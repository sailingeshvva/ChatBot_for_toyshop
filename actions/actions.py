import json
from pathlib import Path
from typing import Any, Dict, List, Text

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher


PRODUCT_FILE = Path(__file__).resolve().parents[1] / "data" / "products" / "toys.json"


class ActionRecommendToys(Action):
    def name(self) -> Text:
        return "action_recommend_toys"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:
        age = _number_slot(tracker.get_slot("age"))
        budget = _number_slot(tracker.get_slot("budget"))
        category = _text_slot(tracker.get_slot("category"))
        if category is None:
            category = _category_from_message(tracker.latest_message.get("text", ""))

        toys = _load_toys()
        matches = []

        for toy in toys:
            if age is not None and not (toy["min_age"] <= age <= toy["max_age"]):
                continue
            if budget is not None and toy["price"] > budget:
                continue
            if category and category not in toy["category"]:
                continue
            if toy["stock"] <= 0:
                continue
            matches.append(toy)

        if not matches:
            dispatcher.utter_message(
                text=(
                    "I could not find an exact match. Try another budget, age, or category like "
                    "puzzles, soft toys, educational, building blocks, remote control cars, dolls, or board games."
                )
            )
            return []

        top_matches = sorted(matches, key=lambda item: item["price"])[:3]
        lines = ["Here are good toy options:"]
        for index, toy in enumerate(top_matches, start=1):
            lines.append(
                f"{index}. {toy['name']} - Rs. {toy['price']} "
                f"({toy['category']}, age {toy['min_age']}-{toy['max_age']})"
            )
            lines.append(f"   {toy['description']}")

        lines.append("You can ask for more toys, delivery details, return policy, or another toy category.")
        dispatcher.utter_message(text="\n".join(lines))
        return []


def _load_toys() -> List[Dict[str, Any]]:
    with PRODUCT_FILE.open("r", encoding="utf-8") as file:
        return json.load(file)


def _number_slot(value: Any) -> float | None:
    if value is None:
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _text_slot(value: Any) -> str | None:
    if not value:
        return None
    category = str(value).strip().lower()
    if category in {"rc cars", "remote cars"}:
        return "remote control cars"
    return category


def _category_from_message(message: str) -> str | None:
    text = message.lower()
    if "rc car" in text or "remote car" in text or "remote control car" in text:
        return "remote control cars"
    if "puzzle" in text:
        return "puzzles"
    if "soft toy" in text or "teddy" in text or "plush" in text:
        return "soft toys"
    if "block" in text:
        return "building blocks"
    if "board game" in text:
        return "board games"
    if "doll" in text:
        return "dolls"
    if "educational" in text or "learning" in text:
        return "educational"
    return None
