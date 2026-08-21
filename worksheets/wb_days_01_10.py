# -*- coding: utf-8 -*-
"""Day 1 – Day 10 worksheet content (Foundation week + Building blocks)."""
from wb_lib import LS, LM, LL, LF, opt, hint, shapes, grid, passage_box, method, hintbox

DAYS = []

# --------------------------------------------------------------------- DAY 1
DAYS.append(dict(
    n=1, sub="ALPHABET A–M • NUMBERS 1–10 • ODD ONE OUT",
    foot="Alphabet Foundation • Numbers 1–10",
    A=[
        ("A1. Phonics &amp; Letter Recognition", "৩ নম্বর", {}, [
            (f'বড় হাতের অক্ষরটিতে (Capital Letter) বৃত্ত দাও: {opt("a / B")}', "১"),
            (f'বড় হাতের অক্ষরটিতে বৃত্ত দাও: {opt("c / D")}', "১"),
            (f'বড় হাতের অক্ষরটিতে বৃত্ত দাও: {opt("e / F")}', "১"),
        ]),
        ("A2. Vocabulary Matching", "৩ নম্বর",
         {"hint": hintbox("বাম পাশের ছবির নামের সাথে ডান পাশের শব্দ রেখা টেনে মেলাও।")}, [
            (f'বিড়ালের ছবি &nbsp;→&nbsp; {LM} &nbsp; {opt("(Ball / Cat / Sun)")}', "১"),
            (f'সূর্যের ছবি &nbsp;→&nbsp; {LM} &nbsp; {opt("(Ball / Cat / Sun)")}', "১"),
            (f'বলের ছবি &nbsp;→&nbsp; {LM} &nbsp; {opt("(Ball / Cat / Sun)")}', "১"),
        ]),
        ("A3. Reading Comprehension", "২ নম্বর",
         {"passage": passage_box(["I have a cat. The cat is black."])}, [
            (f'বিড়ালটির রং কী? {LM}', "১"),
            (f'লেখকের কি বিড়াল আছে? {opt("(Yes / No)")} {LS}', "১"),
        ]),
        ("A4. Writing", "২ নম্বর", {}, [
            (f'শূন্যস্থান পূরণ করে লেখো: c _ t → {LM}', "১"),
            (f'শূন্যস্থান পূরণ করে লেখো: s _ n → {LM}', "১"),
        ]),
    ],
    B=[
        ("B1. Mental Math Speed Round", "৪ নম্বর",
         {"hint": hintbox("প্রতিটি প্রশ্নের জন্য সর্বোচ্চ ২০ সেকেন্ড।")}, [
            (f'1 + 2 = {LS}', "১"), (f'2 + 2 = {LS}', "১"),
            (f'1 + 4 = {LS}', "১"), (f'3 + 2 = {LS}', "১"),
        ]),
        ("B2. Number Concept", "২ নম্বর", {}, [
            (f'4-এর পরের সংখ্যা কোনটি? {LS}', "১"),
            (f'বড় সংখ্যাটিতে বৃত্ত দাও: {opt("7 &nbsp; 3")}', "১"),
        ]),
        ("B3. Pattern", "২ নম্বর", {}, [
            (f'1, 2, 3, {LS}, 5', "১"),
            (f'{shapes("bo,ro,bo,ro")} {LS}', "১"),
        ]),
        ("B4. Word Problem", "২ নম্বর", {}, [
            (f'রিনার ২টি আম আছে। সে আরও ১টি আম পেল। এখন তার কয়টি আম? {LF}', "২"),
        ]),
    ],
    C=[
        ("C1. Odd One Out", "৩ নম্বর", {}, [
            (f'ভিন্নটিতে বৃত্ত দাও: {opt("Apple &nbsp; Banana &nbsp; Grapes &nbsp; Car")}', "১"),
            (f'ভিন্নটিতে বৃত্ত দাও: {opt("Dog &nbsp; Cat &nbsp; Cow &nbsp; Bus")}', "১"),
            (f'ভিন্নটিতে বৃত্ত দাও: {opt("Football &nbsp; Basketball &nbsp; Tennis ball &nbsp; Book")}', "১"),
        ]),
        ("C2. Pattern Completion", "৩ নম্বর", {}, [
            (f'{shapes("rt,bo,rt,bo")} {LS}', "১"),
            (f'{shapes("yx,kw,yx,kw")} {LS}', "১"),
            (f'{shapes("gs,rs,gs,rs")} {LS}', "১"),
        ]),
        ("C3. Similarities", "২ নম্বর", {}, [
            (f'কোন দুটি আকৃতি একই? {shapes("kw,kq,kw,ke")} &nbsp; উত্তর: {LM}', "১"),
            (f'কোন দুটি রং একই? {shapes("ro,bo,ro,go")} &nbsp; উত্তর: {LM}', "১"),
        ]),
        ("C4. Sequencing", "২ নম্বর", {}, [
            (f'সঠিক ক্রমে ১ ও ২ লেখো: <div>[ {LS} ] স্কুলে যাওয়া &nbsp;&nbsp; [ {LS} ] ঘুম থেকে ওঠা</div>', "২"),
        ]),
    ],
))

