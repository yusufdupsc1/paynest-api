# -*- coding: utf-8 -*-
import sys

sys.path.insert(0, "/home/user/paynest-api/worksheets")
from wb_lib import worksheet, opt, passage_box

OUT = "/home/user/paynest-api/worksheets/day-91-120-revision.html"

DAYS = []
ANS_DATA = {}

# 10 Expert Pedagogical Themes to loop 3 times (Level 1, 2, 3) = 30 Distinct Daily Tests
themes = [
    ("ERROR ANALYSIS", "ভুল খুঁজে বের করা (Find the Mistake)"),
    ("REVERSE ENGINEERING", "উত্তর থেকে প্রশ্ন তৈরি (Work Backwards)"),
    ("MISSING LINK", "হারানো তথ্য বা লজিক খোঁজা (Deduce the Missing)"),
    ("CATEGORIZATION", "শ্রেণিবিন্যাস ও সাদৃশ্য-বৈসাদৃশ্য (Sorting & Odd-One-Out)"),
    ("REAL-WORLD MATH", "বাস্তব জীবনের প্রয়োগ (Application in Daily Life)"),
    ("VISUAL SPATIAL", "দৃশ্যমান ও স্থানিক যুক্তি (Mental Rotation & Diagrams)"),
    ("CODING & DECODING", "সংকেত ও সমাধান (Symbolic Substitution)"),
    ("MULTI-STEP LOGIC", "বহু-ধাপের সমস্যা (2 or 3 Step Problem Solving)"),
    ("PREDICTIVE THINKING", "পরবর্তী ধাপ অনুমান (What Happens Next?)"),
    ("SPEED & AGILITY", "দ্রুত চিন্তা ও সিদ্ধান্ত (Rapid Fire Mock Test)")
]

