# -*- coding: utf-8 -*-
"""Day 31 – Day 40 worksheet content (Month 2 - Advanced Foundation)."""
from wb_lib import LS, LM, LL, LF, opt, hint, shapes, grid, passage_box, method, hintbox

DAYS = []

# -------------------------------------------------------------------- DAY 31
DAYS.append(dict(
    n=31, sub="VOWEL TEAMS • 3-DIGIT PLACE VALUE • DOUBLE LOGIC PATTERN",
    foot="Vowel Teams • Place Value (100s) • Patterns",
    A=[
        ("A1. Vowel Teams (ee, ea)", "৩ নম্বর",
         {"method": method("<b>নিয়ম:</b> 'ee' এবং 'ea' একসাথে বসলে সাধারণত দীর্ঘ 'ঈ' (long 'e') ধ্বনি হয় (যেমন: tree, leaf)।")}, [
            (f'tr_ _ (গাছ) - {opt("(ee / ea)")} বসাও: {LS}', "১"),
            (f'l_ _f (পাতা) - {opt("(ee / ea)")} বসাও: {LS}', "১"),
            (f'sh_ _p (ভেড়া) - {opt("(ee / ea)")} বসাও: {LS}', "১"),
        ]),
        ("A2. Grammar (Adjectives Intro)", "৩ নম্বর",
         {"method": method("<b>নিয়ম:</b> যে শব্দ নাম-শব্দের (noun) দোষ, গুণ বা অবস্থা বোঝায় তাকে Adjective (describing word) বলে।")}, [
            (f'The <b>big</b> elephant. (এখানে describing word কোনটি?) {LS}', "১"),
            (f'A {LS} apple. {opt("(red / run)")}', "১"),
            (f'The sun is {LS}. {opt("(hot / cold)")}', "১"),
        ]),
        ("A3. Reading Comprehension", "২ নম্বর",
         {"passage": passage_box(["The big dog runs fast.", "It has a red collar.", "The dog likes to play with a ball."])}, [
            (f'কুকুরটি দেখতে কেমন? {LS}', "১"),
            (f'কুকুরটি কী নিয়ে খেলতে ভালোবাসে? {LM}', "১"),
        ]),
        ("A4. Writing & Spelling", "২ নম্বর", {}, [
            (f'ছবি দেখে লেখো: (একটি বড় গাছের ছবি) A {LS} tree.', "১"),
            (f'Correct spelling: {opt("sweat / sweet")} (মিষ্টি) - {LS}', "১"),
        ]),
    ],
    B=[
        ("B1. Mental Math Speed Round", "৪ নম্বর", {}, [
            (f'10 + 20 = {LS}', "১"), (f'35 - 5 = {LS}', "১"),
            (f'50 + {LS} = 100', "১"), (f'100 - 10 = {LS}', "১"),
        ]),
        ("B2. Place Value (Hundreds, Tens, Ones)", "২ নম্বর",
         {"method": method("<b>নিয়ম:</b> 3-digit সংখ্যায় তিনটি ঘর থাকে: Hundreds (শতক), Tens (দশক), Ones (একক)। 245 = 2 Hundreds, 4 Tens, 5 Ones।")}, [
            (f'3 Hundreds + 2 Tens + 6 Ones = {LS}', "১"),
            (f'154 সংখ্যাটিতে 5 এর Place Value কত? {opt("(5 / 50 / 500)")} - {LS}', "১"),
        ]),
        ("B3. Pattern / Sequence (Skip by 3)", "২ নম্বর", {}, [
            (f'3, 6, 9, {LS}, 15', "১"),
            (f'30, 33, {LS}, 39', "১"),
        ]),
        ("B4. Word Problem", "২ নম্বর", {}, [
            (f'রাহুলের কাছে 120 টাকা আছে। বাবা তাকে আরও 30 টাকা দিল। এখন মোট কত টাকা? {LS}', "১"),
            (f'একটি বইয়ের দাম 150 টাকা। তুমি 100 টাকা দিলে। আর কত টাকা দিতে হবে? {LS}', "১"),
        ]),
    ],
    C=[
        ("C1. Number Series (Double Logic)", "৩ নম্বর",
         {"method": method("<b>পদ্ধতি:</b> প্যাটার্ন দেখো। কখনো একবার যোগ, একবার বিয়োগ হতে পারে (যেমন: +2, -1, +2, -1)।")}, [
            (f'প্যাটার্ন: 10, 12, 11, 13, 12, {LS}', "১"),
            (f'প্যাটার্ন: 5, 10, 15, {LS}, 25 (কত করে বাড়ছে?) {LS}', "১"),
            (f'প্যাটার্ন: 1, 2, 4, 8, {LS} (দ্বিগুণ হচ্ছে)', "১"),
        ]),
        ("C2. Visual Pattern Completion", "৩ নম্বর", {}, [
            (f'{shapes("ru")} → {shapes("rd")} → {shapes("ru")} → {LS} {opt("(উপর / নিচ)")}', "১"),
            (f'○ ● ○ ○ ● ○ ○ ○ ● {LS} {opt("(○ / ●)")}', "১"),
            (f'△ ▲ △ ▲ △ {LS} {opt("(△ / ▲)")}', "১"),
        ]),
        ("C3. Classification / Odd One Out", "২ নম্বর", {}, [
            (f'Odd one out: {opt("10 &nbsp; 20 &nbsp; 25 &nbsp; 30")} (কারণ: {LM})', "১"),
            (f'Odd one out: {opt("Sun &nbsp; Moon &nbsp; Star &nbsp; Cloud")}', "১"),
        ]),
        ("C4. Logical Sequence", "২ নম্বর", {}, [
            (f'সঠিক ক্রম: [ {LS} ] গাছ বড় হওয়া &nbsp;&nbsp; [ {LS} ] বীজ বোনা &nbsp;&nbsp; [ {LS} ] ফল ধরা', "১"),
            (f'সঠিক ক্রম: [ {LS} ] সকাল &nbsp;&nbsp; [ {LS} ] রাত &nbsp;&nbsp; [ {LS} ] বিকেল', "১"),
        ]),
    ],
))