# --------------------------------------------------------------------- DAY 2
DAYS.append(dict(
    n=2, sub="ALPHABET N–Z • BEFORE / AFTER NUMBERS • MATCHING PAIRS",
    foot="Alphabet N–Z • Before/After",
    A=[
        ("A1. Phonics &amp; Letter Recognition", "৩ নম্বর", {}, [
            (f'অক্ষর বসাও: N, O, {LS}, Q, R', "১"),
            (f'ছোট হাতের <b>n</b> এর বড় হাতের রূপ কী? {LS}', "১"),
            (f'বর্ণমালার শেষ অক্ষরটিতে বৃত্ত দাও: {opt("X &nbsp; Y &nbsp; Z")}', "১"),
        ]),
        ("A2. Vocabulary Matching", "৩ নম্বর",
         {"hint": hintbox("সঠিক শব্দটি লেখো — Dog / Star / Tree")}, [
            (f'কুকুরের ছবি → {LM}', "১"),
            (f'তারার ছবি → {LM}', "১"),
            (f'গাছের ছবি → {LM}', "১"),
        ]),
        ("A3. Reading Comprehension", "২ নম্বর",
         {"passage": passage_box(["I have a dog. My dog is white."])}, [
            (f'কুকুরটির রং কী? {LM}', "১"),
            (f'এটি কী প্রাণী? {LM}', "১"),
        ]),
        ("A4. Writing", "২ নম্বর", {}, [
            (f'শূন্যস্থান পূরণ করো: d _ g → {LM}', "১"),
            (f'শূন্যস্থান পূরণ করো: b _ g → {LM}', "১"),
        ]),
    ],
    B=[
        ("B1. Mental Math Speed Round", "৪ নম্বর", {}, [
            (f'3 + 2 = {LS}', "১"), (f'4 + 1 = {LS}', "১"),
            (f'2 + 3 = {LS}', "১"), (f'5 − 1 = {LS}', "১"),
        ]),
        ("B2. Number Concept", "২ নম্বর", {}, [
            (f'আগের সংখ্যাটি লেখো: {LS}, 8', "১"),
            (f'বড় সংখ্যাটিতে বৃত্ত দাও: {opt("15 &nbsp; 9")}', "১"),
        ]),
        ("B3. Pattern", "২ নম্বর", {}, [
            (f'2, 3, 4, {LS}, 6', "১"),
            (f'{shapes("ro,bo,ro,bo")} {LS}', "১"),
        ]),
        ("B4. Word Problem", "২ নম্বর", {}, [
            (f'করিমের ৩টি চকলেট আছে। সে আরও ২টি পেল। মোট কয়টি চকলেট? {LF}', "২"),
        ]),
    ],
    C=[
        ("C1. Odd One Out", "৩ নম্বর", {}, [
            (f'ভিন্নটিতে বৃত্ত দাও: {opt("Car &nbsp; Bus &nbsp; Bicycle &nbsp; Book")}', "১"),
            (f'ভিন্নটিতে বৃত্ত দাও: {opt("Sun &nbsp; Moon &nbsp; Star &nbsp; Pizza")}', "১"),
            (f'ভিন্নটিতে বৃত্ত দাও: {opt("Shoe &nbsp; Sandal &nbsp; Boot &nbsp; Banana")}', "১"),
        ]),
        ("C2. Matching Pairs", "৩ নম্বর",
         {"hint": hintbox("প্রতিটি সারিতে হুবহু একই দুটি খুঁজে বের করো এবং দাগ দাও।")}, [
            (f'{shapes("kw,rt,kw,kq")}', "১"),
            (f'{shapes("rs,bs,rs,gs")}', "১"),
            (f'{shapes("yx,kw,yx,bo")}', "১"),
        ]),
        ("C3. Similarities", "২ নম্বর", {}, [
            (f'কোন দুটি সম্পূর্ণ একই? {opt("Cat &nbsp; Cat &nbsp; Dog &nbsp; Mouse")} → {LM}', "১"),
            (f'কোন দুটি একই রঙের ফুল? {shapes("ro,yo,ro,po")} → {LM}', "১"),
        ]),
        ("C4. Sequencing", "২ নম্বর", {}, [
            (f'সঠিক ক্রমে ১ ও ২ লেখো: <div>[ {LS} ] চা বানানো &nbsp;&nbsp; [ {LS} ] পানি ফুটানো</div>', "২"),
        ]),
    ],
))

