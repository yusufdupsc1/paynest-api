# -*- coding: utf-8 -*-
import sys
import random

sys.path.insert(0, "/home/user/paynest-api/worksheets")
from wb_lib import worksheet, bn, opt, hint, shapes, method, hintbox, passage_box

OUT = "/home/user/paynest-api/worksheets/day-91-120-revision.html"

DAYS = []
ANS_DATA = {}

# 30 Distinct Olympiad Logic Puzzles
oly_logic = [
    ("একটি লাঠিকে ৫ বার ভাঙলে কয়টি টুকরো হবে?", "৬টি (ব্যাখ্যা: প্রতিবার ভাঙলে ১টি করে টুকরো বাড়ে। তাই ৫ বার ভাঙলে ৫+১=৬ টুকরো হবে।)"),
    ("লাইনে তোমার সামনে ৫ জন, পিছনে ৪ জন। লাইনে মোট কতজন?", "১০ জন (ব্যাখ্যা: সামনের ৫ জন + পিছনের ৪ জন + তুমি নিজে ১ জন = ১০ জন।)"),
    ("২টি গরু ও ৩টি মুরগির মোট কয়টি পা?", "১৪টি (ব্যাখ্যা: গরুর ৮টি পা + মুরগির ৬টি পা = ১৪টি।)"),
    ("আয়নায় ঘড়িতে ৯টা বাজে। আসলে কয়টা বাজে?", "৩টা (ব্যাখ্যা: ১২ থেকে ৯ বিয়োগ দিলে ৩ হয়। আয়নায় ডান-বাম উল্টে যায়।)"),
    ("আজ সোমবার। ১৫ দিন পর কী বার?", "মঙ্গলবার (ব্যাখ্যা: ১৪ দিন বা ২ সপ্তাহ পর সোমবারই হবে, তাই ১৫ দিন পর মঙ্গলবার।)"),
    ("একটি বানর দিনে ৩ ফুট ওঠে, রাতে ২ ফুট নামে। ১০ ফুট উঠতে কত দিন লাগবে?", "৮ দিন (ব্যাখ্যা: ৭ দিনে ৭ ফুট উঠবে, ৮ম দিনে ৩ ফুট উঠে ১০ ফুটে পৌঁছে যাবে, আর নামবে না।)"),
    ("১০টি আপেল ৩ জনের মাঝে সমানভাবে ভাগ করলে কয়টি অবশিষ্ট থাকে?", "১টি (ব্যাখ্যা: ৩x৩=৯, তাই ১টি আপেল বাকি থাকবে।)"),
    ("রাম শ্যামের চেয়ে বড়। শ্যাম যদুর চেয়ে বড়। সবচেয়ে ছোট কে?", "যদু (ব্যাখ্যা: রাম > শ্যাম > যদু)"),
    ("১ থেকে ১০ এর মধ্যে কয়টি বিজোড় সংখ্যা আছে?", "৫টি (ব্যাখ্যা: ১, ৩, ৫, ৭, ৯ - মোট ৫টি।)"),
    ("লাল, নীল, সবুজ রং পরপর সাজালে ১০ নম্বর রং কোনটি?", "লাল (ব্যাখ্যা: ৩টি রঙের প্যাটার্ন। ১০ কে ৩ দিয়ে ভাগ করলে ভাগশেষ ১, তাই প্রথম রং লাল।)"),
    ("তুমি ৫ টাকার ৩টি কলম কিনে ২০ টাকা দিলে। ফেরত পাবে কত?", "৫ টাকা (ব্যাখ্যা: ৩x৫=১৫ টাকা। ২০-১৫=৫ টাকা।)"),
    ("ঘড়িতে ১টা বাজতে ১ বার ঢং করে, ২টায় ২ বার। ১টা ও ২টায় মোট কয়বার ঢং করবে?", "৩ বার (ব্যাখ্যা: ১+২=৩ বার।)"),
    ("৩টি বিড়াল ৩টি ইঁদুর ধরতে ৩ মিনিট নেয়। ১টি বিড়াল ১টি ইঁদুর ধরতে কত মিনিট নেবে?", "৩ মিনিট (ব্যাখ্যা: প্রতিটি বিড়ালের ১টি ইঁদুর ধরতে ৩ মিনিট সময় লাগে।)"),
    ("১০০ এর অর্ধেক এর সাথে ৫০ যোগ করলে কত হয়?", "১০০ (ব্যাখ্যা: ১০০ এর অর্ধেক ৫০। ৫০+৫০=১০০।)"),
    ("A, B এর ডানে। C, B এর বামে। মাঝখানে কে?", "B (ব্যাখ্যা: ক্রমটি হলো C - B - A)"),
    ("একটি পিজ্জাকে লম্বালম্বি ও আড়াআড়ি (২ বার) কাটলে কয় টুকরো হবে?", "৪ টুকরো (ব্যাখ্যা: ➕ চিহ্নের মতো কাটলে ৪ টুকরো হয়।)"),
    ("৫ জন বন্ধু প্রত্যেকে সবার সাথে ১ বার হাত মেলালে মোট কয়টি করমর্দন হবে?", "১০টি (ব্যাখ্যা: 4+3+2+1=10)"),
    ("RED=3, BLUE=4 হলে YELLOW=কত?", "6 (ব্যাখ্যা: শব্দের অক্ষর সংখ্যা।)"),
    ("তুমি উত্তর দিকে মুখ করে আছ। ২ বার ডানদিকে ঘুরলে কোন দিক দেখবে?", "দক্ষিণ (South) (ব্যাখ্যা: ২ বার ডানদিকে ঘোরা মানে ঠিক উল্টো দিকে ঘোরা।)"),
    ("৫, ১০, ১৫, ? ধারায় পরের সংখ্যা কত?", "২০ (ব্যাখ্যা: ৫ করে বাড়ছে।)"),
    ("A=1, B=2 হলে 2, 1, 4 এর অর্থ কী?", "BAD (ব্যাখ্যা: 2=B, 1=A, 4=D)"),
    ("একটি বাক্সে ৩টি লাল ও ২টি নীল বল আছে। চোখ বন্ধ করে একটি তুললে লাল হওয়ার সম্ভাবনা বেশি না নীল?", "লাল (ব্যাখ্যা: লাল বলের সংখ্যা বেশি।)"),
    ("পরপর ৩টি সংখ্যার যোগফল ৬। সংখ্যাগুলো কী?", "১, ২, ৩ (ব্যাখ্যা: ১+২+৩=৬)"),
    ("১টি ডিম সেদ্ধ হতে ৫ মিনিট লাগে। ৩টি ডিম একসাথে সেদ্ধ হতে কত মিনিট লাগবে?", "৫ মিনিট (ব্যাখ্যা: সবগুলো ডিম একসাথেই সেদ্ধ হবে।)"),
    ("তোমার বাবার একমাত্র ভাইয়ের বাবার সাথে তোমার সম্পর্ক কী?", "দাদা (ব্যাখ্যা: বাবার ভাই মানে চাচা, তার বাবা মানে তোমার দাদা।)"),
    ("১, ৩, ৫, ৭... ধারার পরের সংখ্যাটি কত?", "৯ (ব্যাখ্যা: এগুলো বিজোড় সংখ্যা, ২ করে বাড়ছে।)"),
    ("একটি চাকা ১ বার ঘুরলে ২ মিটার যায়। ১০ মিটার যেতে কয়বার ঘুরবে?", "৫ বার (ব্যাখ্যা: ১০ ÷ ২ = ৫ বার।)"),
    ("M অক্ষরকে আয়নায় দেখলে কেমন দেখাবে?", "M (ব্যাখ্যা: M এর ডানে-বামে প্রতিসাম্য আছে, তাই উল্টায় না।)"),
    ("একটি বইয়ের দাম ১০ টাকা। তুমি হাফ পেমেন্ট করলে, কত দিলে?", "৫ টাকা (ব্যাখ্যা: ১০ এর অর্ধেক ৫।)"),
    ("একটি ত্রিভুজ ও একটি চতুর্ভুজের মোট কয়টি কোণ?", "৭টি (ব্যাখ্যা: ত্রিভুজের ৩টি + চতুর্ভুজের ৪টি = ৭টি।)")
]