# -------------------------------------------------------------------- DAY 32
DAYS.append(dict(
    n=32, sub="VOWEL TEAMS (oa, ai) • SKIP COUNT BY 4 • ANALOGY",
    foot="Vowel Teams • Skip Count 4 • Analogy",
    A=[
        ("A1. Vowel Teams (oa, ai)", "৩ নম্বর",
         {"method": method("<b>নিয়ম:</b> 'oa' (boat, coat), 'ai' (rain, train)। প্রথম স্বরবর্ণটি নিজের নাম বলে, দ্বিতীয়টি চুপ থাকে।")}, [
            (f'b_ _t (নৌকা) - {opt("(oa / ai)")}: {LS}', "১"),
            (f'r_ _n (বৃষ্টি) - {opt("(oa / ai)")}: {LS}', "১"),
            (f'c_ _t (কোট) - {opt("(oa / ai)")}: {LS}', "১"),
        ]),
        ("A2. Describing Words (Adjectives)", "৩ নম্বর", {}, [
            (f'The {LS} girl is smiling. {opt("(happy / sad)")}', "১"),
            (f'I have a {LS} ball. {opt("(round / square)")}', "১"),
            (f'The ice cream is {LS}. {opt("(hot / cold)")}', "১"),
        ]),
        ("A3. Reading Comprehension", "২ নম্বর",
         {"passage": passage_box(["Tom has a blue boat.", "The boat is fast.", "He sails it in the pond."])}, [
            (f'টমের নৌকার রং কী? {LS}', "১"),
            (f'সে কোথায় নৌকা চালায়? {LM}', "১"),
        ]),
        ("A4. Creative Writing", "২ নম্বর", {}, [
            (f'তোমার প্রিয় খেলনা সম্পর্কে ১টি বাক্য লেখো: {LL}', "২"),
        ]),
    ],
    B=[
        ("B1. Mental Math (Skip Count by 4)", "৪ নম্বর", {}, [
            (f'4, 8, 12, {LS}', "১"), (f'20, 24, {LS}', "১"),
            (f'32, 36, {LS}', "১"), (f'40, 44, {LS}', "১"),
        ]),
        ("B2. Addition with Carry (Up to 100)", "২ নম্বর",
         {"method": method("<b>নিয়ম:</b> এককের ঘরে যোগফল ১০ বা তার বেশি হলে দশকের ঘরে ১ carry হবে। যেমন: 28 + 14 = 42।")}, [
            (f'35 + 17 = {LS}', "১"),
            (f'48 + 24 = {LS}', "১"),
        ]),
        ("B3. Number Concept (Greater/Less with 3-digits)", "২ নম্বর", {}, [
            (f'345 এবং 354 এর মধ্যে কোনটি বড়? {LS}', "১"),
            (f'200 {opt("(< / > / =)")} 199', "১"),
        ]),
        ("B4. Word Problem", "২ নম্বর", {}, [
            (f'একটি ক্লাসে 45 জন ছেলে এবং 38 জন মেয়ে। ক্লাসে মোট কতজন? {LS}', "১"),
            (f'বাবার কাছে 95 টাকা ছিল, তিনি 27 টাকার চকলেট কিনলেন। কত রইলো? {LS}', "১"),
        ]),
    ],
    C=[
        ("C1. Analogy (Word & Image)", "৩ নম্বর", {}, [
            (f'Bird : Fly :: Fish : {LS}', "১"),
            (f'Sun : Day :: Moon : {LS}', "১"),
            (f'Book : Read :: Pen : {LS}', "১"),
        ]),
        ("C2. Pattern Completion (Grid 2x2)", "৩ নম্বর",
         {"method": method("<b>পদ্ধতি:</b> উপর-নিচ এবং ডানে-বামে সম্পর্ক খুঁজো।")}, [
            (f'| A | B | <br>| C | {LS} |', "১"),
            (f'| 1 | 3 | <br>| 5 | {LS} |', "১"),
            (f'| ● | ○ | <br>| ▲ | {LS} (△/▲) |', "১"),
        ]),
        ("C3. Direction & Position Logic", "২ নম্বর", {}, [
            (f'তুমি পূর্ব দিকে মুখ করে আছো। উল্টো দিকে ঘুরলে কোন দিক হবে? {LS}', "১"),
            (f'A এর ডানে B, B এর ডানে C। মাঝে কে আছে? {LS}', "১"),
        ]),
        ("C4. Mixed Reasoning", "২ নম্বর", {}, [
            (f'Odd one: {opt("Square &nbsp; Triangle &nbsp; Circle &nbsp; Red")}', "১"),
            (f'10, 8, 6, {LS} (উল্টো গোনো)', "১"),
        ]),
    ],
))

