# -*- coding: utf-8 -*-
import sys
import random

sys.path.insert(0, "/home/user/paynest-api/worksheets")
from wb_lib import worksheet, bn, opt, hint, shapes, method, hintbox, passage_box

OUT = "/home/user/paynest-api/worksheets/day-91-120-revision.html"

DAYS = []
ANS_DATA = {}

# Comprehensive Logic Puzzles (30 Unique Items for C4)
oly_logic = [
    ("একটি বাঁশকে ৫ বার কাটলে কয়টি টুকরো হবে?", "৬ টুকরো (ব্যাখ্যা: প্রতিবার কাটলে ১টি করে টুকরো বাড়ে।)"),
    ("লাইনে তোমার সামনে ৫ জন, পিছনে ৪ জন। লাইনে মোট কতজন?", "১০ জন (ব্যাখ্যা: সামনের ৫ + পিছনের ৪ + তুমি নিজে ১ = ১০)"),
    ("২টি গরু ও ৩টি মুরগির মোট কয়টি পা?", "১৪টি (ব্যাখ্যা: গরুর ৮ + মুরগির ৬ = ১৪)"),
    ("আয়নায় ঘড়িতে ৯টা বাজে দেখালে, বাস্তবে কয়টা বাজে?", "৩টা (ব্যাখ্যা: ১২ - ৯ = ৩)"),
    ("আজ সোমবার হলে, ১৫ দিন পর কী বার?", "মঙ্গলবার (ব্যাখ্যা: ১৪ দিন বা ২ সপ্তাহ পর সোমবার, তাই ১৫ দিন পর মঙ্গলবার)"),
    ("একটি বানর গাছে দিনে ৩ ফুট ওঠে, রাতে ২ ফুট নামে। ১০ ফুট উঠতে কত দিন লাগবে?", "৮ দিন (ব্যাখ্যা: ৭ দিনে ৭ ফুট, ৮ম দিনে ৩ ফুট উঠে ১০ ফুটে পৌঁছাবে)"),
    ("১০টি আপেল ৩ জনের মাঝে সমানভাবে ভাগ করলে কয়টি অবশিষ্ট থাকে?", "১টি (ব্যাখ্যা: ৩x৩=৯, তাই ১টি বাকি থাকে)"),
    ("রাম শ্যামের চেয়ে বড়। শ্যাম যদুর চেয়ে বড়। সবচেয়ে ছোট কে?", "যদু (ব্যাখ্যা: রাম > শ্যাম > যদু)"),
    ("১ থেকে ১০ এর মধ্যে কয়টি বিজোড় সংখ্যা আছে?", "৫টি (ব্যাখ্যা: ১, ৩, ৫, ৭, ৯)"),
    ("লাল, নীল, সবুজ রং পরপর সাজালে ১০ নম্বর রং কোনটি?", "লাল (ব্যাখ্যা: প্যাটার্নটি ৩ রঙের। ১০ কে ৩ দিয়ে ভাগ করলে ভাগশেষ ১)"),
    ("তুমি ৫ টাকার ৩টি কলম কিনে ২০ টাকার নোট দিলে। ফেরত পাবে কত?", "৫ টাকা (ব্যাখ্যা: ৩x৫=১৫ টাকা দাম। ২০-১৫=৫ টাকা)"),
    ("ঘড়িতে ১টায় ১ বার ঢং করে, ২টায় ২ বার। ১টা ও ২টায় মোট কয়বার ঢং করবে?", "৩ বার (ব্যাখ্যা: ১+২=৩)"),
    ("৩টি বিড়াল ৩টি ইঁদুর ধরতে ৩ মিনিট নেয়। ১টি বিড়াল ১টি ইঁদুর ধরতে কত মিনিট নেবে?", "৩ মিনিট (ব্যাখ্যা: প্রতিটি বিড়ালের একটি ইঁদুর ধরতে ৩ মিনিট লাগে)"),
    ("১০০ এর অর্ধেক এর সাথে ৫০ যোগ করলে কত হয়?", "১০০ (ব্যাখ্যা: ১০০ এর অর্ধেক ৫০। ৫০+৫০=১০০)"),
    ("A, B এর ডানে। C, B এর বামে। মাঝখানে কে?", "B (ব্যাখ্যা: ক্রমটি হলো C - B - A)"),
    ("একটি পিজ্জাকে লম্বালম্বি ও আড়াআড়ি (➕) কাটলে কয় টুকরো হবে?", "৪ টুকরো (ব্যাখ্যা: ২ বার ছেদ করলে ৪টি ভাগ হয়)"),
    ("৫ জন বন্ধু প্রত্যেকে সবার সাথে ১ বার হাত মেলালে মোট কয়টি করমর্দন হবে?", "১০টি (ব্যাখ্যা: 4+3+2+1=10)"),
    ("RED=3, BLUE=4 হলে YELLOW=কত?", "6 (ব্যাখ্যা: শব্দের অক্ষর সংখ্যা)"),
    ("তুমি উত্তর দিকে মুখ করে আছ। ২ বার ডানদিকে ঘুরলে কোন দিক দেখবে?", "দক্ষিণ (ব্যাখ্যা: ২ বার ডানদিকে ঘোরা মানে ঠিক ১৮০ ডিগ্রি বা উল্টো দিকে ঘোরা)"),
    ("৫, ১০, ১৫, ? ধারায় পরের সংখ্যা কত?", "২০ (ব্যাখ্যা: ৫ করে বাড়ছে)"),
    ("A=1, B=2 হলে 2, 1, 4 এর অর্থ কী?", "BAD (ব্যাখ্যা: 2=B, 1=A, 4=D)"),
    ("একটি বাক্সে ৩টি লাল ও ২টি নীল বল আছে। না দেখে তুললে কোনটি ওঠার সম্ভাবনা বেশি?", "লাল (ব্যাখ্যা: লাল বলের সংখ্যা বেশি)"),
    ("পরপর ৩টি সংখ্যার যোগফল ৬। সংখ্যাগুলো কী?", "১, ২, ৩ (ব্যাখ্যা: ১+২+৩=৬)"),
    ("১টি ডিম সেদ্ধ হতে ৫ মিনিট লাগে। ৩টি ডিম একসাথে সেদ্ধ হতে কত মিনিট লাগবে?", "৫ মিনিট (ব্যাখ্যা: সবগুলো ডিম একসাথেই সেদ্ধ হবে)"),
    ("তোমার বাবার একমাত্র ভাইয়ের বাবার সাথে তোমার সম্পর্ক কী?", "দাদা (ব্যাখ্যা: বাবার ভাই মানে চাচা, তার বাবা মানে দাদা)"),
    ("১, ৩, ৫, ? ধারার পরের সংখ্যাটি কত?", "৭ (ব্যাখ্যা: এগুলো বিজোড় সংখ্যা, ২ করে বাড়ছে)"),
    ("একটি চাকা ১ বার ঘুরলে ২ মিটার যায়। ১০ মিটার যেতে কয়বার ঘুরবে?", "৫ বার (ব্যাখ্যা: ১০ ÷ ২ = ৫ বার)"),
    ("M অক্ষরকে আয়নায় দেখলে কেমন দেখাবে?", "M (ব্যাখ্যা: M এর ডানে-বামে প্রতিসাম্য আছে, তাই উল্টায় না)"),
    ("একটি বইয়ের দাম ১০ টাকা। তুমি হাফ পেমেন্ট করলে, কত দিলে?", "৫ টাকা (ব্যাখ্যা: ১০ এর অর্ধেক ৫)"),
    ("একটি ত্রিভুজ ও একটি চতুর্ভুজের মোট কয়টি কোণ?", "৭টি (ব্যাখ্যা: ত্রিভুজের ৩টি + চতুর্ভুজের ৪টি = ৭টি)")
]