# --------------------------------------------------------------------- DAY 3
DAYS.append(dict(
    n=3, sub="CVC BLENDING (-at, -an, -ap) • NUMBERS 21–50 • AB PATTERN",
    foot="CVC Blending • Numbers 21–50",
    A=[
        ("A1. Blending (ধ্বনি জোড়া লাগানো)", "৩ নম্বর",
         {"method": method('<b>পদ্ধতি:</b> প্রতিটি অক্ষরের ধ্বনি ধীরে ধীরে বলো, তারপর জোড়া লাগাও — '
                           '"ক্‌...আ...ট্‌" → <b>cat</b>')}, [
            (f'c – a – t = {LM}', "১"),
            (f'm – a – t = {LM}', "১"),
            (f'h – a – t = {LM}', "১"),
        ]),
        ("A2. Vocabulary Matching", "৩ নম্বর",
         {"hint": hintbox("সঠিক শব্দ লেখো — Ant / Map / Cab")}, [
            (f'পিঁপড়ার ছবি → {LM}', "১"),
            (f'মানচিত্রের ছবি → {LM}', "১"),
            (f'ট্যাক্সির ছবি → {LM}', "১"),
        ]),
        ("A3. Reading Comprehension", "২ নম্বর",
         {"passage": passage_box(["I see a cat on a mat."])}, [
            (f'বিড়ালটি কোথায় আছে? {LM}', "১"),
            (f'কয়টি বিড়াল দেখা যাচ্ছে? {LS}', "১"),
        ]),
        ("A4. Writing", "২ নম্বর", {}, [
            (f'সঠিক শব্দটিতে বৃত্ত দাও: c _ t → {opt("cat / cot")}', "১"),
            (f'সঠিক শব্দটিতে বৃত্ত দাও: m _ p → {opt("map / mop")}', "১"),
        ]),
    ],
    B=[
        ("B1. Mental Math Speed Round", "৪ নম্বর", {}, [
            (f'4 + 3 = {LS}', "১"), (f'5 + 2 = {LS}', "১"),
            (f'3 + 4 = {LS}', "১"), (f'6 + 1 = {LS}', "১"),
        ]),
        ("B2. Number Concept (২১–৫০)", "২ নম্বর", {}, [
            (f'বড় সংখ্যাটিতে বৃত্ত দাও: {opt("34 &nbsp; 29")}', "১"),
            (f'ছোট সংখ্যাটিতে বৃত্ত দাও: {opt("45 &nbsp; 38")}', "১"),
        ]),
        ("B3. Pattern", "২ নম্বর", {}, [
            (f'3, 6, 9, {LS}, 15', "১"),
            (f'{shapes("ys,ps,ys,ps")} {LS}', "১"),
        ]),
        ("B4. Word Problem", "২ নম্বর", {}, [
            (f'বাগানে ৪টি ফুল ছিল। আরও ৩টি ফুল ফুটল। মোট কয়টি ফুল হলো? {LF}', "২"),
        ]),
    ],
    C=[
        ("C1. Odd One Out", "৩ নম্বর", {}, [
            (f'ভিন্নটিতে বৃত্ত দাও: {opt("Orange &nbsp; Lemon &nbsp; Strawberry &nbsp; Pen")}', "১"),
            (f'ভিন্নটিতে বৃত্ত দাও: {opt("Bicycle &nbsp; Car &nbsp; Bus &nbsp; Scale")}', "১"),
            (f'ভিন্নটিতে বৃত্ত দাও: {opt("Fish &nbsp; Shark &nbsp; Whale &nbsp; Pencil")}', "১"),
        ]),
        ("C2. Pattern Completion (AB প্যাটার্ন)", "৩ নম্বর", {}, [
            (f'{shapes("bo,yo,bo,yo")} {LS}', "১"),
            (f'{shapes("kt,ks,kt,ks")} {LS}', "১"),
            (f'{shapes("ro,go,ro,go")} {LS}', "১"),
        ]),
        ("C3. Similarities", "২ নম্বর", {}, [
            (f'একই সংখ্যার জোড়া খুঁজে বের করো: {opt("5 &nbsp; 8 &nbsp; 5 &nbsp; 3")} → {LM}', "১"),
            (f'একই আকৃতির জোড়া খুঁজে বের করো: {shapes("kq,ke,kq,kw")} → {LM}', "১"),
        ]),
        ("C4. Sequencing", "২ নম্বর", {}, [
            (f'সঠিক ক্রমে ১, ২, ৩ লেখো: <div>[ {LS} ] দাঁত মাজা &nbsp;&nbsp; [ {LS} ] ঘুম থেকে ওঠা '
             f'&nbsp;&nbsp; [ {LS} ] নাস্তা করা</div>', "২"),
        ]),
    ],
))

# --------------------------------------------------------------------- DAY 4
DAYS.append(dict(
    n=4, sub="CVC WORD READING • SUBTRACTION ≤5 • SKIP COUNTING BY 2 • AAB PATTERN",
    foot="CVC Reading • Skip Counting by 2",
    A=[
        ("A1. Word–Picture Matching", "৩ নম্বর",
         {"hint": hintbox("শব্দটি পড়ে সঠিক ছবির নাম বাংলায় লেখো।")}, [
            (f'cat → {LM}', "১"), (f'bat → {LM}', "১"), (f'hat → {LM}', "১"),
        ]),
        ("A2. Grammar &amp; Sentence", "৩ নম্বর", {}, [
            (f'The {LS} is black. {opt("(cat / hat)")}', "১"),
            (f'I wear a {LS}. {opt("(hat / bat)")}', "১"),
            (f'He hit the ball with a {LS}. {opt("(bat / cat)")}', "১"),
        ]),
        ("A3. Reading Comprehension", "২ নম্বর",
         {"passage": passage_box(["The cat has a hat. The hat is red."])}, [
            (f'হ্যাটের রং কী? {LM}', "১"),
            (f'কে হ্যাট পরেছে? {LM}', "১"),
        ]),
        ("A4. Writing", "২ নম্বর", {}, [
            (f'"b" দিয়ে শুরু হয় এমন একটি শব্দ লেখো: {LM}', "১"),
            (f'"c" দিয়ে শুরু হয় এমন একটি শব্দ লেখো: {LM}', "১"),
        ]),
    ],
    B=[
        ("B1. Subtraction — Mental Round", "৪ নম্বর", {}, [
            (f'5 − 2 = {LS}', "১"), (f'4 − 1 = {LS}', "১"),
            (f'5 − 3 = {LS}', "১"), (f'3 − 1 = {LS}', "১"),
        ]),
        ("B2. Skip Counting by 2", "২ নম্বর", {}, [
            (f'2, 4, 6, {LS}, 10', "১"),
            (f'পরের সংখ্যা লেখো: 8, 10, {LS}', "১"),
        ]),
        ("B3. Pattern", "২ নম্বর", {}, [
            (f'2, 4, 6, 8, {LS}', "১"),
            (f'{shapes("rt,rt,bo,rt,rt,bo")} {LS} {hint("(AAB প্যাটার্ন)")}', "১"),
        ]),
        ("B4. Word Problem", "২ নম্বর", {}, [
            (f'রহিমের ৫টি বেলুন ছিল। ২টি বেলুন ফেটে গেল। কয়টি বেলুন বাকি আছে? {LF}', "২"),
        ]),
    ],
    C=[
        ("C1. Odd One Out", "৩ নম্বর", {}, [
            (f'ভিন্নটিতে বৃত্ত দাও: {opt("Elephant &nbsp; Lion &nbsp; Tiger &nbsp; Jeep")}', "১"),
            (f'ভিন্নটিতে বৃত্ত দাও: {opt("Green book &nbsp; Red book &nbsp; Blue book &nbsp; Pizza")}', "১"),
            (f'ভিন্নটিতে বৃত্ত দাও: {opt("Cake &nbsp; Birthday cake &nbsp; Cupcake &nbsp; Bus")}', "১"),
        ]),
        ("C2. Pattern Completion (AAB)", "৩ নম্বর", {}, [
            (f'{shapes("rt,rt,bo,rt,rt,bo")} {LS}', "১"),
            (f'{shapes("kw,kw,ro,kw,kw,ro")} {LS}', "১"),
            (f'{shapes("bs,bs,ys,bs,bs,ys")} {LS}', "১"),
        ]),
        ("C3. Similarities", "২ নম্বর", {}, [
            (f'একই আকৃতির জোড়া চিহ্নিত করো: {shapes("kt,kq,kt,kw")} → {LM}', "১"),
            (f'একই রঙের জোড়া চিহ্নিত করো: {shapes("go,bo,go,yo")} → {LM}', "১"),
        ]),
        ("C4. Sequencing (৩ ধাপ)", "২ নম্বর", {}, [
            (f'সঠিক ক্রমে ১, ২, ৩ লেখো: <div>[ {LS} ] জামা পরা &nbsp;&nbsp; [ {LS} ] গোসল করা '
             f'&nbsp;&nbsp; [ {LS} ] স্কুলে যাওয়া</div>', "২"),
        ]),
    ],
))

