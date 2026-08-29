# Primary Olympiad Preparation Program — Worksheet Pack

৬–৭ বছর বয়সী শিশুর জন্য ৩০ দিনের সম্পূর্ণ অনুশীলন ওয়ার্কবুক।
দৈনিক ৩০ নম্বর = English (১০) + Mathematics &amp; Mental Reasoning (১০) + Analytical Ability (১০)।

| ফাইল | কী |
|---|---|
| `day-01-30-workbook.pdf` | **সম্পূর্ণ ওয়ার্কবুক (Day 1–30)** — A4, ৪৫ পৃষ্ঠা, প্রিন্ট-রেডি |
| `day-21-30-worksheets.pdf` | শুধু চতুর্থ পর্ব (Day 21–30), ১৮ পৃষ্ঠা |
| `day-01-30-workbook.html` / `day-21-30-worksheets.html` | HTML সোর্স (ব্রাউজারে Ctrl+P দিয়েও প্রিন্ট করা যায়) |
| `index.html` | ডাউনলোড পেজ |

## সম্পূর্ণ ওয়ার্কবুকের বিন্যাস (৪৫ পৃষ্ঠা)

1. **পৃষ্ঠা ১–৩** — কভার, ৩০ দিনের মাস্টার টপিক ম্যাট্রিক্স, ব্যবহারবিধি ও উপকরণ তালিকা
2. **পৃষ্ঠা ৪–৩৫** — Day 1 থেকে Day 30 পর্যন্ত দৈনিক প্রশ্নপত্র (প্রতিটি ৩০ নম্বর, ৭৫ মিনিট)
   • সাপ্তাহিক চেকপয়েন্ট: Day 7, 14, 21 • চূড়ান্ত মূল্যায়ন: Day 30
3. **পৃষ্ঠা ৩৬–৩৮** — সম্পূর্ণ উত্তরপত্র (Day 1–10, 11–20, 21–30)
4. **পৃষ্ঠা ৩৯–৪৪** — Best Tricks: শেখানোর ৩৮টি কৌশল ও প্রশ্নভিত্তিক ব্যাখ্যা
5. **পৃষ্ঠা ৪৫–৪৭** — ৩০ দিনের প্রোগ্রেস ট্র্যাকার, Day 1 vs Day 30 KPI তুলনা, Adaptive Rule, সনদপত্র

## সোর্স ফাইল

| ফাইল | কাজ |
|---|---|
| `wb_lib.py` | ওয়ার্কশিট HTML তৈরির হেল্পার (section, group, shapes, grid, passage …) |
| `wb_days_01_10.py`, `wb_days_11_20.py` | Day 1–20 এর প্রশ্ন-কনটেন্ট (ডেটা) |
| `make_workbook.py` | কভার + Day 1–20 + Day 21–30 + উত্তরপত্র + ট্রিকস + ট্র্যাকার একসাথে জোড়া দিয়ে ওয়ার্কবুক HTML তৈরি করে |
| `build_pdf.py` | HTML → PDF রেন্ডারার (fpdf2 + HarfBuzz বাংলা shaping, প্রতি সেকশনে auto-fit) |

## আবার তৈরি করতে হলে

```bash
python3 -m venv /tmp/pdfenv
/tmp/pdfenv/bin/pip install fpdf2 uharfbuzz fonttools

# বাংলা ফন্ট (Noto Sans Bengali) — @fontsource প্যাকেজ থেকে woff → ttf
curl -sL -o /tmp/fs.tgz https://registry.npmjs.org/@fontsource/noto-sans-bengali/-/noto-sans-bengali-5.3.0.tgz
mkdir -p /tmp/fs /tmp/fonts && tar xzf /tmp/fs.tgz -C /tmp/fs
/tmp/pdfenv/bin/python - <<'PY'
from fontTools.ttLib import TTFont
for w, out in [("400", "Regular"), ("700", "Bold")]:
    f = TTFont(f"/tmp/fs/package/files/noto-sans-bengali-bengali-{w}-normal.woff")
    f.flavor = None
    f.save(f"/tmp/fonts/NotoBengali-{out}.ttf")
PY

python3 make_workbook.py                                              # HTML তৈরি
/tmp/pdfenv/bin/python build_pdf.py day-01-30-workbook.html day-01-30-workbook.pdf
```

