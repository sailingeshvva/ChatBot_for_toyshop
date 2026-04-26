# Toy Shop Phinite Box Chatbot

A starter chatbot for Toy Shop Phinite Box. It can answer common shop questions and recommend toys by age, budget, and category.

## Tech Stack

- Rasa Open Source for NLU and dialogue
- Rasa SDK for custom Python actions
- JSON for toy product data
- HTML, CSS, and JavaScript for the website chat UI
- Transparent PNG logo asset in `web/assets/phinite-box-logo.png`

## Project Structure

```text
.
├── actions/actions.py
├── data/nlu.yml
├── data/rules.yml
├── data/stories.yml
├── data/products/toys.json
├── config.yml
├── credentials.yml
├── domain.yml
├── endpoints.yml
├── requirements.txt
└── web/
```

## Setup

Rasa Open Source 3.6 needs Python 3.8, 3.9, or 3.10. This project is set to Python 3.10 in `.python-version`.

Your current machine has Python 3.11.9, so install Python 3.10 first if `pip install -r requirements.txt` rejects Rasa.

```powershell
py -3.10 -m venv .venv
.\.venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
```

If the `py -3.10` command is not available, install Python 3.10 from python.org, then run the setup commands again.

## Train The Bot

```powershell
rasa train
```

## Run The Bot

Open three terminals in this project folder.

Terminal 1:

```powershell
.\.venv\Scripts\activate
rasa run actions
```

Terminal 2:

```powershell
.\.venv\Scripts\activate
rasa run --enable-api --cors "*"
```

Terminal 3:

```powershell
python -m http.server 8000 -d web
```

Then open:

```text
http://localhost:8000
```

## Example Questions

- `Suggest toys for age 5 under 500`
- `Show educational toys`
- `I want puzzles for age 6`
- `Delivery details`
- `Return policy`
- `Contact number`