# -------------------------------------------------------------------- DAY 33
DAYS.append(dict(
    n=33, sub="MAGIC E (A-E) • 3-DIGIT SUBTRACTION INTRO • VENN DIAGRAM LOGIC",
    foot="Magic E • 3-Digit Sub • Venn Logic",
    A=[
        ("A1. Magic E Rule (a_e)", "৩ নম্বর",
         {"method": method("<b>নিয়ম:</b> শব্দের শেষে 'e' থাকলে, ভেতরের Vowel-টির দীর্ঘ উচ্চারণ হয় এবং শেষের 'e' চুপ থাকে (যেমন: m<b>a</b>k<b>e</b>)।")}, [
            (f'c_k_ (পিঠা) - a এবং e বসাও: {LS}', "১"),
            (f'n_m_ (নাম) - a এবং e বসাও: {LS}', "১"),
            (f'g_m_ (খেলা) - a এবং e বসাও: {LS}', "১"),
        ]),
        ("A2. Grammar (Pronouns: He, She, It, They)", "৩ নম্বর",
         {"method": method("<b>নিয়ম:</b> নামের বদলে যা বসে তাকে Pronoun বলে (He=ছেলে, She=মেয়ে, It=বস্তু, They=একাধিক)।")}, [
            (f'Rahul is a boy. {opt("(He / She)")} likes to play.', "১"),
            (f'Sita is reading. {opt("(He / She)")} is a good girl.', "১"),
            (f'The car is red. {opt("(It / They)")} is fast.', "১"),
        ]),
        ("A3. Reading Comprehension", "২ নম্বর",
         {"passage": passage_box(["Jane bakes a cake.", "It is a sweet chocolate cake.", "Jane shares it with her friends."])}, [
            (f'Jane কী বানায়? {LS}', "১"),
            (f'কেকটির স্বাদ কেমন? {LM}', "১"),
        ]),
        ("A4. Sentence Making", "২ নম্বর", {}, [
            (f'Make a sentence with <b>cake</b>: {LL}', "২"),
        ]),
    ],
    B=[
        ("B1. Mental Math (Times Tables 3 & 4 Intro)", "৪ নম্বর", {}, [
            (f'3 × 2 = {LS}', "১"), (f'3 × 3 = {LS}', "১"),
            (f'4 × 2 = {LS}', "১"), (f'4 × 3 = {LS}', "১"),
        ]),
        ("B2. 3-Digit Subtraction (No Borrow)", "২ নম্বর", {}, [
            (f'345 - 123 = {LS}', "১"),
            (f'489 - 256 = {LS}', "১"),
        ]),
        ("B3. Pattern / Sequence", "২ নম্বর", {}, [
            (f'100, 200, 300, {LS}', "১"),
            (f'4, 8, 12, 16, {LS}', "১"),
        ]),
        ("B4. Word Problem", "২ নম্বর", {}, [
            (f'রাকিবের 150টি মার্বেল আছে। সে 40টি মার্বেল ভাইকে দিল। আর কয়টি রইলো? {LS}', "১"),
            (f'মা 3 প্যাকেট বিস্কুট আনলো। প্রতি প্যাকেটে 4টি বিস্কুট। মোট কয়টি বিস্কুট? {LS}', "১"),
        ]),
    ],
    C=[
        ("C1. Venn Diagram Concept", "৩ নম্বর",
         {"method": method("<b>পদ্ধতি:</b> Venn Diagram-এ দুটি গোলক (Circle) থাকে। মাঝখানের অংশটিতে উভয় গুণ থাকে।")}, [
            (f'Circle 1 = লাল জিনিস, Circle 2 = ফল। মাঝখানে কী থাকবে? {opt("(লাল আপেল / নীল গাড়ি)")}', "১"),
            (f'Circle 1 = প্রাণী, Circle 2 = উড়তে পারে। মাঝখানে: {opt("(কুকুর / পাখি)")}', "১"),
            (f'Circle 1 = গোল, Circle 2 = খাবার। মাঝখানে: {opt("(পিৎজা / বল)")}', "১"),
        ]),
        ("C2. Coding & Decoding Letters", "৩ নম্বর",
         {"method": method("<b>নিয়ম:</b> যদি A=1, B=2, C=3 হয়, তবে বর্ণমালা সংখ্যায় প্রকাশ করা যায়।")}, [
            (f'A=1, B=2, C=3 হলে, CAB = {LS}, {LS}, {LS}', "১"),
            (f'2, 1, 4 = {opt("(B, A, D / B, A, C)")}', "১"),
            (f'A=10, B=20 হলে C= {LS}', "১"),
        ]),
        ("C3. Visual Odd One Out", "২ নম্বর", {}, [
            (f'Odd one: {opt("A &nbsp; E &nbsp; I &nbsp; B")} (কারণ: {LM})', "১"),
            (f'Odd one: {opt("চাকা &nbsp; কয়েন &nbsp; বল &nbsp; বই")}', "১"),
        ]),
        ("C4. Logic Puzzle", "২ নম্বর", {}, [
            (f'আমি একটি সংখ্যা। আমি 10 এর চেয়ে বড় এবং 12 এর চেয়ে ছোট। আমি কে? {LS}', "১"),
            (f'A, B-এর চেয়ে লম্বা। C, A-এর চেয়ে লম্বা। সবচেয়ে লম্বা কে? {LS}', "১"),
        ]),
    ],
))

