# -*- coding: utf-8 -*-
import sys
import random

sys.path.insert(0, "/home/user/paynest-api/worksheets")
from wb_lib import worksheet, bn, opt, hint, shapes, method, hintbox, passage_box

OUT = "/home/user/paynest-api/worksheets/day-91-120-revision.html"

DAYS = []
ANS_DATA = {}

# Rich pool of Olympiad logic puzzles for deep learning
oly_logic = [
    ("একটি লাঠিকে ৩ বার ভাঙলে কয়টি টুকরো হবে?", "৪ টুকরো (ব্যাখ্যা: প্রতিবার ভাঙলে ১টি টুকরো বাড়ে, তাই ৩ বার ভাঙলে ৪ টুকরো হবে।)"),
    ("আজ রবিবার হলে ১৪ দিন পর কী বার হবে?", "রবিবার (ব্যাখ্যা: ৭ দিন পরপর একই বার আসে, তাই ১৪ দিন (২ সপ্তাহ) পরও রবিবারই হবে।)"),
    ("একটি ঘড়িতে ৬টা বাজে। আয়নায় দেখলে কয়টা বাজবে বলে মনে হবে?", "৬টা (ব্যাখ্যা: ৬টার সময় কাঁটাগুলো সোজা উপরে-নিচে থাকে, তাই আয়নাতেও একই দেখায় বা ১২-৬=৬।)"),
    ("১ থেকে ১০ পর্যন্ত সংখ্যাগুলোর মধ্যে কয়টি জোড় সংখ্যা আছে?", "৫টি (ব্যাখ্যা: ২, ৪, ৬, ৮, ১০ - মোট ৫টি।)"),
    ("৫টি বিড়াল ৫টি ইঁদুর ধরতে ৫ মিনিট নেয়। ১টি বিড়াল ১টি ইঁদুর ধরতে কত মিনিট নেবে?", "৫ মিনিট (ব্যাখ্যা: প্রতিটি বিড়াল নিজের ইঁদুরটি ধরতে ৫ মিনিট সময় নেয়।)"),
    ("রাহুলের চেয়ে মিনা লম্বা, কিন্তু সুমির চেয়ে খাটো। সবচেয়ে লম্বা কে?", "সুমি (ব্যাখ্যা: সুমি > মিনা > রাহুল)"),
    ("পুকুরে ১০টি হাঁস ছিল। ৩টি পাড়ে উঠে গেল। আবার ২টি পানিতে নামলো। এখন পানিতে কয়টি?", "৯টি (ব্যাখ্যা: ১০ - ৩ = ৭, ৭ + ২টি = ৯টি।)"),
    ("যদি RED = 3 এবং BLUE = 4 হয়, তবে GREEN = কত?", "5 (ব্যাখ্যা: শব্দের অক্ষর সংখ্যা। GREEN-এ ৫টি অক্ষর আছে।)"),
    ("একটি গাছে কিছু পাখি বসে ছিল। আরও ৫টি পাখি আসায় মোট ১২টি হলো। প্রথমে কয়টি ছিল?", "৭টি (ব্যাখ্যা: ১২ - ৫ = ৭টি।)"),
    ("১০০ এর অর্ধেক কত, তার সাথে ১০ যোগ করলে কত হয়?", "৬০ (ব্যাখ্যা: ১০০ এর অর্ধেক ৫০, তার সাথে ১০ যোগ করলে ৬০।)"),
    ("তোমার সামনে উত্তর দিক, ডানে কোন দিক হবে?", "পূর্ব (East) (ব্যাখ্যা: উত্তর দিকে মুখ করে দাঁড়ালে ডান হাত পূর্ব দিকে থাকে।)"),
    ("A=1, B=2, C=3 হলে, 2,1,4 মানে কী?", "BAD (ব্যাখ্যা: 2=B, 1=A, 4=D)"),
    ("একটি বাক্সে ৩টি লাল এবং ২টি নীল বল আছে। না দেখে তুললে কোন রঙের বল ওঠার সম্ভাবনা বেশি?", "লাল (ব্যাখ্যা: লাল বল বেশি আছে, তাই লাল ওঠার সম্ভাবনা বেশি।)"),
    ("পরপর তিনটি সংখ্যার যোগফল ১২ হলে, সংখ্যা তিনটি কী কী?", "৩, ৪, ৫ (ব্যাখ্যা: ৩+৪+৫ = ১২)"),
    ("একটি বানর ১০ ফুট গাছে ওঠে: দিনে ৩ ফুট ওঠে, রাতে ২ ফুট নামে। কত দিনে ৮ ফুটে পৌঁছাবে?", "৬ষ্ঠ দিনে (ব্যাখ্যা: ৫ দিনে ৫ ফুট উঠবে, ৬ষ্ঠ দিনে ৩ ফুট উঠে ৮ ফুটে পৌঁছাবে।)")
]

