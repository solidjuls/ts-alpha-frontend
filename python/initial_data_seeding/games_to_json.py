## Concept here is a simple script to import a CSV of old twilight struggle games
## Currently meant for just the initial seeding of the DB
import argparse
import csv
from datetime import datetime
from functools import lru_cache
import json
import re

from python.db_helpers import db_helpers
from python.models import models


def cl_args():
    # Initialize parser
    parser = argparse.ArgumentParser()

    # Adding optional argument
    parser.add_argument("-ip", "--input_filepath", help="Input filepath")
    parser.add_argument("-op", "--output_filepath", help="Output filepath")

    # Read arguments from command line
    return parser.parse_args()


def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""

    if isinstance(obj, (datetime)):
        return obj.isoformat()
    raise TypeError("Type %s not serializable" % type(obj))


def extract_turn_from_string(turn_data):
    # 12 indicates turn not between 1 and 10
    # 13 indicates some other parsing error, we should research these
    turn_data = parse_na_as_none(turn_data)
    if turn_data is None:
        return turn_data

    if isinstance(turn_data, int):
        return check_is_valid_turn(turn_data)

    # simple mapper to convert strings into usable data
    TURN_MAPPER = {
        None: 0,
        "Final Scoring": 11,
    }
    mapped_turn = TURN_MAPPER.get(turn_data)

    if mapped_turn:
        return mapped_turn

    try:
        regex_turn = int(re.search(r"\d+", turn_data).group())
        return check_is_valid_turn(regex_turn)
    except:
        return 13


def check_is_valid_turn(turn_int):
    if turn_int > 0 and turn_int <= 10:
        return turn_int
    else:
        return 12


def parse_na_as_none(input_str):
    NULL_STRINGS = ("N/A", "")
    if input_str not in NULL_STRINGS:
        return input_str


def translate_side_to_enum(side_str):
    SIDE_ENUM_MAP = {
        "USA": 1,
        "USSR": 2,
        "Tie": 3,
    }
    return SIDE_ENUM_MAP[side_str]


@lru_cache(maxsize=1500)
def get_player_id_from_db(db_session, player_name):
    try:
        return (
            db_session.query(models.User.id)
            .filter(models.User.name == player_name)
            .one()
            .id
        )
    # this should be commented out, probably. It will break rating calculations if it's left in
    # but for dev purposes, we can't have everything failing
    except:
        return (
            db_session.query(models.User.id)
            .filter(models.User.name == "UNKNOWN_PLAYER")
            .one()
            .id
        )  # unknown player_id


def write_game_results_to_json(db_session, input_filepath, output_filepath):
    with open(input_filepath, mode="r") as infile:

        game_list = []
        reader = csv.DictReader(infile)

        now = datetime.now()
        for _, row in enumerate(reader):
            us_player_id = get_player_id_from_db(db_session, row["US Player"])
            ussr_player_id = get_player_id_from_db(db_session, row["USSR Player"])

            try:
                game_date = datetime.strptime(row["Date"], "%d/%m/%Y")
            except:
                if row["Date"]:
                    print(f"Game date: {row['Date']} cannot be parsed.")
                game_date = None

            new_game_row = models.GameResult(
                usa_player_id=us_player_id,
                ussr_player_id=ussr_player_id,
                game_type=row["Tournament"],
                game_code=row["Game ID"],
                game_winner=translate_side_to_enum(row["Winner"]),
                end_turn=extract_turn_from_string(row["Turn"]),
                end_mode=parse_na_as_none(row["How the game END"]),
                game_date=game_date,
                video1=parse_na_as_none(row["Video"]),
            )

            game_list.append(new_game_row.as_dict())

    with open(output_filepath, "w") as fp:
        json.dump(game_list, fp, default=json_serial)


def run(input_filepath, output_filepath):
    Session = db_helpers.get_db_session()
    with Session() as db_session:
        write_game_results_to_json(db_session, input_filepath, output_filepath)


if __name__ == "__main__":
    args = cl_args()
    input_filepath = args.input_filepath
    output_filepath = args.output_filepath
    if not input_filepath:
        raise RuntimeError("No input filepath entered")
    if not output_filepath:
        raise RuntimeError("No input filepath entered")

    run(input_filepath, output_filepath)