# --------------------------------------------------------------------- DAY 5
DAYS.append(dict(
    n=5, sub="NAMING WORDS (NOUNS) • BEFORE / AFTER / BETWEEN (1–50)",
    foot="Naming Words • Before/After/Between",
    A=[
        ("A1. Naming Words (ছবি দেখে নাম)", "৩ নম্বর",
         {"hint": hintbox("ইংরেজিতে নাম লেখো।")}, [
            (f'কলার ছবি = {LM}', "১"), (f'হাতির ছবি = {LM}', "১"), (f'গাড়ির ছবি = {LM}', "১"),
        ]),
        ("A2. Category Match", "৩ নম্বর",
         {"hint": hintbox("শব্দগুলো: Apple, Dog, Mango, Cat, Cow, Banana")}, [
            (f'Fruit: {LL}', "২"),
            (f'Animal: {LL}', "১"),
        ]),
        ("A3. Reading Comprehension", "২ নম্বর",
         {"passage": passage_box(["I like mangoes. Mangoes are sweet and yellow."])}, [
            (f'আম কেমন স্বাদের? {LM}', "১"),
            (f'আমের রং কী? {LM}', "১"),
        ]),
        ("A4. Writing", "২ নম্বর", {}, [
            (f'একটি প্রাণীর নাম লেখো: {LM}', "১"),
            (f'একটি ফলের নাম লেখো: {LM}', "১"),
        ]),
    ],
    B=[
        ("B1. Mental Math Speed Round", "৪ নম্বর", {}, [
            (f'6 + 2 = {LS}', "১"), (f'7 + 1 = {LS}', "১"),
            (f'5 + 4 = {LS}', "১"), (f'8 + 1 = {LS}', "১"),
        ]),
        ("B2. Before / After / Between", "২ নম্বর", {}, [
            (f'আগে ও পরে বসাও: {LS}, 20, {LS}', "১"),
            (f'15 এবং 17 এর মাঝের সংখ্যা কোনটি? {LS}', "১"),
        ]),
        ("B3. Pattern", "২ নম্বর", {}, [
            (f'10, 20, 30, {LS}, 50', "১"),
            (f'5, 10, 15, {LS}, 25', "১"),
        ]),
        ("B4. Word Problem", "২ নম্বর", {}, [
            (f'দোকানে ৬টি আম ছিল। আরও ৪টি আম আনা হলো। মোট কয়টি আম? {LF}', "২"),
        ]),
    ],
    C=[
        ("C1. Odd One Out (আকার ও রং)", "৩ নম্বর", {}, [
            (f'আকৃতিতে ভিন্নটিতে বৃত্ত দাও: {shapes("ro,bo,go,rt")}', "১"),
            (f'আকারে ভিন্নটিতে বৃত্ত দাও: {opt("বড় &nbsp; বড় &nbsp; বড় &nbsp; ছোট")}', "১"),
            (f'রঙে ভিন্নটিতে বৃত্ত দাও: {opt("লাল &nbsp; লাল &nbsp; লাল &nbsp; নীল")}', "১"),
        ]),
        ("C2. Pattern Completion", "৩ নম্বর", {}, [
            (f'{shapes("yo,po,yo,po")} {LS}', "১"),
            (f'1, 1, 2, 1, 1, 2, {LS}', "১"),
            (f'A, B, A, B, {LS}', "১"),
        ]),
        ("C3. Similarities", "২ নম্বর", {}, [
            (f'কোন দুটি প্রাণী একই? {opt("Cow &nbsp; Goat &nbsp; Cow &nbsp; Hen")} → {LM}', "১"),
            (f'কোন দুটি আকৃতি একই? {shapes("ks,kt,ks,kw")} → {LM}', "১"),
        ]),
        ("C4. Sequencing", "২ নম্বর", {}, [
            (f'সঠিক ক্রমে ১ ও ২ লেখো: <div>[ {LS} ] গাছ বড় হওয়া &nbsp;&nbsp; [ {LS} ] বীজ বোনা</div>', "২"),
        ]),
    ],
))

