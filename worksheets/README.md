# Day 21–30 Worksheet Pack

দুটি ফরম্যাটে একই কনটেন্ট:

| ফাইল | কী |
|---|---|
| `day-21-30-worksheets.pdf` | **ডাউনলোড/প্রিন্ট-রেডি PDF** (A4, ১৬ পৃষ্ঠা) |
| `day-21-30-worksheets.html` | সোর্স ফাইল — ব্রাউজারে খুলে Ctrl+P দিয়েও প্রিন্ট করা যায় |
| `build_pdf.py` | HTML → PDF রেন্ডারার (fpdf2 + HarfBuzz shaping) |

## PDF-এর কাঠামো (১৬ পৃষ্ঠা)

1. কভার — কাঠামো, টপিক মানচিত্র, পরিচালনার নির্দেশাবলী, গ্রেড রুব্রিক
2–11. **Day 21 – Day 30**, প্রতিটি এক পৃষ্ঠায় সম্পূর্ণ প্রশ্নপত্র (৩০ নম্বর, ৭৫ মিনিট)
12. সম্পূর্ণ উত্তরপত্র (Section A/B/C × ১০ দিন)
13–14. ব্যাখ্যা + ১৬টি Best Trick + দিনভিত্তিক শিক্ষাগত যুক্তি
15–16. Progress Tracking, Day 1 vs Day 30 KPI তুলনা, Adaptive Rule, সনদপত্র

## PDF আবার তৈরি করতে হলে

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

/tmp/pdfenv/bin/python build_pdf.py
```

লাতিন অক্ষর, সংখ্যা ও জ্যামিতিক আকৃতির (● ■ ▲ → ↑) জন্য সিস্টেমের DejaVu Sans
fallback হিসেবে ব্যবহৃত হয়। প্রতিটি ওয়ার্কশিট যাতে ঠিক এক পৃষ্ঠায় বসে, তার জন্য
স্ক্রিপ্ট প্রতিটি সেকশন ড্রাই-রান করে সবচেয়ে বড় উপযুক্ত স্কেল বেছে নেয়।

> নোট: এই ফোল্ডারটি PayNest API কোডবেসের অংশ নয় — শুধু ডকুমেন্ট আউটপুট রাখার জন্য।
