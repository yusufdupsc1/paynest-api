# -*- coding: utf-8 -*-
"""Day 11 – Day 20 worksheet content (Building blocks + Application)."""
from wb_lib import LS, LM, LL, LF, opt, hint, shapes, grid, passage_box, method, hintbox

DAYS = []

# -------------------------------------------------------------------- DAY 11
DAYS.append(dict(
    n=11, sub="PLURALS • SKIP COUNTING BY 10 • ROTATION &amp; SHAPE MATCHING",
    foot="Plurals • Skip Counting by 10 • Rotation",
    A=[
        ("A1. Plural Formation (বহুবচন)", "৩ নম্বর",
         {"method": method("<b>নিয়ম:</b> সাধারণ শব্দে <b>s</b> যোগ হয় (cat → cats)। যেসব শব্দ "
                           "s, x, ch, sh দিয়ে শেষ হয়, সেখানে <b>es</b> যোগ হয় (box → boxes)।")}, [
            (f'One cat → Two {LM}', "১"),
            (f'One box → Two {LM}', "১"),
            (f'One dog → Two {LM}', "১"),
        ]),
        ("A2. Vocabulary Application", "৩ নম্বর", {}, [
            (f'I have two {LS}. {opt("(book / books)")}', "১"),
            (f'She has three {LS}. {opt("(pen / pens)")}', "১"),
            (f'There are five {LS} in the tree. {opt("(bird / birds)")}', "১"),
        ]),
        ("A3. Reading Comprehension", "২ নম্বর",
         {"passage": passage_box(["I have two dogs. They like to play in the garden."])}, [
            (f'লেখকের কয়টি কুকুর আছে? {LS}', "১"),
            (f'কুকুরগুলো কোথায় খেলে? {LM}', "১"),
        ]),
        ("A4. Writing", "২ নম্বর", {}, [
            (f'বহুবচন করো: One toy → Two {LM}', "১"),
            (f'"dogs" শব্দ ব্যবহার করে একটি বাক্য লেখো: {LF}', "১"),
        ]),
    ],
    B=[
        ("B1. Mental Math Speed Round", "৪ নম্বর",
         {"hint": hintbox("প্রতিটি প্রশ্নের জন্য সর্বোচ্চ ২০ সেকেন্ড।")}, [
            (f'8 + 1 = {LS}', "১"), (f'6 + 3 = {LS}', "১"),
            (f'9 − 2 = {LS}', "১"), (f'7 + 2 = {LS}', "১"),
        ]),
        ("B2. Skip Counting by 10", "২ নম্বর", {}, [
            (f'10, 20, 30, {LS}, 50', "১"),
            (f'60, 70, {LS}, 90, 100', "১"),
        ]),
        ("B3. One-Step Word Problem", "২ নম্বর", {}, [
            (f'একটি ঝুড়িতে ১০টি করে আম আছে, এমন ৩টি ঝুড়ি আছে। মোট কয়টি আম? {LF}', "২"),
        ]),
        ("B4. Number Application", "২ নম্বর", {}, [
            (f'40 এবং 50 এর মধ্যবর্তী সংখ্যা কী? {LS}', "১"),
            (f'সবচেয়ে ছোট সংখ্যাটিতে বৃত্ত দাও: {opt("65 &nbsp; 56 &nbsp; 60")}', "১"),
        ]),
    ],
    C=[
        ("C1. Rotation / Shape Matching", "৪ নম্বর",
         {"method": method("<b>পদ্ধতি:</b> মূল আকৃতিটি মনে মনে ঘুরিয়ে দেখো — ঘোরালে কোনটির মতো দেখাবে?")}, [
            (f'মূল: {shapes("rt")} (উপরে মুখ) → {opt("(ক)")} {shapes("rd")} &nbsp; {opt("(খ)")} {shapes("rt")} '
             f'&nbsp; {opt("(গ)")} {shapes("kq")} &nbsp;&nbsp; উত্তর: {LS}', "১"),
            (f'মূল: {shapes("ka")} → {opt("(ক)")} {shapes("ku")} &nbsp; {opt("(খ)")} {shapes("ka")} '
             f'&nbsp; {opt("(গ)")} {shapes("kw")} &nbsp;&nbsp; উত্তর: {LS}', "১"),
            (f'মূল: {shapes("bs")} → {opt("(ক)")} {shapes("bs")} &nbsp; {opt("(খ)")} {shapes("yx")} '
             f'&nbsp; {opt("(গ)")} {shapes("ro")} &nbsp;&nbsp; উত্তর: {LS}', "১"),
            (f'মূল: <b>L</b> আকৃতি → {opt("(ক) ⌐")} &nbsp; {opt("(খ) L")} &nbsp; {opt("(গ) ⌐ (উল্টানো)")} '
             f'&nbsp;&nbsp; উত্তর: {LS}', "১"),
        ]),
        ("C2. Odd One Out", "৩ নম্বর", {}, [
            (f'{opt("Bus &nbsp; Car &nbsp; Bicycle &nbsp; Pencil")}', "১"),
            (f'{opt("Elephant &nbsp; Giraffe &nbsp; Lion &nbsp; Tree")}', "১"),
            (f'{opt("3 &nbsp; 6 &nbsp; 9 &nbsp; 10")}', "১"),
        ]),
        ("C3. Sequencing", "৩ নম্বর", {}, [
            (f'সঠিক ক্রমে ১, ২, ৩ লেখো: <div>[ {LS} ] জামা শুকানো &nbsp;&nbsp; [ {LS} ] জামা ধোয়া '
             f'&nbsp;&nbsp; [ {LS} ] জামা পরিধান করা</div>', "৩"),
        ]),
    ],
))

