# Toy Shop Phinite Box Chatbot

A website chatbot for **Toy Shop Phinite Box**. The bot helps customers find toys by age, budget, and category, and answers common shop questions like delivery, returns, contact details, and available toy types.

## Features

- Toy recommendations by age, budget, and category
- Product data stored in `data/products/toys.json`
- Follow-up buttons so customers can reply without typing
- Support for categories like RC cars, educational toys, soft toys, puzzles, dolls, board games, building blocks, and toy cars
- Delivery, return policy, and contact replies
- Branded UI theme using navy, burgundy, and gold colors
- Transparent PNG logo used in the landing panel and chat header

## Tech Stack

- Rasa Open Source for chatbot NLU and dialogue
- Rasa SDK for custom Python actions
- JSON for product data
- HTML, CSS, and JavaScript for the website chat UI
- Python 3.10 virtual environment

## Project Structure

```text
.
├── actions/
│   └── actions.py
├── data/
│   ├── nlu.yml
│   ├── rules.yml
│   ├── stories.yml
│   └── products/toys.json
├── web/
│   ├── assets/phinite-box-logo.png
│   ├── index.html
│   ├── script.js
│   └── styles.css
├── config.yml
├── credentials.yml
├── domain.yml
├── endpoints.yml
├── requirements.txt
└── README.md
```

## Setup

Rasa Open Source 3.6 works with Python 3.8, 3.9, or 3.10. This project is configured for Python 3.10.

```powershell
py -3.10 -m venv .venv
.\.venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
```

## Train

```powershell
.\.venv\Scripts\activate
rasa train
```

## Run

Open three terminals in the project folder.

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
.\.venv\Scripts\activate
python -m http.server 8000 --bind 127.0.0.1 --directory web
```

Open:

```text
http://localhost:8000
```

## GitHub Pages

The static website is in `web/`. A root `index.html` redirects GitHub Pages visitors to `web/` so the site can open at:

```text
https://sailingeshvva.github.io/ChatBot_for_toyshop/
```

GitHub Pages can host the website UI only. The Python/Rasa chatbot server still needs to run separately, because GitHub Pages cannot run Python backends.

## Example Questions

- `Show remote control cars`
- `Suggest toys for age 5 under 500`
- `Show educational toys`
- `What categories do you have`
- `Delivery details`
- `Return policy`
- `Contact number`

## Notes

- Generated Rasa model archives are ignored by Git and can be rebuilt with `rasa train`.
- Runtime logs, `.rasa/`, `.venv/`, and Python cache files are ignored.
