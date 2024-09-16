## Concept here is a simple script to import a CSV from the tournament page
## Can be used going forward to populate tournament data from new sheets, if needed
import argparse
import csv
from datetime import datetime
from functools import lru_cache
import json
import re
from sqlalchemy import exc as sa_exc

from python.db_helpers import db_helpers
from python.models import models

# You can use these generic constants as needed to populate data
TOURNAMENT_TYPE = "OTSL"
TOURNAMENT_DESCRIPTION = """The Online Twilight Struggle League (OTSL) is an uncapped, free participation league, which features a regular season, playoff, and side tournaments with prizes. This league is designed to be a friendly competition, not a cut-throat league, where anything goes. The overall goal of the league is to create an enjoyable experience for players at all skill levels.  Good luck and have fun!

OTSL-GOLD = 60 minute timer
OTSL-SILVER = 90 minute timer

Rules = https://drive.google.com/file/d/10BNtClCrRVXCVaEm6o_MoaPyf4v2Lb2C/view
"""
TOURNAMENT_START_DATE = datetime(2024, 3, 21)
TOURNAMENT_END_DATE = datetime(2024, 11, 30)
TOURNAMENT_FORMAT = "Online"
SPREADSHEET_LINK = "https://docs.google.com/spreadsheets/d/16MVPndQQErMV-HFlz-lCD5woEf8dnXDypa1Zp8K5hKw/edit?gid=1407845663#gid=1407845663"
TOURNAMENT_EDITION = "Season 6"
GAME_DURATION = "60 minutes (Gold), 90 minutes (Silver)"
REGISTRATION_STATUS = "Closed"
TOURNAMENT_STATUS = "Ongoing"


def cl_args():
    # Initialize parser
    parser = argparse.ArgumentParser()

    # Adding optional argument
    parser.add_argument("-sp", "--schedule_filepath", help="Schedule Filepath")

    # Read arguments from command line
    return parser.parse_args()


def get_tournament_if_exists(db_session, tournament_type_id, edition):
    return (
        db_session.query(models.Tournament)
        .filter(
            models.Tournament.tournament_type_id == tournament_type_id
            and models.Tournament.edition == edition
        )
        .one_or_none()
    )


def create_tournament_record(db_session):
    tournament_type_rec = (
        db_session.query(models.TournamentType)
        .filter(models.TournamentType.tournament_type_name == TOURNAMENT_TYPE)
        .one()
    )

    tournament_rec = get_tournament_if_exists(
        db_session, tournament_type_rec.id, TOURNAMENT_EDITION
    )
    if tournament_rec:
        print("Tournament Already Exists!")
        return tournament_rec
    else:
        tournament_record = models.Tournament(
            created_at=datetime.now(),
            updated_at=datetime.now(),
            tournament_type_id=tournament_type_rec.id,
            description=TOURNAMENT_DESCRIPTION,
            start_date=TOURNAMENT_START_DATE,
            end_date=TOURNAMENT_END_DATE,
            format=TOURNAMENT_FORMAT,
            registration_status=REGISTRATION_STATUS,
            spreadsheet_link=SPREADSHEET_LINK,
            edition=TOURNAMENT_EDITION,
            game_duration=GAME_DURATION,
            tournament_status=TOURNAMENT_STATUS,
            admins={"Craig Richards", "JR Jones", "Patrick Gong"},
        )
    db_session.add(tournament_record)
    db_session.flush()
    print("Added tournament record")

    return tournament_record


@lru_cache(maxsize=1500)
def get_player_id_from_db(db_session, player_name):
    full_name = models.User.first_name + " " + models.User.last_name

    return db_session.query(models.User.id).filter(full_name == player_name).one().id


def create_schedules_in_tournament(db_session, tournament_rec, input_filepath):
    all_player_ids = set()
    with open(input_filepath, mode="r") as infile:
        reader = csv.DictReader(infile)

        now = datetime.now()
        for _, row in enumerate(reader):

            usa_player = get_player_id_from_db(db_session, row["USA"])
            ussr_player = get_player_id_from_db(db_session, row["USSR"])
            all_player_ids.add(usa_player)
            all_player_ids.add(ussr_player)

            new_schedule_rec = models.TournamentSchedule(
                created_at=now,
                updated_at=now,
                tournament_id=tournament_rec.id,
                usa_player_id=usa_player,
                ussr_player_id=ussr_player,
                game_code=row["GAME ID"],
                game_due_date=datetime.strptime(row["DUE DATE"], "%m/%d/%Y").date(),
            )
            existing_record = (
                db_session.query(models.TournamentSchedule)
                .filter(
                    models.TournamentSchedule.tournament_id
                    == new_schedule_rec.tournament_id,
                    models.TournamentSchedule.game_code == new_schedule_rec.game_code,
                )
                .one_or_none()
            )
            if existing_record:
                new_schedule_dict = new_schedule_rec.as_dict()
                new_schedule_dict.pop("id")
                for key, value in new_schedule_dict.items():
                    setattr(existing_record, key, value)
            else:
                db_session.add(new_schedule_rec)

        for player in all_player_ids:
            registration_rec = models.TournamentRegistration(
                created_at=now,
                updated_at=now,
                tournament_id=tournament_rec.id,
                user_id=player,
                on_waitlist=False,
            )
            existing_record = (
                db_session.query(models.TournamentRegistration)
                .filter(
                    models.TournamentRegistration.tournament_id
                    == registration_rec.tournament_id,
                    models.TournamentRegistration.user_id == registration_rec.user_id,
                )
                .one_or_none()
            )
            if existing_record:
                registration_dict = registration_rec.as_dict()
                registration_dict.pop("id")
                for key, value in registration_dict.items():
                    setattr(existing_record, key, value)
            else:
                db_session.add(registration_rec)


def run():
    Session = db_helpers.get_db_session()
    with Session() as db_session:
        tournament_rec = create_tournament_record(db_session)
        create_schedules_in_tournament(db_session, tournament_rec, schedule_filepath)
        db_session.commit()


if __name__ == "__main__":
    args = cl_args()
    schedule_filepath = args.schedule_filepath
    if not schedule_filepath:
        raise RuntimeError("No schedule filepath entered")
    run()