# --------------------------------------------------------------------- DAY 6
DAYS.append(dict(
    n=6, sub="SHORT PASSAGE READING • SUBTRACTION ≤10 • MISSING NUMBER PATTERN",
    foot="Passage Reading • Missing Numbers",
    A=[
        ("A1. Vowel Filling", "৩ নম্বর", {}, [
            (f'c {LS} t &nbsp; {opt("(a / e)")}', "১"),
            (f'd {LS} g &nbsp; {opt("(o / i)")}', "১"),
            (f's {LS} n &nbsp; {opt("(u / e)")}', "১"),
        ]),
        ("A2. Yes / No Questions", "৩ নম্বর",
         {"hint": hintbox("নিচের প্যাসেজটি পড়ে উত্তর দাও।")}, [
            (f'Ravi has a bike. {opt("(Yes / No)")} {LS}', "১"),
            (f'The bike is green. {opt("(Yes / No)")} {LS}', "১"),
            (f'He rides it in the evening. {opt("(Yes / No)")} {LS}', "১"),
        ]),
        ("A3. Reading Comprehension", "২ নম্বর",
         {"passage": passage_box(["Ravi has a red bike. He rides it every morning."])}, [
            (f'রবির বাইকের রং কী? {LM}', "১"),
            (f'সে কখন বাইক চালায়? {LM}', "১"),
        ]),
        ("A4. Sentence Writing", "২ নম্বর", {}, [
            (f'বাক্যটি সম্পূর্ণ করো: I have a {LM}.', "১"),
            (f'"dog" শব্দ দিয়ে একটি নতুন বাক্য লেখো: {LF}', "১"),
        ]),
    ],
    B=[
        ("B1. Subtraction ≤10", "৪ নম্বর", {}, [
            (f'9 − 3 = {LS}', "১"), (f'8 − 5 = {LS}', "১"),
            (f'10 − 4 = {LS}', "১"), (f'7 − 2 = {LS}', "১"),
        ]),
        ("B2. Missing Number (+১ প্যাটার্ন)", "২ নম্বর", {}, [
            (f'23, 24, {LS}, 26', "১"),
            (f'{LS}, 45, 46, 47', "১"),
        ]),
        ("B3. Pattern", "২ নম্বর", {}, [
            (f'4, 8, 12, {LS}, 20 {hint("(৪ করে বাড়ছে)")}', "১"),
            (f'{shapes("go,go,yo,go,go,yo")} {LS}', "১"),
        ]),
        ("B4. Word Problem", "২ নম্বর", {}, [
            (f'ক্লাসে ১০ জন ছাত্র ছিল। ৪ জন চলে গেল। কয়জন রইল? {LF}', "২"),
        ]),
    ],
    C=[
        ("C1. Odd One Out", "৩ নম্বর", {}, [
            (f'ভিন্নটিতে বৃত্ত দাও: {opt("Bus &nbsp; Taxi &nbsp; Car &nbsp; Book")}', "১"),
            (f'ভিন্নটিতে বৃত্ত দাও: {opt("Cow &nbsp; Pig &nbsp; Sheep &nbsp; Crayon")}', "১"),
            (f'ভিন্নটিতে বৃত্ত দাও: {opt("Football &nbsp; Basketball &nbsp; Tennis ball &nbsp; Apple")}', "১"),
        ]),
        ("C2. Matching Pattern", "৩ নম্বর",
         {"hint": hintbox("উপরের সারির সাথে নিচের কোন সারিটি হুবহু মেলে? সেটিতে দাগ দাও।")}, [
            (f'উপরের সারি: {shapes("ro,bs,ro")} &nbsp;&nbsp; (ক) {shapes("ro,bs,ro")} &nbsp; (খ) {shapes("bs,ro,ro")}', "১"),
            (f'উপরের সারি: {shapes("gt,yo,gt")} &nbsp;&nbsp; (ক) {shapes("yo,gt,gt")} &nbsp; (খ) {shapes("gt,yo,gt")}', "১"),
            (f'উপরের সারি: {shapes("kq,kw,kq")} &nbsp;&nbsp; (ক) {shapes("kq,kw,kq")} &nbsp; (খ) {shapes("kw,kq,kw")}', "১"),
        ]),
        ("C3. Similarities", "২ নম্বর", {}, [
            (f'একই সংখ্যার জোড়া বের করো: {opt("7 &nbsp; 9 &nbsp; 7 &nbsp; 4")} → {LM}', "১"),
            (f'একই আকৃতির জোড়া বের করো: {shapes("kt,kw,kt,kq")} → {LM}', "১"),
        ]),
        ("C4. Sequencing (৩ ধাপ)", "২ নম্বর", {}, [
            (f'সঠিক ক্রমে ১, ২, ৩ লেখো: <div>[ {LS} ] রান্না করা &nbsp;&nbsp; [ {LS} ] বাজার করা '
             f'&nbsp;&nbsp; [ {LS} ] খাওয়া</div>', "২"),
        ]),
    ],
))

