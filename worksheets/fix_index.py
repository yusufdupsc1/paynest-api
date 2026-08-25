import re
import os

f = "/home/user/paynest-api/worksheets/index.html"
txt = open(f).read()

# Fix Month 1 page count
txt = txt.replace("৪৭ পৃষ্ঠা", "৪৫ পৃষ্ঠা")
txt = txt.replace("৪৫–৪৭", "৪৪–৪৫")
txt = txt.replace("৩৯–৪৪", "৩৭–৪৩")
txt = txt.replace("৩৬–৩৮", "৩৪–৩৬")
txt = txt.replace("৪–৩৫", "৪–৩৩")

# Add Month 2 section
new_button = """
    <a href="day-01-30-workbook.pdf" class="btn" download>
      📄 Download Complete Workbook (Day 1-30) PDF
      <br><small style="font-size: 11px; opacity: 0.8;">45 Pages • ~715 KB • 100% Print Ready</small>
    </a>
    
    <a href="day-31-60-workbook.pdf" class="btn btn-alt" download style="background: #2c5282;">
      📄 Download Month 2 Workbook (Day 31-60) PDF
      <br><small style="font-size: 11px; opacity: 0.8;">32 Pages • ~600 KB • Advanced Level</small>
    </a>
"""
txt = re.sub(r'<a href="day-01-30-workbook.pdf" class="btn".*?</a>', new_button, txt, flags=re.S)

open(f, "w").write(txt)
