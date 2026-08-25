# -*- coding: utf-8 -*-
import sys
import random

sys.path.insert(0, "/home/user/paynest-api/worksheets")
from wb_lib import worksheet, bn, opt, hint, shapes, method, hintbox, passage_box

OUT = "/home/user/paynest-api/worksheets/day-61-90-workbook.html"

DAYS = []
ANS_DATA = {}

oly_logic = [
    ("একটি বানর ৩ ফুট ওঠে এবং ২ ফুট নিচে নেমে যায়। ৫ ফুট উঠতে কত দিন লাগবে?", "৩ দিন (ব্যাখ্যা: ১ম দিনে ১ ফুট, ২য় দিনে ২ ফুট, ৩য় দিনে ৩ ফুট উঠে ৫ ফুটে পৌঁছাবে।)"),
    ("A, B এর চেয়ে লম্বা। C, A এর চেয়ে লম্বা। সবচেয়ে খাটো কে?", "B (ব্যাখ্যা: C > A > B)"),
    ("৩টি বিড়াল ৩টি ইঁদুর ধরতে ৩ মিনিট সময় নেয়। ১০০টি বিড়াল ১০০টি ইঁদুর ধরতে কত মিনিট নেবে?", "৩ মিনিট (ব্যাখ্যা: প্রতিটি বিড়াল নিজের ইঁদুর ধরতে ৩ মিনিট নেয়।)"),
    ("তোমার কাছে ১০ টাকা আছে। তুমি ৫ টাকার কলম কিনলে। দোকানিকে ২০ টাকা দিলে সে কত ফেরত দেবে?", "১৫ টাকা (ব্যাখ্যা: ২০ - ৫ = ১৫ টাকা ফেরত দেবে। ১০ টাকার তথ্যটি বিভ্রান্ত করার জন্য।)"),
    ("লাল, নীল, সবুজ রং পরপর সাজানো। ১০ নম্বর রং কী হবে?", "লাল (ব্যাখ্যা: ১=লাল, ২=নীল, ৩=সবুজ। ১০ কে ৩ দিয়ে ভাগ করলে ভাগশেষ ১, তাই লাল।)"),
    ("একটি ঘড়িতে ৩টা বাজে। আয়নায় দেখলে কয়টা বাজবে বলে মনে হবে?", "৯টা (ব্যাখ্যা: ১২ - ৩ = ৯)"),
    ("পরপর তিনটি সংখ্যার যোগফল ৬। সংখ্যাগুলো কী কী?", "১, ২, ৩ (ব্যাখ্যা: ১+২+৩=৬)"),
    ("রাম শ্যামের চেয়ে ভারী, যদু রামের চেয়ে হালকা কিন্তু শ্যামের চেয়ে ভারী। মাঝখানে কে?", "যদু (ব্যাখ্যা: রাম > যদু > শ্যাম)"),
    ("একটি পিজ্জাকে ৩ বার কাটলে সর্বোচ্চ কয়টি টুকরো হবে?", "৮ টুকরো (ব্যাখ্যা: অলিম্পিয়াড কাট ফর্মুলা)"),
    ("যদি আজ সোমবার হয়, ১০ দিন পর কী বার হবে?", "বৃহস্পতিবার (ব্যাখ্যা: ১০ কে ৭ দিয়ে ভাগ করলে ভাগশেষ ৩। সোম + ৩ = বৃহস্পতি)")
]

adverbs = [("quickly", "quick"), ("slowly", "slow"), ("loudly", "loud"), ("happily", "happy")]
verbs_past = [("went", "go"), ("played", "play"), ("ate", "eat"), ("saw", "see")]
conjunctions = [("because", "but"), ("and", "or"), ("but", "so")]

