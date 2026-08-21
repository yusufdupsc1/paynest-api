# -*- coding: utf-8 -*-
"""Assemble the complete Day 1–30 workbook HTML."""
import re
import sys

sys.path.insert(0, "/home/user/paynest-api/worksheets")

from wb_lib import worksheet, bn  # noqa: E402
import wb_days_01_10 as d1  # noqa: E402
import wb_days_11_20 as d2  # noqa: E402

SRC21 = "/home/user/paynest-api/worksheets/day-21-30-worksheets.html"
OUT = "/home/user/paynest-api/worksheets/day-01-30-workbook.html"


def part3_sections():
    raw = open(SRC21, encoding="utf-8").read()
    head = raw.split("<body>")[0]
    secs = re.findall(r'<section class="paper">.*?</section>', raw, re.S)
    return head, secs


HEAD, P3 = part3_sections()
HEAD = HEAD.replace(
    "<title>Primary Olympiad Preparation Program — Day 21-30 Worksheets</title>",
    "<title>Primary Olympiad Preparation Program — Day 1–30 Complete Workbook</title>")

# --------------------------------------------------------------------------- #
# Front matter
# --------------------------------------------------------------------------- #
COVER = '''<section class="paper">
  <header class="masthead">
    <div class="brand">PRIMARY OLYMPIAD PREPARATION PROGRAM</div>
    <h1>৩০ দিনের সম্পূর্ণ অনুশীলন ওয়ার্কবুক</h1>
    <div class="sub">DAY 1 – DAY 30 &nbsp;|&nbsp; English Language Skills • Mathematics &amp; Mental Reasoning • Analytical Ability</div>
  </header>

  <table class="meta">
    <tr>
      <td class="k">শিক্ষার্থীর নাম</td><td class="v"></td>
      <td class="k">বয়স</td><td class="v"></td>
      <td class="k">শুরুর তারিখ</td><td class="v"></td>
      <td class="k">অভিভাবক/শিক্ষক</td><td class="v"></td>
    </tr>
    <tr>
      <td class="k">মোট দিন</td><td class="v">৩০</td>
      <td class="k">দৈনিক পূর্ণমান</td><td class="v">৩০</td>
      <td class="k">দৈনিক সময়</td><td class="v">৭৫ মিনিট</td>
      <td class="k">মোট নম্বর</td><td class="v">৯০০</td>
    </tr>
  </table>

  <div class="row2">
    <div class="box">
      <h4>কেন এই কাঠামো (৩০ = ১০ + ১০ + ১০)</h4>
      <table class="dist">
        <tr><th>ডোমেইন</th><th>কগনিটিভ ভিত্তি</th><th>মানদণ্ড</th><th>নম্বর</th></tr>
        <tr><td class="l">English Language Skills</td><td class="l">Phonological Awareness + Vocabulary Acquisition (Pre-A1 → A1)</td><td class="l">Cambridge Primary English Stage 1</td><td>১০</td></tr>
        <tr><td class="l">Mathematics &amp; Mental Reasoning</td><td class="l">Numeracy + Working Memory (Preoperational → Concrete)</td><td class="l">Cambridge Primary Math Stage 1</td><td>১০</td></tr>
        <tr><td class="l">Analytical Ability</td><td class="l">Non-verbal Reasoning / Fluid Intelligence (Gf)</td><td class="l">Primary Admission Test (IQ-pattern)</td><td>১০</td></tr>
      </table>
    </div>
  </div>

  <div class="row2">
    <div class="box">
      <h4>প্রতিদিনের নির্দিষ্ট কাঠামো (Fixed Template — শুধু কঠিনতা বাড়ে)</h4>
      <table class="dist">
        <tr><th>SECTION A — English (১০)</th><th>SECTION B — Mathematics (১০)</th><th>SECTION C — Analytical (১০)</th></tr>
        <tr>
          <td class="l">A1. Phonics / Vocabulary — ৩<br>A2. Grammar / Sentence — ৩<br>A3. Reading Comprehension — ২<br>A4. Writing / Spelling — ২</td>
          <td class="l">B1. Mental Math Speed Round — ৪<br>B2. Number Concept / Place Value — ২<br>B3. Pattern / Sequence — ২<br>B4. Word Problem — ২</td>
          <td class="l">C1. Odd One Out / Classification — ৩<br>C2. Pattern Completion — ৩<br>C3. Similarities / Analogy — ২<br>C4. Sequencing — ২</td>
        </tr>
      </table>
      <div style="font-size:11px;margin-top:4px">প্রতিদিন একই কাঠামো থাকায় প্রতিটি উপ-দক্ষতার স্কোর আলাদাভাবে ট্র্যাক করা যায় — ফলে ৩০ দিন পর "মনে হচ্ছে ভালো করছে" নয়, <b>সংখ্যায় প্রমাণ</b> পাওয়া যায়।</div>
    </div>
  </div>

  <div class="row2">
    <div class="box">
      <h4>দৈনিক সেশন পরিকল্পনা (৭৫ মিনিট)</h4>
      <table class="dist">
        <tr><th>সময়</th><th>কাজ</th><th>টিপস</th></tr>
        <tr><td>০–২৫ মিনিট</td><td class="l">SECTION A — English</td><td class="l">শুরুতেই সবচেয়ে বেশি মনোযোগ থাকে</td></tr>
        <tr><td>২৫–৩০ মিনিট</td><td class="l">বিরতি</td><td class="l">শারীরিক নড়াচড়া বাধ্যতামূলক</td></tr>
        <tr><td>৩০–৫০ মিনিট</td><td class="l">SECTION B — Mathematics</td><td class="l">B1-এ টাইমার চালু করুন</td></tr>
        <tr><td>৫০–৫৫ মিনিট</td><td class="l">বিরতি</td><td class="l">পানি/হালকা নাস্তা</td></tr>
        <tr><td>৫৫–৭৫ মিনিট</td><td class="l">SECTION C — Analytical</td><td class="l">সময় নিয়ে ভাবতে দিন, তাড়া নয়</td></tr>
      </table>
    </div>
  </div>

  <div class="note">
    <b>মূল্যায়ন মানদণ্ড:</b> ২৭–৩০ = A+ (Excellent, কঠিনতা বাড়ান) &nbsp;|&nbsp; ২২–২৬ = A (Good) &nbsp;|&nbsp;
    ১৭–২১ = B (Average, দুর্বল উপ-দক্ষতায় ১ দিন অতিরিক্ত) &nbsp;|&nbsp; ১২–১৬ = C (পূর্বের দিনে ফিরে পুনঃশিক্ষা)
    &nbsp;|&nbsp; ১২-এর নিচে = D (হাতে-কলমে উপকরণ দিয়ে ১:১ পুনঃশিক্ষা আবশ্যক)
  </div>

  <div class="pagefoot"><span>Primary Olympiad Preparation Program — Day 1–30 Workbook</span><span>Cover</span></div>
</section>'''