def get_questions(theme_idx, level, d):
    # theme_idx: 0 to 9, level: 1 to 3
    A, B, C = [], [], []
    ans_a, ans_b, ans_c = "", "", ""
    
    if theme_idx == 0: # ERROR ANALYSIS
        a_q = [f"The dogs is barking.", f"Yesterday I go to school.", f"The bird fly under the sky."][level-1]
        a_ans = [f"is এর জায়গায় are বসবে", f"go এর জায়গায় went বসবে", f"under এর জায়গায় in/over বসবে"][level-1]
        b_q = [f"15 + 12 = 25", f"34 - 18 = 26", f"Half of 50 is 20"][level-1]
        b_ans = [f"সঠিক: 27 (Carry 1 যোগ হয়নি)", f"সঠিক: 16 (Borrow ভুল হয়েছে)", f"সঠিক: 25"][level-1]
        c_q = [f"Pattern: 2, 4, 7, 8", f"Square has 3 sides", f"North's opposite is East"][level-1]
        c_ans = [f"7 ভুল, 6 হবে", f"3 ভুল, 4 sides হবে", f"East ভুল, South হবে"][level-1]
        
        A = [("A. Spot the Error (Grammar)", "১০", {}, [(f'কোথায় ভুল আছে ঠিক করো: "{a_q}"', "১০")])]
        B = [("B. Math Error Analysis", "১০", {}, [(f'শিক্ষার্থী লিখেছে: {b_q}। এটি কি ঠিক? ভুল কোথায়?', "১০")])]
        C = [("C. Logic Error Analysis", "১০", {}, [(f'ভুল লজিকটি ঠিক করো: {c_q}', "১০")])]
        ans_a, ans_b, ans_c = a_ans, b_ans, c_ans
        trick = "Error Analysis Trick: উত্তর খোঁজার বদলে 'কী ভুল হতে পারে' ভাবলে ব্রেইন দ্রুত কাজ করে (Critical Thinking)।"
        
    elif theme_idx == 1: # REVERSE ENGINEERING
        a_q = [f"Answer: 'Blue'. Question: What ___ is the sky?", f"Answer: 'Played'. Root verb is ___?", f"Answer: 'Because it is hot.' Question starts with ___?"][level-1]
        a_ans = [f"Color", f"Play", f"Why"][level-1]
        b_q = [f"Answer is 20. Write an Addition: ___ + ___ = 20", f"Answer is 15. Write a Subtraction: ___ - ___ = 15", f"Answer is Quarter. What fraction is it? ___/___"][level-1]
        b_ans = [f"10+10 বা 15+5 (যেকোনো সঠিক যোগ)", f"25-10 বা 20-5 (যেকোনো সঠিক বিয়োগ)", f"1/4"][level-1]
        c_q = [f"Answer is 'd'. What letter was in the mirror?", f"Result is 'BAT'. If A=1, B=2, T=20, code is?", f"End facing West after turning Left. Where did you start?"][level-1]
        c_ans = [f"b (আয়নায় b উল্টে d হয়)", f"2, 1, 20", f"North (North থেকে বামে ঘুরলে West হয়)"][level-1]
        
        A = [("A. Reverse Grammar", "১০", {}, [(a_q, "১০")])]
        B = [("B. Reverse Math", "১০", {}, [(b_q, "১০")])]
        C = [("C. Reverse Logic", "১০", {}, [(c_q, "১০")])]
        ans_a, ans_b, ans_c = a_ans, b_ans, c_ans
        trick = "Reverse Engineering Trick: উল্টোদিক থেকে ভাবলে (Working Backwards) সমস্যা সমাধানের নতুন পথ খোলে। এটি অলিম্পিয়াডের অন্যতম প্রধান কৌশল।"

    elif theme_idx == 2: # MISSING LINK
        A = [("A. Missing Words", "১০", {}, [(f'Fill in: The cat sleeps ___ the table.', "১০")])]
        B = [("B. Missing Numbers", "১০", {}, [(f'{[ "15 + __ = 25", "100 - __ = 60", "__ x 4 = 32" ][level-1]}', "১০")])]
        C = [("C. Missing Sequence", "১০", {}, [(f'{[ "2, 4, __, 8", "A, C, __, G", "1A, 2B, __, 4D" ][level-1]}', "১০")])]
        ans_a = "under / on"
        ans_b = [f"10", f"40", f"8"][level-1]
        ans_c = [f"6", f"E", f"3C"][level-1]
        trick = "Missing Link Trick: আগের এবং পরের তথ্যের মাঝে সম্পর্ক (Relation) খুঁজলেই হারানো অংশটি পাওয়া যায়।"

    elif theme_idx == 3: # CATEGORIZATION
        A = [("A. Noun vs Verb", "১০", {}, [(f'Odd one out: {[ "Run, Jump, Apple, Play", "Quick, Slow, Fast, Boy", "In, On, Under, Dog" ][level-1]}', "১০")])]
        B = [("B. Math Sorting", "১০", {}, [(f'Odd one out: {[ "10, 20, 25, 30", "12, 14, 15, 18", "Oclock, Minute, Taka, Hour" ][level-1]}', "১০")])]
        C = [("C. Venn Logic", "১০", {}, [(f'{[ "Animals that fly vs swim. Where is Duck?", "Shapes with corners vs round. Where is Oval?", "Living vs Non-living. Where is Tree?" ][level-1]}', "১০")])]
        ans_a = [f"Apple (Noun)", f"Boy (Noun)", f"Dog (Noun)"][level-1]
        ans_b = [f"25 (10 দিয়ে ভাগ যায় না)", f"15 (বিজোড় সংখ্যা)", f"Taka (সময়ের একক নয়)"][level-1]
        ans_c = [f"মাঝখানে (উভয় গুণ আছে)", f"Round-এ (কোনো কোণ নেই)", f"Living-এ (গাছ জীবন্ত)"][level-1]
        trick = "Categorization Trick: শ্রেণিবিন্যাস বা Odd-One-Out করতে হলে আগে সবগুলোর 'সাধারণ গুণ' (Common property) বের করতে হয়।"

    elif theme_idx == 4: # REAL-WORLD MATH
        A = [("A. Real-world Comprehension", "১০", {"passage": passage_box(["I went to the shop. I bought milk and bread."])}, [(f'Where did I go and why?', "১০")])]
        B = [("B. Money & Time", "১০", {}, [(f'{[ "You have 50Tk. Buy toy for 30Tk. Change?", "Start at 9:00. Play 2 hours. End time?", "Buy 3 pens, 10Tk each. Pay 50Tk. Change?" ][level-1]}', "১০")])]
        C = [("C. Scenario Logic", "১০", {}, [(f'{[ "Shadow is shortest at what time? (Morning/Noon)", "If today is Sunday, trip is in 3 days. What day?", "5 people in room, 2 leave, 3 enter. How many now?" ][level-1]}', "১০")])]
        ans_a = "To the shop, to buy milk and bread."
        ans_b = [f"20 Tk", f"11:00 O'clock", f"20 Tk"][level-1]
        ans_c = [f"Noon (দুপুর)", f"Wednesday (বুধবার)", f"6 people (5-2+3)"][level-1]
        trick = "Real-World Trick: অংককে নিজের জীবনের গল্পের মতো কল্পনা করলে (Visualization) সমাধান অনেক সহজ হয়ে যায়।"

    elif theme_idx == 5: # VISUAL SPATIAL
        A = [("A. Visual Description", "১০", {}, [(f'{[ "Spell the word for shape ⬛", "Describe an Egg", "Opposite of Inside is __" ][level-1]}', "১০")])]
        B = [("B. Geometric Math", "১০", {}, [(f'{[ "How many corners in 2 triangles?", "1/4 of a circle looks like a slice of __", "Cut a square diagonally -> two __" ][level-1]}', "১০")])]
        
        q1 = "Mirror image of 'p' is?"
        q2 = "Rotate ↑ 90 degrees Right -> ?"
        q3 = "Fold paper half, punch 1 hole, unfold -> holes?"
        
        C = [("C. Spatial Rotation", "১০", {}, [(f'{[q1, q2, q3][level-1]}', "১০")])]
        ans_a = [f"Square", f"Oval (ডিম্বাকৃতি)", f"Outside"][level-1]
        ans_b = [f"6 (3+3)", f"Pizza / Watermelon", f"Triangles (ত্রিভুজ)"][level-1]
        ans_c = [f"q", f"→ (East)", f"2 holes"][level-1]
        trick = "Spatial Trick: জ্যামিতি বা মিরর ইমেজের প্রশ্নগুলো সবসময় হাতে এঁকে (Draw it out) বা হাত ঘুরিয়ে প্র্যাকটিস করতে হয়।"

    elif theme_idx == 6: # CODING & DECODING
        A = [("A. Word Coding", "১০", {}, [(f'{[ "Unscramble: A-T-C", "Rhyme code: Rhymes with Cat, starts with B", "Secret message: h-e-l-l-o -> ?" ][level-1]}', "১০")])]
        B = [("B. Symbol Math", "১০", {}, [(f'{[ "+ means -, - means +. Solve 5 + 2 = ?", "A=10, B=20. A+B = ?", "♥=5, ♦=2. ♥ + ♦ = ?" ][level-1]}', "১০")])]
        C = [("C. Logic Substitution", "১০", {}, [(f'{[ "If Green=Stop, Red=Go. What to do at Red?", "ONE=3, TWO=3, THREE=5. FOUR=?", "M O N K E Y -> Y E K N O M. Reverse T I G E R" ][level-1]}', "১০")])]
        ans_a = [f"CAT", f"BAT", f"HELLO"][level-1]
        ans_b = [f"3 (যেহেতু + মানে -)", f"30", f"7"][level-1]
        ans_c = [f"Go", f"4 (অক্ষর সংখ্যা)", f"R E G I T"][level-1]
        trick = "Coding Trick: কোডিং-এর প্রশ্নে আসল শব্দের বদলে সংকেতের নিয়মটি (Rule) আগে ধরতে হয়। A=1 হলে B=2 হবে, এটাই নিয়ম।"

    elif theme_idx == 7: # MULTI-STEP LOGIC
        A = [("A. Sequence of Events", "১০", {}, [(f'{[ "First I ate, then I slept. What last?", "Combine: I am hungry. I will eat. (so/but)", "Order: Sleeping, Waking up, Brushing" ][level-1]}', "১০")])]
        B = [("B. 2-Step Arithmetic", "১০", {}, [(f'{[ "Add 5 and 5, then subtract 2.", "Half of 20, then multiply by 3.", "3 groups of 4, plus 2 extra. Total?" ][level-1]}', "১০")])]
        C = [("C. Logic Chains", "১০", {}, [(f'{[ "Turn left, step 2, turn right, step 2.", "A taller than B, B taller than C. Shortest?", "1st letter of BAT, 2nd of CAT, 3rd of MAT. Word?" ][level-1]}', "১০")])]
        ans_a = [f"Slept", f"so", f"Waking up -> Brushing -> Sleeping"][level-1]
        ans_b = [f"8", f"30", f"14 (3x4 + 2)"][level-1]
        ans_c = [f"Go forward in steps", f"C", f"B-A-T (BAT)"][level-1]
        trick = "Multi-Step Trick: বহু-ধাপের অংক একবারে পড়া যাবে না। কমা (,) পর্যন্ত পড়ে একটা ধাপ খাতায় লিখে তারপর পরের ধাপে যেতে হয়।"

    elif theme_idx == 8: # PREDICTIVE THINKING
        A = [("A. Sentence Prediction", "১০", {}, [(f'{[ "It is raining, so I will take an __", "If hot->cold, day->__", "The glass fell. It will __" ][level-1]}', "১০")])]
        B = [("B. Sequence Prediction", "১০", {}, [(f'{[ "10, 20, 30, __", "Plant is 2cm. Grows 1cm daily. In 3 days?", "Save 5Tk daily. In a week (7 days)?" ][level-1]}', "১০")])]
        C = [("C. Logic Prediction", "১০", {}, [(f'{[ "○, ○○, ○○○, ?", "Now 2 Oclock. After 3 hours?", "Tomorrow is Friday. Yesterday was?" ][level-1]}', "১০")])]
        ans_a = [f"Umbrella", f"Night", f"Break (ভাঙবে)"][level-1]
        ans_b = [f"40", f"5cm (2+3)", f"35 Tk (5x7)"][level-1]
        ans_c = [f"○○○○ (4টি গোল)", f"5 O'clock", f"Wednesday (বুধবার)"][level-1]
        trick = "Predictive Trick: অনুমানের ক্ষেত্রে প্যাটার্নের প্রথম দুটি অংশ দেখে নিয়মটি ধরতে হয়, তারপর তা ভবিষ্যতে প্রয়োগ করতে হয়।"

    elif theme_idx == 9: # SPEED & AGILITY
        A = [("A. Rapid Grammar", "১০", {}, [(f'Write plural of Child, Mouse, Tooth quickly!', "১০")])]
        B = [("B. Rapid Math", "১০", {}, [(f'{[ "5x5=?, 100-20=?, Half of 50=?", "4x8=?, 250+50=?, Quarter of 20=?", "6x6=?, 300-150=?, 10Tk x 5 notes=?" ][level-1]}', "১০")])]
        C = [("C. Rapid Logic", "১০", {}, [(f'{[ "Sun rises in __, Sets in __", "3 sides=Triangle, 4 sides=__", "A=1, Z=__" ][level-1]}', "১০")])]
        ans_a = "Children, Mice, Teeth"
        ans_b = [f"25, 80, 25", f"32, 300, 5", f"36, 150, 50"][level-1]
        ans_c = [f"East, West", f"Square/Rectangle", f"26"][level-1]
        trick = "Speed Trick: দ্রুত উত্তরের ক্ষেত্রে নার্ভাস না হয়ে আগে সহজ অংশটি করে ফেলতে হয়, ব্রেইন অটোমেটিক স্পিড বাড়িয়ে নেয়।"

    return A, B, C, ans_a, ans_b, ans_c, trick

