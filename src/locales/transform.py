#!/usr/bin/env python3

import sys
import json
from typing import Any


def load_faq():
    with open(sys.argv[1], "r") as faq:
        return json.load(faq)


class FAQ:
    def __init__(self):
        self.faq = {
            "q": {},
            "a": {},
        }

    def add_question(self, index, question):
        self.faq["q"][index] = question

    def add_answer(self, index, answer):
        self.faq["a"][index] = {}
        self.faq["a"][index]["m"] = answer


def main():
    faq = load_faq()
    new_faq = FAQ()
    for k, v in faq.items():
        if not k.startswith("FAQ"):
            continue

        nb = -1
        if k.startswith("FAQA"):
            nb = int(k[len("FAQA") :])
            new_faq.add_answer(nb, v)

        else:
            nb = int(k[len("FAQQ") :])
            new_faq.add_question(nb, v)

    print(json.dumps(new_faq.faq, indent=4, sort_keys=False))


if __name__ == "__main__":
    main()