MATRIX = '''<section class="paper">
  <h2 class="big">৩০ দিনের মাস্টার টপিক ম্যাট্রিক্স (Skill Progression Map)</h2>

  <h3 class="sub">সপ্তাহ ১ (দিন ১–৭): Diagnostic &amp; Foundation</h3>
  <table class="ans">
    <tr><th style="width:34px">দিন</th><th>Section A (English)</th><th>Section B (Mathematics)</th><th>Section C (Analytical)</th></tr>
    <tr><td class="d">১</td><td>Alphabet A–M ও ধ্বনি</td><td>সংখ্যা ১–২০, যোগ ≤৫</td><td>সহজ Odd One Out</td></tr>
    <tr><td class="d">২</td><td>Alphabet N–Z ও ধ্বনি</td><td>Before/After, যোগ-বিয়োগ ≤৫</td><td>Matching Pairs</td></tr>
    <tr><td class="d">৩</td><td>CVC Blending (-at, -an, -ap)</td><td>সংখ্যা ২১–৫০, যোগ ≤১০</td><td>সরল AB প্যাটার্ন</td></tr>
    <tr><td class="d">৪</td><td>CVC শব্দ পড়া</td><td>২-করে গোনা, বিয়োগ ≤৫</td><td>AAB প্যাটার্ন, ৩-ধাপ ক্রম</td></tr>
    <tr><td class="d">৫</td><td>Naming Words (Nouns)</td><td>Before/After/Between ১–৫০</td><td>আকার ও রং ভিত্তিক Odd One Out</td></tr>
    <tr><td class="d">৬</td><td>২-লাইন Passage + Yes/No</td><td>Missing Number, বিয়োগ ≤১০</td><td>Matching Pattern</td></tr>
    <tr><td class="d">৭ 🏁</td><td colspan="3"><b>সাপ্তাহিক ডায়াগনস্টিক টেস্ট — Baseline স্কোর রেকর্ড হবে</b></td></tr>
  </table>

  <h3 class="sub">সপ্তাহ ২ (দিন ৮–১৪): Building Blocks</h3>
  <table class="ans">
    <tr><th style="width:34px">দিন</th><th>Section A (English)</th><th>Section B (Mathematics)</th><th>Section C (Analytical)</th></tr>
    <tr><td class="d">৮</td><td>ছন্দমিল শব্দ (Rhyming)</td><td>সংখ্যা ৫১–১০০, যোগ ≤২০</td><td>AAB প্যাটার্ন</td></tr>
    <tr><td class="d">৯</td><td>স্বরবর্ণ শনাক্তকরণ</td><td>Place Value (দশক-একক)</td><td>২-বৈশিষ্ট্যের Odd One Out</td></tr>
    <tr><td class="d">১০</td><td>Opposites</td><td>৫-করে গোনা, বিয়োগ ≤২০</td><td>Analogy, ৪-ধাপ ক্রম</td></tr>
    <tr><td class="d">১১</td><td>Plural (cat → cats)</td><td>১০-করে গোনা, ১-ধাপ সমস্যা</td><td>ঘোরানো shape মেলানো</td></tr>
    <tr><td class="d">১২</td><td>Action Words / Verbs</td><td>Doubling, Carry Addition পরিচিতি</td><td>সারিতে Missing Shape</td></tr>
    <tr><td class="d">১৩</td><td>৩-লাইন Passage + Wh-question</td><td>Number Bonds to 20</td><td>Category Classification</td></tr>
    <tr><td class="d">১৪ 🏁</td><td colspan="3"><b>সপ্তাহ ২ মূল্যায়ন — Day 7 এর সাথে তুলনা</b></td></tr>
  </table>

  <h3 class="sub">সপ্তাহ ৩ (দিন ১৫–২১): Application</h3>
  <table class="ans">
    <tr><th style="width:34px">দিন</th><th>Section A (English)</th><th>Section B (Mathematics)</th><th>Section C (Analytical)</th></tr>
    <tr><td class="d">১৫</td><td>Sight Words (the, is, and, a, to)</td><td>যোগ ≤৫০ (হাতে রাখা ছাড়া)</td><td>Analogy</td></tr>
    <tr><td class="d">১৬</td><td>Synonyms</td><td>বিয়োগ ≤৫০</td><td>Pattern Grid ২×২</td></tr>
    <tr><td class="d">১৭</td><td>Digraphs sh, ch, th</td><td>গুণের পরিচয় (২-এর নামতা)</td><td>Growth Process Sequence</td></tr>
    <tr><td class="d">১৮</td><td>Article a / an</td><td>হাফিং (জোড় সংখ্যা ≤২০)</td><td>Abstract Odd One Out + Reasoning</td></tr>
    <tr><td class="d">১৯</td><td>Sentence Completion (Verb)</td><td>মিশ্র ও ২-ধাপ Word Problem</td><td>Coding–Decoding পরিচিতি</td></tr>
    <tr><td class="d">২০</td><td>Capital Letter + Full Stop</td><td>সময় পড়া (o'clock, half past)</td><td>Mirror Image</td></tr>
    <tr><td class="d">২১ 🏁</td><td colspan="3"><b>সপ্তাহ ৩ মূল্যায়ন — Day 14 এর সাথে তুলনা</b></td></tr>
  </table>

  <h3 class="sub">সপ্তাহ ৪ (দিন ২২–৩০): Mastery &amp; Final Assessment</h3>
  <table class="ans">
    <tr><th style="width:34px">দিন</th><th>Section A (English)</th><th>Section B (Mathematics)</th><th>Section C (Analytical)</th></tr>
    <tr><td class="d">২২</td><td>Category Words</td><td>যোগ ≤১০০ (হাতে রাখা সহ)</td><td>Advanced Classification (২ বৈশিষ্ট্য)</td></tr>
    <tr><td class="d">২৩</td><td>Compound Words</td><td>বিয়োগ ≤১০০ (ধার করা সহ)</td><td>Pattern Grid ৩×৩</td></tr>
    <tr><td class="d">২৪</td><td>Sentence Formation (S+V+O)</td><td>টাকা-পয়সা</td><td>Analogy (বিভিন্ন ধরন)</td></tr>
    <tr><td class="d">২৫</td><td>Punctuation ( . ? ! )</td><td>২-ধাপ Word Problem</td><td>Advanced Sequencing (৫ ধাপ)</td></tr>
    <tr><td class="d">২৬</td><td>৫-লাইন Passage + Inference</td><td>মিশ্র Review</td><td>Direction ও সরল Maze</td></tr>
    <tr><td class="d">২৭</td><td>ছবি দেখে ২টি বাক্য</td><td>২-নিয়ম Advanced Pattern</td><td>Mixed Mock (সহজ)</td></tr>
    <tr><td class="d">২৮</td><td>Spelling Dictation (৫ শব্দ)</td><td>Mental Math Speed Drill</td><td>Mixed Mock (মাঝারি)</td></tr>
    <tr><td class="d">২৯</td><td colspan="3">পূর্ণ পুনরালোচনা (সব উপ-দক্ষতা মিশ্র)</td></tr>
    <tr><td class="d">৩০ 🏆</td><td colspan="3"><b>FINAL ASSESSMENT — Day 1 এর সাথে তুলনামূলক মূল্যায়ন</b></td></tr>
  </table>

  <div class="pagefoot"><span>Master Topic Matrix</span><span>Day 1–30 Workbook</span></div>
</section>'''