for d in range(91, 121):
    level = (d - 91) // 10 + 1  # 1 for 91-100, 2 for 101-110, 3 for 111-120
    theme_idx = (d - 91) % 10
    theme_title, theme_desc = themes[theme_idx]
    
    sub = f"DAY {d}: {theme_title} (Lvl {level})"
    if d == 120:
        sub = "DAY 120: OLYMPIAD GRAND FINALE"
        
    A, B, C, ans_a, ans_b, ans_c, trick = get_questions(theme_idx, level, d)
    
    DAYS.append(dict(
        n=d, sub=sub, foot=f"Day {d} • {theme_title}",
        A=A, B=B, C=C
    ))
    
    ANS_DATA[d] = {
        "A": ans_a, "B": ans_b, "C": ans_c, "trick": trick
    }

HTML_HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4; margin: 0; }
  body { margin: 0; padding: 0; font-family: 'Noto Sans Bengali', sans-serif; font-size: 13px; line-height: 1.4; color: #111; }
  .paper { width: 100%; height: 297mm; box-sizing: border-box; padding: 15mm 20mm; position: relative; page-break-after: always; background: #fff; }
  h1 { font-size: 26px; text-align: center; color: #1a365d; margin: 0 0 10px 0; border-bottom: 2px solid #1a365d; padding-bottom: 5px; }
  h2.big { font-size: 24px; text-align: center; color: #2b6cb0; margin-top: 30px; }
  h3.sub { font-size: 15px; color: #fff; background: #2b6cb0; padding: 4px 10px; margin: 10px 0 10px 0; border-radius: 4px; }
  .sec { margin-bottom: 20px; }
  .sec h4 { font-size: 14px; font-weight: bold; color: #2c5282; margin: 0 0 5px 0; border-bottom: 1px dashed #cbd5e0; padding-bottom: 2px; }
  .q { display: flex; margin-bottom: 5px; }
  .q .idx { width: 25px; font-weight: bold; color: #4a5568; }
  .q .txt { flex: 1; font-size: 15px; padding-bottom: 50px; border-bottom: 1px dotted #e2e8f0; margin-top: 15px;}
  .q .mk { width: 35px; text-align: right; color: #718096; font-size: 11px; }
  .hintbox { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 8px; margin-bottom: 10px; border-radius: 4px; font-size: 12px; font-weight: bold; text-align: center; color: #276749;}
  .passbox { border: 1px solid #e2e8f0; background: #f8fafc; padding: 8px; font-style: italic; margin-bottom: 8px; border-radius: 4px; }
  .pagefoot { position: absolute; bottom: 15mm; left: 20mm; right: 20mm; border-top: 1px solid #cbd5e0; padding-top: 5px; display: flex; justify-content: space-between; font-size: 11px; color: #a0aec0; }
  
  .ans-box { font-size: 11.5px; border: 1px solid #e2e8f0; padding: 10px; margin-bottom: 15px; background: #fafafa; border-radius: 6px; break-inside: avoid; }
  .ans-box h4 { margin: 0 0 8px 0; color: #2b6cb0; border-bottom: 2px solid #e2e8f0; padding-bottom: 3px; font-size: 14px; }
  .ans-row { margin-bottom: 6px; }
  .ans-row b { color: #2d3748; }
  .trick-row { margin-top: 8px; padding: 6px; background: #ebf8ff; border-left: 3px solid #3182ce; color: #2b6cb0; font-style: italic;}
</style>
</head>
<body>
"""

HTML_COVER = """<section class="paper">
  <br><br><br><br>
  <h1 style="font-size: 36px; border:none; text-align: center;">EXPERT RESEARCHER EDITION</h1>
  <h2 style="font-size: 24px; color: #4a5568; text-align: center;">90-DAY MASTERY & REVISION (DAY 91 – 120)</h2>
  <br><br>
  <div style="text-align: center; font-size: 16px; color: #2d3748; line-height: 1.6;">
    <p>Target Age: 6-7 Years (Solidifying Cognitive Skills)</p>
    <p>30 Days = 30 Distinct Pedagogical Formats</p>
    <p>Daily Format: 30 Marks (English 10, Math 10, Logic 10)</p>
  </div>
  <br><br><br>
  <div style="margin: 0 40px; padding: 20px; border: 2px solid #38a169; background: #f0fff4; border-radius: 8px;">
    <h3 style="color: #276749; margin-top:0;">10 Rotating Pedagogical Themes (Level 1 to 3)</h3>
    <ol style="font-size: 14px; color: #2f855a; line-height: 1.5; margin-bottom:0;">
      <li><b>Error Analysis</b> (ভুল ধরা)</li>
      <li><b>Reverse Engineering</b> (উল্টো পথে হাঁটা)</li>
      <li><b>Missing Link</b> (হারানো তথ্য খোঁজা)</li>
      <li><b>Categorization</b> (শ্রেণিবিন্যাস)</li>
      <li><b>Real-World Application</b> (বাস্তব জীবনের প্রয়োগ)</li>
      <li><b>Visual & Spatial</b> (দৃশ্যমান যুক্তি)</li>
      <li><b>Coding & Decoding</b> (সংকেত ও সমাধান)</li>
      <li><b>Multi-Step Logic</b> (বহু-ধাপের সমস্যা)</li>
      <li><b>Predictive Thinking</b> (পরবর্তী ধাপ অনুমান)</li>
      <li><b>Speed & Agility</b> (দ্রুত সমাধান)</li>
    </ol>
  </div>
  <div class="pagefoot"><span>PayNest API / Arena.ai</span><span>Expert Revision</span></div>
</section>
"""

html_parts = [HTML_HEAD, HTML_COVER]

for day in DAYS:
    d = day['n']
    t_idx = (d - 91) % 10
    thm = themes[t_idx]
    
    html_parts.append(f'<section class="paper">')
    html_parts.append(f'<h2 class="big" style="margin-top: 0;">{day["sub"]}</h2>')
    html_parts.append(f'<div class="hintbox">আজকের ফোকাস: {thm[1]}</div>')
    
    # Render sections directly
    for sec_name, data in [("Section A: English (10 Marks)", day["A"]), ("Section B: Math (10 Marks)", day["B"]), ("Section C: Analytical (10 Marks)", day["C"])]:
        html_parts.append(f'<div class="sec"><h3 class="sub">{sec_name}</h3>')
        for group in data:
            title, marks, extras, qs = group
            if 'passage' in extras:
                html_parts.append(extras['passage'])
            for q, m in qs:
                html_parts.append(f'<div class="q"><div class="txt">{q}</div></div>')
        html_parts.append('</div>')
        
    html_parts.append(f'<div class="pagefoot"><span>{day["foot"]}</span></div></section>')

# Answer Key Section
html_parts.append("""
<section class="paper">
  <h2 class="big">নির্ভুল উত্তর, ব্যাখ্যা ও ট্রিকস (Day 91-120)</h2>
  <p style="text-align:center; color:#4a5568; margin-bottom: 20px;">শিক্ষণকে কংক্রিট করার জন্য উত্তরের সাথে সাথে পেডাগজিক্যাল লজিক দেওয়া হলো।</p>
  <div style='column-count: 2; column-gap: 15px;'>
""")

for d in range(91, 121):
    html_parts.append(f"""
    <div class="ans-box">
      <h4>Day {d} - {themes[(d-91)%10][0]}</h4>
      <div class="ans-row"><b>English:</b> {ANS_DATA[d]["A"]}</div>
      <div class="ans-row"><b>Math:</b> {ANS_DATA[d]["B"]}</div>
      <div class="ans-row"><b>Logic:</b> {ANS_DATA[d]["C"]}</div>
      <div class="trick-row">💡 <b>Focus Trick:</b> {ANS_DATA[d]["trick"]}</div>
    </div>
    """)
    if (d - 90) % 5 == 0 and d != 120:
        html_parts.append("</div></section><section class='paper'><div style='column-count: 2; column-gap: 15px;'>")

html_parts.append("</div>")
html_parts.append("""<div class="pagefoot"><span>Expert Keys</span><span>Revision</span></div></section></body></html>""")

with open(OUT, "w", encoding="utf-8") as f:
    f.write("\n".join(html_parts))

print(f"Generated {OUT}")