# -------------------------------------------------------------------- DAY 34
DAYS.append(dict(
    n=34, sub="MAGIC E (I-E) • 3-DIGIT ADDITION (CARRY) • SPATIAL REASONING",
    foot="Magic E (i_e) • 3-Digit Add • Spatial",
    A=[
        ("A1. Magic E Rule (i_e)", "৩ নম্বর", {}, [
            (f'k_t_ (ঘুড়ি) - i এবং e বসাও: {LS}', "১"),
            (f'b_k_ (সাইকেল) - i এবং e বসাও: {LS}', "১"),
            (f't_m_ (সময়) - i এবং e বসাও: {LS}', "১"),
        ]),
        ("A2. Pronouns Application", "৩ নম্বর", {}, [
            (f'Mina is sleeping. {LS} is tired.', "১"),
            (f'Tom and I are playing. {LS} are happy. {opt("(We / They)")}', "১"),
            (f'Look at the dog. {LS} is barking.', "১"),
        ]),
        ("A3. Reading Comprehension", "২ নম্বর",
         {"passage": passage_box(["Mike rides his bike.", "He rides to the park.", "The park is big and green."])}, [
            (f'Mike কী চড়ে? {LS}', "১"),
            (f'পার্কটি কেমন দেখতে? {LM}', "১"),
        ]),
        ("A4. Writing & Spelling", "২ নম্বর", {}, [
            (f'Correct spelling: {opt("bike / bik")} - {LS}', "১"),
            (f'Opposite word: big × {LS}', "১"),
        ]),
    ],
    B=[
        ("B1. Mental Math Speed Round", "৪ নম্বর", {}, [
            (f'50 + 50 = {LS}', "১"), (f'100 - 20 = {LS}', "১"),
            (f'25 + 25 = {LS}', "১"), (f'30 + 40 = {LS}', "১"),
        ]),
        ("B2. 3-Digit Addition (with Carry)", "২ নম্বর", {}, [
            (f'245 + 138 = {LS}', "১"),
            (f'362 + 254 = {LS}', "১"),
        ]),
        ("B3. Pattern / Sequence", "২ নম্বর", {}, [
            (f'5, 10, 15, {LS}, 25', "১"),
            (f'20, 18, 16, {LS}, 12', "১"),
        ]),
        ("B4. Word Problem", "২ নম্বর", {}, [
            (f'একটি গাছে 25টি আপেল ছিল। আরও 18টি আপেল হলো। মোট কয়টি আপেল? {LS}', "১"),
            (f'মিনা 120 পৃষ্ঠার বই পড়ছে। সে 50 পৃষ্ঠা পড়েছে। আর কত পৃষ্ঠা বাকি? {LS}', "১"),
        ]),
    ],
    C=[
        ("C1. Spatial Reasoning (Folding/Cutting Intro)", "৩ নম্বর",
         {"method": method("<b>পদ্ধতি:</b> একটি কাগজ মাঝ বরাবর ভাঁজ করে কেটে আবার খুললে কেমন দেখাবে, তা কল্পনা করো।")}, [
            (f'কাগজ ভাঁজ করে মাঝে গোল কাটলে, খুললে কয়টি গোল দেখা যাবে? {opt("(১ / ২)")}', "১"),
            (f'কাগজ চার ভাঁজ করে কোণা কাটলে, খুললে কয়টি কোণা কাটা থাকবে? {opt("(২ / ৪)")}', "১"),
            (f'বর্গক্ষেত্রকে কোনাকুনি কাটলে কী আকার পাওয়া যায়? {opt("(ত্রিভুজ / গোল)")}', "১"),
        ]),
        ("C2. Direction Logic", "৩ নম্বর", {}, [
            (f'উত্তর দিকের বিপরীতে কোন দিক? {LS}', "১"),
            (f'তুমি সোজা গিয়ে ডানে ঘুরলে। এখন আবার ডানে ঘুরলে, তুমি কোন দিকে ফিরবে? {opt("(সোজা / উল্টো)")}', "১"),
            (f'সূর্য পূর্ব দিকে ওঠে, অস্ত যায় কোন দিকে? {LS}', "১"),
        ]),
        ("C3. Classification / Odd One Out", "২ নম্বর", {}, [
            (f'Odd one: {opt("Table &nbsp; Chair &nbsp; Apple &nbsp; Bed")}', "১"),
            (f'Odd one: {opt("Train &nbsp; Boat &nbsp; Ship &nbsp; Submarine")}', "১"),
        ]),
        ("C4. Logical Sequence", "২ নম্বর", {}, [
            (f'সঠিক ক্রম: [ {LS} ] স্কুল যাওয়া &nbsp;&nbsp; [ {LS} ] ঘুম থেকে ওঠা &nbsp;&nbsp; [ {LS} ] দাঁত মাজা', "১"),
            (f'সঠিক ক্রম: [ {LS} ] শিশু &nbsp;&nbsp; [ {LS} ] বুড়ো &nbsp;&nbsp; [ {LS} ] যুবক', "১"),
        ]),
    ],
))

# -------------------------------------------------------------------- DAY 35
DAYS.append(dict(
    n=35, sub="PREPOSITIONS • SUBTRACTION (BORROW) • GRID LOGIC",
    foot="Prepositions • Borrowing Sub • Grid",
    A=[
        ("A1. Prepositions Intro (In, On, Under)", "৩ নম্বর",
         {"method": method("<b>নিয়ম:</b> In মানে ভেতরে, On মানে উপরে (লেগে থাকা), Under মানে নিচে।")}, [
            (f'The book is {LS} the table. {opt("(on / under)")}', "১"),
            (f'The cat is sleeping {LS} the bed. {opt("(under / on)")}', "১"),
            (f'The fish is {LS} the water. {opt("(in / on)")}', "১"),
        ]),
        ("A2. Magic E Rule (o_e, u_e)", "৩ নম্বর", {}, [
            (f'r_s_ (গোলাপ) - o এবং e বসাও: {LS}', "১"),
            (f'c_b_ (ঘনক) - u এবং e বসাও: {LS}', "১"),
            (f'h_m_ (বাড়ি) - o এবং e বসাও: {LS}', "১"),
        ]),
        ("A3. Reading Comprehension", "২ নম্বর",
         {"passage": passage_box(["The cat is on the mat.", "The dog is under the table.", "They are resting."])}, [
            (f'কুকুরটি কোথায়? {LS}', "১"),
            (f'বিড়ালটি কীসের উপরে? {LM}', "১"),
        ]),
        ("A4. Creative Writing", "২ নম্বর", {}, [
            (f'তোমার ব্যাগে কী কী আছে? (২টি জিনিসের নাম লেখো): {LL}', "২"),
        ]),
    ],
    B=[
        ("B1. Mental Math (Speed Drill)", "৪ নম্বর", {}, [
            (f'4 × 4 = {LS}', "১"), (f'4 × 5 = {LS}', "১"),
            (f'3 × 4 = {LS}', "১"), (f'3 × 5 = {LS}', "১"),
        ]),
        ("B2. Subtraction with Borrowing (Up to 100)", "২ নম্বর",
         {"method": method("<b>নিয়ম:</b> উপরে ছোট সংখ্যা থাকলে দশক থেকে ১ ধার (borrow) করে ১০ যোগ করে বিয়োগ করতে হয়।")}, [
            (f'52 - 18 = {LS}', "১"),
            (f'65 - 27 = {LS}', "১"),
        ]),
        ("B3. Concept of Money (টাকা-পয়সা)", "২ নম্বর", {}, [
            (f'১০ টাকার ৩টি নোট = কত টাকা? {LS}', "১"),
            (f'৫০ টাকার নোট থেকে ২০ টাকার জিনিস কিনলে ফেরত পাবে কত? {LS}', "১"),
        ]),
        ("B4. Word Problem", "২ নম্বর", {}, [
            (f'শ্রেণিকক্ষে 42 জন ছাত্র। আজ 15 জন আসেনি। কতজন উপস্থিত? {LS}', "১"),
            (f'রিমার 65 টাকা ছিল। সে 28 টাকার বই কিনলো। তার কাছে আর কত টাকা আছে? {LS}', "১"),
        ]),
    ],
    C=[
        ("C1. Grid Logic (Sudoku 3x3 Intro)", "৩ নম্বর",
         {"method": method("<b>পদ্ধতি:</b> প্রতি সারি (row) এবং কলামে (column) ১, ২, ৩ একবার করেই বসবে।")}, [
            (f'| 1 | 2 | ? | → ? স্থানে কত বসবে? {LS}', "১"),
            (f'| 2 | ? | 1 | → ? স্থানে কত বসবে? {LS}', "১"),
            (f'উপর-নিচে: 1, 2, ? → ? স্থানে কত বসবে? {LS}', "১"),
        ]),
        ("C2. Analogy (Number & Shape)", "৩ নম্বর", {}, [
            (f'△ : 3 :: □ : {LS}', "১"),
            (f'2 : 4 :: 3 : {LS} {opt("(6 / 8)")}', "১"),
            (f'Wheel : Circle :: Book : {LS} {opt("(Rectangle / Triangle)")}', "১"),
        ]),
        ("C3. Mirror Image Application", "২ নম্বর", {}, [
            (f'A এর Mirror Image কী হবে? {opt("(A / V)")}', "১"),
            (f'M এর Mirror Image কী হবে? {opt("(W / M)")}', "১"),
        ]),
        ("C4. Logic Puzzle", "২ নম্বর", {}, [
            (f'আমি আকাশে থাকি, রাতে আলো দিই, আমার আকার বদলায়। আমি কে? {LS}', "১"),
            (f'পুকুরে ৫টি হাঁস ছিল। ২টি পাড়ে উঠে গেল। পুকুরে কয়টি হাঁস? {LS}', "১"),
        ]),
    ],
))