GUIDE = '''<section class="paper">
  <h2 class="big">ব্যবহারবিধি, প্রয়োজনীয় উপকরণ ও অভিভাবকের নির্দেশিকা</h2>

  <div class="row2">
    <div class="box">
      <h4>পরীক্ষা পরিচালনার নির্দেশাবলী (অভিভাবক / শিক্ষকের জন্য)</h4>
      <ol>
        <li>প্রতিদিন একই সময়ে বসান — নির্দিষ্ট সময়ে অভ্যাস তৈরি হলে মনোযোগ বাড়ে।</li>
        <li>ক্রম: <b>Section A → বিরতি ৫ মিনিট → Section B → বিরতি ৫ মিনিট → Section C</b>।</li>
        <li>B1 (Mental Math) অংশে টাইমার চালু করুন — প্রতি প্রশ্নে সর্বোচ্চ ২০ সেকেন্ড।</li>
        <li>পরীক্ষা চলাকালীন কোনো সাহায্য নয়; শেষ হওয়ার পর একসাথে বসে ভুল আলোচনা করুন।</li>
        <li>ভুল উত্তরগুলো <b>Wrong Answer Journal</b>-এ তুলে রাখুন — পরদিনের ওয়ার্ম-আপে সেগুলো আসবে।</li>
        <li>প্রতিদিনের স্কোর ওয়ার্কবুকের শেষে <b>Progress Tracking Sheet</b>-এ লিখুন।</li>
        <li>Day 7, 14, 21 ও 30 — এই চারটি চেকপয়েন্টে কোনো সাহায্য দেবেন না, এগুলোই মাপকাঠি।</li>
      </ol>
    </div>
    <div class="box">
      <h4>শিক্ষার্থীর জন্য নির্দেশ</h4>
      <ol>
        <li>প্রতিটি প্রশ্ন <b>দুইবার</b> পড়ো, তারপর উত্তর লেখো।</li>
        <li>নির্ধারিত দাগের উপরে পরিষ্কার করে লেখো।</li>
        <li>যেখানে "বৃত্ত দাও" লেখা আছে, সঠিক উত্তরের চারপাশে গোল দাগ দাও।</li>
        <li>কঠিন প্রশ্নে আটকে গেলে দাগ দিয়ে রেখে পরেরটিতে যাও, শেষে ফিরে এসো।</li>
        <li>শেষ করে একবার সব উত্তর মিলিয়ে দেখো।</li>
      </ol>
    </div>
  </div>

  <div class="row2">
    <div class="box">
      <h4>প্রয়োজনীয় উপকরণ (সম্পূর্ণ হাতে-কলমে, কোনো স্ক্রিন নয়)</h4>
      <table class="dist">
        <tr><th>উপকরণ</th><th>কোথায় লাগবে</th></tr>
        <tr><td class="l">ছবিযুক্ত Flashcards (Alphabet, Animals, Fruits)</td><td class="l">Section A — শব্দভাণ্ডার</td></tr>
        <tr><td class="l">গণনার জিনিস (বোতাম, বীজ, ব্লক), ১০টি করে বাঁধা কাঠি</td><td class="l">Section B — সংখ্যা ও স্থানীয় মান</td></tr>
        <tr><td class="l">কাগজে কাটা Shape কার্ড (বৃত্ত, বর্গ, ত্রিভুজ)</td><td class="l">Section C — প্যাটার্ন ও শ্রেণিবিভাগ</td></tr>
        <tr><td class="l">কাগজের টাকা (৫, ১০, ২০, ৫০, ১০০)</td><td class="l">Day 24 — টাকা-পয়সা</td></tr>
        <tr><td class="l">চলমান কাঁটাযুক্ত কাগজের ঘড়ি</td><td class="l">Day 20 — সময় পড়া</td></tr>
        <tr><td class="l">টাইমার, স্টার চার্ট ও স্টিকার</td><td class="l">গতি ও অনুপ্রেরণা</td></tr>
        <tr><td class="l">আলাদা "Wrong Answer Journal" খাতা</td><td class="l">ভুল বিশ্লেষণ</td></tr>
      </table>
    </div>
  </div>

  <div class="row2">
    <div class="box">
      <h4>ওয়ার্কবুকের বিন্যাস</h4>
      <ol>
        <li><b>Day 1 – Day 30</b> — প্রতিদিনের প্রশ্নপত্র (প্রতিটি ৩০ নম্বর, এক পৃষ্ঠা)</li>
        <li><b>উত্তরপত্র</b> — তিন পর্বে (Day 1–10, Day 11–20, Day 21–30)</li>
        <li><b>Best Tricks</b> — প্রতিটি সেকশনের জন্য শেখানোর কৌশল ও ব্যাখ্যা</li>
        <li><b>Progress Tracking</b> — দৈনিক স্কোর, উপ-দক্ষতা বিশ্লেষণ ও Day 1 vs Day 30 তুলনা</li>
        <li><b>সনদপত্র</b> — ৩০ দিন সম্পন্ন করার স্বীকৃতি</li>
      </ol>
    </div>
  </div>

  <div class="note">
    <b>সবচেয়ে গুরুত্বপূর্ণ নিয়ম:</b> একদিনে ২টির বেশি নতুন ধারণা নয়, এবং ক্লান্ত অবস্থায় কখনোই জোর করা নয়।
    শিশুর কৌতূহল ও আনন্দ বজায় রাখাই সবচেয়ে বড় KPI — সেটি নষ্ট হলে স্কোর ভালো হলেও পদ্ধতি ব্যর্থ।
  </div>

  <div class="pagefoot"><span>ব্যবহারবিধি ও উপকরণ</span><span>Day 1–30 Workbook</span></div>
</section>'''