for d in range(61, 91):
    sub = f"MONTH 3 ADVANCED (DAY {d})"
    if d == 90:
        sub = "FINAL ASSESSMENT (MONTH 3)"
    
    adv_c, adv_w = random.choice(adverbs)
    v_c, v_w = random.choice(verbs_past)
    conj_c, conj_w = random.choice(conjunctions)
    oly_q, oly_a = oly_logic[d % len(oly_logic)]
    
    mul_a = random.randint(6, 9)
    mul_b = random.randint(3, 9)
    div_a = random.randint(4, 9)
    div_b = random.randint(2, 5)
    
    # Each group in wb_lib expects: (title, marks, dict_of_extras, list_of_questions)
    # The error was because I only provided a string, not a list of 1 tuple.
    
    A_qs = [
        ("A1. Adverbs (How?)", "৩ নম্বর", {}, [
            (f'The dog runs {opt(f"({adv_c} / {adv_w})")}.', "৩")
        ]),
        ("A2. Past Tense", "৩ নম্বর", {}, [
            (f'Yesterday, we {opt(f"({v_c} / {v_w})")} to the park.', "৩")
        ]),
        ("A3. Conjunctions", "২ নম্বর", {}, [
            (f'I am happy {opt(f"({conj_c} / {conj_w})")} I won.', "২")
        ]),
        ("A4. Sentence Making", "২ নম্বর", {}, [
            (f'Write a sentence with <b>{adv_c}</b>: __________', "২")
        ])
    ]
    A_ans = [
        f"{adv_c} (ব্যাখ্যা: 'কীভাবে' দৌড়ায় বোঝাতে adverb -ly বসে)",
        f"{v_c} (ব্যাখ্যা: Yesterday মানে অতীত, তাই past tense)",
        f"{conj_c} (ব্যাখ্যা: বাক্যের অর্থ অনুযায়ী সঠিক সংযোগকারী)",
        "Open answer / মুক্ত উত্তর"
    ]
    
    B_qs = [
        ("B1. Mental Math", "৪ নম্বর", {}, [
            (f'{mul_a} × {mul_b} = ?', "২"),
            (f'{div_a * div_b} ÷ {div_b} = ?', "২")
        ]),
        ("B2. 3-Digit Math", "২ নম্বর", {}, [
            (f'4{d}0 + 2{d}5 = ?', "২")
        ]),
        ("B3. Fractions / Time", "২ নম্বর", {}, [
            (f'Quarter past 3 means 3:___ ?', "২")
        ]),
        ("B4. Olympiad Word Problem", "২ নম্বর", {}, [
            (f'1 pen costs {mul_a} Tk. How much for {mul_b} pens?', "২")
        ])
    ]
    B_ans = [
        f"{mul_a * mul_b} এবং {div_a}",
        f"{400 + d*10 + 200 + d*10 + 5} (ব্যাখ্যা: শতক, দশক, একক ধরে যোগ)",
        "15 (ব্যাখ্যা: Quarter past মানে ১৫ মিনিট পার হয়েছে)",
        f"{mul_a * mul_b} Tk (ব্যাখ্যা: ১টির দাম জানা থাকলে গুণ করতে হয়)"
    ]
    
    C_qs = [
        ("C1. Advanced Series", "৩ নম্বর", {}, [
            (f'2, 5, 9, 14, ?', "৩")
        ]),
        ("C2. Coding", "৩ নম্বর", {}, [
            (f'A=1, B=2. What is 3, 1, 20?', "৩")
        ]),
        ("C3. Odd One Out", "২ নম্বর", {}, [
            (f'{opt("(Square / Circle / Triangle / Oval)")}', "২")
        ]),
        ("C4. Olympiad Logic", "২ নম্বর", {}, [
            (f'{oly_q}', "২")
        ])
    ]
    C_ans = [
        "20 (ব্যাখ্যা: পার্থক্য যথাক্রমে +3, +4, +5, তাই 14+6=20)",
        "CAT (ব্যাখ্যা: C=3, A=1, T=20)",
        "Oval/Circle (ব্যাখ্যা: বাকিগুলোর সরলরেখা বা কোণ আছে)",
        oly_a
    ]
    
    DAYS.append(dict(
        n=d, sub=sub, foot=f"Day {d} • Month 3",
        A=A_qs, B=B_qs, C=C_qs
    ))
    
    ANS_DATA[d] = {
        "A": A_ans,
        "B": B_ans,
        "C": C_ans
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
  h3.sub { font-size: 16px; color: #fff; background: #2b6cb0; padding: 4px 10px; margin: 15px 0 10px 0; border-radius: 4px; }
  .sec { margin-bottom: 20px; }
  .sec h4 { font-size: 14px; font-weight: bold; color: #2c5282; margin: 0 0 5px 0; border-bottom: 1px dashed #cbd5e0; padding-bottom: 2px; }
  .q { display: flex; margin-bottom: 5px; }
  .q .idx { width: 25px; font-weight: bold; color: #4a5568; }
  .q .txt { flex: 1; }
  .q .mk { width: 35px; text-align: right; color: #718096; font-size: 11px; }
  .hintbox { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 8px; margin-bottom: 10px; border-radius: 4px; font-size: 12px; }
  .passbox { border: 1px solid #e2e8f0; background: #f8fafc; padding: 8px; font-style: italic; margin-bottom: 8px; border-radius: 4px; }
  .pagefoot { position: absolute; bottom: 15mm; left: 20mm; right: 20mm; border-top: 1px solid #cbd5e0; padding-top: 5px; display: flex; justify-content: space-between; font-size: 11px; color: #a0aec0; }
  
  .trick { background: #fffaf0; border-left: 4px solid #f6ad55; padding: 10px; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
  .trick h5 { margin: 0 0 5px 0; color: #dd6b20; font-size: 14px; }
  .trick p { margin: 0; font-size: 13px; color: #4a5568; }
  
  .ans-box { font-size: 11.5px; border: 1px solid #e2e8f0; padding: 8px; margin-bottom: 10px; background: #fafafa; border-radius: 6px; break-inside: avoid; }
  .ans-box h4 { margin: 0 0 5px 0; color: #2b6cb0; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; font-size: 13px; }
  .ans-row { margin-bottom: 4px; }
  .ans-row b { color: #2d3748; }
  
  .tracker { width: 100%; border-collapse: collapse; font-size: 11px; text-align: center; margin-top: 10px;}
  .tracker th, .tracker td { border: 1px solid #cbd5e0; padding: 4px; }
  .tracker th { background: #edf2f7; font-weight: bold; }
</style>
</head>
<body>
"""

HTML_COVER = """<section class="paper">
  <br><br><br><br>
  <h1 style="font-size: 36px; border:none;">PRIMARY MATH OLYMPIAD & LOGIC</h1>
  <h2 style="font-size: 24px; color: #4a5568;">MONTH 3 WORKBOOK (DAY 61 – 90)</h2>
  <br><br>
  <div style="text-align: center; font-size: 16px; color: #2d3748;">
    <p>Target Age: 6-7 Years (Olympiad & Mastery Level)</p>
    <p>Daily Routine: 30 Marks (English 10, Math 10, Logic 10)</p>
    <p>Outcome Oriented & Measurable Growth</p>
  </div>
  <br><br><br>
  <div class="trick" style="margin: 0 40px; border-color: #4299e1; background: #ebf8ff;">
    <h5>গুরুত্বপূর্ণ নির্দেশিকা (Parents / Teachers):</h5>
    <p>১. তৃতীয় মাসটি সবচেয়ে চ্যালেঞ্জিং। প্রতিদিন মাত্র ১৫-২০ মিনিট সময় দিন।<br>
       ২. <b>নির্ভুল উত্তর ও ব্যাখ্যা:</b> ওয়ার্কবুকের শেষে প্রতিটি দিনের উত্তরের সাথে বিস্তারিত ব্যাখ্যা দেওয়া আছে।<br>
       ৩. <b>Best Tricks:</b> শেষের পৃষ্ঠায় শেখানোর দারুণ কিছু কৌশল দেওয়া আছে, যা পড়াশোনাকে মজাদার করবে।<br>
       ৪. ভুল হলে বকবেন না, ট্রিকসগুলো ব্যবহার করে বুঝিয়ে দিন।</p>
  </div>
  <div class="pagefoot"><span>PayNest API / Arena.ai</span><span>Month 3</span></div>
</section>
"""

html_parts = [HTML_HEAD, HTML_COVER]

for day in DAYS:
    html_parts.append(worksheet(day))

# Answer Key Section
html_parts.append("""
<section class="paper">
  <h2 class="big">নির্ভুল উত্তর ও ব্যাখ্যা (Day 61-90)</h2>
  <p style="text-align:center; color:#4a5568; margin-bottom: 20px;">প্রতিটি প্রশ্নের উত্তর এবং সহজে বোঝানোর ব্যাখ্যা নিচে দেওয়া হলো।</p>
  <div style='column-count: 2; column-gap: 15px;'>
""")

for d in range(61, 91):
    html_parts.append(f"""
    <div class="ans-box">
      <h4>Day {d}</h4>
      <div class="ans-row"><b>English:</b><br> A1. {ANS_DATA[d]["A"][0]}<br> A2. {ANS_DATA[d]["A"][1]}<br> A3. {ANS_DATA[d]["A"][2]}<br> A4. {ANS_DATA[d]["A"][3]}</div>
      <div class="ans-row"><b>Math:</b><br> B1. {ANS_DATA[d]["B"][0]}<br> B2. {ANS_DATA[d]["B"][1]}<br> B3. {ANS_DATA[d]["B"][2]}<br> B4. {ANS_DATA[d]["B"][3]}</div>
      <div class="ans-row"><b>Logic:</b><br> C1. {ANS_DATA[d]["C"][0]}<br> C2. {ANS_DATA[d]["C"][1]}<br> C3. {ANS_DATA[d]["C"][2]}<br> C4. {ANS_DATA[d]["C"][3]}</div>
    </div>
    """)
    if d % 5 == 0 and d != 90:
        html_parts.append("</div></section><section class='paper'><div style='column-count: 2; column-gap: 15px;'>")

html_parts.append("</div>")
html_parts.append("""<div class="pagefoot"><span>Answer Key & Explanations</span><span>Month 3</span></div></section>""")

# Tricks Section
html_parts.append("""
<section class="paper">
  <h2 class="big">কার্যকরী ট্রিকস (Best Teaching Tricks)</h2>
  <h3 class="sub">মজার ছলে কঠিন বিষয় শেখানোর কৌশল</h3>
  
  <div class="trick"><h5>১. Adverbs শেখানোর "কীভাবে" (How) ট্রিক</h5>
  <p>verb-কে প্রশ্ন করুন "কীভাবে?"। যেমন: "সে দৌড়ায়" - কীভাবে? "দ্রুত (Quickly)"। সাধারণত -ly যুক্ত শব্দগুলোই Adverb হয়। শিশুকে acting করে দেখান - slowly হেঁটে দেখান, loudly কথা বলে দেখান।</p></div>

  <div class="trick"><h5>২. Multiplication (গুণ) শেখানোর "Group" ট্রিক</h5>
  <p>নামতা মুখস্থ করার আগে Group করে শেখান। 3 × 4 মানে ৩টি ঝুড়িতে ৪টি করে আপেল। শিশুকে বোতাম বা মার্বেল দিয়ে ৩টি দলে ৪টি করে সাজাতে বলুন।</p></div>

  <div class="trick"><h5>৩. Time (সময়) শেখানোর "Quarter" ট্রিক</h5>
  <p>ঘড়িকে একটি পিজ্জা কল্পনা করুন। পিজ্জাকে ৪ ভাগ করলে এক ভাগ হলো Quarter (১৫ মিনিট)। তাই Quarter past মানে ১৫ মিনিট পার হয়েছে, আর Quarter to মানে ১৫ মিনিট বাকি।</p></div>

  <div class="trick"><h5>৪. Word Problem এর "Key Word" ট্রিক</h5>
  <p>প্রশ্নে "Total", "Altogether" থাকলে <b>যোগ (+)</b> হবে। "Left", "Remaining", "Difference" থাকলে <b>বিয়োগ (-)</b> হবে। "Each", "Per" থাকলে <b>গুণ (×) বা ভাগ (÷)</b> হবে।</p></div>

  <div class="trick"><h5>৫. Logic Series এর "Hat" (টুপি) ট্রিক</h5>
  <p>2, 5, 9, 14 এর মতো ধারায় পাশাপাশি দুটি সংখ্যার উপরে পেন্সিল দিয়ে একটি উল্টো 'V' (টুপি) এঁকে পার্থক্যটা (যেমন +3, +4, +5) লিখতে বলুন। প্যাটার্ন চোখের সামনে ভেসে উঠবে!</p></div>

  <div class="trick"><h5>৬. Mirror Image (আয়না) ট্রিক</h5>
  <p>b, d, p, q এর মতো বর্ণ আয়নায় কেমন দেখাবে বুঝতে, একটি স্বচ্ছ কাগজে (Tracing paper) বর্ণটি গাঢ় করে লিখে উল্টে দেখতে বলুন। এটি মস্তিষ্কের Spatial Reasoning দ্রুত বাড়ায়।</p></div>

  <div class="pagefoot"><span>Best Tricks</span><span>Month 3</span></div>
</section>
""")

# Progress Tracker
html_parts.append("""
<section class="paper">
  <h2 class="big">Master Progress Tracker (Month 3)</h2>
  <p style="text-align:center">প্রতিদিনের প্রাপ্ত নম্বর এখানে লিখে রাখুন।</p>
  <table class="tracker">
    <tr><th>Day</th><th>English (10)</th><th>Math (10)</th><th>Logic (10)</th><th>Total (30)</th><th>Signature</th></tr>
""")
for d in range(61, 91):
    html_parts.append(f'<tr><td>Day {d}</td><td></td><td></td><td></td><td></td><td></td></tr>')
html_parts.append("""
  </table>
  
  <div style="margin-top: 40px; text-align: center; border: 2px dashed #4299e1; padding: 20px; border-radius: 10px; background: #ebf8ff;">
    <h1 style="color: #2b6cb0; border: none; margin-bottom: 5px;">CERTIFICATE OF EXCELLENCE</h1>
    <p style="margin: 0; font-size: 14px;">This certifies that</p>
    <div style="border-bottom: 1px solid #111; width: 60%; margin: 20px auto 5px; height: 20px;"></div>
    <p style="margin: 0; font-size: 14px;">has successfully completed the 90-Day Math Olympiad Preparation Program (Months 1, 2 & 3).</p>
  </div>
  
  <div class="pagefoot"><span>Progress Tracker & Certificate</span><span>Month 3</span></div>
</section>
</body>
</html>
""")

with open(OUT, "w", encoding="utf-8") as f:
    f.write("\n".join(html_parts))

print(f"Generated {OUT}")
