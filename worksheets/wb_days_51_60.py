# -*- coding: utf-8 -*-
"""Day 51 – Day 60 worksheet content."""
from wb_lib import LS, LM, LL, LF, opt, hint, shapes, grid, passage_box, method, hintbox
import random

DAYS = []

for d in range(51, 61):
    sub = f"MONTH 2 MASTERY (DAY {d})"
    if d == 60:
        sub = "FINAL ASSESSMENT (MONTH 2)"
    
    DAYS.append(dict(
        n=d, sub=sub, foot=f"Day {d} • Month 2",
        A=[
            (f'A1. Grammar Mastery', "৩ নম্বর", {}, [
                (f'Choose the noun: I have a {opt("(red / ball)")}.', "১"),
                (f'Choose the verb: The dog {opt("(barks / black)")}.', "১"),
                (f'Choose the adjective: A {opt("(sweet / eat)")} mango.', "১"),
            ]),
            (f'A2. Vocabulary & Spelling', "৩ নম্বর", {}, [
                (f'Unscramble: p-a-p-e-l → {LM}', "১"),
                (f'Plural of Child: {opt("(Childs / Children)")}', "১"),
                (f'Opposite of Hard is: {LS}', "১"),
            ]),
            (f'A3. Reading Comprehension', "২ নম্বর",
             {"passage": passage_box([f"It is day {d}.", "We are learning math and english.", "We are very smart."])}, [
                (f'What are we learning? {LM}', "১"),
                (f'Are we smart? {LS}', "১"),
            ]),
            (f'A4. Creative Writing', "২ নম্বর", {}, [
                (f'Write two sentences about your favorite food: {LL}', "২"),
            ]),
        ],
        B=[
            (f'B1. Mental Math (Tables 2-5 Mixed)', "৪ নম্বর", {}, [
                (f'4 × {random.randint(2,9)} = {LS}', "১"), (f'5 × {random.randint(2,9)} = {LS}', "১"),
                (f'3 × {random.randint(2,9)} = {LS}', "১"), (f'2 × {random.randint(2,9)} = {LS}', "১"),
            ]),
            (f'B2. Arithmetic (3-Digit Mixed)', "২ নম্বর", {}, [
                (f'250 + 1{d} = {LS}', "১"),
                (f'300 - 1{d} = {LS}', "১"),
            ]),
            (f'B3. Fractions & Measurement', "২ নম্বর", {}, [
                (f'Half of 50 = {LS}', "১"),
                (f'Quarter of 20 = {LS}', "১"),
            ]),
            (f'B4. Word Problem (2-step)', "২ নম্বর", {}, [
                (f'You had 50 Taka. Bought pen for 10 and pencil for 5. Left: {LS}', "১"),
                (f'4 cars have how many wheels in total? {LS}', "১"),
            ]),
        ],
        C=[
            (f'C1. Advanced Logic Sequence', "৩ নম্বর", {}, [
                (f'10, 20, 30, {LS}, 50', "১"),
                (f'1, 2, 4, 7, {LS} (+1,+2,+3...)', "১"),
                (f'Z, Y, X, {LS} (Backwards)', "১"),
            ]),
            (f'C2. Visual Reasoning & Directions', "৩ নম্বর", {}, [
                (f'Face East, turn left. You face: {opt("(North / South)")}', "১"),
                (f'How many corners in a square? {LS}', "১"),
                (f'Mirror of <b>3</b> is: {LS}', "১"),
            ]),
            (f'C3. Analogy & Classification', "২ নম্বর", {}, [
                (f'Cat : Kitten :: Dog : {opt("(Puppy / Cub)")}', "১"),
                (f'Odd one: {opt("Circle &nbsp; Sphere &nbsp; Square &nbsp; Triangle")}', "১"),
            ]),
            (f'C4. Logic Puzzle', "২ নম্বর", {}, [
                (f'I have hands but cannot clap (Clock/Table). I am: {LS}', "১"),
                (f'Tom is older than Sam. Sam is older than Bob. Youngest is: {LS}', "১"),
            ]),
        ],
    ))