# --------------------------------------------------------------------------- #
# Answer keys — Day 1-10
# --------------------------------------------------------------------------- #
AK_1_10 = '''<section class="paper">
  <h2 class="big">উত্তরপত্র (ANSWER KEY) — Day 1 – Day 10</h2>
  <div class="note"><b>মূল্যায়নের নিয়ম:</b> "(মুক্ত)" চিহ্নিত প্রশ্নে একটিমাত্র সঠিক উত্তর নেই — শিশুর লেখা বাক্যে
  <b>(১)</b> বড় হাতের অক্ষরে শুরু, <b>(২)</b> শেষে দাঁড়ি, <b>(৩)</b> অর্থবোধক — এই তিনটি থাকলে পূর্ণ নম্বর দিন।</div>

  <h3 class="sub">SECTION A — English Language Skills</h3>
  <table class="ans">
    <tr><th style="width:34px">দিন</th><th>A1</th><th>A2</th><th>A3</th><th>A4</th></tr>
    <tr><td class="d">১</td><td>B, D, F</td><td>Cat, Sun, Ball</td><td>Black; Yes</td><td>cat; sun</td></tr>
    <tr><td class="d">২</td><td>P; N; Z</td><td>Dog, Star, Tree</td><td>White; Dog</td><td>dog; big</td></tr>
    <tr><td class="d">৩</td><td>cat, mat, hat</td><td>Ant, Map, Cab</td><td>On a mat; ১টি</td><td>cat; map</td></tr>
    <tr><td class="d">৪</td><td>বিড়াল, বাদুড়, টুপি</td><td>cat; hat; bat</td><td>Red; The cat</td><td>(মুক্ত) যেমন ball; cup</td></tr>
    <tr><td class="d">৫</td><td>Banana, Elephant, Car</td><td>Fruit: Apple, Mango, Banana / Animal: Dog, Cat, Cow</td><td>Sweet; Yellow</td><td>(মুক্ত)</td></tr>
    <tr><td class="d">৬</td><td>a; o; u</td><td>Yes; No; No</td><td>Red; Every morning</td><td>(মুক্ত)</td></tr>
    <tr><td class="d">৭</td><td>O; run; Bird</td><td>u (run); have; is</td><td>Yellow; Bird</td><td>(মুক্ত)</td></tr>
    <tr><td class="d">৮</td><td>hat; fun; pig</td><td>pen; dog; jug</td><td>On a log; ১টি (hen)</td><td>(মুক্ত) যেমন mat; run</td></tr>
    <tr><td class="d">৯</td><td>a ও e; o; u</td><td>e (pen); o (dog); u (cup)</td><td>On an oak tree; Oak</td><td>(মুক্ত) যেমন apple; egg</td></tr>
    <tr><td class="d">১০</td><td>Cold; Small; Slow</td><td>Down; Out; Night</td><td>Big; Small</td><td>(মুক্ত); Sad</td></tr>
  </table>

  <h3 class="sub">SECTION B — Mathematics &amp; Mental Reasoning</h3>
  <table class="ans">
    <tr><th style="width:34px">দিন</th><th>B1</th><th>B2</th><th>B3</th><th>B4</th></tr>
    <tr><td class="d">১</td><td>3, 4, 5, 5</td><td>5; 7</td><td>4; নীল ●</td><td>৩টি আম</td></tr>
    <tr><td class="d">২</td><td>5, 5, 5, 4</td><td>7; 15</td><td>5; লাল ●</td><td>৫টি চকলেট</td></tr>
    <tr><td class="d">৩</td><td>7, 7, 7, 7</td><td>34; 38</td><td>12; হলুদ ■</td><td>৭টি ফুল</td></tr>
    <tr><td class="d">৪</td><td>3, 3, 2, 2</td><td>8; 12</td><td>10; লাল ▲</td><td>৩টি বেলুন</td></tr>
    <tr><td class="d">৫</td><td>8, 8, 9, 9</td><td>19 ও 21; 16</td><td>40; 20</td><td>১০টি আম</td></tr>
    <tr><td class="d">৬</td><td>6, 3, 6, 5</td><td>25; 44</td><td>16; সবুজ ●</td><td>৬ জন</td></tr>
    <tr><td class="d">৭</td><td>9, 5, 9, 5</td><td>29 ও 31; 32</td><td>20; লাল ▲</td><td>৪টি বল</td></tr>
    <tr><td class="d">৮</td><td>17, 27, 18, 27</td><td>78; 65</td><td>লাল ●; 2</td><td>১৮টি ডিম</td></tr>
    <tr><td class="d">৯</td><td>49, 49, 39, 59</td><td>4; 63</td><td>24; 12</td><td>৩১ জন</td></tr>
    <tr><td class="d">১০</td><td>11, 6, 14, 9</td><td>20; 70</td><td>20; নীল ●</td><td>১৭ টাকা</td></tr>
  </table>

  <h3 class="sub">SECTION C — Analytical Ability</h3>
  <table class="ans">
    <tr><th style="width:34px">দিন</th><th>C1</th><th>C2</th><th>C3</th><th>C4</th></tr>
    <tr><td class="d">১</td><td>Car; Bus; Book</td><td>লাল ▲; ★; সবুজ ■</td><td>দুটি ○; দুটি লাল ●</td><td>ঘুম থেকে ওঠা–১, স্কুলে যাওয়া–২</td></tr>
    <tr><td class="d">২</td><td>Book; Pizza; Banana</td><td>দুটি ○; দুটি লাল ■; দুটি ★</td><td>Cat–Cat; দুটি লাল ●</td><td>পানি ফুটানো–১, চা বানানো–২</td></tr>
    <tr><td class="d">৩</td><td>Pen; Scale; Pencil</td><td>নীল ●; ▲; লাল ●</td><td>5 ও 5; দুটি □</td><td>ওঠা–১, দাঁত মাজা–২, নাস্তা–৩</td></tr>
    <tr><td class="d">৪</td><td>Jeep; Pizza; Bus</td><td>লাল ▲; ○; নীল ■</td><td>দুটি ▲; দুটি সবুজ ●</td><td>গোসল–১, জামা পরা–২, স্কুল–৩</td></tr>
    <tr><td class="d">৫</td><td>▲ (আকৃতি); ছোট; নীল</td><td>হলুদ ●; 1; A</td><td>Cow ও Cow; দুটি ■</td><td>বীজ বোনা–১, গাছ বড় হওয়া–২</td></tr>
    <tr><td class="d">৬</td><td>Book; Crayon; Apple</td><td>(ক); (খ); (ক)</td><td>7 ও 7; দুটি ▲</td><td>বাজার–১, রান্না–২, খাওয়া–৩</td></tr>
    <tr><td class="d">৭</td><td>Book; Jeep; ▲</td><td>নীল ●; লাল ▲; 4</td><td>দুটি ○; 7 ও 7</td><td>ওঠা–১, নাস্তা–২, স্কুল–৩</td></tr>
    <tr><td class="d">৮</td><td>Burger; Elephant; Bicycle</td><td>★; সবুজ ■; A</td><td>দুটি লাল ●; দুটি নীল ■</td><td>বীজ বোনা–১, পানি–২, ফুল ফোটা–৩</td></tr>
    <tr><td class="d">৯</td><td>ছোট-নীল; 15; নীল ●</td><td>লাল ●; 4; 20</td><td>Water; Night</td><td>বীজ–১, চারাগাছ–২, ফুল–৩, ফল–৪</td></tr>
    <tr><td class="d">১০</td><td>Bus; January; 7</td><td>8; সবুজ ▲; 40</td><td>Shoe; Cut</td><td>ওঠা–১, দাঁত মাজা–২, নাস্তা–৩, স্কুল–৪</td></tr>
  </table>

  <div class="pagefoot"><span>Answer Key — Day 1–10</span><span>উত্তরপত্র পর্ব ১</span></div>
</section>'''

