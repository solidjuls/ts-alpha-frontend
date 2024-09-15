from datetime import datetime

from python.db_helpers import db_helpers
from python.models import models

TOURNAMENT_TYPES = {"National League", "ITSL", "OTSL", "RTSL", "TSC", "TSWC", "CL", "FG", "GS"}

def run():
    Session = db_helpers.get_db_session()
    with Session() as db_session:
        added_tournaments = set()
        existing_tournament_types = db_session.query(models.TournamentType.tournament_type_name).filter(models.TournamentType.tournament_type_name.in_(TOURNAMENT_TYPES)).all()
        for tournament_type in TOURNAMENT_TYPES:
            if tournament_type not in [i[0] for i in existing_tournament_types]:
                db_session.add(
                    models.TournamentType(
                        created_at=datetime.now(),
                        updated_at=datetime.now(),
                        tournament_type_name=tournament_type
                    )
                )
                added_tournaments.add(tournament_type)
        db_session.commit()
        print(f'Added tournament types were {added_tournaments}')


if __name__ == "__main__":
    run()