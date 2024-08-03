# Initial Migrations

## Purpose

These initial migrations are generally kept simply for posterity - they should only be run once for the initial seeding of historical data into the DB.

If they are run later, they are likely to wipe out any new data that is not captured in the Junta spreadsheets.

## Usage

There are two scripts to be used:

### Import Users

This script does as named - it creates the users in the database by directly updating the database itself. It does it's best to handle special characters and do first/last name mapping, if files are passed to do so.

You can invoke this script with:

```bash
python3 -m python.initial_data_seeding.import_users \
 -ip <players_database_input_file> \
 -fmf <players_accurate_name_input_file> \
 -flf <first_last_name_input_file>
```

* The `players_database_input_file` should be the path to a downloaded CSV from the [Tasos Twilight Struggle Book - Players Database Sheet](https://docs.google.com/spreadsheets/d/1pTEf6pVvTIBlTCR7Zk8kaf3OYI6biEhTerAdhLN1_tY/edit?gid=555059173#gid=555059173).
* The `players_accurate_name_input_file` should be the path to a downloaded CSV from the [Twilight Struggle Official Rating - Stats Sheet](https://docs.google.com/spreadsheets/d/1WPCgYqUxEcWqrt7bdOQXnTxjOtjLj-Je-2RcJ53ygKM/edit?gid=1754799574#gid=1754799574).
* The `first_last_name_input_file` should be the path to a downloaded CSV from the [Tasos Twilight Struggle Book - Tournament Registrations Sheet](https://docs.google.com/spreadsheets/d/1pTEf6pVvTIBlTCR7Zk8kaf3OYI6biEhTerAdhLN1_tY/edit?gid=1604809537#gid=1604809537).

The script will ask you for DB credential information before doing the commits.

If you'd like to delete the users table before rewriting, you can add the `-o` arguement to the above command. _Do this at your own risk, it will delete all existing records._

The script will print any failed rows - if you'd like you put these an an output file, you can add `-eof <path_to_filename>` to the end of the above command.

### Games to JSON

This script does as named - it creates a json file of games to call the site's API. It is formatted as an ordered list of games, with each game being a JSON-object blob.

You can invoke this script with:

```bash
python -m python.initial_data_seeding.games_to_json \
 -ip <games_input_file> \
 -op <games_output_file>
```

* The `games_input_file` should be the path to a downloaded CSV from the [Twilight Struggle Official Rating - Games Sheet](https://docs.google.com/spreadsheets/d/1WPCgYqUxEcWqrt7bdOQXnTxjOtjLj-Je-2RcJ53ygKM/edit?gid=426377424#gid=426377424).
* `games_output_file` can be anything - store it locally wherever makes sense for you.

If any rows fail in this script, it should be researched, as it will cause issues with rating calculations if games are missed. I do not output failure rows for this reason, and simply let the script fail.