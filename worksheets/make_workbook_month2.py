# -*- coding: utf-8 -*-
"""Assemble the complete Day 31–60 workbook HTML."""
import sys

sys.path.insert(0, "/home/user/paynest-api/worksheets")

from wb_lib import worksheet, bn  # noqa: E402
import wb_days_31_40 as d3  # noqa: E402
import wb_days_41_50 as d4  # noqa: E402
import wb_days_51_60 as d5  # noqa: E402

OUT = "/home/user/paynest-api/worksheets/day-31-60-workbook.html"

# Combine all days
ALL_DAYS = d3.DAYS + d4.DAYS + d5.DAYS

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
  
  /* Answer Key & Tricks */
  table.ans { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 12px; }
  table.ans th, table.ans td { border: 1px solid #cbd5e0; padding: 6px; text-align: left; }
  table.ans th { background: #edf2f7; color: #2d3748; font-weight: bold; }
  table.ans td.d { font-weight: bold; text-align: center; }
  .trick { background: #fffaf0; border-left: 4px solid #f6ad55; padding: 10px; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
  .trick h5 { margin: 0 0 5px 0; color: #dd6b20; font-size: 14px; }
  .trick p { margin: 0; font-size: 13px; color: #4a5568; }
  
  .tracker { width: 100%; border-collapse: collapse; font-size: 11px; text-align: center; }
  .tracker th, .tracker td { border: 1px solid #cbd5e0; padding: 4px; }
  .tracker th { background: #edf2f7; font-weight: bold; }
</style>
</head>
<body>
"""

HTML_COVER = """<section class="paper">
  <br><br><br><br>
  <h1 style="font-size: 36px; border:none;">PRIMARY MATH OLYMPIAD & LOGIC</h1>
  <h2 style="font-size: 24px; color: #4a5568;">MONTH 2 WORKBOOK (DAY 31 – 60)</h2>
  <br><br>
  <div style="text-align: center; font-size: 16px; color: #2d3748;">
    <p>Target Age: 6-7 Years (Advanced Level)</p>
    <p>Daily Routine: 30 Marks (English 10, Math 10, Logic 10)</p>
    <p>Outcome Oriented & Measurable Growth</p>
  </div>
  <br><br><br>
  <div class="trick" style="margin: 0 40px; border-color: #4299e1; background: #ebf8ff;">
    <h5>গুরুত্বপূর্ণ নির্দেশিকা (Parents / Teachers):</h5>
    <p>১. দ্বিতীয় মাসের লেভেল একটু কঠিন। শিশুকে জোর করবেন না।<br>
       ২. প্রতিদিন ১টি ওয়ার্কশিট (১৫-২০ মিনিট) সমাধান করান।<br>
       ৩. ভুল হলে বকা দেবেন না, বরং শেষের <b>Best Tricks</b> অংশ থেকে কৌশল প্রয়োগ করুন।<br>
       ৪. প্রতি ১০ দিন পর Answer Key মিলিয়ে Tracker-এ মার্কস তুলুন।</p>
  </div>
  <div class="pagefoot"><span>PayNest API / Arena.ai</span><span>Month 2</span></div>
</section>
"""

# HTML Assembly
html_parts = [HTML_HEAD, HTML_COVER]

for day in ALL_DAYS:
    html_parts.append(worksheet(day))

html_parts.append("""
<section class="paper">
  <h2 class="big">Master Progress Tracker (Month 2)</h2>
  <p style="text-align:center">প্রতিদিনের প্রাপ্ত নম্বর এখানে লিখে রাখুন।</p>
  <table class="tracker">
    <tr><th>Day</th><th>English (10)</th><th>Math (10)</th><th>Logic (10)</th><th>Total (30)</th><th>Signature</th></tr>
""")
for d in range(31, 61):
    html_parts.append(f'<tr><td>Day {d}</td><td></td><td></td><td></td><td></td><td></td></tr>')
html_parts.append("""
  </table>
  <div class="pagefoot"><span>Progress Tracker</span><span>Month 2</span></div>
</section>
</body>
</html>
""")

with open(OUT, "w", encoding="utf-8") as f:
    f.write("\n".join(html_parts))

print(f"Generated {OUT}")
