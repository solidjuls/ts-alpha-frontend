import argparse
import csv
from functools import lru_cache

from sqlalchemy import exc as sa_exc

from python.db_helpers import db_helpers
from python.models import models


def cl_args():
    # Initialize parser
    parser = argparse.ArgumentParser()

    # Adding optional argument
    parser.add_argument("-ip", "--input_filepath", help="Input filepath")

    # Read arguments from command line
    return parser.parse_args()


def get_user_record_by_name(db_session, player_name):
    full_name = models.User.first_name + " " + models.User.last_name

    try:
        return db_session.query(models.User).filter(full_name == player_name).one()
    except Exception as exp:
        print(f"Could not find {player_name}")
        raise exp


@lru_cache(maxsize=15000)
def get_id_from_city_table(db_session, city_name, us_federation=None):
    try:
        city_rec = (
            db_session.query(models.City).filter(models.City.name == city_name).one()
        )
    except sa_exc.MultipleResultsFound:
        try:
            if us_federation:
                city_rec = (
                    db_session.query(models.City)
                    .filter(
                        models.City.name == city_name,
                        models.City.province == us_federation,
                    )
                    .one()
                )
            else:
                # print(f'Multiple cities found (no Us federation) for: {city_name}')
                return None
        except Exception as exc:
            # print(f'Multiple cities found for: {city_name}, {us_federation}')
            return None
    except sa_exc.NoResultFound:
        # print(f'No City Found for {city_name}, {us_federation}')
        return None
    return city_rec.id


def update_playdek_city(db_session, input_filepath):
    with open(input_filepath, mode="r") as infile:
        reader = csv.DictReader(infile)

        issues = []

        for i, row in enumerate(reader):
            user_record = get_user_record_by_name(db_session, row["NAME "])
            user_record.name = row["Playdek ID"]

            city_name = row["Normalized City"]
            us_federation = row["US Federation"] if row["US Federation"] else None
            if city_name:
                city_id = get_id_from_city_table(db_session, city_name, us_federation)
                user_record.city_id = city_id
                if not city_id:
                    issues.append(
                        {
                            "name": row["NAME "],
                            "city_name": city_name,
                            "us_federation": us_federation or "",
                        }
                    )
        db_session.commit()

        with open("errors.csv", "w", newline="") as output_file:
            dict_writer = csv.DictWriter(output_file, issues[0].keys())
            dict_writer.writeheader()
            dict_writer.writerows(issues)


def run(
    input_filepath,
):
    Session = db_helpers.get_db_session()
    with Session() as db_session:
        update_playdek_city(
            db_session,
            input_filepath,
        )


if __name__ == "__main__":
    args = cl_args()
    input_filepath = args.input_filepath
    if not input_filepath:
        raise RuntimeError("No input filepath entered")
    run(
        input_filepath=input_filepath,
    )