# -------------------------------------------------------------------- DAY 12
DAYS.append(dict(
    n=12, sub="ACTION WORDS (VERBS) • DOUBLING • CARRY ADDITION (পরিচিতি) • PATTERN",
    foot="Verbs • Doubling • Carry Addition",
    A=[
        ("A1. Action Words / Verbs", "৩ নম্বর", {}, [
            (f'দৌড়ানোর ছবি → {opt("Run / Sit")}', "১"),
            (f'খাওয়ার ছবি → {opt("Eat / Fly")}', "১"),
            (f'ঘুমানোর ছবি → {opt("Sleep / Jump")}', "১"),
        ]),
        ("A2. Verb–Picture Match", "৩ নম্বর",
         {"hint": hintbox("শব্দগুলো: Read / Write / Sing")}, [
            (f'বই পড়ার ছবি → {LM}', "১"),
            (f'লেখার ছবি → {LM}', "১"),
            (f'গান গাওয়ার ছবি → {LM}', "১"),
        ]),
        ("A3. Reading Comprehension", "২ নম্বর",
         {"passage": passage_box(["Mina runs every morning. She likes to run in the park."])}, [
            (f'মিনা কখন দৌড়ায়? {LM}', "১"),
            (f'সে কোথায় দৌড়ায়? {LM}', "১"),
        ]),
        ("A4. Writing", "২ নম্বর", {}, [
            (f'একটি verb (action word) লেখো: {LM}', "১"),
            (f'সেই verb দিয়ে একটি বাক্য লেখো: {LF}', "১"),
        ]),
    ],
    B=[
        ("B1. Doubling (1–10)", "৪ নম্বর", {}, [
            (f'Double of 3 = {LS}', "১"), (f'Double of 5 = {LS}', "১"),
            (f'Double of 7 = {LS}', "১"), (f'Double of 9 = {LS}', "১"),
        ]),
        ("B2. Carry Addition — পরিচিতি", "৩ নম্বর",
         {"method": method("<b>পদ্ধতি:</b> 15 + 8 → একক: 5 + 8 = 13 (৩ লেখো, ১ হাতে) → দশক: 1 + 1 = 2 → "
                           "উত্তর <b>23</b>")}, [
            (f'17 + 6 = {LS}', "১"), (f'24 + 9 = {LS}', "১"), (f'19 + 5 = {LS}', "১"),
        ]),
        ("B3. Application", "৩ নম্বর", {}, [
            (f'ছোট থেকে বড় ক্রমে সাজাও: 34, 12, 27 → {LL}', "১"),
            (f'Double করলে ১৬ হয় — সংখ্যাটি কোনটি? {LS}', "১"),
            (f'18 + 7 এর উত্তরের একক স্থানের অঙ্ক কী? {LS}', "১"),
        ]),
    ],
    C=[
        ("C1. Pattern Completion (সারিতে missing shape)", "৪ নম্বর", {}, [
            (f'{shapes("bo,ro,bo,ro,bo")} {LS}', "১"),
            (f'{shapes("yx,yx,kw,yx,yx,kw,yx,yx")} {LS}', "১"),
            (f'{shapes("gs,ys,gs,ys,gs")} {LS}', "১"),
            (f'{shapes("ke,kq,ke,kq,ke")} {LS}', "১"),
        ]),
        ("C2. Classification", "৩ নম্বর",
         {"hint": hintbox("শব্দগুলো: Apple, Dog, Banana, Cat, Mango, Cow")}, [
            (f'Group 1 (Fruits): {LL}', "২"),
            (f'Group 2 (Animals): {LL}', "১"),
        ]),
        ("C3. Odd One Out", "৩ নম্বর", {}, [
            (f'{opt("Crayon &nbsp; Scale &nbsp; Scissors &nbsp; Pizza")}', "১"),
            (f'{opt("Monday &nbsp; Tuesday &nbsp; Friday &nbsp; Blue")}', "১"),
            (f'{opt("5 &nbsp; 10 &nbsp; 15 &nbsp; 17")}', "১"),
        ]),
    ],
))

# -------------------------------------------------------------------- DAY 13
DAYS.append(dict(
    n=13, sub="WH-QUESTIONS • NUMBER BONDS TO 20 • CLASSIFICATION",
    foot="Wh-Questions • Number Bonds to 20",
    A=[
        ("A1. Vocabulary Recall", "৩ নম্বর",
         {"hint": hintbox("প্যাসেজ পড়ার আগে শব্দগুলোর অর্থ অনুমান করে বাংলায় লেখো।")}, [
            (f'garden = {LM}', "১"), (f'flower = {LM}', "১"), (f'bee = {LM}', "১"),
        ]),
        ("A2. Wh-Question Practice", "৩ নম্বর",
         {"passage": passage_box(["Sara has a garden. She grows red flowers.",
                                  "A bee comes to the flowers every day."])}, [
            (f'Who has a garden? {LM}', "১"),
            (f'What colour are the flowers? {LM}', "১"),
            (f'What comes to the flowers? {LM}', "১"),
        ]),
        ("A3. Comprehension — Extended", "২ নম্বর", {}, [
            (f'সারা কী জন্মায়? {LM}', "১"),
            (f'মৌমাছি কখন আসে? {LM}', "১"),
        ]),
        ("A4. Writing", "২ নম্বর", {}, [
            (f'তোমার নিজের বাগান বা গাছ নিয়ে একটি বাক্য লেখো: {LF}', "১"),
            (f'"flower" শব্দের বানান তিনবার লেখো: {LL}', "১"),
        ]),
    ],
    B=[
        ("B1. Number Bonds to 20", "৪ নম্বর",
         {"method": method("<b>পদ্ধতি:</b> ২০ পূর্ণ করতে আর কত লাগবে — ১০-এর জোড়া মনে রেখে হিসাব করো।")}, [
            (f'12 + {LS} = 20', "১"), (f'15 + {LS} = 20', "১"),
            (f'8 + {LS} = 20', "১"), (f'20 − {LS} = 13', "১"),
        ]),
        ("B2. Mixed Addition–Subtraction", "৩ নম্বর", {}, [
            (f'14 + 5 = {LS}', "১"), (f'19 − 6 = {LS}', "১"), (f'11 + 8 = {LS}', "১"),
        ]),
        ("B3. Application", "৩ নম্বর", {}, [
            (f'রিমার ১৪টি চকলেট ছিল। সে ৫টি বন্ধুকে দিল, তারপর ৩টি আরও কিনল। এখন কয়টি আছে? {LF}', "২"),
            (f'20 তৈরি করতে 9 এর সাথে কত যোগ করতে হবে? {LS}', "১"),
        ]),
    ],
    C=[
        ("C1. Classification by Category", "৪ নম্বর",
         {"hint": hintbox("শব্দগুলো: Apple, Car, Bus, Mango, Bicycle, Banana")}, [
            (f'Fruits: {LL}', "২"),
            (f'Vehicles: {LL}', "২"),
        ]),
        ("C2. Odd One Out — Category Based", "৩ নম্বর", {}, [
            (f'{opt("Apple &nbsp; Mango &nbsp; Carrot &nbsp; Banana")}', "১"),
            (f'{opt("Car &nbsp; Bus &nbsp; Bicycle &nbsp; Cow")}', "১"),
            (f'{opt("Red &nbsp; Blue &nbsp; Green &nbsp; Happy")}', "১"),
        ]),
        ("C3. Pattern &amp; Sequencing", "৩ নম্বর", {}, [
            (f'2, 2, 4, 2, 2, 4, {LS}', "১"),
            (f'{shapes("rt,rd,rt,rd,rt")} {LS}', "১"),
            (f'সঠিক ক্রমে ১, ২, ৩ লেখো: <div>[ {LS} ] স্কুল থেকে ফেরা &nbsp;&nbsp; [ {LS} ] স্কুলের ব্যাগ গোছানো '
             f'&nbsp;&nbsp; [ {LS} ] ঘুমাতে যাওয়া</div>', "১"),
        ]),
    ],
))