nouns_plurals = [("Cat", "Cats", "Cates"), ("Fox", "Foxes", "Foxs"), ("Child", "Children", "Childs"), ("Tooth", "Teeth", "Tooths"), ("Leaf", "Leaves", "Leafs"), ("Mouse", "Mice", "Mouses")]
verbs_past = [("go", "went"), ("see", "saw"), ("eat", "ate"), ("play", "played"), ("run", "ran"), ("jump", "jumped"), ("write", "wrote")]
adverbs = [("quick", "quickly"), ("slow", "slowly"), ("loud", "loudly"), ("happy", "happily"), ("soft", "softly")]
preps = [("in", "inside", "over"), ("on", "top", "under"), ("under", "below", "over"), ("behind", "back", "in front")]
adjectives = ["big", "small", "fast", "slow", "red", "blue", "happy"]
animals = ["Tiger", "Lion", "Cat", "Bird", "Fish", "Bear", "Deer", "Dog", "Fox", "Rabbit"]
opposites = [("Hot", "Cold"), ("Big", "Small"), ("Tall", "Short"), ("Fast", "Slow"), ("Day", "Night"), ("Up", "Down")]

for d in range(91, 121):
    sub = f"DAY {d}: COMPREHENSIVE REVISION"
    if d == 120:
        sub = "DAY 120: GRAND OLYMPIAD FINALE"
        
    random.seed(d * 100) # Deterministic randomness for variant generation
    
    # Text Data
    v_sg, v_pl_c, v_pl_w = random.choice(nouns_plurals)
    vp_base, vp_past = random.choice(verbs_past)
    adv_base, adv_ly = random.choice(adverbs)
    prep_c, prep_h, prep_w = random.choice(preps)
    adj = random.choice(adjectives)
    anim = random.choice(animals)
    op_q, op_a = random.choice(opposites)
    
    # Math Data
    a1 = random.randint(25, 49)
    a2 = random.randint(15, 39)
    s1 = random.randint(60, 99)
    s2 = random.randint(15, 45)
    m1 = random.randint(3, 9)
    m2 = random.randint(4, 9)
    d1 = random.randint(2, 6)
    d_ans = random.randint(3, 9)
    d_total = d1 * d_ans
    frac_num = random.randint(1, 4) * 10
    
    # Logic Data
    seq_start = random.randint(2, 12)
    seq_step = random.randint(2, 5)
    
    oly_q, oly_a = oly_logic[d - 91]

    # SECTION A: English (10 Marks)
    # A1 (3 marks): Grammar Mix
    a1_qs = [
        (f"Plural form of {v_sg} is {opt(f'({v_pl_c} / {v_pl_w})')}.", "১"),
        (f"Yesterday I {opt(f'({vp_base} / {vp_past})')} an apple.", "১"),
        (f"The cat is hiding {opt(f'({prep_c} / {prep_w})')} the box.", "১")
    ]
    a1_ans = f"{v_pl_c}; {vp_past}; {prep_c}"

    # A2 (3 marks): Vocabulary & Spelling
    a2_qs = [
        (f"Opposite of {op_q} is {opt(f'({op_a} / Same)')}.", "১"),
        (f"Which word is an Adverb? {opt(f'({adv_base} / {adv_ly})')}", "১"),
        (f"Unscramble: {anim[::-1].lower()} -> ?", "১")
    ]
    a2_ans = f"{op_a}; {adv_ly}; {anim.capitalize()}"

    # A3 (2 marks): Comprehension
    passage = [f"The {adj} {anim.lower()} likes to {vp_base}.", f"It runs very {adv_ly}.", "We watch it play."]
    a3_qs = [
        (f"What animal is in the story?", "১"),
        (f"How does it run?", "১")
    ]
    a3_ans = f"The {anim.lower()}; Very {adv_ly}"

    # A4 (2 marks): Writing
    a4_qs = [
        (f"Rearrange: {anim.lower()} / The / is / {adj}.", "২")
    ]
    a4_ans = f"The {anim.lower()} is {adj}."

    A = [
        ("A1. Grammar Review", "৩ নম্বর", {}, a1_qs),
        ("A2. Vocabulary & Spelling", "৩ নম্বর", {}, a2_qs),
        ("A3. Reading Comprehension", "২ নম্বর", {"passage": passage_box(passage)}, a3_qs),
        ("A4. Sentence Structure", "২ নম্বর", {}, a4_qs)
    ]
    
    ans_A = f"<b>A1:</b> {a1_ans}<br><b>A2:</b> {a2_ans}<br><b>A3:</b> {a3_ans}<br><b>A4:</b> {a4_ans}"


    # SECTION B: Mathematics (10 Marks)
    # B1 (4 marks): Speed Round
    b1_qs = [
        (f"{m1} × {m2} = ?", "১"),
        (f"{d_total} ÷ {d1} = ?", "১"),
        (f"{m1*10} + {m2*10} = ?", "১"),
        (f"{s1} - 10 = ?", "১")
    ]
    b1_ans = f"{m1*m2}; {d_ans}; {m1*10 + m2*10}; {s1-10}"

    # B2 (2 marks): Core Arithmetic
    b2_qs = [
        (f"Addition: 1{a1} + 2{a2} = ?", "১"),
        (f"Subtraction: 3{s1} - 1{s2} = ?", "১")
    ]
    b2_ans = f"{100+a1+200+a2}; {300+s1-100-s2}"

    # B3 (2 marks): Applied (Time/Fraction)
    b3_qs = [
        (f"Half of {frac_num} is ?", "১"),
        (f"Quarter past 5 means 5:___", "১")
    ]
    b3_ans = f"{int(frac_num/2)}; 15"

    # B4 (2 marks): Word Problems
    b4_qs = [
        (f"You had 100 Tk. Bought a toy for {a1+a2} Tk. Left?", "১"),
        (f"1 box has {m1} balls. How many balls in {m2} boxes?", "১")
    ]
    b4_ans = f"{100-(a1+a2)} Tk; {m1*m2} balls"

    B = [
        ("B1. Mental Math Speed Round", "৪ নম্বর", {}, b1_qs),
        ("B2. 3-Digit Core Arithmetic", "২ নম্বর", {}, b2_qs),
        ("B3. Applied Math (Fraction/Time)", "২ নম্বর", {}, b3_qs),
        ("B4. Word Problems", "২ নম্বর", {}, b4_qs)
    ]
    ans_B = f"<b>B1:</b> {b1_ans}<br><b>B2:</b> {b2_ans}<br><b>B3:</b> {b3_ans}<br><b>B4:</b> {b4_ans}"


    # SECTION C: Analytical Ability (10 Marks)
    # C1 (3 marks): Classification / Odd One Out
    c1_qs = [
        (f"Odd one out: {opt('(Apple / Banana / Car / Mango)')}", "১"),
        (f"Odd one out: {opt('(10 / 20 / 25 / 30)')} (Hint: divisible by 10)", "১"),
        (f"Odd one out: {opt('(Square / Triangle / Circle / Rectangle)')}", "১")
    ]
    c1_ans = "Car (খাবার নয়); 25 (১০ দিয়ে ভাগ যায় না); Circle (এর কোণ নেই)"

    # C2 (3 marks): Sequences & Spatial
    c2_qs = [
        (f"Pattern: {seq_start}, {seq_start+seq_step}, {seq_start+seq_step*2}, ?, {seq_start+seq_step*4}", "১"),
        (f"Mirror image of <b>p</b> is {opt('(q / d)')}", "১"),
        (f"A triangle has {opt('(3 / 4)')} sides.", "১")
    ]
    c2_ans = f"{seq_start+seq_step*3}; q; 3 sides"

    # C3 (2 marks): Coding / Analogy
    c3_qs = [
        (f"If A=1, B=2, C=3, then CAB = ?", "১"),
        (f"Bird : Fly :: Fish : {opt('(Run / Swim)')}", "১")
    ]
    c3_ans = "312; Swim"

    # C4 (2 marks): Olympiad Logic
    c4_qs = [
        (oly_q, "২")
    ]
    c4_ans = oly_a

    C = [
        ("C1. Classification / Odd One Out", "৩ নম্বর", {}, c1_qs),
        ("C2. Pattern & Spatial Logic", "৩ নম্বর", {}, c2_qs),
        ("C3. Coding & Analogy", "২ নম্বর", {}, c3_qs),
        ("C4. Olympiad Master Logic", "২ নম্বর", {}, c4_qs)
    ]
    ans_C = f"<b>C1:</b> {c1_ans}<br><b>C2:</b> {c2_ans}<br><b>C3:</b> {c3_ans}<br><b>C4:</b> {c4_ans}"


    DAYS.append(dict(n=d, sub=sub, foot=f"Day {d} • Revision Variant", A=A, B=B, C=C))
    ANS_DATA[d] = {"A": ans_A, "B": ans_B, "C": ans_C}