# --------------------------------------------------------------------------- #
# Answer keys — Day 11-20
# --------------------------------------------------------------------------- #
AK_11_20 = '''<section class="paper">
  <h2 class="big">উত্তরপত্র (ANSWER KEY) — Day 11 – Day 20</h2>

  <h3 class="sub">SECTION A — English Language Skills</h3>
  <table class="ans">
    <tr><th style="width:34px">দিন</th><th>A1</th><th>A2</th><th>A3</th><th>A4</th></tr>
    <tr><td class="d">১১</td><td>cats; boxes; dogs</td><td>books; pens; birds</td><td>দুটি; বাগানে (garden)</td><td>toys; (মুক্ত)</td></tr>
    <tr><td class="d">১২</td><td>Run; Eat; Sleep</td><td>Read; Write; Sing</td><td>প্রতিদিন সকালে; পার্কে</td><td>(মুক্ত)</td></tr>
    <tr><td class="d">১৩</td><td>বাগান; ফুল; মৌমাছি</td><td>Sara; Red; A bee</td><td>Flowers (লাল ফুল); প্রতিদিন</td><td>(মুক্ত)</td></tr>
    <tr><td class="d">১৪</td><td>books; trees; run</td><td>Read; Write; Sing</td><td>Tom; Red ও In the park</td><td>(মুক্ত)</td></tr>
    <tr><td class="d">১৫</td><td>The; am; is</td><td>and; to; is</td><td>Red; বল নিয়ে খেলে</td><td>CAT; (মুক্ত)</td></tr>
    <tr><td class="d">১৬</td><td>Large; Glad; Quick</td><td>large; glad; quick</td><td>Quick (দ্রুত); মাঠে</td><td>Little / Tiny; (মুক্ত)</td></tr>
    <tr><td class="d">১৭</td><td>i; ai; i</td><td>Ship; Chair; Thin</td><td>সমুদ্রে (on the sea); খুব বড়</td><td>(মুক্ত) যেমন shop; chair</td></tr>
    <tr><td class="d">১৮</td><td>an; a; an</td><td>an; a; an</td><td>একটি ছাতা; বড়</td><td>(মুক্ত)</td></tr>
    <tr><td class="d">১৯</td><td>goes; play; reads</td><td>is; like; am</td><td>প্রতিদিন সকালে; মিষ্টি</td><td>(মুক্ত)</td></tr>
    <tr><td class="d">২০</td><td>My name is Rina. / I love my school. / Rana plays football.</td><td>তিনটিতেই দাঁড়ি ( . )</td><td>Rina; তার স্কুল</td><td>(মুক্ত)</td></tr>
  </table>

  <h3 class="sub">SECTION B — Mathematics &amp; Mental Reasoning</h3>
  <table class="ans">
    <tr><th style="width:34px">দিন</th><th>B1</th><th>B2</th><th>B3</th><th>B4</th></tr>
    <tr><td class="d">১১</td><td>9, 9, 7, 9</td><td>40; 80</td><td>৩০টি আম</td><td>45; 56</td></tr>
    <tr><td class="d">১২</td><td>6, 10, 14, 18</td><td>23; 33; 24</td><td>12–27–34; 8; 5</td><td>—</td></tr>
    <tr><td class="d">১৩</td><td>8, 5, 12, 7</td><td>19; 13; 19</td><td>১২টি; 11</td><td>—</td></tr>
    <tr><td class="d">১৪</td><td>12, 23, 12, 19</td><td>30; 5</td><td>23–38–45; 9</td><td>৬০টি পেন্সিল</td></tr>
    <tr><td class="d">১৫</td><td>38, 46, 48, 39</td><td>4; 53</td><td>20; 8</td><td>৪৭টি আম</td></tr>
    <tr><td class="d">১৬</td><td>22, 23, 23, 21</td><td>32; 35</td><td>30; নীল ■</td><td>২৩টি গাছ</td></tr>
    <tr><td class="d">১৭</td><td>2, 6, 10, 8</td><td>9 → 3×3; 8 → 4×2</td><td>10; 12</td><td>১০টি বল</td></tr>
    <tr><td class="d">১৮</td><td>2, 5, 8, 10</td><td>12; 6</td><td>7; 9</td><td>৬টি আম</td></tr>
    <tr><td class="d">১৯</td><td>40, 26, 12, 9</td><td>৩ ও ০; 16</td><td>১৭ জন</td><td>২০ টাকা</td></tr>
    <tr><td class="d">২০</td><td>3; 8; 1</td><td>3; 7:30; 10:30</td><td>১ ঘণ্টা; ১ ঘণ্টা</td><td>8; 7</td></tr>
  </table>

  <h3 class="sub">SECTION C — Analytical Ability</h3>
  <table class="ans">
    <tr><th style="width:34px">দিন</th><th>C1</th><th>C2</th><th>C3</th></tr>
    <tr><td class="d">১১</td><td>(খ); (খ); (ক); (খ)</td><td>Pencil; Tree; 10</td><td>ধোয়া–১, শুকানো–২, পরা–৩</td></tr>
    <tr><td class="d">১২</td><td>লাল ●; ○; হলুদ ■; □</td><td>Fruits: Apple, Banana, Mango / Animals: Dog, Cat, Cow</td><td>Pizza; Blue; 17</td></tr>
    <tr><td class="d">১৩</td><td>Fruits: Apple, Mango, Banana / Vehicles: Car, Bus, Bicycle</td><td>Carrot; Cow; Happy</td><td>2; ▼; ফেরা–১, ব্যাগ গোছানো–২, ঘুমাতে যাওয়া–৩</td></tr>
    <tr><td class="d">১৪</td><td>(খ); Carrot; 17</td><td>লাল ●; ★; 2</td><td>Fruits / Animals; ধোয়া–১, শুকানো–২, পরা–৩</td></tr>
    <tr><td class="d">১৫</td><td>Water; Shoe; Night; Egg</td><td>লাল ●; 4; 8</td><td>Red; 7; January</td></tr>
    <tr><td class="d">১৬</td><td>△; A; 1; 3</td><td>Carrot; 20; Box</td><td>ফল; পোষা প্রাণী; যানবাহন</td></tr>
    <tr><td class="d">১৭</td><td>বীজ বপন–১, চারাগাছ–২, ফুল ফোটা–৩, ফল ধরা–৪</td><td>ডিম–১, বাচ্চা–২, মুরগি–৩</td><td>লাল ▲; 4; D</td></tr>
    <tr><td class="d">১৮</td><td>Jump; Red; 9; Table</td><td>Chair; Yellow; 35</td><td>সুন্দর; উড়তে পারে; বৃষ্টি হয়েছিল</td></tr>
    <tr><td class="d">১৯</td><td>2; C; 3–1–2; DAB; 3–1–20</td><td>1–2–1; A–B–A; 1–3–5</td><td>রিয়া; A &gt; C</td></tr>
    <tr><td class="d">২০</td><td>d; উল্টানো E; (খ) বামে হেলানো; উল্টানো 3</td><td>বাম হাত; হ্যাঁ; (ক) ←</td><td>Apple; 10; বই খোলা–১, পড়া–২, বন্ধ–৩</td></tr>
  </table>

  <div class="pagefoot"><span>Answer Key — Day 11–20</span><span>উত্তরপত্র পর্ব ২</span></div>
</section>'''