# -------------------------------------------------------------------- DAY 14
DAYS.append(dict(
    n=14, title="সাপ্তাহিক মূল্যায়ন পরীক্ষা — সপ্তাহ ২",
    sub="WEEK 2 DIAGNOSTIC — এই স্কোর Day 7 এর সাথে তুলনা করে অগ্রগতি নির্ণয় করা হবে",
    note="<b>বিশেষ নির্দেশ:</b> Day 7 এর স্কোরের সাথে তুলনা করার জন্য এই পরীক্ষা। উন্নতির হার = "
         "(Day 14 − Day 7) ÷ ৩০ × ১০০ %",
    foot="Week 2 Diagnostic",
    A=[
        ("A1. Vocabulary &amp; Plural", "৩ নম্বর", {}, [
            (f'বহুবচন করো: One book → Two {LM}', "১"),
            (f'বহুবচন করো: One tree → Two {LM}', "১"),
            (f'সঠিক verb বৃত্ত দাও: I {opt("run / runs")} every day.', "১"),
        ]),
        ("A2. Verb Matching", "৩ নম্বর",
         {"hint": hintbox("শব্দগুলো: Read / Write / Sing")}, [
            (f'বই পড়ার ছবি → {LM}', "১"),
            (f'লেখার ছবি → {LM}', "১"),
            (f'গান গাওয়ার ছবি → {LM}', "১"),
        ]),
        ("A3. Reading Comprehension", "২ নম্বর",
         {"passage": passage_box(["Tom has a red ball. He plays with it in the park."])}, [
            (f'Who has a ball? {LM}', "১"),
            (f'What colour is the ball? {LM} &nbsp; Where does Tom play? {LM}', "১"),
        ]),
        ("A4. Writing", "২ নম্বর", {}, [
            (f'"ball" শব্দ দিয়ে একটি সম্পূর্ণ বাক্য লেখো: {LF}', "১"),
            (f'"garden" শব্দ দিয়ে একটি বাক্য লেখো: {LF}', "১"),
        ]),
    ],
    B=[
        ("B1. Mental Math Speed Round", "৪ নম্বর", {}, [
            (f'Double of 6 = {LS}', "১"), (f'16 + 7 = {LS}', "১"),
            (f'20 − 8 = {LS}', "১"), (f'13 + 6 = {LS}', "১"),
        ]),
        ("B2. Number Concept", "২ নম্বর", {}, [
            (f'10, 20, {LS}, 40', "১"),
            (f'15 + {LS} = 20', "১"),
        ]),
        ("B3. Pattern &amp; Ordering", "২ নম্বর", {}, [
            (f'ছোট থেকে বড় সাজাও: 45, 23, 38 → {LL}', "১"),
            (f'18 − 9 = {LS}', "১"),
        ]),
        ("B4. Word Problem", "২ নম্বর", {}, [
            (f'একটি দোকানে ২০টি করে পেন্সিল আছে এমন ৩টি বাক্স আছে। মোট কয়টি পেন্সিল? {LF}', "২"),
        ]),
    ],
    C=[
        ("C1. Rotation &amp; Odd One Out", "৩ নম্বর", {}, [
            (f'{shapes("rt")} এর ঘোরানো রূপ কোনটি? {opt("(ক)")} {shapes("rd")} &nbsp; {opt("(খ)")} {shapes("rt")} '
             f'&nbsp; উত্তর: {LS}', "১"),
            (f'ভিন্নটিতে বৃত্ত দাও: {opt("Apple &nbsp; Mango &nbsp; Carrot &nbsp; Banana")}', "১"),
            (f'ভিন্নটিতে বৃত্ত দাও: {opt("5 &nbsp; 10 &nbsp; 15 &nbsp; 17")}', "১"),
        ]),
        ("C2. Pattern Completion", "৩ নম্বর", {}, [
            (f'{shapes("bo,ro,bo,ro,bo")} {LS}', "১"),
            (f'{shapes("yx,yx,kw,yx,yx,kw")} {LS}', "১"),
            (f'2, 2, 4, 2, 2, 4, {LS}', "১"),
        ]),
        ("C3. Classification", "২ নম্বর",
         {"hint": hintbox("শব্দগুলো: Apple, Dog, Banana, Cat, Mango, Cow")}, [
            (f'Fruits: {LL}', "১"),
            (f'Animals: {LL}', "১"),
        ]),
        ("C4. Sequencing (৩ ধাপ)", "২ নম্বর", {}, [
            (f'সঠিক ক্রমে ১, ২, ৩ লেখো: <div>[ {LS} ] জামা শুকানো &nbsp;&nbsp; [ {LS} ] জামা ধোয়া '
             f'&nbsp;&nbsp; [ {LS} ] জামা পরা</div>', "২"),
        ]),
    ],
    score_left="Day 7 স্কোর: ______ / ৩০ &nbsp;→&nbsp; Day 14 স্কোর: ______ / ৩০ &nbsp;→&nbsp; উন্নতি: ______ %",
))

