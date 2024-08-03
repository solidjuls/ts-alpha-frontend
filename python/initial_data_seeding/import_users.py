import argparse
import csv
from datetime import datetime
import re

from fuzzywuzzy import fuzz
from sqlalchemy import text

from python.db_helpers import db_helpers
from python.models import models


def cl_args():
    # Initialize parser
    parser = argparse.ArgumentParser()

    # Adding optional argument
    parser.add_argument("-ip", "--input_filepath", help="Input filepath")
    parser.add_argument(
        "-fmf",
        "--fuzzy_match_filepath",
        help="Filepath with list of accurate full names",
    )
    parser.add_argument(
        "-flf",
        "--first_last_filepath",
        help="Filepath with list of accurate first and last names",
    )
    parser.add_argument(
        "-o",
        "--overwrite",
        help="Allow overwriting of existing data",
        action=argparse.BooleanOptionalAction,
    )
    parser.add_argument(
        "-eof",
        "--errors_output_filepath",
        help="Filepath used to write errors file, if not provided will log out",
    )

    # Read arguments from command line
    return parser.parse_args()


def create_unknown_user(now):
    return models.User(
        name="UNKNOWN_PLAYER",
        email="UNKNOWN@UNKNOWN.COM",
        created_at=now,
        updated_at=now,
        country_id=1,  # set unknown country_id
    )


def get_country_from_player_sheet(country_str):
    COUNTRY_REXEX = r"(\w+)\s\((.+)\)"
    return re.match(COUNTRY_REXEX, country_str).groups()


def get_fuzzy_match_names(match_file):
    with open(match_file, mode="r") as infile:
        reader = csv.DictReader(infile)
        return set([row["Name"] for row in reader])


def get_phone_number_from_player_sheet(phone_str):
    PHONE_REGEX = r"[^0-9]"

    if not phone_str:
        return None
    return re.sub(PHONE_REGEX, "", phone_str)


def do_fuzzy_name_matching_and_split_names(
    old_name, possible_correct_names, last_name_length_map
):
    chosen_name = old_name
    best_ratio = 0
    if old_name not in possible_correct_names:
        for new_name in possible_correct_names:
            ratio = fuzz.ratio(old_name, new_name)
            if ratio > 85 and ratio > best_ratio:
                best_ratio = ratio
                chosen_name = new_name

    if old_name in last_name_length_map:
        words_in_last_name = last_name_length_map[old_name]
        split_name = chosen_name.split(" ")
        first_name = " ".join(split_name[: len(split_name) - words_in_last_name])
        last_name = " ".join(split_name[-words_in_last_name:])
    else:
        # if we can't find a match, we just assume one word last name
        split_name = chosen_name.split(" ")
        first_name = " ".join(split_name[: len(split_name) - 1])
        last_name = " ".join(split_name[-1:])

    return chosen_name, first_name, last_name


def get_first_last_names_map(first_last_filepath):
    last_name_length_map = {}
    with open(first_last_filepath, mode="r") as infile:
        reader = csv.DictReader(infile)
        for row in reader:
            # get number of words in last name
            last_length = len(row["Last Name"].split(" "))
            last_name_length_map[row["First Name"] + " " + row["Last Name"]] = (
                last_length
            )

    return last_name_length_map


def upload_users_to_db(
    db_session,
    input_filepath,
    allow_overwriting,
    fuzzy_match_filepath,
    first_last_filepath,
    errors_output_filepath,
):
    # TODO: overwrite doesnt really work with merge()
    # so for now overwrite just means "delete everything and start over"
    now = datetime.now()

    if allow_overwriting:
        db_session.execute(text("DELETE FROM reynolds_ts_local.game_results;"))
        db_session.execute(text("DELETE FROM reynolds_ts_local.users;"))
        db_session.flush()
        db_session.merge(create_unknown_user(now))

    FAKE_EMAIL_TEMPLATE = "fake_email_{}@fake_domain.com"
    fake_email_counter = 0

    errors = []
    duplicate_emails = set()

    possible_correct_names = set()
    if fuzzy_match_filepath:
        possible_correct_names = get_fuzzy_match_names(fuzzy_match_filepath)

    last_name_length_map = {}
    if first_last_filepath:
        last_name_length_map = get_first_last_names_map(first_last_filepath)

    with open(input_filepath, mode="r") as infile:
        reader = csv.DictReader(infile)

        now = datetime.now()

        for row in reader:
            # handle email issues, email must be unique
            email = row["Email"]
            if email in duplicate_emails:
                row["error_reason"] = "Duplicate email found"
                errors.append(row)
                continue
            if not email:
                email = None

            duplicate_emails.add(email)

            # handle parsing the tld_code out of the player sheet
            try:
                tld_code = get_country_from_player_sheet(row["Federation"])[0]
            except:
                row["error_reason"] = "Unable to extact TLD code from sheet"
                errors.append(row)
                continue

            name, first_name, last_name = do_fuzzy_name_matching_and_split_names(
                row["NAME "], possible_correct_names, last_name_length_map
            )

            # get the id from the country record associated w/ the player record
            try:
                country_id = (
                    db_session.query(models.Country.id)
                    .filter(models.Country.tld_code == tld_code)
                    .one()
                    .id
                )
            except:
                country_id = (
                    db_session.query(models.Country.id)
                    .filter(models.Country.tld_code == "XX")
                    .one()
                    .id
                )

            user_row = models.User(
                name=name,
                email=email,
                created_at=now,
                updated_at=now,
                country_id=country_id,
                first_name=first_name,
                last_name=last_name,
                phoneNumber=get_phone_number_from_player_sheet(row["Phone Number"]),
                preferredGamingPlatform=row["Preferred Way"],
                preferredGameDuration=row["Time Limit"],
            )

            db_session.add(user_row)

    db_session.commit()

    if errors_output_filepath:
        with open(errors_output_filepath, mode="w") as outfile:
            fieldnames = errors[0].keys()
            writer = csv.DictWriter(outfile, fieldnames=fieldnames)

            writer.writeheader()
            for row in errors:
                writer.writerow(row)
    else:
        for row in errors:
            print(row)


def run(
    input_filepath,
    allow_overwriting=False,
    fuzzy_match_filepath=None,
    first_last_filepath=None,
    errors_output_filepath=None,
):
    Session = db_helpers.get_db_session()
    with Session() as db_session:
        upload_users_to_db(
            db_session,
            input_filepath,
            allow_overwriting,
            fuzzy_match_filepath,
            first_last_filepath,
            errors_output_filepath,
        )


if __name__ == "__main__":
    args = cl_args()
    input_filepath = args.input_filepath
    if not input_filepath:
        raise RuntimeError("No input filepath entered")

    run(
        input_filepath=input_filepath,
        allow_overwriting=args.overwrite,
        fuzzy_match_filepath=args.fuzzy_match_filepath,
        first_last_filepath=args.first_last_filepath,
        errors_output_filepath=args.errors_output_filepath,
    )
