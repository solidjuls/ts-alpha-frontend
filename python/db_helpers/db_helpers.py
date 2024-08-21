from contextlib import contextmanager
from getpass import getpass

import pymysql
from pymysql.constants.CLIENT import MULTI_STATEMENTS
import sqlalchemy as sa
from sqlalchemy.orm import sessionmaker


def prompt_for_db_input(input_type, default_value=None):
    if input_type == "password":
        input_val = getpass("Enter password (required): ")
    elif default_value is None:
        input_val = input(f"Enter {input_type} (required): ")
    else:
        input_val = input(
            f"Enter {input_type}, or leave blank for default {default_value}: "
        )
        if input_val == "":
            input_val = default_value
    return input_val


def get_mysql_args():
    # defaults for mysql connection args
    mysql_arg_map = {
        "host": "127.0.0.1",
        "port": 3306,
        "user": None,
        "password": None,
        "database": None,
    }

    for input_type, val in mysql_arg_map.items():
        mysql_arg_map[input_type] = prompt_for_db_input(input_type, val)

    # port has to be recast as int, python input likes to make it a string
    mysql_arg_map["port"] = int(mysql_arg_map["port"])

    return mysql_arg_map


def get_pymysql_connection():
    connection_args = get_mysql_args()

    return pymysql.connect(
        **connection_args,
        client_flag=MULTI_STATEMENTS,
    )


def create_db_engine():
    return sa.create_engine("mysql+pymysql://", creator=get_pymysql_connection)


def get_db_session():
    # Create a Session class bound to the engine
    engine = create_db_engine()
    return sessionmaker(bind=engine)


@contextmanager
def open_db_connection(commit=False):
    # raw DB connection allow us to execute multiple SQL commands
    # in one execute statement
    connection = create_db_engine().raw_connection()
    cursor = connection.cursor()
    try:
        yield cursor
    except sa.exc.SQLAlchemyError as err:
        (error,) = err.args
        print(error.message)
        cursor.execute("ROLLBACK")
        raise err
    else:
        if commit:
            cursor.execute("COMMIT")
        else:
            cursor.execute("ROLLBACK")
    finally:
        connection.close()


def run_initial_migration():
    # Just a generic helper function for instantiating the DB, if needed
    # unlikely to be used anywhere aside from local DB setup
    with open_db_connection() as cursor:
        # at some point we should set this up for multiple migrations
        with open("init/init.sql") as file:
            query = file.read()
            cursor.execute(query)

        cursor.execute("COMMIT")