# -------------------------------------------------------------------- DAY 36
DAYS.append(dict(
    n=36, sub="PREPOSITIONS • DIVISION INTRO • CODING LOGIC",
    foot="Prepositions • Division Intro • Logic",
    A=[
        ("A1. Prepositions (Behind, Next to)", "৩ নম্বর", {}, [
            (f'The dog is hiding {LS} the door. {opt("(behind / on)")}', "১"),
            (f'Sit {LS} me. {opt("(next to / under)")}', "১"),
            (f'The sun is {LS} the clouds. {opt("(behind / in)")}', "১"),
        ]),
        ("A2. Opposites (Antonyms)", "৩ নম্বর", {}, [
            (f'Hot × {LS}', "১"),
            (f'Day × {LS}', "১"),
            (f'Up × {LS}', "১"),
        ]),
        ("A3. Reading Comprehension", "২ নম্বর",
         {"passage": passage_box(["The bird is in the nest.", "The nest is in the tree.", "The tree is tall."])}, [
            (f'পাখিটি কোথায়? {LS}', "১"),
            (f'গাছটি কেমন? {LM}', "১"),
        ]),
        ("A4. Sentence Correction", "২ নম্বর", {}, [
            (f'সঠিক করো: i am a boy → {LL}', "১"),
            (f'সঠিক করো: the sun is hot → {LL}', "১"),
        ]),
    ],
    B=[
        ("B1. Mental Math (Times Tables Mixed)", "৪ নম্বর", {}, [
            (f'2 × 8 = {LS}', "১"), (f'3 × 6 = {LS}', "১"),
            (f'4 × 5 = {LS}', "১"), (f'5 × 5 = {LS}', "১"),
        ]),
        ("B2. Division Concept (Sharing Equally)", "২ নম্বর",
         {"method": method("<b>নিয়ম:</b> Division (ভাগ) মানে সমানভাবে ভাগ করে দেওয়া। ৬টি চকলেট ২ জনকে দিলে প্রত্যেকে ৩টি পাবে।")}, [
            (f'10টি চকলেট 2 জনকে সমানভাবে দিলে প্রত্যেকে পাবে = {LS}টি', "১"),
            (f'12টি পেন্সিল 3 জনের মধ্যে ভাগ করলে প্রত্যেকে পাবে = {LS}টি', "১"),
        ]),
        ("B3. Number Concept (Even / Odd)", "২ নম্বর",
         {"method": method("<b>নিয়ম:</b> যে সংখ্যাকে ২ দিয়ে ভাগ করা যায় (০,২,৪,৬,৮ দিয়ে শেষ), তা Even (জোড়)। বাকি সব Odd (বিজোড়)।")}, [
            (f'14 কি জোড় না বিজোড়? {opt("(Even / Odd)")}', "১"),
            (f'9 কি জোড় না বিজোড়? {opt("(Even / Odd)")}', "১"),
        ]),
        ("B4. Word Problem", "২ নম্বর", {}, [
            (f'তোমার પાસે 15টি ফুল আছে। তুমি 3টি ফুলদানিতে সমানভাবে রাখবে। প্রতিটিতে কয়টি? {LS}', "১"),
            (f'একটি গাড়িতে 4টি চাকা। 3টি গাড়িতে মোট কয়টি চাকা? {LS}', "১"),
        ]),
    ],
    C=[
        ("C1. Coding & Decoding", "৩ নম্বর", {}, [
            (f'CAT = 3,1,20 হলে, BAT = {LS},1,20', "১"),
            (f'+ মানে -, - মানে + হলে, 5 + 2 = {LS}', "১"),
            (f'RED-কে সংকেতে লিখলে XWZ হলে, RED = {opt("(XWZ / ZWX)")}', "১"),
        ]),
        ("C2. Visual Sequence", "৩ নম্বর", {}, [
            (f'| | → L → C → {opt("(O / □)")}', "১"),
            (f'১টি পাতা → ২টি পাতা → ৩টি পাতা → {LS}', "১"),
            (f'○ → ◑ → ● → {opt("(○ / ◑)")}', "১"),
        ]),
        ("C3. Classification (2 Properties)", "২ নম্বর", {}, [
            (f'Odd one: {opt("Red Apple &nbsp; Red Tomato &nbsp; Green Leaf &nbsp; Red Cherry")} (কারণ: {LM})', "১"),
            (f'Odd one: {opt("Square Box &nbsp; Round Ball &nbsp; Square Book &nbsp; Square Frame")}', "১"),
        ]),
        ("C4. Logical Deduction", "২ নম্বর", {}, [
            (f'আমার ৪টি পা আছে, আমি ঘেউ ঘেউ করি। আমি কে? {LS}', "১"),
            (f'রাম রহিমের চেয়ে বড়। রহিম করিমের চেয়ে বড়। সবচেয়ে ছোট কে? {LS}', "১"),
        ]),
    ],
))

