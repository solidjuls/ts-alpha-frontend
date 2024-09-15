## Concept here is a simple script to import a CSV from the tournament page
## Can be used going forward to populate tournament data from new sheets, if needed
import argparse
import csv
from datetime import datetime
from functools import lru_cache
import json
import re

from python.db_helpers import db_helpers
from python.models import models

# You can use these generic constants as needed to populate data
TOURNAMENT_TYPE = 'OTSL'
TOURNAMENT_DESCRIPTION = '''The Online Twilight Struggle League (OTSL) is an uncapped, free participation league, which features a regular season, playoff, and side tournaments with prizes. This league is designed to be a friendly competition, not a cut-throat league, where anything goes. The overall goal of the league is to create an enjoyable experience for players at all skill levels.  Good luck and have fun!

OTSL-GOLD = 60 minute timer
OTSL-SILVER = 90 minute timer

Rules = https://drive.google.com/file/d/10BNtClCrRVXCVaEm6o_MoaPyf4v2Lb2C/view
'''
TOURNAMENT_START_DATE = datetime(2024,3,21)
TOURNAMENT_END_DATE = datetime(2024,11,30)
TOURNAMENT_FORMAT = 'Online'
SPREADSHEET_LINK = "https://docs.google.com/spreadsheets/d/16MVPndQQErMV-HFlz-lCD5woEf8dnXDypa1Zp8K5hKw/edit?gid=1407845663#gid=1407845663"
TOURNAMENT_EDITION = "Season 6"
GAME_DURATION = "60 minutes (Gold), 90 minutes (Silver)"
REGISTRATION_STATUS = 'Closed'
TOURNAMENT_STATUS = 'Ongoing'


def cl_args():
    # Initialize parser
    parser = argparse.ArgumentParser()

    # Adding optional argument
    parser.add_argument("-ip", "--input_filepath", help="Input filepath")
    parser.add_argument("-op", "--output_filepath", help="Output filepath")

    # Read arguments from command line
    return parser.parse_args()


def get_tournament_if_exists(db_session, tournament_type_id, edition):
    return db_session.query(models.Tournament).filter(models.Tournament.tournament_type_id == tournament_type_id and models.Tournament.edition == edition).one_or_none()

def create_tournament_record(db_session):
    tournament_type_rec = db_session.query(models.TournamentType).filter(models.TournamentType.tournament_type_name == TOURNAMENT_TYPE).one()

    tournament_rec = get_tournament_if_exists(db_session, tournament_type_rec.id, TOURNAMENT_EDITION)
    if tournament_rec:
        raise KeyError('Tournament Already Exists!')
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
            admins={'Craig Richards', 'JR Jones', 'Patrick Gong'}
        )

    db_session.add(tournament_record)
    db_session.flush()
    print('Added tournament record')

    return tournament_record


def run():
    Session = db_helpers.get_db_session()
    with Session() as db_session:
        create_tournament_record(db_session)
        db_session.commit()


if __name__ == "__main__":
    args = cl_args()
    run()