# --------------------------------------------------------------------- DAY 7
DAYS.append(dict(
    n=7, title="সাপ্তাহিক মূল্যায়ন পরীক্ষা — সপ্তাহ ১ (Baseline)",
    sub="WEEK 1 DIAGNOSTIC TEST — এই স্কোরই পুরো কর্মসূচির ভিত্তি (Baseline)",
    note="<b>বিশেষ নির্দেশ:</b> এটি প্রথম সপ্তাহের ডায়াগনস্টিক পরীক্ষা। এই স্কোর Day 14, Day 21 ও Day 30 এর "
         "সাথে তুলনা করে অগ্রগতি মাপা হবে — তাই কোনো সাহায্য ছাড়া একা সম্পন্ন করতে দিন।",
    foot="Week 1 Diagnostic (Baseline)",
    A=[
        ("A1. Phonics &amp; Blending", "৩ নম্বর", {}, [
            (f'অক্ষর বসাও: {LS}, P, Q', "১"),
            (f'Blend করো: r – u – n = {LM}', "১"),
            (f'সঠিক শব্দ লেখো — পাখির ছবি = {LM} {opt("(Bird / Bee)")}', "১"),
        ]),
        ("A2. Grammar &amp; Sentence", "৩ নম্বর", {}, [
            (f'শূন্যস্থান পূরণ করো: r {LS} n → run', "১"),
            (f'I {LS} a pet. {opt("(have / has)")}', "১"),
            (f'My pet {LS} yellow. {opt("(is / are)")}', "১"),
        ]),
        ("A3. Reading Comprehension", "২ নম্বর",
         {"passage": passage_box(["I have a pet. My pet is a bird. It is yellow."])}, [
            (f'পোষা প্রাণীটির রং কী? {LM}', "১"),
            (f'এটি কী প্রাণী? {LM}', "১"),
        ]),
        ("A4. Writing", "২ নম্বর", {}, [
            (f'তোমার পছন্দের রং নিয়ে একটি সম্পূর্ণ বাক্য লেখো: {LF}', "২"),
        ]),
    ],
    B=[
        ("B1. Mental Math Speed Round", "৪ নম্বর", {}, [
            (f'6 + 3 = {LS}', "১"), (f'9 − 4 = {LS}', "১"),
            (f'7 + 2 = {LS}', "১"), (f'10 − 5 = {LS}', "১"),
        ]),
        ("B2. Number Concept", "২ নম্বর", {}, [
            (f'আগের ও পরের সংখ্যা লেখো: {LS}, 30, {LS}', "১"),
            (f'বড় সংখ্যাটিতে বৃত্ত দাও: {opt("28 &nbsp; 32")}', "১"),
        ]),
        ("B3. Pattern", "২ নম্বর", {}, [
            (f'5, 10, 15, {LS}, 25', "১"),
            (f'{shapes("rt,rt,bo,rt,rt,bo")} {LS}', "১"),
        ]),
        ("B4. Word Problem", "২ নম্বর", {}, [
            (f'রহিমের ৭টি বল ছিল। ৩টি হারিয়ে গেল। কয়টি বল বাকি আছে? {LF}', "২"),
        ]),
    ],
    C=[
        ("C1. Odd One Out", "৩ নম্বর", {}, [
            (f'ভিন্নটিতে বৃত্ত দাও: {opt("Bus &nbsp; Car &nbsp; Bicycle &nbsp; Book")}', "১"),
            (f'ভিন্নটিতে বৃত্ত দাও: {opt("Elephant &nbsp; Lion &nbsp; Tiger &nbsp; Jeep")}', "১"),
            (f'ভিন্নটিতে বৃত্ত দাও: {shapes("yx,yx,yx,rt")}', "১"),
        ]),
        ("C2. Pattern Completion", "৩ নম্বর", {}, [
            (f'{shapes("bo,ro,bo,ro")} {LS}', "১"),
            (f'{shapes("rt,rt,bo,rt,rt,bo")} {LS}', "১"),
            (f'1, 2, 3, {LS}, 5', "১"),
        ]),
        ("C3. Similarities / Matching Pair", "২ নম্বর", {}, [
            (f'একই আকৃতির জোড়া: {shapes("kw,kq,kw,ke")} → {LM}', "১"),
            (f'একই সংখ্যার জোড়া: {opt("7 &nbsp; 9 &nbsp; 7 &nbsp; 4")} → {LM}', "১"),
        ]),
        ("C4. Sequencing (৩ ধাপ)", "২ নম্বর", {}, [
            (f'সঠিক ক্রমে ১, ২, ৩ লেখো: <div>[ {LS} ] নাস্তা করা &nbsp;&nbsp; [ {LS} ] ঘুম থেকে ওঠা '
             f'&nbsp;&nbsp; [ {LS} ] স্কুলে যাওয়া</div>', "২"),
        ]),
    ],
))

# --------------------------------------------------------------------- DAY 8
DAYS.append(dict(
    n=8, sub="RHYMING WORDS • NUMBERS 51–100 • ADDITION ≤20 (NO CARRY) • AAB PATTERN",
    foot="Rhyming Words • Numbers 51–100",
    A=[
        ("A1. Rhyming Words (ছন্দমিল)", "৩ নম্বর",
         {"method": method('<b>নিয়ম:</b> যে শব্দগুলোর <b>শেষের ধ্বনি এক</b>, সেগুলোই ছন্দমিল শব্দ — '
                           'c<b>at</b> – h<b>at</b> – m<b>at</b>')}, [
            (f'cat — {opt("hat / dog")}', "১"),
            (f'sun — {opt("fun / cup")}', "১"),
            (f'big — {opt("pig / red")}', "১"),
        ]),
        ("A2. Rhyming Pairs", "৩ নম্বর",
         {"hint": hintbox("সঠিক ছন্দ-জোড়া মিলিয়ে লেখো — pen / dog / jug")}, [
            (f'hen — {LM}', "১"), (f'log — {LM}', "১"), (f'mug — {LM}', "১"),
        ]),
        ("A3. Reading Comprehension", "২ নম্বর",
         {"passage": passage_box(["The hen sat on a log."])}, [
            (f'মুরগি কোথায় বসল? {LM}', "১"),
            (f'প্যাসেজে কয়টি প্রাণীর নাম আছে? {LS}', "১"),
        ]),
        ("A4. Writing", "২ নম্বর", {}, [
            (f'"cat" এর সাথে ছন্দ মেলে এমন একটি শব্দ লেখো: {LM}', "১"),
            (f'"sun" এর সাথে ছন্দ মেলে এমন একটি শব্দ লেখো: {LM}', "১"),
        ]),
    ],
    B=[
        ("B1. Addition ≤20 (হাতে রাখা ছাড়া)", "৪ নম্বর", {}, [
            (f'12 + 5 = {LS}', "১"), (f'23 + 4 = {LS}', "১"),
            (f'15 + 3 = {LS}', "১"), (f'21 + 6 = {LS}', "১"),
        ]),
        ("B2. Number Concept (৫১–১০০)", "২ নম্বর", {}, [
            (f'বড় সংখ্যাটিতে বৃত্ত দাও: {opt("78 &nbsp; 65")}', "১"),
            (f'৫ করে গোনো: 55, 60, {LS}, 70', "১"),
        ]),
        ("B3. Pattern (AAB)", "২ নম্বর", {}, [
            (f'{shapes("ro,ro,bo,ro,ro,bo")} {LS}', "১"),
            (f'2, 2, 4, 2, 2, 4, {LS}', "১"),
        ]),
        ("B4. Word Problem", "২ নম্বর", {}, [
            (f'দোকানে ১৫টি ডিম ছিল। আরও ৩টি ডিম আনা হলো। মোট কয়টি ডিম? {LF}', "২"),
        ]),
    ],
    C=[
        ("C1. Odd One Out", "৩ নম্বর", {}, [
            (f'ভিন্নটিতে বৃত্ত দাও: {opt("Pencil &nbsp; Scale &nbsp; Set square &nbsp; Burger")}', "১"),
            (f'ভিন্নটিতে বৃত্ত দাও: {opt("Car &nbsp; Taxi &nbsp; Jeep &nbsp; Elephant")}', "১"),
            (f'ভিন্নটিতে বৃত্ত দাও: {opt("Balloon &nbsp; Gift &nbsp; Ribbon &nbsp; Bicycle")}', "১"),
        ]),
        ("C2. Pattern Completion (AAB)", "৩ নম্বর", {}, [
            (f'{shapes("yx,yx,kw,yx,yx,kw")} {LS}', "১"),
            (f'{shapes("gs,gs,rs,gs,gs,rs")} {LS}', "১"),
            (f'A, A, B, A, A, B, {LS}', "১"),
        ]),
        ("C3. Similarities (৩ বৈশিষ্ট্য)", "২ নম্বর", {}, [
            (f'রং, আকার ও আকৃতি — তিনটিই মেলে এমন জোড়া: {shapes("ro,bs,ro,gt")} → {LM}', "১"),
            (f'হুবহু একই জোড়া: {shapes("bs,bs,yo,rt")} → {LM}', "১"),
        ]),
        ("C4. Sequencing (৩ ধাপ)", "২ নম্বর", {}, [
            (f'সঠিক ক্রমে ১, ২, ৩ লেখো: <div>[ {LS} ] গাছে পানি দেওয়া &nbsp;&nbsp; [ {LS} ] বীজ বোনা '
             f'&nbsp;&nbsp; [ {LS} ] ফুল ফোটা</div>', "২"),
        ]),
    ],
))