# -------------------------------------------------------------------- DAY 15
DAYS.append(dict(
    n=15, sub="SIGHT WORDS • ADDITION ≤50 (NO CARRY) • ANALOGY (পরিচিতি)",
    foot="Sight Words • Addition ≤50 • Analogy",
    A=[
        ("A1. Sight Words", "৩ নম্বর", {}, [
            (f'{LS} cat is black. {opt("(The / Teh)")}', "১"),
            (f'I {LS} happy. {opt("(am / is)")}', "১"),
            (f'This {LS} a dog. {opt("(is / am)")}', "১"),
        ]),
        ("A2. Sentence Building with Sight Words", "৩ নম্বর", {}, [
            (f'I have a cat {LS} a dog. {opt("(and)")}', "১"),
            (f'I go {LS} school. {opt("(to)")}', "১"),
            (f'The sun {LS} hot. {opt("(is)")}', "১"),
        ]),
        ("A3. Reading Comprehension", "২ নম্বর",
         {"passage": passage_box(["Rina has a red ball. She plays with it every day."])}, [
            (f'বলের রং কী? {LM}', "১"),
            (f'রিনা প্রতিদিন কী করে? {LM}', "১"),
        ]),
        ("A4. Writing", "২ নম্বর", {}, [
            (f'Unscramble করো: T – A – C → {LM}', "১"),
            (f'তোমার প্রিয় খেলনা নিয়ে একটি বাক্য লেখো: {LF}', "১"),
        ]),
    ],
    B=[
        ("B1. Addition ≤50 (হাতে রাখা ছাড়া)", "৪ নম্বর", {}, [
            (f'23 + 15 = {LS}', "১"), (f'34 + 12 = {LS}', "১"),
            (f'41 + 7 = {LS}', "১"), (f'26 + 13 = {LS}', "১"),
        ]),
        ("B2. Place Value Application", "২ নম্বর", {}, [
            (f'47-এর দশক স্থানের অঙ্ক কী? {LS}', "১"),
            (f'৫ দশক ৩ একক = {LS}', "১"),
        ]),
        ("B3. Pattern", "২ নম্বর", {}, [
            (f'5, 10, 15, {LS}, 25', "১"),
            (f'2, 4, 6, {LS}, 10', "১"),
        ]),
        ("B4. Word Problem", "২ নম্বর", {}, [
            (f'দোকানে ৩৫টি আম ছিল। ১২টি আরও আনা হলো। মোট কয়টি আম হলো? {LF}', "২"),
        ]),
    ],
    C=[
        ("C1. Analogy — নতুন পরিচিতি", "৪ নম্বর",
         {"method": method("<b>পদ্ধতি:</b> প্রথম জোড়ার সম্পর্ক খুঁজে বের করো, তারপর দ্বিতীয় জোড়ায় প্রয়োগ করো।")}, [
            (f'Bird : Sky :: Fish : {LM} {opt("(Water / Tree)")}', "১"),
            (f'Hand : Glove :: Foot : {LM} {opt("(Shoe / Hat)")}', "১"),
            (f'Sun : Day :: Moon : {LM} {opt("(Night / Rain)")}', "১"),
            (f'Cow : Milk :: Hen : {LM} {opt("(Egg / Wool)")}', "১"),
        ]),
        ("C2. Pattern Grid 2×2", "৩ নম্বর", {}, [
            (f'খালি ঘরে সঠিক আকৃতি আঁকো: {grid([["ro", "bo"], ["bo", ""]])}', "১"),
            (f'খালি ঘরে সঠিক সংখ্যা লেখো: {grid([["1", "2"], ["3", ""]])}', "১"),
            (f'খালি ঘরে সঠিক সংখ্যা লেখো: {grid([["2", "4"], ["6", ""]])}', "১"),
        ]),
        ("C3. Odd One Out — Mixed", "৩ নম্বর", {}, [
            (f'{opt("Circle &nbsp; Square &nbsp; Triangle &nbsp; Red")}', "১"),
            (f'{opt("2 &nbsp; 4 &nbsp; 6 &nbsp; 7")}', "১"),
            (f'{opt("Monday &nbsp; Tuesday &nbsp; January &nbsp; Wednesday")}', "১"),
        ]),
    ],
))