লাতিন অক্ষর, সংখ্যা ও জ্যামিতিক আকৃতির (● ■ ▲ ★ → ↑) জন্য সিস্টেমের DejaVu Sans fallback হিসেবে ব্যবহৃত হয়।
প্রতিটি ওয়ার্কশিট যাতে এক পৃষ্ঠায় বসে, তার জন্য বিল্ডার প্রতিটি সেকশন ড্রাই-রান করে সবচেয়ে বড় উপযুক্ত স্কেল বেছে নেয়।

## নোট

- আগের চ্যাটে ইমোজি দিয়ে দেখানো ছবিগুলো (🍎 🚗 🔺) প্রিন্টের উপযোগী করতে **শব্দ ও রঙিন জ্যামিতিক আকৃতিতে**
  (Apple, Car, ▲ ●) রূপান্তর করা হয়েছে — প্রশ্নের বিষয়বস্তু অপরিবর্তিত।
- আগের উত্তরপত্রে থাকা কয়েকটি স্পষ্ট টাইপো (যেমন প্যাটার্নের পরের ধাপের বদলে আগের ধাপ লেখা) সংশোধন করা হয়েছে।
- এই ফোল্ডারটি PayNest API কোডবেসের অংশ নয় — শুধু ডকুমেন্ট আউটপুট।

### Month 2 Workbook (Day 31–60)
* **Target:** Advanced Level (2nd Month)
* **Focus:** 3-Digit operations, Multiplication, Division Intro, Prepositions, Deductive Logic.
* **Files:** 
  * `day-31-60-workbook.pdf` — A4, 32 পৃষ্ঠা (Print Ready)
  * `day-31-60-workbook.html` — HTML Source
  * Generated from `wb_days_31_40.py`, `wb_days_41_50.py`, `wb_days_51_60.py`.

### Month 3 Workbook (Day 61–90)
* **Target:** Advanced Olympiad Mastery Level (3rd Month)
* **Focus:** Logic Puzzles, Mental Math, Adverbs, Past Tenses, Conjunctions.
* **Special:** Includes Answer Key + Explanations for all 30 days and 6 new teaching Tricks at the end of the workbook.
* **Files:** 
  * `day-61-90-workbook.pdf` — A4, 45 পৃষ্ঠা (Print Ready)
  * `day-61-90-workbook.html` — HTML Source

### Revision & Concrete Learning Workbook (Day 91–120)
* **Target:** Comprehensive Solidifying Revision (4th Month)
* **Focus:** 30 Distinct Variants covering all fundamentals from Month 1, 2, and 3. No repetitions.
* **Special:** Contains 30 full mock test days, 30 Unique Olympiad Logic Puzzles, and a fully explained logical Answer Key.
* **Files:** 
  * `day-91-120-revision.pdf` — A4, 38 পৃষ্ঠা (Print Ready)
  * `day-91-120-revision.html` — HTML Source

### Revision & Concrete Learning Workbook (Day 91–120)
* **Target:** Full Format Solidifying Revision (4th Month)
* **Focus:** 30 Distinct Variants strictly following the original 30-Marks Full Format (A: 10, B: 10, C: 10). Covers all fundamentals from Month 1, 2, and 3 without repetitions.
* **Special:** Contains 30 Unique Olympiad Logic Puzzles, detailed logical Answer Key, and Solidifying Tricks.
* **Files:** 
  * `day-91-120-revision.pdf` — A4, 44 পৃষ্ঠা (Print Ready)
  * `day-91-120-revision.html` — HTML Source