# -------------------------------------------------------------------- DAY 37
DAYS.append(dict(
    n=37, sub="CONJUNCTIONS (And, But) • MIXED MATH • VENN & DIRECTION",
    foot="Conjunctions • Mixed Math • Venn",
    A=[
        ("A1. Conjunctions Intro (and, but)", "৩ নম্বর",
         {"method": method("<b>নিয়ম:</b> দুটি কথা জোড়া লাগাতে 'and' (এবং) এবং বিপরীত কথা জোড়া লাগাতে 'but' (কিন্তু) বসে।")}, [
            (f'I like apples {LS} bananas. {opt("(and / but)")}', "১"),
            (f'I can run fast, {LS} I cannot fly. {opt("(and / but)")}', "১"),
            (f'The sun is hot {LS} bright. {opt("(and / but)")}', "১"),
        ]),
        ("A2. Grammar (Plurals with -es)", "৩ নম্বর", {}, [
            (f'Bus → {LS}', "১"),
            (f'Box → {LS}', "১"),
            (f'Glass → {LS}', "১"),
        ]),
        ("A3. Reading Comprehension", "২ নম্বর",
         {"passage": passage_box(["Tom has a cat and a dog.", "The cat is small, but the dog is big.", "They play together."])}, [
            (f'Tom এর কী কী আছে? {LM}', "১"),
            (f'কে বড়? {LS}', "১"),
        ]),
        ("A4. Writing", "২ নম্বর", {}, [
            (f'and দিয়ে বাক্য বানাও: {LL}', "২"),
        ]),
    ],
    B=[
        ("B1. Mental Math (Times Tables 5)", "৪ নম্বর", {}, [
            (f'5 × 2 = {LS}', "১"), (f'5 × 5 = {LS}', "১"),
            (f'5 × 8 = {LS}', "১"), (f'5 × 10 = {LS}', "১"),
        ]),
        ("B2. Measurement Concept (Length - cm/m)", "২ নম্বর",
         {"method": method("<b>নিয়ম:</b> ছোট জিনিস মাপা হয় সেন্টিমিটার (cm) দিয়ে, বড় জিনিস মিটার (m) দিয়ে।")}, [
            (f'পেন্সিল মাপতে কী ব্যবহার করবে? {opt("(cm / m)")}', "১"),
            (f'ঘরের দৈর্ঘ্য মাপতে কী ব্যবহার করবে? {opt("(cm / m)")}', "১"),
        ]),
        ("B3. Addition & Subtraction Review", "২ নম্বর", {}, [
            (f'45 + 36 = {LS}', "১"),
            (f'72 - 28 = {LS}', "১"),
        ]),
        ("B4. Word Problem (2-step)", "২ নম্বর", {}, [
            (f'তোমার কাছে 10 টাকা ছিল। বাবা 20 টাকা দিল। তুমি 15 টাকার বই কিনলে। এখন কত আছে? {LS}', "১"),
            (f'মাঠে 8 জন খেলছিল। 4 জন চলে গেল, আবার 5 জন এলো। এখন মাঠে কতজন? {LS}', "১"),
        ]),
    ],
    C=[
        ("C1. Venn Diagram Application", "৩ নম্বর", {}, [
            (f'Circle 1 = চার পেয়ে প্রাণী, Circle 2 = পোষা প্রাণী। মাঝখানে: {opt("(কুকুর / বাঘ)")}', "১"),
            (f'Circle 1 = উড়তে পারে, Circle 2 = যন্ত্র। মাঝখানে: {opt("(পাখি / বিমান)")}', "১"),
            (f'Circle 1 = ঠান্ডা, Circle 2 = মিষ্টি। মাঝখানে: {opt("(চা / আইসক্রিম)")}', "১"),
        ]),
        ("C2. Spatial Direction (Map Intro)", "৩ নম্বর",
         {"method": method("<b>পদ্ধতি:</b> উপরের দিক হলো North (উত্তর), ডান দিক East (পূর্ব)।")}, [
            (f'মানচিত্রের উপরের দিক কোনটি? {opt("(উত্তর / দক্ষিণ)")}', "১"),
            (f'পূর্ব দিকের উল্টো দিকে কী? {opt("(পশ্চিম / উত্তর)")}', "১"),
            (f'ডান দিকে 2 ধাপ গিয়ে বাঁয়ে ঘুরলে কোথায় যাবে? {opt("(উপরে / নিচে)")}', "১"),
        ]),
        ("C3. Logic / Odd One Out", "২ নম্বর", {}, [
            (f'Odd one: {opt("A &nbsp; E &nbsp; I &nbsp; Z")} (Vowel/Consonant)', "১"),
            (f'Odd one: {opt("Dog &nbsp; Cat &nbsp; Cow &nbsp; Lion")}', "১"),
        ]),
        ("C4. Number Analogy", "২ নম্বর", {}, [
            (f'5 : 10 :: 10 : {LS} (দ্বিগুণ)', "১"),
            (f'3 : 6 :: 4 : {LS}', "১"),
        ]),
    ],
))