# -------------------------------------------------------------------- DAY 16
DAYS.append(dict(
    n=16, sub="SYNONYMS • SUBTRACTION ≤50 • PATTERN GRID • SIMILARITIES",
    foot="Synonyms • Subtraction ≤50",
    A=[
        ("A1. Synonyms (সমার্থক শব্দ)", "৩ নম্বর", {}, [
            (f'Big = {opt("Large / Small")}', "১"),
            (f'Happy = {opt("Sad / Glad")}', "১"),
            (f'Fast = {opt("Quick / Slow")}', "১"),
        ]),
        ("A2. Synonym Application in Sentence", "৩ নম্বর", {}, [
            (f'"Big" এর বদলে সমার্থক শব্দ বসাও: The elephant is {LM}.', "১"),
            (f'"Happy" এর সমার্থক শব্দ বসাও: I am {LM} today.', "১"),
            (f'"Fast" এর সমার্থক শব্দ বসাও: The car is {LM}.', "১"),
        ]),
        ("A3. Reading Comprehension", "২ নম্বর",
         {"passage": passage_box(["The rabbit is quick. It runs fast in the field."])}, [
            (f'খরগোশ কেমন? {LM}', "১"),
            (f'এটি কোথায় দৌড়ায়? {LM}', "১"),
        ]),
        ("A4. Writing", "২ নম্বর", {}, [
            (f'"Small" এর একটি সমার্থক শব্দ লেখো: {LM}', "১"),
            (f'সেই শব্দ দিয়ে একটি বাক্য লেখো: {LF}', "১"),
        ]),
    ],
    B=[
        ("B1. Subtraction ≤50", "৪ নম্বর", {}, [
            (f'45 − 23 = {LS}', "১"), (f'38 − 15 = {LS}', "১"),
            (f'49 − 26 = {LS}', "১"), (f'32 − 11 = {LS}', "১"),
        ]),
        ("B2. Number Application", "২ নম্বর", {}, [
            (f'50 থেকে 18 বিয়োগ করলে কত হয়? {LS}', "১"),
            (f'কোন সংখ্যা থেকে 10 বিয়োগ করলে 25 হয়? {LS}', "১"),
        ]),
        ("B3. Pattern", "২ নম্বর", {}, [
            (f'45, 40, 35, {LS}, 25', "১"),
            (f'{shapes("bs,bs,ys,bs,bs,ys")} {LS}', "১"),
        ]),
        ("B4. Word Problem", "২ নম্বর", {}, [
            (f'একটি বাগানে ৪০টি গাছ ছিল। ঝড়ে ১৭টি গাছ পড়ে গেল। কয়টি গাছ বাকি রইল? {LF}', "২"),
        ]),
    ],
    C=[
        ("C1. Pattern Grid 2×2 — Advanced", "৪ নম্বর", {}, [
            (f'খালি ঘরে সঠিক আকৃতি আঁকো: {grid([["ke", "kq"], ["kq", ""]])}', "১"),
            (f'খালি ঘরে সঠিক অক্ষর লেখো: {grid([["A", "B"], ["B", ""]])}', "১"),
            (f'খালি ঘরে সঠিক সংখ্যা লেখো: {grid([["1", "2"], ["2", ""]])}', "১"),
            (f'খালি ঘরে সঠিক সংখ্যা লেখো: {grid([["3", "4"], ["4", ""]])}', "১"),
        ]),
        ("C2. Odd One Out — Abstract", "৩ নম্বর", {}, [
            (f'{opt("Rose &nbsp; Tulip &nbsp; Lily &nbsp; Carrot")}', "১"),
            (f'{opt("4 &nbsp; 9 &nbsp; 16 &nbsp; 20")}', "১"),
            (f'{opt("Circle &nbsp; Ball &nbsp; Wheel &nbsp; Box")}', "১"),
        ]),
        ("C3. Similarities", "৩ নম্বর", {}, [
            (f'Apple ও Mango — দুটির মধ্যে মিল কী? (উভয়ই {LM})', "১"),
            (f'Dog ও Cat — দুটির মধ্যে মিল কী? (উভয়ই {LM})', "১"),
            (f'Car ও Bus — দুটির মধ্যে মিল কী? (উভয়ই {LM})', "১"),
        ]),
    ],
))