# --------------------------------------------------------------------------- #
# Best tricks
# --------------------------------------------------------------------------- #
def trick(title, body):
    return f'<div class="trick"><h5>{title}</h5><p>{body}</p></div>'


TRICKS_1_10 = '''<section class="paper">
  <h2 class="big">ব্যাখ্যা ও শেখানোর সেরা কৌশল — Day 1 – Day 10</h2>

  <h3 class="sub">SECTION A — English: ৪টি কৌশল</h3>''' + "".join([
    trick("কৌশল ১ — Phonics Memory Hook (Sound First, Letter Second)",
          "প্রতিটি অক্ষরকে একটি ছবির সাথে যুক্ত করুন (A = Apple, B = Ball)। শুধু অক্ষর মুখস্থ না করিয়ে "
          "<b>আগে ধ্বনি শোনান, পরে অক্ষর দেখান</b> — এটিই Synthetic Phonics পদ্ধতি, যা UK Primary-তে স্ট্যান্ডার্ড।"),
    trick("কৌশল ২ — CVC Blending: \"Robot Reading\"",
          "\"c-a-t\" পড়াতে আঙুল দিয়ে প্রতিটি অক্ষর স্পর্শ করে ধীরে ধীরে জোড়া লাগান: "
          "\"ক্‌ক্‌ক্‌…আ্‌আ্‌…ট্‌ট্‌\" → <b>cat</b>। শিশুরা এই রোবট-গলার খেলাটি খুব পছন্দ করে এবং blending দ্রুত শিখে যায়।"),
    trick("কৌশল ৩ — Comprehension: Picture-First Approach",
          "প্যাসেজ পড়ার আগে ছবি দেখিয়ে prediction করান — \"তুমি কী মনে করো গল্পে কী হবে?\" এরপর পড়ে উত্তর করতে দিন। "
          "প্রাথমিক পাঠক গবেষণা অনুযায়ী এই পদ্ধতিতে কমপ্রিহেনশন স্কোর গড়ে ২৫–৩০% বাড়ে।"),
    trick("কৌশল ৪ — Rhyming: Colour-Coding",
          "ছন্দমিল শব্দের শেষ অংশ একই রঙে দাগ দিতে বলুন — c<b>at</b>, h<b>at</b>, m<b>at</b>। "
          "চোখে দেখা রঙের মিল ধ্বনির মিল চিনতে সাহায্য করে।"),
]) + '''
  <h3 class="sub">SECTION B — Mathematics: ৬টি কৌশল</h3>''' + "".join([
    trick("কৌশল ১ — \"Number Bonds to 10\" (আঙুল পদ্ধতি)",
          "১০-এর জোড়াগুলো (১–৯, ২–৮, ৩–৭, ৪–৬, ৫–৫) আঙুল দিয়ে শেখান। এগুলো মুখস্থ হয়ে গেলে যেকোনো "
          "যোগ-বিয়োগ অনেক দ্রুত হয় — এটাই মানসিক গণিতের ভিত্তি।"),
    trick("কৌশল ২ — যোগের জন্য \"Counting On\"",
          "12 + 5 করতে ছোট সংখ্যা থেকে নয়, <b>বড় সংখ্যা থেকে</b> শুরু করে গুনতে বলুন: 13, 14, 15, 16, 17। "
          "এটি সময় বাঁচায় এবং ভুল কমায়।"),
    trick("কৌশল ৩ — বিয়োগের জন্য \"Counting Back\" ও Number Line",
          "15 − 9 করতে একটি নম্বর লাইন এঁকে 15 থেকে ৯ ঘর পিছনে যেতে বলুন। প্রথমে কাগজে আঁকা লাইন, "
          "কয়েকদিন পর মনে মনে (mental number line)।"),
    trick("কৌশল ৪ — Place Value: \"Bundling\" পদ্ধতি",
          "১০টি করে কাঠি/স্টিক রাবার দিয়ে বেঁধে \"দশক\" বানান, একক আলাদা রাখুন। 47 = ৪ বান্ডিল + ৭ একক। "
          "হাতে ধরে দেখলে বিমূর্ত স্থানীয় মান দৃশ্যমান হয়ে যায়।"),
    trick("কৌশল ৫ — Skip Counting: ছন্দ ও গান",
          "২, ৪, ৬, ৮… গানের সুরে বা তালি দিয়ে শেখান। Rhythm + Repetition = দীর্ঘমেয়াদি স্মৃতিতে গেঁথে যাওয়া।"),
    trick("কৌশল ৬ — Word Problem: RUCSAC পদ্ধতি",
          "<b>R</b>ead (পড়ো) → <b>U</b>nderline (সংখ্যায় দাগ দাও) → <b>C</b>hoose (যোগ না বিয়োগ?) → "
          "<b>S</b>olve → <b>A</b>nswer → <b>C</b>heck। প্রতিবার জিজ্ঞেস করুন: \"সংখ্যা কি বাড়ছে না কমছে?\""),
]) + '''
  <div class="pagefoot"><span>Best Tricks — Day 1–10 (Section A &amp; B)</span><span>শিক্ষক নির্দেশিকা</span></div>
</section>

<section class="paper">
  <h3 class="sub" style="margin-top:0">SECTION C — Analytical Ability: ৬টি কৌশল (Day 1–10)</h3>''' + "".join([
    trick("কৌশল ১ — Odd One Out: \"Similarity First, Difference Second\"",
          "শিশুকে আগে জিজ্ঞেস করুন — \"এই ৩টির মধ্যে <b>মিল</b> কী?\" মিলটা বের হয়ে গেলে (যেমন: সবগুলো ফল) "
          "যেটির মিল নেই সেটি নিজে থেকেই চোখে পড়ে।"),
    trick("কৌশল ২ — Pattern: \"Say It Out Loud\"",
          "প্যাটার্ন দেখে জোরে জোরে বলতে বলুন — \"লাল, নীল, লাল, নীল…\" মুখে বলার সময় পরেরটি নিজে থেকেই বলে ফেলে। "
          "Verbal rehearsal প্যাটার্ন চেনার ক্ষমতা শক্তিশালী করে।"),
    trick("কৌশল ৩ — AAB / AABB প্যাটার্ন: Clapping Method",
          "হাততালি দিয়ে ছন্দ বোঝান — 👏👏(বিরতি) 👏👏(বিরতি)। ৬–৭ বছর বয়সে শারীরিক ছন্দ দিয়ে বিমূর্ত প্যাটার্ন "
          "বোঝানো সবচেয়ে কার্যকর।"),
    trick("কৌশল ৪ — Analogy: \"Relationship Bridge\"",
          "\"Bird : Sky :: Fish : ?\" বোঝাতে বলুন — \"পাখি কোথায় থাকে? আকাশে। তাহলে মাছ কোথায় থাকে?\" "
          "সম্পর্কটি আগে মুখে বাক্য করে বলান, তারপর উত্তর।"),
    trick("কৌশল ৫ — Sequencing: \"Story Picture\"",
          "ধাপগুলোকে ছোট গল্প হিসেবে বলতে বলুন — \"প্রথমে কী হলো? তারপর?\" এটি temporal reasoning তৈরি করে, "
          "যা পরে বিজ্ঞান ও বহু-ধাপ গণিতে কাজে লাগে।"),
    trick("কৌশল ৬ — Grid Pattern: \"Row–Column Scan\"",
          "প্রথমে সারি ধরে বাম → ডান, তারপর কলাম ধরে উপর → নিচ scan করান। দুই দিক থেকে নিয়ম মিলিয়ে উত্তর বের করা — "
          "এটাই প্রকৃত IQ টেস্টের মূল কৌশল।"),
]) + '''
  <div class="note"><b>মনে রাখুন:</b> Section C-তে ভুল হলে উত্তর বলে দেবেন না — প্রশ্ন করুন
  ("তুমি কীভাবে ভাবলে?")। চিন্তার প্রক্রিয়ার প্রশংসা (process praise) করলে যুক্তি-ক্ষমতা দ্রুত বাড়ে।</div>
  <div class="pagefoot"><span>Best Tricks — Day 1–10 (Section C)</span><span>শিক্ষক নির্দেশিকা</span></div>
</section>'''