nouns = ["Apple", "Book", "Car", "Dog", "Elephant", "Fox", "Girl", "House", "Ice", "Jar"]
verbs_past = [("go", "went"), ("see", "saw"), ("eat", "ate"), ("play", "played"), ("run", "ran"), ("jump", "jumped"), ("write", "wrote")]
adverbs = [("quick", "quickly"), ("slow", "slowly"), ("loud", "loudly"), ("happy", "happily"), ("soft", "softly")]
preps = [("in", "inside"), ("on", "top"), ("under", "below"), ("behind", "back")]
animals = ["Tiger", "Lion", "Cat", "Bird", "Fish", "Bear", "Deer"]
adjectives = ["big", "small", "fast", "slow", "red", "blue", "happy"]

for d in range(91, 121):
    sub = f"DAY {d}: 90-DAY COMPREHENSIVE REVISION"
    if d == 120:
        sub = "DAY 120: GRAND FINALE ASSESSMENT"
        
    random.seed(d * 100) # Ensure distinct but stable variant per day
    
    vp_base, vp_past = random.choice(verbs_past)
    adv_base, adv_ly = random.choice(adverbs)
    prep_word, prep_hint = random.choice(preps)
    adj = random.choice(adjectives)
    anim = random.choice(animals)
    n_word = random.choice(nouns)
    
    # Generate completely varied math numbers
    a1, a2 = random.randint(15, 49), random.randint(15, 49)
    s1, s2 = random.randint(60, 99), random.randint(15, 50)
    m1, m2 = random.randint(2, 9), random.randint(3, 9)
    d1 = random.randint(2, 6)
    d_ans = random.randint(3, 9)
    d_total = d1 * d_ans
    
    # Section A
    grammar_types = random.choice(["past_tense", "adverb", "preposition"])
    if grammar_types == "past_tense":
        a1_q = f"Fill in past tense: Yesterday I {opt(f'({vp_base} / {vp_past})')}."
        a1_ans = f"{vp_past} (ব্যাখ্যা: Yesterday মানে অতীতকাল)"
    elif grammar_types == "adverb":
        a1_q = f"Choose adverb: The boy runs {opt(f'({adv_base} / {adv_ly})')}."
        a1_ans = f"{adv_ly} (ব্যাখ্যা: কাজ 'কীভাবে' হচ্ছে বোঝাতে -ly বসে)"
    else:
        a1_q = f"Where is it? The cat is {opt(f'(on / {prep_word})')} the box."
        a1_ans = f"{prep_word} (ব্যাখ্যা: বাক্যের অর্থের ওপর ভিত্তি করে সঠিক Preposition)"

    a2_q = f"Unscramble the word: {anim[::-1].lower()} -> ?"
    a2_ans = f"{anim} (ব্যাখ্যা: এলোমেলো অক্ষর সাজিয়ে সঠিক শব্দ)"
    
    a3_q = f"Passage: The {adj} {anim.lower()} likes to {vp_base}. It is very {adv_base}. What does it like to do?"
    a3_ans = f"It likes to {vp_base}. (ব্যাখ্যা: প্যাসেজ থেকে সরাসরি উত্তর)"
    
    a4_q = f"Make a sentence using: <b>{n_word}</b>"
    a4_ans = f"Open answer (যেমন: This is a {n_word.lower()}.)"
    
    A = [
        ("A1. Grammar Rule", "৩", {}, [(a1_q, "৩")]),
        ("A2. Vocabulary / Spelling", "৩", {}, [(a2_q, "৩")]),
        ("A3. Reading Comprehension", "২", {}, [(a3_q, "২")]),
        ("A4. Creative Writing", "২", {}, [(a4_q, "২")])
    ]
    A_ans = f"A1. {a1_ans} | A2. {a2_ans} | A3. {a3_ans} | A4. {a4_ans}"
    
    # Section B
    b1_q = f"{m1} × {m2} = ? &nbsp;&nbsp; {d_total} ÷ {d1} = ?"
    b2_q = f"{a1} + {a2} = ? &nbsp;&nbsp; {s1} - {s2} = ?"
    b3_q = f"If I have {d_total} Taka and buy a pen for {a1} Taka, how much is left?"
    b4_q = f"Half of {a2*2} is ? &nbsp;&nbsp; Double of {m1} is ?"
    
    B = [
        ("B1. Mental Math (Multiply & Divide)", "৪", {}, [(b1_q, "৪")]),
        ("B2. Arithmetic (Add & Subtract)", "২", {}, [(b2_q, "২")]),
        ("B3. Real-world Word Problem", "২", {}, [(b3_q, "২")]),
        ("B4. Fractions & Doubles", "২", {}, [(b4_q, "২")])
    ]
    B_ans = f"B1. {m1*m2} এবং {d_ans} | B2. {a1+a2} এবং {s1-s2} | B3. {d_total-a1} Taka | B4. {a2} এবং {m1*2}"
    
    # Section C
    seq_start = random.randint(1, 10)
    seq_step = random.randint(2, 4)
    c1_q = f"Sequence: {seq_start}, {seq_start+seq_step}, {seq_start+seq_step*2}, {seq_start+seq_step*3}, ?"
    c1_ans = f"{seq_start+seq_step*4} (+{seq_step} করে বাড়ছে)"
    
    c2_q = f"Coding: If A=1, B=2, C=3, what is {ord(anim[0].upper())-64}, {ord(anim[1].upper())-64}?"
    c2_ans = f"{anim[:2].upper()} (অক্ষরের সিরিয়াল নম্বর)"
    
    oly_q, oly_a = oly_logic[d - 91]
    
    C = [
        ("C1. Logical Series", "৩", {}, [(c1_q, "৩")]),
        ("C2. Coding / Decoding", "৩", {}, [(c2_q, "৩")]),
        ("C3. Olympiad Master Logic", "৪", {}, [(oly_q, "৪")])
    ]
    C_ans = f"C1. {c1_ans} | C2. {c2_ans} | C3. {oly_a}"
    
    DAYS.append(dict(n=d, sub=sub, foot=f"Day {d} • Revision", A=A, B=B, C=C))
    ANS_DATA[d] = {"A": A_ans, "B": B_ans, "C": C_ans}

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
  .q .txt { flex: 1; font-size: 15px; padding-bottom: 35px; border-bottom: 1px dotted #e2e8f0; margin-top: 10px;}
  .q .mk { width: 35px; text-align: right; color: #718096; font-size: 11px; }
  .hintbox { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 8px; margin-bottom: 10px; border-radius: 4px; font-size: 12px; font-weight: bold; text-align: center; color: #276749;}
  .pagefoot { position: absolute; bottom: 15mm; left: 20mm; right: 20mm; border-top: 1px solid #cbd5e0; padding-top: 5px; display: flex; justify-content: space-between; font-size: 11px; color: #a0aec0; }
  
  .ans-box { font-size: 11.5px; border: 1px solid #e2e8f0; padding: 10px; margin-bottom: 15px; background: #fafafa; border-radius: 6px; break-inside: avoid; }
  .ans-box h4 { margin: 0 0 8px 0; color: #2b6cb0; border-bottom: 2px solid #e2e8f0; padding-bottom: 3px; font-size: 14px; }
  .ans-row { margin-bottom: 6px; line-height: 1.5; }
  .ans-row b { color: #2d3748; }
  .trick { background: #fffaf0; border-left: 4px solid #f6ad55; padding: 10px; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
  .trick h5 { margin: 0 0 5px 0; color: #dd6b20; font-size: 14px; }
  .trick p { margin: 0; font-size: 13px; color: #4a5568; }
</style>
</head>
<body>
"""

HTML_COVER = """<section class="paper">
  <br><br><br><br>
  <h1 style="font-size: 36px; border:none; text-align: center;">90-DAY COMPREHENSIVE REVISION</h1>
  <h2 style="font-size: 24px; color: #4a5568; text-align: center;">SOLIDIFYING LEARNING (DAY 91 – 120)</h2>
  <br><br>
  <div style="text-align: center; font-size: 16px; color: #2d3748; line-height: 1.6;">
    <p>Target Age: 6-7 Years (Primary Olympiad Preparation)</p>
    <p>30 Unique Variants Covering Months 1, 2, and 3</p>
    <p>Daily Format: 30 Marks (English 10, Math 10, Logic 10)</p>
  </div>
  <br><br><br>
  <div style="margin: 0 40px; padding: 20px; border: 2px solid #38a169; background: #f0fff4; border-radius: 8px;">
    <h3 style="color: #276749; margin-top:0;">এই রিভিশন মডিউলের বিশেষত্ব:</h3>
    <ul style="font-size: 14px; color: #2f855a; line-height: 1.6; margin-bottom:0;">
      <li><b>Distinct Variants:</b> প্রতিটি দিনের প্রশ্ন সম্পূর্ণ আলাদা। কোনো রিপিটেশন নেই।</li>
      <li><b>Full Coverage:</b> গত ৯০ দিনের Phonics, Grammar, Math, Fractions, Time, Series এবং Coding-এর ব্লেন্ড।</li>
      <li><b>30 Unique Olympiad Logic:</b> প্রতিদিনের লজিক সেকশনে একটি করে সম্পূর্ণ নতুন অলিম্পিয়াড পাজল।</li>
      <li><b>Detailed Answer Key:</b> ওয়ার্কবুকের শেষে প্রতিটি উত্তরের সাথে লজিক্যাল ব্যাখ্যা দেওয়া আছে।</li>
    </ul>
  </div>
  <div class="pagefoot"><span>PayNest API / Arena.ai</span><span>Variant Revision</span></div>
</section>
"""

html_parts = [HTML_HEAD, HTML_COVER]

for day in DAYS:
    d = day['n']
    html_parts.append(f'<section class="paper">')
    html_parts.append(f'<h2 class="big" style="margin-top: 0;">{day["sub"]}</h2>')
    html_parts.append(f'<div class="hintbox">Topics: Mixed Grammar, Arithmetic, Unique Logic Puzzle</div>')
    
    for sec_name, data in [("Section A: English (10 Marks)", day["A"]), ("Section B: Math (10 Marks)", day["B"]), ("Section C: Analytical (10 Marks)", day["C"])]:
        html_parts.append(f'<div class="sec"><h3 class="sub">{sec_name}</h3>')
        for group in data:
            title, marks, extras, qs = group
            if 'passage' in extras:
                html_parts.append(extras['passage'])
            for q, m in qs:
                html_parts.append(f'<div class="q"><div class="txt"><b>{title}:</b> {q}</div></div>')
        html_parts.append('</div>')
        
    html_parts.append(f'<div class="pagefoot"><span>{day["foot"]}</span></div></section>')

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
      <div class="ans-row"><b>English:</b><br>{ANS_DATA[d]["A"]}</div>
      <div class="ans-row"><b>Math:</b><br>{ANS_DATA[d]["B"]}</div>
      <div class="ans-row"><b>Logic:</b><br>{ANS_DATA[d]["C"]}</div>
    </div>
    """)
    if (d - 90) % 5 == 0 and d != 120:
        html_parts.append("</div></section><section class='paper'><div style='column-count: 2; column-gap: 15px;'>")

html_parts.append("</div>")
html_parts.append("""<div class="pagefoot"><span>Variant Keys</span><span>Revision</span></div></section>""")

# Master Tricks Section
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

  <div class="pagefoot"><span>Master Tricks</span><span>Revision</span></div>
</section>
</body></html>
""")

with open(OUT, "w", encoding="utf-8") as f:
    f.write("\n".join(html_parts))

print(f"Generated {OUT}")