# -------------------------------------------------------------------- DAY 17
DAYS.append(dict(
    n=17, sub="DIGRAPHS (sh, ch, th) • MULTIPLICATION INTRODUCTION (2's) • GROWTH SEQUENCE",
    foot="Digraphs • Multiplication (2's)",
    A=[
        ("A1. Digraphs — sh, ch, th", "৩ নম্বর",
         {"method": method("<b>নিয়ম:</b> দুটি অক্ষর একসাথে মিলে একটি নতুন ধ্বনি তৈরি করে — "
                           "<b>sh</b> (শ), <b>ch</b> (চ), <b>th</b> (থ)।")}, [
            (f'sh {LS} p &nbsp; (ship এর জন্য) → বৃত্ত দাও {opt("i / e")}', "১"),
            (f'ch {LS} r &nbsp; (chair এর জন্য) → বৃত্ত দাও {opt("ai / oi")}', "১"),
            (f'th {LS} n &nbsp; (thin এর জন্য) → বৃত্ত দাও {opt("i / o")}', "১"),
        ]),
        ("A2. Digraph Word Recognition", "৩ নম্বর", {}, [
            (f'কোন শব্দে "sh" আছে? {opt("Ship / Cup")}', "১"),
            (f'কোন শব্দে "ch" আছে? {opt("Chair / Table")}', "১"),
            (f'কোন শব্দে "th" আছে? {opt("Thin / Pen")}', "১"),
        ]),
        ("A3. Reading Comprehension", "২ নম্বর",
         {"passage": passage_box(["The ship sails on the sea. It is very big."])}, [
            (f'জাহাজ কোথায় চলে? {LM}', "১"),
            (f'জাহাজটি কেমন আকারের? {LM}', "১"),
        ]),
        ("A4. Writing", "২ নম্বর", {}, [
            (f'"sh" দিয়ে একটি শব্দ লেখো: {LM}', "১"),
            (f'"ch" দিয়ে একটি শব্দ লেখো: {LM}', "১"),
        ]),
    ],
    B=[
        ("B1. Multiplication — 2 এর নামতা", "৪ নম্বর",
         {"method": method("<b>পদ্ধতি:</b> 2 × 3 মানে 2 + 2 + 2 = 6 (২-এর ৩টি দল)।")}, [
            (f'2 × 1 = {LS}', "১"), (f'2 × 3 = {LS}', "১"),
            (f'2 × 5 = {LS}', "১"), (f'2 × 4 = {LS}', "১"),
        ]),
        ("B2. Repeated Addition → Multiplication", "২ নম্বর", {}, [
            (f'3 + 3 + 3 = {LS} &nbsp;&nbsp; গুণে লেখো: 3 × {LS} = {LS}', "১"),
            (f'4 + 4 = {LS} &nbsp;&nbsp; গুণে লেখো: 4 × {LS} = {LS}', "১"),
        ]),
        ("B3. Application", "২ নম্বর", {}, [
            (f'একটি হাতে ৫টি আঙুল। ২ হাতে কয়টি আঙুল? {LS}', "১"),
            (f'একটি গাড়িতে ৪টি চাকা। ৩টি গাড়িতে কয়টি চাকা? {LS}', "১"),
        ]),
        ("B4. Word Problem", "২ নম্বর", {}, [
            (f'প্রতিটি বাক্সে ২টি করে বল আছে। ৫টি বাক্সে মোট কয়টি বল? {LF}', "২"),
        ]),
    ],
    C=[
        ("C1. Growth Process Sequence", "৪ নম্বর", {}, [
            (f'সঠিক ক্রমে ১–৪ লেখো: <div>[ {LS} ] ফুল ফোটা &nbsp;&nbsp; [ {LS} ] বীজ বপন &nbsp;&nbsp; '
             f'[ {LS} ] চারাগাছ &nbsp;&nbsp; [ {LS} ] ফল ধরা</div>', "৪"),
        ]),
        ("C2. Growth Sequence — Variant", "৩ নম্বর", {}, [
            (f'সঠিক ক্রমে ১, ২, ৩ লেখো: <div>[ {LS} ] মুরগির বাচ্চা &nbsp;&nbsp; [ {LS} ] ডিম &nbsp;&nbsp; '
             f'[ {LS} ] পূর্ণবয়স্ক মুরগি</div>', "৩"),
        ]),
        ("C3. Pattern Completion", "৩ নম্বর", {}, [
            (f'{shapes("rt,rt,rt,bo,rt,rt,rt,bo")} {LS}', "১"),
            (f'1, 1, 2, 2, 3, 3, {LS}', "১"),
            (f'A, A, B, B, C, C, {LS}', "১"),
        ]),
    ],
))

# -------------------------------------------------------------------- DAY 18
DAYS.append(dict(
    n=18, sub="ARTICLES a / an • HALVING • ABSTRACT ODD ONE OUT • REASONING",
    foot="Articles • Halving • Reasoning",
    A=[
        ("A1. Article \"a / an\"", "৩ নম্বর",
         {"method": method("<b>নিয়ম:</b> স্বরবর্ণ (a, e, i, o, u) দিয়ে শুরু শব্দের আগে <b>an</b>, "
                           "ব্যঞ্জনবর্ণে <b>a</b>।")}, [
            (f'I have {LS} apple. {opt("(a / an)")}', "১"),
            (f'I have {LS} ball. {opt("(a / an)")}', "১"),
            (f'I saw {LS} elephant. {opt("(a / an)")}', "১"),
        ]),
        ("A2. Article Application", "৩ নম্বর", {}, [
            (f'She has {LS} umbrella. {opt("(a / an)")}', "১"),
            (f'He is {LS} boy. {opt("(a / an)")}', "১"),
            (f'It is {LS} orange. {opt("(a / an)")}', "১"),
        ]),
        ("A3. Reading Comprehension", "২ নম্বর",
         {"passage": passage_box(["I have an umbrella. It is a big umbrella."])}, [
            (f'লেখকের কী আছে? {LM}', "১"),
            (f'ছাতাটি কেমন? {LM}', "১"),
        ]),
        ("A4. Writing", "২ নম্বর", {}, [
            (f'"a" ব্যবহার করে একটি বাক্য লেখো: {LF}', "১"),
            (f'"an" ব্যবহার করে একটি বাক্য লেখো: {LF}', "১"),
        ]),
    ],
    B=[
        ("B1. Halving (জোড় সংখ্যা ≤20)", "৪ নম্বর",
         {"method": method("<b>পদ্ধতি:</b> Half of 8 মানে 8 ÷ 2 = 4 — সমান দুই ভাগে ভাগ করা।")}, [
            (f'Half of 4 = {LS}', "১"), (f'Half of 10 = {LS}', "১"),
            (f'Half of 16 = {LS}', "১"), (f'Half of 20 = {LS}', "১"),
        ]),
        ("B2. Doubling–Halving Relationship", "২ নম্বর", {}, [
            (f'Double of 6 = {LS} &nbsp;&nbsp; তাহলে Half of 12 = {LS}', "২"),
        ]),
        ("B3. Application", "২ নম্বর", {}, [
            (f'১৪টি চকলেট দুই বন্ধুতে সমান ভাগ করলে প্রত্যেকে কয়টি পাবে? {LS}', "১"),
            (f'১৮টি বল দুই দলে সমান ভাগ করলে প্রতি দলে কয়টি? {LS}', "১"),
        ]),
        ("B4. Word Problem", "২ নম্বর", {}, [
            (f'মায়ের ১২টি আম ছিল। তিনি অর্ধেক প্রতিবেশীকে দিলেন। তাঁর কাছে কয়টি বাকি? {LF}', "২"),
        ]),
    ],
    C=[
        ("C1. Odd One Out — Abstract Property", "৪ নম্বর",
         {"method": method('<b>পদ্ধতি:</b> প্রথমে ভাবো — "এই ৪টির মধ্যে ৩টির মিল কী?"')}, [
            (f'{opt("Whisper &nbsp; Shout &nbsp; Talk &nbsp; Jump")}', "১"),
            (f'{opt("Circle &nbsp; Square &nbsp; Red &nbsp; Triangle")}', "১"),
            (f'{opt("2 &nbsp; 4 &nbsp; 6 &nbsp; 9")}', "১"),
            (f'{opt("Happy &nbsp; Sad &nbsp; Angry &nbsp; Table")}', "১"),
        ]),
        ("C2. Abstract Classification", "৩ নম্বর", {}, [
            (f'কোনটি "feeling" নয়? {opt("Happy &nbsp; Sad &nbsp; Chair &nbsp; Angry")}', "১"),
            (f'কোনটি "shape" নয়? {opt("Circle &nbsp; Square &nbsp; Yellow &nbsp; Triangle")}', "১"),
            (f'কোনটি সংখ্যা-প্যাটার্ন ভাঙছে? {opt("10 &nbsp; 20 &nbsp; 30 &nbsp; 35 &nbsp; 50")}', "১"),
        ]),
        ("C3. Reasoning", "৩ নম্বর", {}, [
            (f'যদি সব ফুল সুন্দর হয়, এবং গোলাপ একটি ফুল হয় — তাহলে গোলাপ কেমন? {LM}', "১"),
            (f'যদি সব পাখি ওড়ে, এবং কাক একটি পাখি হয় — কাক কী করতে পারে? {LM}', "১"),
            (f'বৃষ্টি হলে মাটি ভেজে। আজ মাটি ভেজা — তাহলে কী হতে পারে? {LM}', "১"),
        ]),
    ],
))