TRICKS_11_20 = '''<section class="paper">
  <h2 class="big">ব্যাখ্যা ও শেখানোর সেরা কৌশল — Day 11 – Day 20</h2>

  <h3 class="sub">SECTION A — English: ৫টি কৌশল</h3>''' + "".join([
    trick("কৌশল ১ — Plural: \"S Family / ES Family\" কার্ড",
          "সাধারণ শব্দে শুধু <b>s</b> (cat → cats), কিন্তু s, x, ch, sh দিয়ে শেষ হলে <b>es</b> (box → boxes)। "
          "দুই রঙের কার্ডে ভাগ করুন — লাল কার্ড \"S Family\", নীল কার্ড \"ES Family\"।"),
    trick("কৌশল ২ — Wh-Question: \"5W Finger\" পদ্ধতি",
          "এক হাতের পাঁচ আঙুলে Who, What, Where, When, Why লিখে রাখুন। প্যাসেজ পড়ার পর প্রতিটি আঙুল ছুঁয়ে "
          "প্রশ্ন তৈরি করতে বলুন — প্রশ্ন গঠনের কাঠামো দ্রুত শক্তিশালী হয়।"),
    trick("কৌশল ৩ — Article a/an: \"Vowel Song\"",
          "\"A, E, I, O, U — apple বলতে an লাগবে তুই\" — ছড়ার আকারে শেখান। স্বরবর্ণ দিয়ে শুরু শব্দের "
          "প্রথম অক্ষরে লাল বৃত্ত দিতে বলুন, visual cue তৈরি হবে।"),
    trick("কৌশল ৪ — Digraph (sh, ch, th): \"Sound Pair\"",
          "দুটি হাত একসাথে চেপে একটি নতুন শব্দ (হাততালি) তৈরি করে দেখান — দুটি অক্ষর মিলে একটি নতুন ধ্বনি। "
          "sh = ঠোঁটে আঙুল রেখে \"শ্‌শ্‌\", ch = হাঁচির মতো \"চ\"।"),
    trick("কৌশল ৫ — Capital Letter + Full Stop: \"Traffic Signal\"",
          "বাক্যের শুরু = সবুজ বাতি (Capital Letter দিয়ে চলা শুরু), বাক্যের শেষ = লাল বাতি (Full Stop দিয়ে থামা)। "
          "এই রূপকটি শিশুরা সহজে মনে রাখে।"),
]) + '''
  <h3 class="sub">SECTION B — Mathematics: ৫টি কৌশল</h3>''' + "".join([
    trick("কৌশল ১ — Multiplication: \"Groups of\" পদ্ধতি",
          "\"2 × 3\" মানে \"২-এর ৩টি দল\" — ৩টি প্লেটে ২টি করে বিস্কুট রেখে গুনতে বলুন। "
          "Repeated Addition (2+2+2) থেকে Multiplication (2×3)-এ পরিবর্তনই মূল লক্ষ্য।"),
    trick("কৌশল ২ — Halving: \"Fair Share\" পদ্ধতি",
          "\"Half of 14\" বোঝাতে ১৪টি বস্তু হাতে হাতে দুই ভাগে সমানভাবে বিলি করতে বলুন। "
          "ভাগের (division) প্রাথমিক ভিত্তি এখান থেকেই তৈরি হয়।"),
    trick("কৌশল ৩ — Carry Addition: \"House Method\"",
          "দুটি কলাম আঁকুন (দশক | একক) — যেন দুটি ঘর। একক ঘরে যোগফল ১০ ছাড়ালে ১টি \"টিকিট\" (carry) "
          "দশক ঘরে পাঠানো হয় — গল্পের আকারে শেখালে ধারণা পরিষ্কার হয়।"),
    trick("কৌশল ৪ — Time: \"Big Hand, Small Hand\" নিয়ম",
          "ছোট কাঁটা = ঘণ্টা, বড় কাঁটা = মিনিট। বড় কাঁটা ১২-এ থাকলে \"o'clock\", ৬-এ থাকলে \"half past\"। "
          "চলমান কাঁটাযুক্ত কাগজের ঘড়ি বানিয়ে অনুশীলন করানোই সবচেয়ে কার্যকর।"),
    trick("কৌশল ৫ — Number Bonds to 20: \"Ten Frame\"",
          "১০ ঘরের দুটি গ্রিড এঁকে দিন। একটি সংখ্যা পূরণ করলে বাকি ঘর গুনেই উত্তর বেরিয়ে আসে — "
          "বিমূর্ত যোগ-বিয়োগ দৃশ্যমান হয়ে যায়।"),
]) + '''
  <div class="pagefoot"><span>Best Tricks — Day 11–20 (Section A &amp; B)</span><span>শিক্ষক নির্দেশিকা</span></div>
</section>

<section class="paper">
  <h3 class="sub" style="margin-top:0">SECTION C — Analytical Ability: ৬টি কৌশল (Day 11–20)</h3>''' + "".join([
    trick("কৌশল ১ — Rotation / Mirror Image: \"Physical Flip\"",
          "কাগজে আকৃতি এঁকে সত্যিই ঘুরিয়ে/উল্টে দেখান। বিমূর্ত কল্পনার আগে হাতে ধরে ঘোরানো ৬–৭ বছর বয়সীদের "
          "জন্য আবশ্যক — এটি Piaget-এর Concrete Operational পর্যায়ের মূলনীতি।"),
    trick("কৌশল ২ — Analogy: \"Complete the Sentence\"",
          "\"Bird is to Sky as Fish is to ___\" — প্রতিবার সম্পূর্ণ বাক্য বলিয়ে নিন। বাক্য গঠনের মাধ্যমেই সম্পর্কটি স্পষ্ট হয়।"),
    trick("কৌশল ৩ — Coding–Decoding: \"Number–Letter Ladder\"",
          "A–Z কে ১–২৬ পর্যন্ত একটি মইয়ের মতো দেয়ালে টাঙিয়ে রাখুন। শিশু আঙুল দিয়ে গুনে অক্ষর/সংখ্যা বের করবে — "
          "working memory-র ওপর চাপ কমে যায়।"),
    trick("কৌশল ৪ — Growth Sequence: \"Life Cycle Story\"",
          "সিকোয়েন্স মুখস্থ না করিয়ে ছোট গল্প বলুন: \"প্রথমে বীজ মাটিতে থাকে, পানি পেয়ে চারা হয়, তারপর ফুল ফোটে…\" "
          "গল্পের যুক্তিক্রম থেকেই ধাপগুলো মনে থাকে।"),
    trick("কৌশল ৫ — Abstract Odd One Out: \"Category Label\"",
          "প্রতিটি বিকল্পে লেবেল দিতে শেখান: \"Whisper = শব্দের মাত্রা, Shout = শব্দের মাত্রা, Talk = শব্দের মাত্রা, "
          "Jump = কাজ\" — তাই Jump আলাদা। এই labeling কৌশলই abstract reasoning গড়ে তোলে।"),
    trick("কৌশল ৬ — Logical Deduction: \"Ladder Ranking\"",
          "তিনজনের নাম কাগজে সিঁড়ির মতো সাজাতে বলুন — সবচেয়ে লম্বা উপরে, খাটো নিচে। "
          "দৃশ্যমান ranking \"taller than\" সম্পর্ক বোঝা সহজ করে দেয়।"),
]) + '''
  <div class="pagefoot"><span>Best Tricks — Day 11–20 (Section C)</span><span>শিক্ষক নির্দেশিকা</span></div>
</section>'''