# -------------------------------------------------------------------- DAY 38
DAYS.append(dict(
    n=38, sub="ACTION VERBS (PAST TENSE) • FRACTIONS (1/2) • GRID SUDOKU",
    foot="Past Tense • Fractions • Sudoku",
    A=[
        ("A1. Action Verbs (Past Tense Intro with -ed)", "৩ নম্বর",
         {"method": method("<b>নিয়ম:</b> কাজ আগে হয়ে গেলে verb এর শেষে 'ed' যোগ হয় (play → played)।")}, [
            (f'Today I play. Yesterday I {LS}. {opt("(played / play)")}', "১"),
            (f'Today I jump. Yesterday I {LS}.', "১"),
            (f'Today I walk. Yesterday I {LS}.', "১"),
        ]),
        ("A2. Vocabulary (Rhyming Advanced)", "৩ নম্বর", {}, [
            (f'Light → {LS} {opt("(Night / Day)")}', "১"),
            (f'Boat → {LS} {opt("(Coat / Cat)")}', "১"),
            (f'Train → {LS} {opt("(Rain / Run)")}', "১"),
        ]),
        ("A3. Reading Comprehension", "২ নম্বর",
         {"passage": passage_box(["Yesterday, I walked to the park.", "I played with my friends.", "We jumped high."])}, [
            (f'সে গতকাল কোথায় গিয়েছিল? {LS}', "১"),
            (f'তারা কী করেছিল? {LM}', "১"),
        ]),
        ("A4. Writing", "২ নম্বর", {}, [
            (f'Played দিয়ে বাক্য বানাও: {LL}', "২"),
        ]),
    ],
    B=[
        ("B1. Mental Math Speed Round", "৪ নম্বর", {}, [
            (f'Half of 10 = {LS}', "১"), (f'Half of 20 = {LS}', "১"),
            (f'Double 5 = {LS}', "১"), (f'Double 10 = {LS}', "১"),
        ]),
        ("B2. Fractions Concept (1/2 or Half)", "২ নম্বর",
         {"method": method("<b>নিয়ম:</b> কোনো জিনিসকে সমান ২ ভাগ করলে, প্রতি ভাগকে 1/2 বা Half বলে।")}, [
            (f'একটি পিৎজাকে সমান ২ ভাগ করলে এক ভাগকে কী বলে? {opt("(Half / Quarter)")}', "১"),
            (f'8টি আপেলের Half কয়টি? {LS}টি', "১"),
        ]),
        ("B3. Pattern / Sequence", "২ নম্বর", {}, [
            (f'50, 45, 40, {LS}, 30', "১"),
            (f'2, 4, 8, {LS} (দ্বিগুণ)', "১"),
        ]),
        ("B4. Word Problem", "২ নম্বর", {}, [
            (f'মায়ের પાસે 12টি বিস্কুট আছে। সে অর্ধেক তোমাকে দিল। তুমি কয়টি পেলে? {LS}', "১"),
            (f'একটি বইয়ের দাম 40 টাকা। তুমি হাফ পেমেন্ট করলে, কত দিলে? {LS}', "১"),
        ]),
    ],
    C=[
        ("C1. Grid Logic (Sudoku Shape 3x3)", "৩ নম্বর", {}, [
            (f'| △ | ○ | □ | <br>| □ | △ | ○ | <br>| ○ | □ | {LS} |', "১"),
            (f'| 1 | 2 | 3 | <br>| 2 | 3 | 1 | <br>| 3 | 1 | {LS} |', "১"),
            (f'| A | B | C | <br>| C | A | B | <br>| B | C | {LS} |', "১"),
        ]),
        ("C2. Visual Pattern Completion", "৩ নম্বর", {}, [
            (f'■ □ ■ □ ■ {LS} {opt("(■ / □)")}', "১"),
            (f'→ ↓ ← ↑ → {LS} {opt("(↓ / ←)")}', "১"),
            (f'1টি বিন্দু, ২টি বিন্দু, ৩টি বিন্দু, {LS}টি বিন্দু', "১"),
        ]),
        ("C3. Analogy", "২ নম্বর", {}, [
            (f'Eye : See :: Ear : {LS}', "১"),
            (f'Nose : Smell :: Tongue : {LS} {opt("(Taste / Talk)")}', "১"),
        ]),
        ("C4. Deductive Reasoning", "২ নম্বর", {}, [
            (f'লাল ও হলুদ রং মেশালে কমলা হয়। লাল ও সাদা মেশালে কী হয়? {opt("(গোলাপি / নীল)")}', "১"),
            (f'A=5, B=10 হলে, A+A = {LS}', "১"),
        ]),
    ],
))

# -------------------------------------------------------------------- DAY 39
DAYS.append(dict(
    n=39, sub="QUESTION WORDS (Wh-) • DATA HANDLING • MIXED REASONING",
    foot="Wh- Questions • Tally Chart • Mixed",
    A=[
        ("A1. Wh- Question Words (Who, What, Where)", "৩ নম্বর",
         {"method": method("<b>নিয়ম:</b> Who = কে, What = কী, Where = কোথায়।")}, [
            (f'{LS} is your name? {opt("(What / Who)")}', "১"),
            (f'{LS} is that boy? {opt("(Who / Where)")}', "১"),
            (f'{LS} do you live? {opt("(Where / What)")}', "১"),
        ]),
        ("A2. Grammar (Punctuation Review)", "৩ নম্বর", {}, [
            (f'how are you {opt("(? / .)")} - সঠিক চিহ্ন বসাও: {LS}', "১"),
            (f'i am happy {opt("(? / .)")} - সঠিক চিহ্ন বসাও: {LS}', "১"),
            (f'wow {opt("(! / ?)")} - সঠিক চিহ্ন বসাও: {LS}', "১"),
        ]),
        ("A3. Reading Comprehension", "২ নম্বর",
         {"passage": passage_box(["Where is the cat?", "It is under the bed.", "Who is playing with it? Tom is playing."])}, [
            (f'বিড়ালটি কোথায়? {LS}', "১"),
            (f'কে বিড়ালটির সাথে খেলছে? {LM}', "১"),
        ]),
        ("A4. Sentence Making", "২ নম্বর", {}, [
            (f'What দিয়ে একটি প্রশ্ন বানাও: {LL}', "২"),
        ]),
    ],
    B=[
        ("B1. Mental Math (Mixed Operations)", "৪ নম্বর", {}, [
            (f'5 + 5 + 5 = {LS}', "১"), (f'10 - 2 - 2 = {LS}', "১"),
            (f'3 × 4 = {LS}', "১"), (f'12 ÷ 2 = {LS}', "১"),
        ]),
        ("B2. Data Handling (Tally Chart Intro)", "২ নম্বর",
         {"method": method("<b>নিয়ম:</b> Tally marks-এ ১ থেকে ৪ পর্যন্ত খাড়া দাগ (||||) এবং ৫-এ একটি আড়াআড়ি দাগ কাটা হয় (<s>||||</s>)।")}, [
            (f'|||| মানে কত? {LS}', "১"),
            (f'৭ কে Tally তে লিখতে কয়টি খাড়া দাগ লাগে? {opt("(৫ / ৭)")}', "১"),
        ]),
        ("B3. Pattern / Sequence (Subtracting)", "২ নম্বর", {}, [
            (f'100, 90, 80, {LS}', "১"),
            (f'20, 16, 12, {LS}', "১"),
        ]),
        ("B4. Word Problem (Mixed)", "২ নম্বর", {}, [
            (f'ক্লাসে 5টি বেঞ্চ আছে। প্রতি বেঞ্চে 2 জন বসলে মোট কতজন? {LS}', "১"),
            (f'তোমার কাছে 20 টাকা ছিল। 5 টাকার কলম কিনলে। আর কত রইলো? {LS}', "১"),
        ]),
    ],
    C=[
        ("C1. Advanced Number Logic", "৩ নম্বর", {}, [
            (f'2, 3, 5, 8, {LS} (পার্থক্য: 1, 2, 3...)', "১"),
            (f'1, 1, 2, 3, 5, {LS} (Fibonacci intro)', "১"),
            (f'10, 20, 15, 25, 20, {LS} (+10, -5)', "১"),
        ]),
        ("C2. Visual Logic (Rotation)", "৩ নম্বর", {}, [
            (f'ঘড়ির কাঁটার দিকে ঘোরাও: ↑ → ↓ → {LS}', "১"),
            (f'p কে উল্টালে d হয়, b কে উল্টালে কী হয়? {LS}', "১"),
            (f'△ কে উল্টালে কী হয়? {opt("(▽ / □)")}', "১"),
        ]),
        ("C3. Classification / Odd One Out", "২ নম্বর", {}, [
            (f'Odd one: {opt("Apple &nbsp; Banana &nbsp; Potato &nbsp; Mango")}', "১"),
            (f'Odd one: {opt("Sun &nbsp; Fire &nbsp; Ice &nbsp; Heater")}', "১"),
        ]),
        ("C4. Logic Puzzle", "২ নম্বর", {}, [
            (f'আমি একটি তিন অক্ষরের শব্দ। আমার প্রথম অক্ষর C, শেষ অক্ষর T, আমি মিয়াঁও করি। আমি কে? {LS}', "১"),
            (f'সপ্তাহের প্রথম দিন রবিবার হলে, চতুর্থ দিন কী? {LS}', "১"),
        ]),
    ],
))