# -------------------------------------------------------------------- DAY 19
DAYS.append(dict(
    n=19, sub="VERB AGREEMENT • MIXED MENTAL MATH • CODING–DECODING (পরিচিতি)",
    foot="Verb Agreement • Coding–Decoding",
    A=[
        ("A1. Sentence Completion — Correct Verb", "৩ নম্বর", {}, [
            (f'She {LS} to school. {opt("(go / goes)")}', "১"),
            (f'They {LS} football. {opt("(play / plays)")}', "১"),
            (f'He {LS} a book. {opt("(read / reads)")}', "১"),
        ]),
        ("A2. Sentence Completion — Missing Word", "৩ নম্বর", {}, [
            (f'The sun {LS} hot. {opt("(is / are)")}', "১"),
            (f'Cats {LS} milk. {opt("(like / likes)")}', "১"),
            (f'I {LS} a student. {opt("(am / is)")}', "১"),
        ]),
        ("A3. Reading Comprehension", "২ নম্বর",
         {"passage": passage_box(["Every morning, birds sing in the trees. They sound very sweet."])}, [
            (f'পাখিরা কখন গান গায়? {LM}', "১"),
            (f'তাদের গান কেমন শোনায়? {LM}', "১"),
        ]),
        ("A4. Writing", "২ নম্বর", {}, [
            (f'"goes" শব্দ দিয়ে একটি বাক্য লেখো: {LF}', "১"),
            (f'"plays" শব্দ দিয়ে একটি বাক্য লেখো: {LF}', "১"),
        ]),
    ],
    B=[
        ("B1. Mixed Mental Math", "৪ নম্বর", {}, [
            (f'27 + 13 = {LS}', "১"), (f'45 − 19 = {LS}', "১"),
            (f'2 × 6 = {LS}', "১"), (f'Half of 18 = {LS}', "১"),
        ]),
        ("B2. Application", "২ নম্বর", {}, [
            (f'30-এর দশক অঙ্ক {LS} ও একক অঙ্ক {LS}', "১"),
            (f'8-এর দ্বিগুণ কত? {LS}', "১"),
        ]),
        ("B3. One-Step Word Problem", "২ নম্বর", {}, [
            (f'একটি ক্লাসে ২৫ জন ছাত্র ছিল, ৮ জন অসুস্থ হয়ে বাসায় রইল। কতজন স্কুলে এলো? {LF}', "২"),
        ]),
        ("B4. Two-Step Word Problem — পরিচিতি", "২ নম্বর", {}, [
            (f'রহিমের ১৫ টাকা ছিল। সে ৫ টাকার একটি চকলেট কিনল, তারপর মা তাকে ১০ টাকা দিলেন। '
             f'এখন তার কাছে কত টাকা? {LF}', "২"),
        ]),
    ],
    C=[
        ("C1. Coding–Decoding — পরিচিতি", "৫ নম্বর",
         {"method": method("<b>নিয়ম:</b> A = 1, B = 2, C = 3, D = 4, E = 5 … (বর্ণমালার ক্রম অনুযায়ী)")}, [
            (f'B এর কোড কী? {LS}', "১"),
            (f'কোড 3 কোন অক্ষর? {LS}', "১"),
            (f'CAB এর কোড লেখো: {LS} – {LS} – {LS}', "১"),
            (f'কোড 4 – 1 – 2 হলে শব্দটি কী? {LM}', "১"),
            (f'যদি DOG = 4 – 15 – 7 হয়, তাহলে CAT এর কোড কত? {hint("(C=3, A=1, T=20)")} {LL}', "১"),
        ]),
        ("C2. Simple Pattern Coding", "৩ নম্বর", {}, [
            (f'যদি {shapes("ro")} = 1 এবং {shapes("bo")} = 2 হয়, তাহলে {shapes("ro,bo,ro")} = {LL}', "১"),
            (f'যদি {shapes("yx")} = A এবং {shapes("ko")} = B হয়, তাহলে {shapes("yx,ko,yx")} = {LL}', "১"),
            (f'কোড 5 – 3 – 1 কে উল্টো করে লেখো: {LL}', "১"),
        ]),
        ("C3. Logical Deduction", "২ নম্বর", {}, [
            (f'রিয়া, তিশার চেয়ে লম্বা। তিশা, মিমের চেয়ে লম্বা। সবচেয়ে লম্বা কে? {LM}', "১"),
            (f'যদি A &gt; B এবং B &gt; C হয়, তাহলে A ও C এর মধ্যে সম্পর্ক কী? {LM}', "১"),
        ]),
    ],
))