# HTML Generation
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
  h3.sub { font-size: 15px; color: #fff; background: #2b6cb0; padding: 4px 10px; margin: 15px 0 10px 0; border-radius: 4px; }
  .sec { margin-bottom: 20px; }
  .sec h4 { font-size: 14px; font-weight: bold; color: #2c5282; margin: 0 0 5px 0; border-bottom: 1px dashed #cbd5e0; padding-bottom: 2px; }
  .q { display: flex; margin-bottom: 5px; }
  .q .idx { width: 25px; font-weight: bold; color: #4a5568; }
  .q .txt { flex: 1; }
  .q .mk { width: 35px; text-align: right; color: #718096; font-size: 11px; }
  .hintbox { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 8px; margin-bottom: 10px; border-radius: 4px; font-size: 12px; }
  .passbox { border: 1px solid #e2e8f0; background: #f8fafc; padding: 8px; font-style: italic; margin-bottom: 8px; border-radius: 4px; }
  .pagefoot { position: absolute; bottom: 15mm; left: 20mm; right: 20mm; border-top: 1px solid #cbd5e0; padding-top: 5px; display: flex; justify-content: space-between; font-size: 11px; color: #a0aec0; }
  
  .ans-box { font-size: 11.5px; border: 1px solid #e2e8f0; padding: 10px; margin-bottom: 15px; background: #fafafa; border-radius: 6px; break-inside: avoid; }
  .ans-box h4 { margin: 0 0 8px 0; color: #2b6cb0; border-bottom: 2px solid #e2e8f0; padding-bottom: 3px; font-size: 14px; }
  .ans-row { margin-bottom: 6px; line-height: 1.5; }
  .ans-row b { color: #2d3748; }
  .trick { background: #fffaf0; border-left: 4px solid #f6ad55; padding: 10px; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
  .trick h5 { margin: 0 0 5px 0; color: #dd6b20; font-size: 14px; }
  .trick p { margin: 0; font-size: 13px; color: #4a5568; }
  
  .tracker { width: 100%; border-collapse: collapse; font-size: 11px; text-align: center; margin-top: 10px;}
  .tracker th, .tracker td { border: 1px solid #cbd5e0; padding: 4px; }
  .tracker th { background: #edf2f7; font-weight: bold; }
</style>
</head>
<body>
"""

HTML_COVER = """<section class="paper">
  <br><br><br><br>
  <h1 style="font-size: 36px; border:none; text-align: center;">FINAL 30-DAY COMPREHENSIVE REVISION</h1>
  <h2 style="font-size: 24px; color: #4a5568; text-align: center;">SOLIDIFYING 90-DAY LEARNING (DAY 91 – 120)</h2>
  <br><br>
  <div style="text-align: center; font-size: 16px; color: #2d3748; line-height: 1.6;">
    <p>Target Age: 6-7 Years (Primary Olympiad Preparation)</p>
    <p>Strict Format: Section A (10), Section B (10), Section C (10) = 30 Marks Daily</p>
    <p>30 Unique Testing Variants ensuring Zero Repetition</p>
  </div>
  <br><br><br>
  <div class="trick" style="margin: 0 40px; border-color: #38a169; background: #f0fff4;">
    <h5>কীভাবে এই রিভিশন ওয়ার্কবুক ব্যবহার করবেন?</h5>
    <p>১. <b>পূর্বের কাঠামোর পুনরাবৃত্তি:</b> এটি ঠিক আগের মাসগুলোর মতই A1-A4, B1-B4, C1-C4 ফরম্যাটে তৈরি। এতে শিশু পরিচিত প্যাটার্নেই পরীক্ষা দিতে পারবে।<br>
       ২. <b>Full Coverage:</b> গত ৯০ দিনের Grammar, Spelling, Mental Math, Fractions, 3-Digit Arithmetic, Coding এবং Series একসাথে ব্লেন্ড করা হয়েছে।<br>
       ৩. <b>30 Unique Logic Puzzles:</b> প্রতিদিন C4 সেকশনে একটি নতুন অলিম্পিয়াড লজিক পাজল দেওয়া হয়েছে।<br>
       ৪. <b>Answer Key with Explanations:</b> ওয়ার্কবুকের শেষে প্রতিটি উত্তরের সাথে লজিক্যাল ব্যাখ্যা ও রিভিশন ট্রিকস দেওয়া আছে।</p>
  </div>
  <div class="pagefoot"><span>PayNest API / Arena.ai</span><span>Variant Revision Edition</span></div>
</section>
"""

html_parts = [HTML_HEAD, HTML_COVER]

for day in DAYS:
    html_parts.append(worksheet(day))

# Answer Key Section
html_parts.append("""
<section class="paper">
  <h2 class="big">নির্ভুল উত্তর ও ব্যাখ্যা (Day 91-120)</h2>
  <p style="text-align:center; color:#4a5568; margin-bottom: 20px;">উত্তরের সাথে সাথে ব্র্যাকেটে লজিক্যাল ব্যাখ্যা দেওয়া হলো যাতে শিশুর কনসেপ্ট ক্লিয়ার হয়।</p>
  <div style='column-count: 2; column-gap: 15px;'>
""")

for d in range(91, 121):
    html_parts.append(f"""
    <div class="ans-box">
      <h4>Day {d}</h4>
      <div class="ans-row">{ANS_DATA[d]["A"]}</div>
      <div class="ans-row">{ANS_DATA[d]["B"]}</div>
      <div class="ans-row">{ANS_DATA[d]["C"]}</div>
    </div>
    """)
    if (d - 90) % 5 == 0 and d != 120:
        html_parts.append("</div></section><section class='paper'><div style='column-count: 2; column-gap: 15px;'>")

html_parts.append("</div>")
html_parts.append("""<div class="pagefoot"><span>Variant Keys & Explanations</span><span>Revision</span></div></section>""")

# Master Tricks & Tracker Section
html_parts.append("""
<section class="paper">
  <h2 class="big">Solidifying Tricks: কনসেপ্ট চিরস্থায়ী করার কৌশল</h2>
  <h3 class="sub">রিভিশন মাস্টার ক্লাস</h3>
  
  <div class="trick"><h5>১. The "Draw It" Rule (লজিক পাজল সমাধান)</h5>
  <p>যেকোনো অলিম্পিয়াড পাজল (যেমন বানরের গাছে ওঠা, লাঠি ভাঙা) মুখে মুখে হিসাব না করে শিশুকে খাতায় দাগ টেনে বা ছবি এঁকে সমাধান করতে শেখান। এতে ভুল হওয়ার সম্ভাবনা শূন্য হয়ে যায়।</p></div>

  <div class="trick"><h5>২. Math: Check by Reverse (উল্টো চেক)</h5>
  <p>যোগ করার পর বিয়োগ করে এবং গুণ করার পর ভাগ করে নিজের উত্তর নিজেকেই চেক করতে শেখান। যেমন: 15 + 12 = 27 হলে, 27 - 12 = 15 হয় কি না তা মিলিয়ে দেখতে বলুন। এটি Self-Correction স্কিল বাড়ায়।</p></div>

  <div class="trick"><h5>৩. Grammar: Action Acting (অভিনয় করে শেখা)</h5>
  <p>Verb এবং Adverb শেখার সময় শিশুকে সেটি অভিনয় করে দেখাতে বলুন। যেমন: "Run Slowly" বললে সে ধীরে দৌড়াবে, "Speak loudly" বললে জোরে কথা বলবে। ফিজিক্যাল মুভমেন্ট ব্রেইনে পড়া গেঁথে দেয়।</p></div>

  <div class="trick"><h5>৪. Word Problem: "Key Word" Highlighting</h5>
  <p>প্রশ্নে "Total", "Altogether" থাকলে যোগ (+), "Left", "Change" থাকলে বিয়োগ (-) হয়। শিশুকে পেন্সিল দিয়ে প্রশ্নে এই শব্দগুলো গোল দাগ (Highlight) করতে শেখান।</p></div>

  <h2 class="big" style="margin-top: 40px;">Final Master Progress Tracker</h2>
  <table class="tracker">
    <tr><th>Day</th><th>English (10)</th><th>Math (10)</th><th>Logic (10)</th><th>Total (30)</th><th>Signature</th></tr>
""")
for d in range(91, 121):
    html_parts.append(f'<tr><td>Day {d}</td><td></td><td></td><td></td><td></td><td></td></tr>')
html_parts.append("""
  </table>
  <div class="pagefoot"><span>Master Tricks & Tracker</span><span>Revision</span></div>
</section>
</body></html>
""")

with open(OUT, "w", encoding="utf-8") as f:
    f.write("\n".join(html_parts))

print(f"Generated {OUT}")