vocab_words = [("Child", "Children"), ("Mouse", "Mice"), ("Tooth", "Teeth"), ("Foot", "Feet"), ("Leaf", "Leaves")]
vowels = ["a", "e", "i", "o", "u"]
tenses = [("go", "went"), ("see", "saw"), ("run", "ran"), ("eat", "ate"), ("play", "played")]

for d in range(91, 121):
    sub = f"MASTER REVISION TEST (DAY {d})"
    if d == 120:
        sub = "FINAL 90-DAY OLYMPIAD CHAMPIONSHIP (DAY 120)"
    
    # Deterministic randomness based on day
    random.seed(d)
    
    v_sg, v_pl = random.choice(vocab_words)
    t_pr, t_pa = random.choice(tenses)
    oly_q, oly_a = oly_logic[(d-91) % len(oly_logic)]
    
    # Math variables
    add1 = random.randint(150, 400)
    add2 = random.randint(150, 400)
    mul1 = random.randint(4, 9)
    mul2 = random.randint(3, 9)
    div_ans = random.randint(3, 8)
    div_val = div_ans * random.randint(2, 5)
    
    # Logic variables
    seq_start = random.randint(2, 10)
    seq_step = random.randint(2, 5)
    
    A_qs = [
        ("A1. Grammar & Plurals", "৩ নম্বর", {}, [
            (f'Plural of <b>{v_sg}</b> is {opt(f"({v_sg}s / {v_pl})")}.', "১"),
            (f'I {opt(f"({t_pr} / {t_pa})")} to the zoo yesterday.', "১"),
            (f'The bird is flying {opt("(in / over)")} the tree.', "১")
        ]),
        ("A2. Vocabulary & Spelling", "৩ নম্বর", {}, [
            (f'Which word has a silent letter? {opt("(Write / Read)")}', "১"),
            (f'Opposite of <b>Fast</b> is ________.', "১"),
            (f'Add a vowel (a,e,i,o,u): B _ T (something that flies at night)', "১")
        ]),
        ("A3. Reading Comprehension", "২ নম্বর", 
         {"passage": passage_box(["The quick brown fox jumped over the lazy dog.", "It was a sunny day.", "The dog just slept."])}, [
            (f'Who jumped over the dog?', "১"),
            (f'What did the dog do?', "১")
        ]),
        ("A4. Sentence Structure", "২ নম্বর", {}, [
            (f'Rearrange: dog / The / is / barking.', "২")
        ])
    ]
    A_ans = [
        f"{v_pl}; {t_pa}; over (ব্যাখ্যা: Yesterday অতীতকাল বোঝায়, over মানে উপরে উড়ন্ত।)",
        f"Write; Slow; A (BAT) (ব্যাখ্যা: Write এ W উচ্চারণ হয় না।)",
        f"The fox; Slept (ব্যাখ্যা: প্যাসেজ থেকে সরাসরি উত্তর।)",
        f"The dog is barking. (ব্যাখ্যা: Subject + Verb গঠন।)"
    ]
    
    B_qs = [
        ("B1. Mental Math Speed Drill", "৪ নম্বর", {}, [
            (f'{mul1} × {mul2} = ?', "১"),
            (f'{div_val} ÷ {int(div_val/div_ans)} = ?', "১"),
            (f'Half of {mul1 * 10} = ?', "১"),
            (f'{mul2 * 10} + 25 = ?', "১")
        ]),
        ("B2. Core Arithmetic (3-Digits)", "২ নম্বর", {}, [
            (f'{add1} + {add2} = ?', "১"),
            (f'{add1 + add2} - {add1} = ?', "১")
        ]),
        ("B3. Applied Concepts (Fractions/Time)", "২ নম্বর", {}, [
            (f'Quarter past 4 means 4:___', "১"),
            (f'If I have 4 quarters, it equals ___ whole?', "১")
        ]),
        ("B4. Real-life Word Problem", "২ নম্বর", {}, [
            (f'You buy {mul1} books. Each costs {mul2} Taka. Total cost?', "১"),
            (f'You pay with a 100 Taka note. Your change is ___ Taka?', "১")
        ])
    ]
    B_ans = [
        f"{mul1 * mul2}; {div_ans}; {int(mul1 * 10 / 2)}; {mul2 * 10 + 25}",
        f"{add1 + add2}; {add2} (ব্যাখ্যা: যোগ ও বিয়োগের সম্পর্ক।)",
        f"15; 1 (ব্যাখ্যা: Quarter মানে 1/4 বা ১৫ মিনিট, ৪টি Quarter মিলে ১টি পূর্ণ অংশ হয়।)",
        f"{mul1 * mul2} Taka; {100 - (mul1 * mul2)} Taka (ব্যাখ্যা: গুণ করে মোট দাম বের করা এবং ১০০ থেকে বিয়োগ।)"
    ]
    
    C_qs = [
        ("C1. Logical Series", "৩ নম্বর", {}, [
            (f'{seq_start}, {seq_start + seq_step}, {seq_start + seq_step*2}, {seq_start + seq_step*3}, ?', "১"),
            (f'100, 90, 80, 70, ?', "১"),
            (f'A, C, E, G, ?', "১")
        ]),
        ("C2. Visual / Coding Logic", "৩ নম্বর", {}, [
            (f'Mirror image of <b>b</b> is {opt("( d / p )")}', "১"),
            (f'If Apple=5, Banana=6, then Cat=?', "১"),
            (f'Odd one out: {opt("(Sun / Moon / Star / Chair)")}', "১")
        ]),
        ("C3. Spatial Reasoning", "২ নম্বর", {}, [
            (f'Facing East, you turn Left. Now facing: {opt("(North / South)")}', "১"),
            (f'A square has ___ sides and ___ corners.', "১")
        ]),
        ("C4. Olympiad Logic Puzzle", "২ নম্বর", {}, [
            (f'{oly_q}', "২")
        ])
    ]
    C_ans = [
        f"{seq_start + seq_step*4}; 60; I (ব্যাখ্যা: +{seq_step} করে বাড়ছে, দ্বিতীয়টিতে -10, তৃতীয়টিতে ১টি বর্ণ বাদ দিয়ে।)",
        f"d; 3; Chair (ব্যাখ্যা: আয়নায় b উল্টে d হয়। Cat এ ৩টি অক্ষর। Chair আকাশের বস্তু নয়।)",
        f"North; 4 sides, 4 corners (ব্যাখ্যা: পূর্বের বাঁয়ে উত্তর দিক।)",
        f"{oly_a}"
    ]
    
    DAYS.append(dict(
        n=d, sub=sub, foot=f"Day {d} • Revision",
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
  
  .ans-box { font-size: 11px; border: 1px solid #e2e8f0; padding: 8px; margin-bottom: 10px; background: #fafafa; border-radius: 6px; break-inside: avoid; }
  .ans-box h4 { margin: 0 0 5px 0; color: #2b6cb0; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; font-size: 12px; }
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
  <h1 style="font-size: 36px; border:none; text-align: center;">CONCRETE LEARNING & REVISION</h1>
  <h2 style="font-size: 24px; color: #4a5568; text-align: center;">90-DAY MASTERY WORKBOOK (DAY 91 – 120)</h2>
  <br><br>
  <div style="text-align: center; font-size: 16px; color: #2d3748; line-height: 1.6;">
    <p>Target Age: 6-7 Years (Revision & Solidification)</p>
    <p>Daily Format: 30 Marks (English 10, Math 10, Logic 10)</p>
    <p>A Comprehensive Mock Test Series for Permanent Brain Retention</p>
  </div>
  <br><br><br>
  <div class="trick" style="margin: 0 40px; border-color: #38a169; background: #f0fff4;">
    <h5>কীভাবে এই রিভিশন ওয়ার্কবুক ব্যবহার করবেন?</h5>
    <p>১. এটি মূলত গত ৩ মাসের (Day 1-90) শিক্ষার <b>Mock Test</b> বা রিভিশন।<br>
       ২. প্রতিদিন একটি শিট পরীক্ষা হিসেবে সমাধান করতে দিন।<br>
       ৩. শিশু আটকে গেলে <b>শেষের পৃষ্ঠায় থাকা 'Best Tricks'</b> ব্যবহার করে মনে করিয়ে দিন।<br>
       ৪. প্রতিটি দিনের নির্ভুল উত্তর ও লজিক্যাল ব্যাখ্যা শেষে দেওয়া আছে, মিলিয়ে নম্বর দিন এবং Tracker-এ লিখুন।<br>
       ৫. <b>লক্ষ্য:</b> শেখা বিষয়গুলো মস্তিষ্কে স্থায়ী (Concrete) করা।</p>
  </div>
  <div class="pagefoot"><span>PayNest API / Arena.ai</span><span>Revision Month</span></div>
</section>
"""

html_parts = [HTML_HEAD, HTML_COVER]

for day in DAYS:
    html_parts.append(worksheet(day))

# Answer Key Section
html_parts.append("""
<section class="paper">
  <h2 class="big">নির্ভুল উত্তর ও ব্যাখ্যা (Revision Day 91-120)</h2>
  <p style="text-align:center; color:#4a5568; margin-bottom: 20px;">এই অংশের সাহায্যে শিশুর উত্তর মেলাবেন এবং ব্যাখ্যার মাধ্যমে তাদের ভুলগুলো শুধরে দেবেন।</p>
  <div style='column-count: 2; column-gap: 15px;'>
""")

for d in range(91, 121):
    html_parts.append(f"""
    <div class="ans-box">
      <h4>Day {d}</h4>
      <div class="ans-row"><b>English:</b><br> A1. {ANS_DATA[d]["A"][0]}<br> A2. {ANS_DATA[d]["A"][1]}<br> A3. {ANS_DATA[d]["A"][2]}<br> A4. {ANS_DATA[d]["A"][3]}</div>
      <div class="ans-row"><b>Math:</b><br> B1. {ANS_DATA[d]["B"][0]}<br> B2. {ANS_DATA[d]["B"][1]}<br> B3. {ANS_DATA[d]["B"][2]}<br> B4. {ANS_DATA[d]["B"][3]}</div>
      <div class="ans-row"><b>Logic:</b><br> C1. {ANS_DATA[d]["C"][0]}<br> C2. {ANS_DATA[d]["C"][1]}<br> C3. {ANS_DATA[d]["C"][2]}<br> C4. {ANS_DATA[d]["C"][3]}</div>
    </div>
    """)
    if (d - 90) % 6 == 0 and d != 120:
        html_parts.append("</div></section><section class='paper'><div style='column-count: 2; column-gap: 15px;'>")

html_parts.append("</div>")
html_parts.append("""<div class="pagefoot"><span>Answer Key & Explanations</span><span>Revision</span></div></section>""")

# Tricks Section
html_parts.append("""
<section class="paper">
  <h2 class="big">Master Tricks: শেখা বিষয় চিরস্থায়ী করার কৌশল</h2>
  <h3 class="sub">Concrete Learning Tricks (রিভিশন ট্রিকস)</h3>
  
  <div class="trick"><h5>১. The "Teach Me" Trick (আমাকে শেখাও)</h5>
  <p>সবচেয়ে ভালো শেখা হয় যখন কেউ অন্যকে শেখায়। শিশুকে বলুন, "আজকের গণিতটা তুমি আমাকে টিচারের মতো বোর্ডে বা খাতায় বুঝিয়ে দাও।" এতে তাদের কনসেপ্ট কংক্রিট (Concrete) হয়ে যায়।</p></div>

  <div class="trick"><h5>২. Grammar Visualization (চোখ বন্ধ করে দেখা)</h5>
  <p>Preposition (in, on, under, over) রিভিশন করার সময় শিশুকে চোখ বন্ধ করতে বলুন এবং কল্পনা করতে বলুন: "একটি পাখি গাছের উপর দিয়ে উড়ছে (over), কিন্তু ডালে বসলে (on)।" ভিজ্যুয়ালাইজেশন মেমোরি অনেক স্ট্রং হয়।</p></div>

  <div class="trick"><h5>৩. Logic: The "Drawing" Method (এঁকে সমাধান)</h5>
  <p>লজিক পাজল (যেমন: বানরের গাছে ওঠা বা কত টুকরো হলো) মনে মনে হিসাব করার বদলে সব সময় খাতায় ছোট করে দাগ কেটে বা ছবি এঁকে সমাধান করতে শেখান। অলিম্পিয়াডের এটি সবচেয়ে সেরা নিয়ম।</p></div>

  <div class="trick"><h5>৪. Math: Number Bonds Re-check</h5>
  <p>যোগ-বিয়োগ করার পর উল্টো করে চেক করতে শেখান। যেমন: 40 + 25 = 65 হলে, 65 - 25 করলে 40 ফিরে আসে কি না দেখতে বলুন। এতে শিশুর Self-correction বা নিজের ভুল নিজে ধরার ক্ষমতা বাড়ে।</p></div>

  <div class="trick"><h5>৫. Vocabulary: Word Association (শব্দের জাল)</h5>
  <p>যেকোনো নতুন শব্দ (যেমন: Fast) পেলে তার সাথে সম্পর্কিত আরও তিনটি শব্দ বা বিপরীত শব্দ মনে করতে বলুন (Slow, Run, Car)। এটি মস্তিষ্কে শব্দের একটি জাল (Network) তৈরি করে।</p></div>

  <div class="pagefoot"><span>Master Tricks</span><span>Revision</span></div>
</section>
""")

# Progress Tracker
html_parts.append("""
<section class="paper">
  <h2 class="big">Final Master Progress Tracker (Day 91-120)</h2>
  <p style="text-align:center">প্রতিদিনের রিভিশন টেস্টের প্রাপ্ত নম্বর এখানে লিখে রাখুন।</p>
  <table class="tracker">
    <tr><th>Day</th><th>English (10)</th><th>Math (10)</th><th>Logic (10)</th><th>Total (30)</th><th>Signature</th></tr>
""")
for d in range(91, 121):
    html_parts.append(f'<tr><td>Day {d}</td><td></td><td></td><td></td><td></td><td></td></tr>')
html_parts.append("""
  </table>
  
  <div style="margin-top: 30px; text-align: center; border: 3px double #38a169; padding: 20px; border-radius: 10px; background: #f0fff4;">
    <h1 style="color: #276749; border: none; margin-bottom: 5px; font-size: 28px;">GRAND MASTER CERTIFICATE</h1>
    <p style="margin: 0; font-size: 15px;">Awarded to the incredible student for</p>
    <div style="border-bottom: 2px solid #111; width: 70%; margin: 15px auto; height: 10px;"></div>
    <p style="margin: 0; font-size: 15px;">for completing the entire <b>120-Day Primary Olympiad & Logic Curriculum</b>.</p>
    <p style="margin: 5px 0 0 0; font-size: 13px; color: #4a5568;">Your foundation is now rock solid!</p>
  </div>
  
  <div class="pagefoot"><span>Final Tracker & Certificate</span><span>Revision</span></div>
</section>
</body>
</html>
""")

with open(OUT, "w", encoding="utf-8") as f:
    f.write("\n".join(html_parts))

print(f"Generated {OUT}")
