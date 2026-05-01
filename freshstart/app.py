from __future__ import annotations

from pathlib import Path
import json
from flask import Flask, render_template, request, jsonify

BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR.parent / "src" / "data" / "morse.json"

app = Flask(__name__, template_folder="templates", static_folder="static")

MORSE_MAP = {
    "A": ".-", "B": "-...", "C": "-.-.", "D": "-..", "E": ".", "F": "..-.",
    "G": "--.", "H": "....", "I": "..", "J": ".---", "K": "-.-", "L": ".-..",
    "M": "--", "N": "-.", "O": "---", "P": ".--.", "Q": "--.-", "R": ".-.",
    "S": "...", "T": "-", "U": "..-", "V": "...-", "W": ".--", "X": "-..-",
    "Y": "-.--", "Z": "--..", "0": "-----", "1": ".----", "2": "..---", "3": "...--",
    "4": "....-", "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
    ".": ".-.-.-", ",": "--..--", "?": "..--..", "!": "-.-.--", "'": ".----.",
    "/": "-..-.", "(": "-.--.", ")": "-.--.-", "&": ".-...", ":": "---...", ";": "-.-.-.",
    "=": "-...-", "+": ".-.-.", "-": "-....-", "_": "..--.-", '"': ".-..-.", "$": "...-..-",
    "@": ".--.-.",
}
REVERSE_MAP = {v: k for k, v in MORSE_MAP.items()}


def text_to_morse(text: str) -> str:
    words = []
    for word in text.upper().split():
        letters = [MORSE_MAP[ch] for ch in word if ch in MORSE_MAP]
        if letters:
            words.append(" ".join(letters))
    return " / ".join(words)


def morse_to_text(code: str) -> str:
    words = []
    for word in code.split("/"):
        letters = []
        for token in word.strip().split():
            letters.append(REVERSE_MAP.get(token, ""))
        words.append("".join(letters))
    return " ".join(filter(None, words)).strip()


def load_phrase_samples() -> list[dict[str, str]]:
    if not DATA_FILE.exists():
        return []
    data = json.loads(DATA_FILE.read_text())
    phrases = [x for x in data if x.get("type") == "phrase"]
    return phrases[:12]


@app.get("/")
def home():
    return render_template("index.html", title="Morse Code Generator", phrases=load_phrase_samples()[:6])


@app.get("/translate/")
def translate_page():
    initial = request.args.get("q", "")
    return render_template("translate.html", title="Translate", initial=initial)


@app.get("/phrases/")
def phrases_page():
    return render_template("phrases.html", title="Common Morse Phrases", phrases=load_phrase_samples())


@app.get("/about/")
def about_page():
    return render_template("about.html", title="About")


@app.get("/contact/")
def contact_page():
    return render_template("contact.html", title="Contact")


@app.post("/api/translate")
def translate_api():
    payload = request.get_json(silent=True) or {}
    text = str(payload.get("text", "")).strip()
    mode = payload.get("mode", "auto")

    if mode == "text_to_morse":
        result = text_to_morse(text)
    elif mode == "morse_to_text":
        result = morse_to_text(text)
    else:
        result = morse_to_text(text) if any(c in ".-/" for c in text) else text_to_morse(text)

    return jsonify({"result": result})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