# -------------------------------------------------------------------- DAY 20
DAYS.append(dict(
    n=20, sub="CAPITAL LETTER &amp; FULL STOP • TIME (O'CLOCK, HALF PAST) • MIRROR IMAGE",
    foot="Capitalisation • Time • Mirror Image",
    A=[
        ("A1. Capital Letter Rule", "৩ নম্বর",
         {"method": method("<b>নিয়ম:</b> বাক্যের প্রথম অক্ষর ও নামের প্রথম অক্ষর সবসময় বড় হাতের হয়।")}, [
            (f'my name is rina. → {LF}', "১"),
            (f'i love my school. → {LF}', "১"),
            (f'rana plays football. → {LF}', "১"),
        ]),
        ("A2. Full Stop Application", "৩ নম্বর", {}, [
            (f'I have a dog {LS}', "১"),
            (f'She likes cats {LS}', "১"),
            (f'We play in the park {LS}', "১"),
        ]),
        ("A3. Reading Comprehension", "২ নম্বর",
         {"passage": passage_box(["My name is Rina. I love my school."])}, [
            (f'মেয়েটির নাম কী? {LM}', "১"),
            (f'সে কী ভালোবাসে? {LM}', "১"),
        ]),
        ("A4. Writing", "২ নম্বর", {}, [
            (f'তোমার নাম দিয়ে সঠিক বাক্য লেখো (বড় হাতের অক্ষর ও দাঁড়ি সহ): {LF}', "১"),
            (f'তোমার স্কুল নিয়ে একটি বাক্য লেখো (নিয়ম মেনে): {LF}', "১"),
        ]),
    ],
    B=[
        ("B1. Time Reading — o'clock", "৩ নম্বর",
         {"method": method("<b>নিয়ম:</b> ছোট কাঁটা = ঘণ্টা, বড় কাঁটা = মিনিট। বড় কাঁটা ১২-এ থাকলে "
                           "\"o'clock\", ৬-এ থাকলে \"half past\"।")}, [
            (f'ঘড়িতে ছোট কাঁটা ৩-এ, বড় কাঁটা ১২-এ = {LS} o\'clock', "১"),
            (f'ছোট কাঁটা ৮-এ, বড় কাঁটা ১২-এ = {LS} o\'clock', "১"),
            (f'ছোট কাঁটা ১-এ, বড় কাঁটা ১২-এ = {LS} o\'clock', "১"),
        ]),
        ("B2. Time Reading — Half Past", "৩ নম্বর", {}, [
            (f'ঘড়িতে ৩:৩০ হলে বলা হয় "Half past {LS}"', "১"),
            (f'"Half past 7" মানে ঘড়িতে কী সময়? {LS} : {LS}', "১"),
            (f'"Half past 10" সংখ্যায় লেখো: {LS} : {LS}', "১"),
        ]),
        ("B3. Application", "২ নম্বর", {}, [
            (f'স্কুল শুরু হয় ৯টায়। এখন ৮টা। স্কুল শুরু হতে আর কত ঘণ্টা বাকি? {LS}', "১"),
            (f'ঘুমাতে যাওয়ার সময় রাত ৯টা। এখন রাত ৮টা। আর কত সময় বাকি? {LS}', "১"),
        ]),
        ("B4. Mixed Review", "২ নম্বর", {}, [
            (f'2 × 4 = {LS}', "১"), (f'Half of 14 = {LS}', "১"),
        ]),
    ],
    C=[
        ("C1. Mirror Image (আয়নার প্রতিচ্ছবি)", "৪ নম্বর",
         {"method": method("<b>পদ্ধতি:</b> কাগজে এঁকে সত্যিই উল্টে ধরে দেখো — বাম দিকটা ডানে চলে যায়।")}, [
            (f'<b>b</b> এর mirror image: {opt("d / b / p")}', "১"),
            (f'অক্ষর <b>E</b> এর mirror image আঁকো: {LM}', "১"),
            (f'{shapes("rt")} (ডানে হেলানো) এর mirror image: {opt("(ক)")} {shapes("rd")} &nbsp; '
             f'{opt("(খ) বামে হেলানো")} &nbsp; {opt("(গ)")} {shapes("rt")} &nbsp; উত্তর: {LS}', "১"),
            (f'সংখ্যা <b>3</b> এর mirror image আঁকো: {LM}', "১"),
        ]),
        ("C2. Spatial Reasoning", "৩ নম্বর", {}, [
            (f'আয়নার সামনে ডান হাত তুললে আয়নায় কোন হাত ওঠা দেখাবে? {LM}', "১"),
            (f'{shapes("kt")} এবং {shapes("kd")} — এদের একটি অন্যটির প্রতিচ্ছবি কি? {opt("(হ্যাঁ / না)")} {LS}', "১"),
            (f'{shapes("ka")} এর প্রতিচ্ছবি কোনটি? {opt("(ক) ←")} &nbsp; {opt("(খ)")} {shapes("ku")} '
             f'&nbsp; উত্তর: {LS}', "১"),
        ]),
        ("C3. Comprehensive Mixed Review", "৩ নম্বর", {}, [
            (f'Odd one out: {opt("Car &nbsp; Bus &nbsp; Bicycle &nbsp; Apple")}', "১"),
            (f'Pattern: 2, 4, 6, 8, {LS}', "১"),
            (f'সঠিক ক্রমে ১, ২, ৩: <div>[ {LS} ] পড়া শুরু করা &nbsp;&nbsp; [ {LS} ] বই খোলা &nbsp;&nbsp; '
             f'[ {LS} ] বই বন্ধ করা</div>', "১"),
        ]),
    ],
))
