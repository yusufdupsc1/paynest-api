"""Shared helpers for building worksheet HTML in the workbook markup."""

LS = '<span class="ln ln-s"></span>'
LM = '<span class="ln ln-m"></span>'
LL = '<span class="ln ln-l"></span>'
LF = '<span class="ln-full"></span>'

COLOR_CLASS = {"r": "r", "b": "b", "g": "g", "y": "y", "p": "p", "k": ""}


def opt(text):
    return f'<span class="opt">{text}</span>'


def hint(text):
    return f'<span class="hint" style="display:inline">{text}</span>'


def shapes(spec):
    """'r*,b*,r*' -> coloured geometric run.  Codes: o=circle, s=square,
    t=triangle, d=down-triangle, w=hollow circle, x=star, a=arrow-right,
    u=arrow-up."""
    glyph = {"o": "●", "s": "■", "t": "▲", "d": "▼", "w": "○", "x": "★",
             "a": "→", "u": "↑", "q": "□", "e": "△"}
    out = []
    for token in spec.split(","):
        token = token.strip()
        if not token:
            continue
        col, kind = token[0], token[1]
        cls = COLOR_CLASS.get(col, "")
        out.append(f'<span class="{cls}">{glyph[kind]}</span>' if cls else glyph[kind])
    return '<span class="sh">' + "".join(out) + "</span>"


def grid(rows, blank_at=None, cell_cls=None):
    """rows: list of lists of cell strings ('' -> blank answer cell)."""
    html = ['<table class="grid">']
    for r in rows:
        html.append("<tr>")
        for c in r:
            if c == "":
                html.append('<td class="blank"></td>')
            else:
                cls = ""
                if len(c) == 2 and c[0] in COLOR_CLASS and c[1] in "ostdwxque":
                    g = {"o": "●", "s": "■", "t": "▲", "d": "▼", "w": "○",
                         "x": "★", "q": "□", "e": "△"}[c[1]]
                    cls = f' class="{COLOR_CLASS[c[0]]}"'
                    c = g
                html.append(f"<td{cls}>{c}</td>")
        html.append("</tr>")
    html.append("</table>")
    return "".join(html)


def maze(rows, cols, start=(None, None)):
    sr, sc = start
    html = ['<table class="maze">']
    for i in range(rows):
        html.append("<tr>")
        for j in range(cols):
            html.append("<td>S</td>" if (i == sr and j == sc) else "<td></td>")
        html.append("</tr>")
    html.append("</table>")
    return "".join(html)


def passage_box(lines, label="READ THE PASSAGE"):
    body = "".join(f"<p>{l}</p>" for l in lines)
    return f'<div class="passage"><span class="pt">{label}</span>{body}</div>'


def method(text):
    return f'<div class="method">{text}</div>'


def note(text):
    return f'<div class="note" style="margin:6px 0">{text}</div>'


def hintbox(text):
    return f'<div class="hint">{text}</div>'


SECTION_META = {
    "A": ("SECTION A — English Language Skills", "sec a"),
    "B": ("SECTION B — Mathematics &amp; Mental Reasoning", "sec b"),
    "C": ("SECTION C — Analytical Ability", "sec c"),
}


def section(letter, groups):
    title, cls = SECTION_META[letter]
    out = [f'<div class="{cls}">',
           f'<div class="sec-head"><span>{title}</span><span class="badge">১০ নম্বর</span></div>']
    qno = 1
    for g in groups:
        gtitle, gmarks, extras, items = g
        out.append(f'<div class="grp"><span>{gtitle}</span><span class="gm">{gmarks}</span></div>')
        for key in ("method", "hint", "passage"):
            if extras.get(key):
                out.append(extras[key])
        out.append(f'<ol class="q" start="{qno}">')
        for text, marks in items:
            out.append(f'<li>{text} <span class="m">{marks}</span></li>')
            qno += 1
        out.append("</ol>")
    out.append("</div>")
    return "".join(out)


def scorebox(extra_left=None):
    left = extra_left or "পরীক্ষকের মন্তব্য: ................................................................"
    return f'''<div class="scorebox">
<table>
<tr><th>Section A<br>English</th><th>Section B<br>Mathematics</th><th>Section C<br>Analytical</th><th>মোট</th><th>গ্রেড</th><th>সময় লেগেছে</th></tr>
<tr><td>____ / ১০</td><td>____ / ১০</td><td>____ / ১০</td><td class="tot">____ / ৩০</td><td>____</td><td>____ মিনিট</td></tr>
</table>
<div class="sign"><span>{left}</span><span>স্বাক্ষর: ..............................</span></div>
</div>'''


BN = {0: "০", 1: "১", 2: "২", 3: "৩", 4: "৪", 5: "৫", 6: "৬", 7: "৭", 8: "৮", 9: "৯"}


def bn(n):
    return "".join(BN[int(d)] for d in str(n))


def worksheet(day):
    """Render one full worksheet page from a day dict."""
    n = day["n"]
    title = day.get("title", "দৈনিক অনুশীলন ও মূল্যায়ন পত্র")
    sub = day.get("sub", "")
    out = [f'<section class="paper">',
           '<header class="masthead">',
           '<div class="brand">PRIMARY OLYMPIAD PREPARATION PROGRAM</div>',
           f'<h1>{title}</h1>',
           f'<div class="sub">{sub}</div>',
           '</header>',
           '<table class="meta"><tr>',
           '<td class="k">নাম</td><td class="v"></td>',
           f'<td class="k">দিন</td><td class="v dayno">{bn(n)}</td>',
           '<td class="k">তারিখ</td><td class="v"></td>',
           '<td class="k">পূর্ণমান</td><td class="v">৩০</td>',
           '<td class="k">সময়</td><td class="v">৭৫ মিনিট</td>',
           '</tr></table>']
    if day.get("note"):
        out.append(note(day["note"]))
    for letter in ("A", "B", "C"):
        out.append(section(letter, day[letter]))
    out.append(scorebox(day.get("score_left")))
    foot = day.get("foot", "")
    out.append(f'<div class="pagefoot"><span>Day {n} — {foot}</span>'
               f'<span>পূর্ণমান ৩০ • সময় ৭৫ মিনিট</span></div>')
    out.append("</section>")
    return "\n".join(out)