# --------------------------------------------------------------------- DAY 9
DAYS.append(dict(
    n=9, sub="VOWEL RECOGNITION • PLACE VALUE (TENS &amp; ONES) • 2-PROPERTY ODD ONE OUT",
    foot="Vowels • Place Value",
    A=[
        ("A1. Vowel Recognition", "৩ নম্বর",
         {"method": method("<b>স্বরবর্ণ (Vowels):</b> a, e, i, o, u — বাকি সব ব্যঞ্জনবর্ণ।")}, [
            (f'স্বরবর্ণটিতে বৃত্ত দাও: {opt("b &nbsp; a &nbsp; t &nbsp; e")} {hint("(দুটি আছে)")}', "১"),
            (f'স্বরবর্ণটিতে বৃত্ত দাও: {opt("c &nbsp; o &nbsp; d &nbsp; g")}', "১"),
            (f'স্বরবর্ণটিতে বৃত্ত দাও: {opt("s &nbsp; u &nbsp; n &nbsp; m")}', "১"),
        ]),
        ("A2. Fill in the Vowel", "৩ নম্বর", {}, [
            (f'p {LS} n', "১"), (f'd {LS} g', "১"), (f'c {LS} p', "১"),
        ]),
        ("A3. Reading Comprehension", "২ নম্বর",
         {"passage": passage_box(["An owl sat on an oak tree."])}, [
            (f'পেঁচা কোথায় বসেছিল? {LM}', "১"),
            (f'গাছটির নাম কী? {LM}', "১"),
        ]),
        ("A4. Writing", "২ নম্বর", {}, [
            (f'স্বরবর্ণ দিয়ে শুরু হয় এমন একটি শব্দ লেখো: {LM}', "১"),
            (f'আরেকটি লেখো: {LM}', "১"),
        ]),
    ],
    B=[
        ("B1. Addition (২ অঙ্ক)", "৪ নম্বর", {}, [
            (f'34 + 15 = {LS}', "১"), (f'42 + 7 = {LS}', "১"),
            (f'26 + 13 = {LS}', "১"), (f'51 + 8 = {LS}', "১"),
        ]),
        ("B2. Place Value", "২ নম্বর",
         {"method": method("<b>স্থানীয় মান:</b> 47 = ৪ দশক + ৭ একক। ১০টি একক = ১ দশক।")}, [
            (f'47 সংখ্যাটিতে দশক স্থানের অঙ্ক কত? {LS}', "১"),
            (f'৬ দশক ৩ একক = {LS}', "১"),
        ]),
        ("B3. Pattern", "২ নম্বর", {}, [
            (f'6, 12, 18, {LS}, 30', "১"),
            (f'3, 6, 9, {LS}, 15', "১"),
        ]),
        ("B4. Word Problem", "২ নম্বর", {}, [
            (f'ক্লাসে ২২ জন ছাত্র ছিল। আরও ৯ জন এলো। মোট কতজন? {LF}', "২"),
        ]),
    ],
    C=[
        ("C1. Odd One Out (২টি বৈশিষ্ট্য)", "৩ নম্বর",
         {"method": method("<b>পদ্ধতি:</b> আগে <b>রং</b> মেলাও, তারপর <b>আকার</b> — যেটি অন্তত একটিতে আলাদা সেটিই উত্তর।")}, [
            (f'{opt("বড়-লাল &nbsp; বড়-লাল &nbsp; বড়-লাল &nbsp; ছোট-নীল")}', "১"),
            (f'কোনটি ৪-এর গুণিতক নয়? {opt("4 &nbsp; 8 &nbsp; 12 &nbsp; 15")}', "১"),
            (f'{shapes("ro,ro,ro,bo")} — কোনটি রঙে আলাদা?', "১"),
        ]),
        ("C2. Pattern Grid 2×2", "৩ নম্বর",
         {"method": method("<b>পদ্ধতি:</b> আগে সারি (বাম→ডান), তারপর কলাম (উপর→নিচ) ধরে নিয়ম খোঁজো।")}, [
            (f'খালি ঘরে সঠিক আকৃতি আঁকো: {grid([["ro", "bs"], ["bs", ""]])}', "১"),
            (f'খালি ঘরে সঠিক সংখ্যা লেখো: {grid([["1", "2"], ["3", ""]])}', "১"),
            (f'খালি ঘরে সঠিক সংখ্যা লেখো: {grid([["5", "10"], ["15", ""]])}', "১"),
        ]),
        ("C3. Analogy (পরিচিতি)", "২ নম্বর",
         {"method": method('<b>পদ্ধতি:</b> প্রথম জোড়ার সম্পর্ক মুখে বলো — "পাখি আকাশে থাকে, তাহলে মাছ কোথায় থাকে?"')}, [
            (f'Bird : Sky :: Fish : {LM}', "১"),
            (f'Sun : Day :: Moon : {LM}', "১"),
        ]),
        ("C4. Sequencing (৪ ধাপ)", "২ নম্বর", {}, [
            (f'সঠিক ক্রমে ১–৪ লেখো: <div>[ {LS} ] ফুল &nbsp;&nbsp; [ {LS} ] বীজ &nbsp;&nbsp; '
             f'[ {LS} ] ফল &nbsp;&nbsp; [ {LS} ] চারাগাছ</div>', "২"),
        ]),
    ],
))