# -------------------------------------------------------------------- DAY 40
DAYS.append(dict(
    n=40, sub="REVIEW DAY 1 (MONTH 2) • MOCK ASSESSMENT MEDIUM",
    foot="Review Day 1 • Month 2",
    A=[
        ("A1. Vowels, Grammar & Prepositions Review", "৪ নম্বর", {}, [
            (f'b_ _t (নৌকা) - oa/ea? {LS}', "১"),
            (f'She is {LS} girl. {opt("(a / an)")}', "১"),
            (f'The book is {LS} the bag. {opt("(in / under)")}', "১"),
            (f'Cat → {LS} (Plural)', "১"),
        ]),
        ("A2. Action Verbs & Pronouns", "৪ নম্বর", {}, [
            (f'Yesterday I {LS}. {opt("(play / played)")}', "১"),
            (f'Ram is a boy. {LS} is tall. {opt("(He / She)")}', "১"),
            (f'Hot × {LS} (Opposite)', "১"),
            (f'{LS} is your name? {opt("(What / Where)")}', "১"),
        ]),
        ("A3. Comprehension & Writing", "২ নম্বর",
         {"passage": passage_box(["Sara has a big red balloon.", "It flies up in the sky.", "She is happy."])}, [
            (f'Sara-র বেলুনটি কেমন? {LM}', "১"),
            (f'বেলুনটি কোথায় ওড়ে? {LM}', "১"),
        ]),
    ],
    B=[
        ("B1. Mental Math & Number Concept Review", "৪ নম্বর", {}, [
            (f'345-এ 4 এর Place Value: {LS}', "১"),
            (f'100, 90, 80, {LS}', "১"),
            (f'Half of 12 = {LS}', "১"),
            (f'25 + 15 = {LS}', "১"),
        ]),
        ("B2. Arithmetic (Addition, Subtraction, Multiplication)", "৪ নম্বর", {}, [
            (f'45 + 37 = {LS}', "১"),
            (f'62 - 28 = {LS}', "১"),
            (f'4 × 5 = {LS}', "১"),
            (f'15 ÷ 3 = {LS}', "১"),
        ]),
        ("B3. Word Problem (Mixed)", "২ নম্বর", {}, [
            (f'একটি বাক্সে 50টি আপেল। 24টি পচে গেল। ভালো আছে কয়টি? {LS}', "১"),
            (f'3 জনের প্রত্যেকে 4টি চকলেট পেলে মোট কয়টি? {LS}', "১"),
        ]),
    ],
    C=[
        ("C1. Analogy & Odd One Out Review", "৪ নম্বর", {}, [
            (f'Bird : Nest :: Bee : {LS} {opt("(Hive / Tree)")}', "১"),
            (f'Odd one: {opt("A &nbsp; E &nbsp; I &nbsp; B")}', "১"),
            (f'Circle : Ball :: Square : {LS} {opt("(Box / Egg)")}', "১"),
            (f'Odd one: {opt("Car &nbsp; Bus &nbsp; Ship &nbsp; Truck")}', "১"),
        ]),
        ("C2. Coding & Venn Diagram Review", "৪ নম্বর", {}, [
            (f'A=1, B=2 হলে CAB = {LS}{LS}{LS}', "১"),
            (f'+ মানে -, - মানে + হলে 8 - 3 = {LS}', "১"),
            (f'Circle 1: ফল, Circle 2: হলুদ। মাঝে: {opt("(কলা / আপেল)")}', "১"),
            (f'2, 4, 6, {LS}', "১"),
        ]),
        ("C3. Logic & Visual Review", "২ নম্বর", {}, [
            (f'পূর্ব দিকের বিপরীতে কোন দিক? {LS}', "১"),
            (f'আয়নায় <b>A</b> কেমন দেখাবে? {opt("(A / V)")}', "১"),
        ]),
    ],
))