# --------------------------------------------------------------------------- #
# 30-day master tracking sheet
# --------------------------------------------------------------------------- #
def track_rows(start, end):
    rows = []
    for i in range(start, end + 1):
        mark = " 🏁" if i in (7, 14, 21) else (" 🏆" if i == 30 else "")
        rows.append(f'<tr><td class="d">{bn(i)}{mark}</td><td></td><td></td><td></td>'
                    f'<td></td><td></td><td></td></tr>')
    return "".join(rows)


MASTER_TRACK = '''<section class="paper">
  <h2 class="big">৩০ দিনের প্রোগ্রেস ট্র্যাকিং শিট</h2>
  <div class="note">প্রতিদিন পরীক্ষা শেষ হওয়ার সাথে সাথেই ঘরগুলো পূরণ করুন। 🏁 = সাপ্তাহিক চেকপয়েন্ট,
  🏆 = চূড়ান্ত মূল্যায়ন। এই একটি পাতাই ৩০ দিনের পুরো অগ্রগতির প্রমাণপত্র।</div>

  <div class="cols2">
    <div>
      <table class="ans">
        <tr><th style="width:30px">দিন</th><th>Eng<br>১০</th><th>Math<br>১০</th><th>Ana<br>১০</th><th>মোট<br>৩০</th><th>গ্রেড</th><th>সময়</th></tr>
        ''' + track_rows(1, 15) + '''
      </table>
    </div>
    <div>
      <table class="ans">
        <tr><th style="width:30px">দিন</th><th>Eng<br>১০</th><th>Math<br>১০</th><th>Ana<br>১০</th><th>মোট<br>৩০</th><th>গ্রেড</th><th>সময়</th></tr>
        ''' + track_rows(16, 30) + '''
      </table>
    </div>
  </div>

  <h3 class="sub">সাপ্তাহিক গড় ও চেকপয়েন্ট তুলনা</h3>
  <table class="ans">
    <tr><th>সপ্তাহ</th><th>দিন</th><th>English গড়</th><th>Math গড়</th><th>Analytical গড়</th><th>মোট গড় (৩০)</th><th>চেকপয়েন্ট স্কোর</th><th>প্রবণতা</th></tr>
    <tr><td class="d">১</td><td>১–৭</td><td></td><td></td><td></td><td></td><td>Day 7: ____ / ৩০</td><td>↑ / → / ↓</td></tr>
    <tr><td class="d">২</td><td>৮–১৪</td><td></td><td></td><td></td><td></td><td>Day 14: ____ / ৩০</td><td>↑ / → / ↓</td></tr>
    <tr><td class="d">৩</td><td>১৫–২১</td><td></td><td></td><td></td><td></td><td>Day 21: ____ / ৩০</td><td>↑ / → / ↓</td></tr>
    <tr><td class="d">৪</td><td>২২–৩০</td><td></td><td></td><td></td><td></td><td>Day 30: ____ / ৩০</td><td>↑ / → / ↓</td></tr>
  </table>

  <h3 class="sub">উপ-দক্ষতা ভিত্তিক দুর্বলতা চিহ্নিতকরণ (সপ্তাহ শেষে পূরণ করুন)</h3>
  <table class="ans">
    <tr><th>সপ্তাহ</th><th>সবচেয়ে দুর্বল উপ-দক্ষতা</th><th>সবচেয়ে শক্তিশালী উপ-দক্ষতা</th><th>পরের সপ্তাহের করণীয়</th></tr>
    <tr><td class="d">১</td><td></td><td></td><td></td></tr>
    <tr><td class="d">২</td><td></td><td></td><td></td></tr>
    <tr><td class="d">৩</td><td></td><td></td><td></td></tr>
    <tr><td class="d">৪</td><td></td><td></td><td></td></tr>
  </table>

  <pre class="mono">উন্নতির হার নির্ণয়ের সূত্র:

     উন্নতি (%) = (Day 30 স্কোর − Day 7 Baseline স্কোর) ÷ ৩০ × ১০০

     উদাহরণ: Day 7 = ১৪, Day 30 = ২৫  →  (২৫ − ১৪) ÷ ৩০ × ১০০ = ৩৬.৬% উন্নতি

লক্ষ্যমাত্রা: প্রতিটি সেকশনে ৮/১০ এবং মোট ২৪/৩০</pre>

  <div class="pagefoot"><span>৩০ দিনের প্রোগ্রেস ট্র্যাকিং</span><span>Day 1–30 Workbook</span></div>
</section>'''

# --------------------------------------------------------------------------- #
# Assemble
# --------------------------------------------------------------------------- #
def main():
    days_21_30 = P3[1:11]
    ak_21_30 = P3[11]
    tricks_21_30 = P3[12] + "\n" + P3[13]
    final_analysis = P3[14]

    body = [COVER, MATRIX, GUIDE]
    body += [worksheet(d) for d in d1.DAYS]
    body += [worksheet(d) for d in d2.DAYS]
    body += days_21_30
    body += [AK_1_10, AK_11_20, ak_21_30]
    body += [TRICKS_1_10, TRICKS_11_20, tricks_21_30]
    body += [MASTER_TRACK, final_analysis]

    html = HEAD + "<body>\n" + "\n\n".join(body) + "\n</body>\n</html>\n"
    open(OUT, "w", encoding="utf-8").write(html)
    print("sections:", html.count('<section class="paper">'), "->", OUT)


if __name__ == "__main__":
    main()