# --------------------------------------------------------------------- DAY 10
DAYS.append(dict(
    n=10, sub="OPPOSITES • SKIP COUNTING BY 5 • SUBTRACTION ≤20 • ANALOGY",
    foot="Opposites • Skip Counting by 5",
    A=[
        ("A1. Opposites (বিপরীত শব্দ)", "৩ নম্বর", {}, [
            (f'Hot ↔ {LM}', "১"), (f'Big ↔ {LM}', "১"), (f'Fast ↔ {LM}', "১"),
        ]),
        ("A2. Opposite Pairs", "৩ নম্বর",
         {"hint": hintbox("সঠিক জোড়া মিলিয়ে লেখো — Down / Out / Night")}, [
            (f'Up — {LM}', "১"), (f'In — {LM}', "১"), (f'Day — {LM}', "১"),
        ]),
        ("A3. Reading Comprehension", "২ নম্বর",
         {"passage": passage_box(["The elephant is big. The ant is small."])}, [
            (f'হাতি কেমন? {LM}', "১"),
            (f'পিঁপড়া কেমন? {LM}', "১"),
        ]),
        ("A4. Writing", "২ নম্বর", {}, [
            (f'"hot" এর বিপরীত শব্দ দিয়ে একটি বাক্য লেখো: {LF}', "১"),
            (f'"happy" এর বিপরীত শব্দ লেখো: {LM}', "১"),
        ]),
    ],
    B=[
        ("B1. Subtraction ≤20", "৪ নম্বর", {}, [
            (f'18 − 7 = {LS}', "১"), (f'15 − 9 = {LS}', "১"),
            (f'20 − 6 = {LS}', "১"), (f'17 − 8 = {LS}', "১"),
        ]),
        ("B2. Skip Counting by 5", "২ নম্বর", {}, [
            (f'5, 10, 15, {LS}, 25', "১"),
            (f'60, 65, {LS}, 75', "১"),
        ]),
        ("B3. Pattern", "২ নম্বর", {}, [
            (f'4, 8, 12, 16, {LS}', "১"),
            (f'{shapes("bo,bo,bo,ro,bo,bo,bo,ro")} {LS} {hint("(AAAB প্যাটার্ন)")}', "১"),
        ]),
        ("B4. Two-Step Word Problem", "২ নম্বর", {}, [
            (f'রিমার ২০ টাকা ছিল। সে ৮ টাকার একটি চকলেট কিনল, তারপর মায়ের কাছ থেকে ৫ টাকা পেল। '
             f'এখন তার কাছে কত টাকা? {LF}', "২"),
        ]),
    ],
    C=[
        ("C1. Odd One Out", "৩ নম্বর", {}, [
            (f'কোনটি উড়তে পারে না? {opt("Bird &nbsp; Bee &nbsp; Butterfly &nbsp; Bus")}', "১"),
            (f'ভিন্নটিতে বৃত্ত দাও: {opt("Monday &nbsp; Tuesday &nbsp; January &nbsp; Wednesday")}', "১"),
            (f'ভিন্নটিতে বৃত্ত দাও: {opt("2 &nbsp; 4 &nbsp; 6 &nbsp; 7")}', "১"),
        ]),
        ("C2. Pattern Grid 2×2", "৩ নম্বর", {}, [
            (f'খালি ঘরে সঠিক সংখ্যা লেখো: {grid([["2", "4"], ["6", ""]])}', "১"),
            (f'খালি ঘরে সঠিক আকৃতি আঁকো: {grid([["gt", "rs"], ["rs", ""]])}', "১"),
            (f'খালি ঘরে সঠিক সংখ্যা লেখো: {grid([["10", "20"], ["30", ""]])}', "১"),
        ]),
        ("C3. Analogy", "২ নম্বর", {}, [
            (f'Hand : Glove :: Foot : {LM}', "১"),
            (f'Pen : Write :: Scissors : {LM}', "১"),
        ]),
        ("C4. Sequencing (৪ ধাপ)", "২ নম্বর", {}, [
            (f'সঠিক ক্রমে ১–৪ লেখো: <div>[ {LS} ] দাঁত মাজা &nbsp;&nbsp; [ {LS} ] ঘুম থেকে ওঠা &nbsp;&nbsp; '
             f'[ {LS} ] স্কুলে যাওয়া &nbsp;&nbsp; [ {LS} ] নাস্তা করা</div>', "২"),
        ]),
    ],
))
