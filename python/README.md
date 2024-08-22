# Python

## Usage

To install python dependencies:

1. Install virtualenv, if not already: `pip install virtualenv`
2. `virtualenv venv` to create your new environment (called 'venv' here)
3. `source venv/bin/activate` to enter the virtual environment
4. `pip install -r python/requirements.txt` to install the requirements in the current environment

If adding any new dependencies, add them to requirements.txt with `pip freeze > python/requirements.txt`

## Formatting

Please run the [black formatter](https://github.com/psf/black) on any files before committing to the repo. Black should already be installed if virtualenv is set up as above.

`black <path_to_file>`
