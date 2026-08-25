#!/usr/bin/env python3
"""
Build a print-ready A4 PDF from the Day 21-30 worksheet HTML.

Uses fpdf2 + HarfBuzz text shaping with Noto Sans Bengali (Bengali) and
DejaVu Sans (Latin / digits / geometric shapes) as fallback.
"""
import html
import re
import sys
from html.parser import HTMLParser

from fpdf import FPDF
from fpdf.enums import XPos, YPos

SRC = sys.argv[1] if len(sys.argv) > 1 else \
    "/home/user/paynest-api/worksheets/day-21-30-worksheets.html"
OUT = sys.argv[2] if len(sys.argv) > 2 else SRC.rsplit(".", 1)[0] + ".pdf"

BENG_R = "/tmp/fonts/NotoBengali-Regular.ttf"
BENG_B = "/tmp/fonts/NotoBengali-Bold.ttf"
DV_R = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
DV_B = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

INK = (18, 32, 46)
MUTED = (91, 107, 124)
LINE = (201, 212, 222)
SOFT = (238, 244, 248)
NAVY = (18, 58, 94)
TEAL = (15, 107, 107)
GOLD = (138, 106, 16)
RED = (165, 53, 47)
SHAPE_COLORS = {
    "r": (192, 57, 43), "b": (31, 95, 168), "g": (30, 125, 79),
    "y": (201, 149, 10), "p": (112, 72, 160),
}

EMOJI_MAP = {
    "🏁": "★", "🏆": "★", "✅": "", "📗": "", "📘": "", "📙": "", "📊": "",
    "🔍": "", "🖨️": "", "⏱": "", "📄": "", "🧠": "", "⚠️": "!", "🔴": "",
    "🟢": "", "😊": "", "️": "",
}
KEEP_SYMBOLS = set("★☆✓✔→←↑↓●○■□▲▼△▽◆◇≥≤")

EMOJI_RANGES = (
    (0x1F000, 0x1FAFF),   # pictographs
    (0x2600, 0x27BF),     # misc symbols & dingbats (stars kept via KEEP_SYMBOLS)
    (0x2B00, 0x2BFF),
    (0xFE00, 0xFE0F),     # variation selectors
    (0x200D, 0x200D),     # ZWJ
)


def _is_emoji(ch: str) -> bool:
    if ch in KEEP_SYMBOLS:
        return False
    cp = ord(ch)
    return any(lo <= cp <= hi for lo, hi in EMOJI_RANGES)


SCALE = 1.0          # vertical/space scale (auto-fit per section)


def sc(v: float) -> float:
    return v * SCALE


def fs(v: float) -> float:
    """Font sizes shrink more gently than spacing."""
    return v * (0.62 + 0.38 * SCALE)


def clean(text: str) -> str:
    for k, v in EMOJI_MAP.items():
        text = text.replace(k, v)
    text = "".join(ch for ch in text if not _is_emoji(ch))
    return text


# --------------------------------------------------------------------------- #
# Tiny DOM
# --------------------------------------------------------------------------- #
class Elem:
    __slots__ = ("tag", "attrs", "children", "parent")

    def __init__(self, tag, attrs=None, parent=None):
        self.tag = tag
        self.attrs = attrs or {}
        self.children = []
        self.parent = parent

    def cls(self):
        return (self.attrs.get("class") or "").split()

    def has(self, c):
        return c in self.cls()

    def find_all(self, tag=None, cls=None):
        out = []
        for ch in self.children:
            if isinstance(ch, Elem):
                if (tag is None or ch.tag == tag) and (cls is None or ch.has(cls)):
                    out.append(ch)
                out.extend(ch.find_all(tag, cls))
        return out

    def kids(self, tag=None, cls=None):
        return [
            c for c in self.children
            if isinstance(c, Elem)
            and (tag is None or c.tag == tag)
            and (cls is None or c.has(cls))
        ]

    def text(self):
        parts = []
        for ch in self.children:
            if isinstance(ch, str):
                parts.append(ch)
            elif ch.tag == "br":
                parts.append(" ")
            else:
                parts.append(ch.text())
        return re.sub(r"\s+", " ", "".join(parts)).strip()


VOID = {"br", "img", "link", "meta", "hr", "input"}


class DOM(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Elem("root")
        self.cur = self.root
        self.skip = 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "body":
            self.skip = 0
        if tag in ("link", "meta"):
            return
        if tag in ("style", "script", "head", "title"):
            self.skip += 1
            return
        if self.skip:
            return
        if "toolbar" in (a.get("class") or ""):
            self.skip += 1
            return
        if tag in VOID:
            self.cur.children.append(Elem(tag, a, self.cur))
            return
        e = Elem(tag, a, self.cur)
        self.cur.children.append(e)
        self.cur = e

    def handle_endtag(self, tag):
        if tag in ("style", "script", "head", "title"):
            self.skip = max(0, self.skip - 1)
            return
        if self.skip:
            if tag == "div":
                self.skip = max(0, self.skip - 1)
            return
        if tag in VOID:
            return
        node = self.cur
        while node is not self.root and node.tag != tag:
            node = node.parent
        if node is not self.root:
            self.cur = node.parent

    def handle_data(self, data):
        if self.skip or not data.strip():
            if data.strip() == "":
                return
        if self.skip:
            return
        self.cur.children.append(data)


# --------------------------------------------------------------------------- #
# Renderer
# --------------------------------------------------------------------------- #
class PDF(FPDF):
    """FPDF with a workaround for the fallback-font state bug.

    When a fragment is rendered with a fallback font, fpdf2 emits a `Tf` for
    that font but keeps `current_font_is_set_on_page` True, so the next text
    op silently reuses the fallback font (Bengali then renders as garbage or
    disappears). Forcing the flag off makes every draw re-emit its own `Tf`.
    """

    def set_font(self, family=None, style="", size=0):
        super().set_font(family, style, size)
        self.current_font_is_set_on_page = False

    def cell(self, *args, **kwargs):
        self.current_font_is_set_on_page = False
        return super().cell(*args, **kwargs)


class Book:
    ML, MR, MT, MB = 11.0, 11.0, 10.0, 11.0

    def __init__(self):
        pdf = PDF(orientation="P", unit="mm", format="A4")
        pdf.set_auto_page_break(False)
        pdf.add_font("beng", "", BENG_R)
        pdf.add_font("beng", "B", BENG_B)
        pdf.add_font("dv", "", DV_R)
        pdf.add_font("dv", "B", DV_B)
        pdf.set_fallback_fonts(["dv", "beng"])
        pdf.set_text_shaping(True)
        pdf.set_compression(True)
        pdf.set_title("Primary Olympiad Preparation Program — Day 21-30")
        pdf.set_creator("Worksheet Builder")
        self.pdf = pdf
        self.y = self.MT
        self.footer = ("", "")
        self.pageno = 0

    # -- geometry -------------------------------------------------------- #
    @property
    def W(self):
        return self.pdf.w - self.ML - self.MR

    @property
    def bottom(self):
        return self.pdf.h - self.MB - 8

    def new_page(self, footer=None):
        if self.pageno:
            self.draw_footer()
        self.pdf.add_page()
        self.pageno += 1
        self.y = self.MT
        if footer is not None:
            self.footer = footer

    def need(self, h):
        if self.y + h > self.bottom:
            f = self.footer
            self.new_page()
            self.footer = f
            return True
        return False

    def draw_footer(self):
        left, right = self.footer
        if not left and not right:
            return
        p = self.pdf
        y = p.h - self.MB - 1
        p.set_draw_color(*LINE)
        p.set_line_width(0.2)
        p.set_dash_pattern()
        p.line(self.ML, y - 3.4, p.w - self.MR, y - 3.4)
        p.set_font("beng", "", 6.6)
        p.set_text_color(132, 150, 166)
        p.set_xy(self.ML, y - 3.0)
        p.cell(self.W / 2, 3.2, clean(left), align="L")
        p.set_xy(self.ML + self.W / 2, y - 3.0)
        p.cell(self.W / 2, 3.2, clean(right) + f"   ·   {self.pageno}", align="R")

    # -- primitives ------------------------------------------------------ #
    def box(self, x, y, w, h, fill=None, border=None, lw=0.25, radius=0.0):
        p = self.pdf
        p.set_dash_pattern()
        p.set_line_width(lw)
        style = ""
        if fill:
            p.set_fill_color(*fill)
            style += "F"
        if border:
            p.set_draw_color(*border)
            style += "D"
        if style:
            if radius:
                p.rect(x, y, w, h, round_corners=True, corner_radius=radius, style=style)
            else:
                p.rect(x, y, w, h, style=style)

    def dotted(self, x, y, w):
        p = self.pdf
        p.set_draw_color(71, 88, 106)
        p.set_line_width(0.25)
        p.set_dash_pattern(dash=0.45, gap=0.75)
        p.line(x, y, x + w, y)
        p.set_dash_pattern()

    def sw(self, s, font="beng", style="", size=9.0):
        self.pdf.set_font(font, style, size)
        return self.pdf.get_string_width(clean(s))

    # -- inline engine ---------------------------------------------------- #
    def runs(self, node, st):
        """Flatten inline content into runs; block children returned separately."""
        out = []
        for ch in node.children:
            if isinstance(ch, str):
                txt = clean(ch)
                if txt.strip() == "" and txt != "":
                    txt = " "
                if txt:
                    out.append({"t": "txt", "s": txt, **st})
                continue
            c = ch.cls()
            if ch.tag == "br":
                out.append({"t": "br"})
            elif ch.tag in ("b", "strong"):
                out += self.runs(ch, {**st, "bold": True})
            elif ch.tag in ("i", "em"):
                out += self.runs(ch, {**st, "italic": True})
            elif ch.tag == "span" and "m" in c:
                out.append({"t": "chip", "s": ch.text()})
            elif ch.tag == "span" and "ln-full" in c:
                out.append({"t": "fullline"})
            elif ch.tag == "span" and "ln" in c:
                wmm = 11.5
                if "ln-m" in c:
                    wmm = 25.0
                elif "ln-l" in c:
                    wmm = 45.0
                out.append({"t": "line", "w": wmm})
            elif ch.tag == "span" and "opt" in c:
                out += self.runs(ch, {**st, "bold": True, "color": NAVY})
            elif ch.tag == "span" and "hint" in c:
                out += self.runs(ch, {**st, "italic": True, "color": MUTED,
                                      "size": st.get("size", 9) - 0.8})
            elif ch.tag == "span" and "sh" in c:
                out += self.runs(ch, {**st, "size": st.get("size", 9) + 1.2,
                                      "shape": True})
            elif ch.tag == "span" and c and c[0] in SHAPE_COLORS:
                out += self.runs(ch, {**st, "color": SHAPE_COLORS[c[0]]})
            elif ch.tag in ("table", "div", "ol", "ul", "p"):
                out.append({"t": "block", "node": ch})
            else:
                out += self.runs(ch, st)
        return out

    def layout(self, runs, x, w, size=9.0, lead=4.3, indent=0.0):
        """Draw runs inside [x, x+w]; returns consumed height."""
        p = self.pdf
        y0 = self.y
        cx, cy = x, self.y
        first = True

        def nl():
            nonlocal cx, cy, first
            cx = x + indent
            cy += lead
            first = False

        for r in runs:
            if r["t"] == "br":
                nl()
                continue
            if r["t"] == "chip":
                continue
            if r["t"] == "fullline":
                if cx > x:
                    nl()
                self.dotted(cx, cy + lead * 0.72, x + w - cx)
                nl()
                continue
            if r["t"] == "line":
                if cx + r["w"] > x + w:
                    nl()
                self.dotted(cx, cy + lead * 0.72, r["w"])
                cx += r["w"] + 1.0
                continue
            if r["t"] == "block":
                continue
            # text run
            fsz = r.get("size", size)
            style = "B" if r.get("bold") else ""
            fam = "dv" if r.get("shape") else "beng"
            p.set_font(fam, style, fsz)
            col = r.get("color", INK)
            words = re.split(r"(\s+)", r["s"])
            for wd in words:
                if wd == "":
                    continue
                wdw = p.get_string_width(wd)
                if wd.strip() == "":
                    if cx > x + indent:
                        cx += wdw
                    continue
                if cx + wdw > x + w + 0.4 and cx > x + indent:
                    nl()
                    p.set_font(fam, style, fsz)
                p.set_text_color(*col)
                p.set_xy(cx, cy)
                p.cell(wdw + 0.6, lead, wd, align="L")
                cx += wdw
            first = False
        p.set_text_color(*INK)
        return (cy + lead) - y0

    def measure(self, runs, w, size=9.0, lead=4.3, indent=0.0):
        """Height without drawing (rough, mirrors layout)."""
        p = self.pdf
        cx, lines = 0.0, 1
        for r in runs:
            if r["t"] == "br":
                cx = indent
                lines += 1
            elif r["t"] == "fullline":
                if cx > 0:
                    lines += 1
                lines += 1
                cx = indent
            elif r["t"] == "line":
                if cx + r["w"] > w:
                    lines += 1
                    cx = indent
                cx += r["w"] + 1.0
            elif r["t"] in ("chip", "block"):
                continue
            else:
                p.set_font("dv" if r.get("shape") else "beng",
                           "B" if r.get("bold") else "", r.get("size", size))
                for wd in re.split(r"(\s+)", r["s"]):
                    if not wd:
                        continue
                    ww = p.get_string_width(wd)
                    if wd.strip() == "":
                        if cx > indent:
                            cx += ww
                        continue
                    if cx + ww > w + 0.4 and cx > indent:
                        lines += 1
                        cx = indent
                    cx += ww
        return lines * lead

    # -- tables ----------------------------------------------------------- #
    def table(self, node, size=7.6, head_fill=SOFT, pad=0.85, align_first_center=False):
        rows = []
        for tr in node.find_all("tr"):
            cells = []
            for td in tr.kids():
                if td.tag not in ("td", "th"):
                    continue
                span = int(td.attrs.get("colspan", 1))
                cells.append({
                    "txt": clean(td.text()),
                    "head": td.tag == "th" or td.has("k"),
                    "span": span,
                    "center": td.tag == "th" or td.has("d") or (
                        align_first_center and not td.has("l")),
                    "bold": td.tag == "th" or td.has("k") or td.has("tot") or td.has("d"),
                    "color": RED if td.has("tot") else (NAVY if td.has("d") else INK),
                })
            if cells:
                rows.append(cells)
        if not rows:
            return
        ncol = max(sum(c["span"] for c in r) for r in rows)
        # column weights from content length
        weights = [1.0] * ncol
        for r in rows:
            i = 0
            for c in r:
                if c["span"] == 1:
                    weights[i] = max(weights[i], min(len(c["txt"]) or 1, 90) ** 0.62)
                i += c["span"]
        tot = sum(weights)
        widths = [max(9.0, self.W * w / tot) for w in weights]
        scale = self.W / sum(widths)
        widths = [w * scale for w in widths]

        p = self.pdf
        lead = sc(size * 0.42 + 1.1)
        for r in rows:
            # measure row height
            hs = []
            i = 0
            for c in r:
                cw = sum(widths[i:i + c["span"]]) - 2 * pad
                p.set_font("beng", "B" if c["bold"] else "", size)
                n = max(1, len(self.wrap(c["txt"], cw, size, c["bold"])))
                hs.append(n * lead)
                i += c["span"]
            h = max(hs) + 2 * pad
            self.need(h + 1)
            x = self.ML
            i = 0
            for c in r:
                cw = sum(widths[i:i + c["span"]])
                self.box(x, self.y, cw, h,
                         fill=head_fill if c["head"] else None, border=LINE, lw=0.2)
                p.set_font("beng", "B" if c["bold"] else "", size)
                p.set_text_color(*c["color"])
                yy = self.y + pad
                for ln in self.wrap(c["txt"], cw - 2 * pad, size, c["bold"]) or [""]:
                    p.set_xy(x + pad, yy)
                    p.cell(cw - 2 * pad, lead, ln,
                           align="C" if c["center"] else "L")
                    yy += lead
                x += cw
                i += c["span"]
            self.y += h
        p.set_text_color(*INK)
        self.y += 0.8

    def wrap(self, txt, w, size, bold=False):
        p = self.pdf
        p.set_font("beng", "B" if bold else "", size)
        out, cur = [], ""
        for word in txt.split(" "):
            trial = (cur + " " + word).strip()
            if p.get_string_width(trial) <= w or not cur:
                cur = trial
            else:
                out.append(cur)
                cur = word
        if cur:
            out.append(cur)
        return out

    # -- shape grids ------------------------------------------------------ #
    def grid(self, node, maze=False):
        rows = node.find_all("tr")
        cell = max(sc(6.6), 5.6) if not maze else max(sc(6.0), 5.2)
        h = len(rows) * cell
        self.need(h + 2)
        p = self.pdf
        y = self.y + 1
        for tr in rows:
            x = self.ML + 4
            for td in tr.kids():
                blank = td.has("blank")
                self.box(x, y, cell, cell, fill=(255, 247, 214) if blank else None,
                         border=(123, 139, 153), lw=0.25)
                t = clean(td.text())
                if t:
                    col = INK
                    for k, v in SHAPE_COLORS.items():
                        if td.has(k):
                            col = v
                    is_shape = any(ch in "●■▲★→↑◆" for ch in t)
                    p.set_font("dv" if is_shape else "beng", "B", 9.5 if is_shape else 8)
                    p.set_text_color(*col)
                    p.set_xy(x, y + cell / 2 - 2.4)
                    p.cell(cell, 4.8, t, align="C")
                x += cell
            y += cell
        p.set_text_color(*INK)
        self.y = y + 1.0

    # -- block dispatch ---------------------------------------------------- #
    def block(self, node, size=9.0):
        c = node.cls()
        tag = node.tag

        if tag == "section" and "paper" in c:
            foot = node.find_all("div", "pagefoot")
            f = ("", "")
            if foot:
                spans = foot[0].kids("span")
                f = (spans[0].text() if spans else "",
                     spans[1].text() if len(spans) > 1 else "")
            self.new_page(f)
            for ch in node.kids():
                if ch.has("pagefoot"):
                    continue
                self.block(ch)
            return

        if tag == "header" and "masthead" in c:
            brand = node.kids("div", "brand")
            h1 = node.kids("h1")
            sub = node.kids("div", "sub")
            h = max(sc(3.0), 2.4)
            if brand:
                h += max(sc(3.3), 2.9)
            if h1:
                h += max(sc(5.4), 4.8)
            if sub:
                h += max(sc(3.4), 3.0)
            self.need(h)
            self.box(self.ML, self.y, self.W, h, fill=SOFT, border=NAVY, lw=0.7, radius=1.0)
            p = self.pdf
            y = self.y + sc(1.5)
            if brand:
                p.set_font("beng", "B", fs(6.6))
                p.set_text_color(*TEAL)
                p.set_xy(self.ML, y)
                p.cell(self.W, 3.2, clean(brand[0].text()), align="C")
                y += max(sc(3.3), 2.9)
            if h1:
                p.set_font("beng", "B", fs(12.0))
                p.set_text_color(*NAVY)
                p.set_xy(self.ML, y)
                p.cell(self.W, max(sc(5.2), 4.6), clean(h1[0].text()), align="C")
                y += max(sc(5.4), 4.8)
            if sub:
                p.set_font("beng", "", fs(6.9))
                p.set_text_color(*MUTED)
                p.set_xy(self.ML, y)
                p.cell(self.W, 3.2, clean(sub[0].text()), align="C")
            p.set_text_color(*INK)
            self.y += h + sc(1.3)
            return

        if tag == "table":
            if "meta" in c:
                self.table(node, size=7.4)
            elif "dist" in c or "ans" in c:
                self.table(node, size=7.0)
            elif "grid" in c:
                self.grid(node)
            elif "maze" in c:
                self.grid(node, maze=True)
            else:
                self.table(node, size=7.4)
            return

        if "row2" in c:
            for b in node.kids("div", "box"):
                self.block(b)
            return

        if "box" in c and tag == "div":
            start_y = self.y
            self.y += 1.6
            head = node.kids("h4")
            if head:
                self.need(5)
                p = self.pdf
                p.set_font("beng", "B", 7.6)
                p.set_text_color(*TEAL)
                p.set_xy(self.ML + 2.5, self.y)
                p.cell(self.W - 5, 4.0, clean(head[0].text()))
                p.set_text_color(*INK)
                self.y += 4.6
            for ch in node.kids():
                if ch.tag == "h4":
                    continue
                self.block(ch, size=8.2)
            self.y += 1.0
            self.box(self.ML, start_y, self.W, self.y - start_y, border=LINE, lw=0.25, radius=1.0)
            self.y += 1.4
            return

        if "sec" in c and tag == "div":
            colr = NAVY
            if "b" in c:
                colr = TEAL
            if "c" in c:
                colr = GOLD
            head = node.kids("div", "sec-head")
            if head:
                spans = head[0].kids("span")
                self.need(9)
                self.box(self.ML, self.y, self.W, sc(5.8), fill=colr, radius=0.8)
                p = self.pdf
                p.set_font("beng", "B", fs(9.4))
                p.set_text_color(255, 255, 255)
                p.set_xy(self.ML + 2.5, self.y + 0.6)
                p.cell(self.W - 30, sc(5.2), clean(spans[0].text()))
                if len(spans) > 1:
                    badge = clean(spans[1].text())
                    bw = self.sw(badge, "beng", "B", 7.4) + 5
                    self.box(self.pdf.w - self.MR - 2 - bw, self.y + 1.15, bw, 4.1,
                             fill=(255, 255, 255), radius=2.0)
                    p.set_font("beng", "B", 7.4)
                    p.set_text_color(*colr)
                    p.set_xy(self.pdf.w - self.MR - 2 - bw, self.y + 1.15)
                    p.cell(bw, 4.1, badge, align="C")
                p.set_text_color(*INK)
                self.y += sc(6.6)
            for ch in node.kids():
                if ch.has("sec-head"):
                    continue
                self.block(ch, size=size)
            self.y += sc(0.3)
            return

        if "grp" in c:
            spans = node.kids("span")
            self.need(7)
            colr = NAVY
            par = node.parent
            if par is not None:
                if par.has("b"):
                    colr = TEAL
                if par.has("c"):
                    colr = GOLD
            h = sc(4.3)
            self.box(self.ML, self.y, self.W, h, fill=SOFT)
            self.box(self.ML, self.y, 1.1, h, fill=colr)
            p = self.pdf
            p.set_font("beng", "B", fs(8.6))
            p.set_text_color(*INK)
            p.set_xy(self.ML + 2.6, self.y + 0.3)
            p.cell(self.W - 34, sc(4.2), clean(spans[0].text()) if spans else "")
            if len(spans) > 1:
                p.set_font("beng", "B", 7.2)
                p.set_text_color(*MUTED)
                p.set_xy(self.pdf.w - self.MR - 32, self.y + 0.4)
                p.cell(30, 4.1, clean(spans[1].text()), align="R")
            p.set_text_color(*INK)
            self.y += h + sc(0.55)
            return

        if "method" in c or "note" in c or "hint" in c or "trick" in c or "passage" in c:
            self.callout(node)
            return

        if tag == "pre":
            txt = "".join(x for x in node.children if isinstance(x, str))
            lines = [clean(l) for l in txt.strip("\n").split("\n")]
            lead = 3.5
            h = len(lines) * lead + 3
            self.need(h)
            self.box(self.ML, self.y, self.W, h, fill=(247, 250, 252), border=LINE, radius=1.0)
            p = self.pdf
            p.set_font("dv", "", 6.6)
            p.set_text_color(*INK)
            yy = self.y + 1.5
            for l in lines:
                p.set_xy(self.ML + 2.5, yy)
                p.cell(self.W - 5, lead, l)
                yy += lead
            self.y += h + 2.0
            return

        if tag in ("h2", "h3"):
            if "big" in c:
                self.need(11)
                self.box(self.ML, self.y, self.W, 8.0, fill=NAVY, radius=0.8)
                p = self.pdf
                p.set_font("beng", "B", 12.0)
                p.set_text_color(255, 255, 255)
                p.set_xy(self.ML + 3, self.y + 0.8)
                p.cell(self.W - 6, 6.4, clean(node.text()))
                p.set_text_color(*INK)
                self.y += 10.0
            else:
                self.need(9)
                p = self.pdf
                p.set_font("beng", "B", 10.2)
                p.set_text_color(*NAVY)
                p.set_xy(self.ML, self.y)
                p.cell(self.W, 5.4, clean(node.text()))
                self.y += 5.6
                p.set_draw_color(*LINE)
                p.set_line_width(0.5)
                p.set_dash_pattern()
                p.line(self.ML, self.y, self.pdf.w - self.MR, self.y)
                p.set_text_color(*INK)
                self.y += 2.2
            return

        if "scorebox" in c:
            start = self.y
            self.y += 1.0
            for t in node.find_all("table"):
                self.table(t, size=7.4)
                break
            sign = node.find_all("div", "sign")
            if sign:
                spans = sign[0].kids("span")
                p = self.pdf
                p.set_font("beng", "", 7.2)
                p.set_text_color(*MUTED)
                p.set_xy(self.ML + 2, self.y)
                p.cell(self.W * 0.62, 4.0, clean(spans[0].text()) if spans else "")
                if len(spans) > 1:
                    p.set_xy(self.ML + self.W * 0.62, self.y)
                    p.cell(self.W * 0.38 - 2, 4.0, clean(spans[1].text()), align="R")
                p.set_text_color(*INK)
                self.y += 4.6
            self.box(self.ML, start, self.W, self.y - start, border=NAVY, lw=0.6, radius=1.0)
            self.y += 1.2
            return

        if "cert" in c:
            self.need(60)
            start = self.y
            p = self.pdf
            self.y += 6
            for ch in node.kids():
                if ch.tag == "h1":
                    p.set_font("beng", "B", 15)
                    p.set_text_color(*NAVY)
                    p.set_xy(self.ML, self.y)
                    p.cell(self.W, 8, clean(ch.text()), align="C")
                    self.y += 9
                elif "name" in ch.cls():
                    self.pdf.set_draw_color(*INK)
                    self.pdf.set_line_width(0.4)
                    self.pdf.set_dash_pattern()
                    self.pdf.line(self.ML + self.W / 2 - 45, self.y + 6,
                                  self.ML + self.W / 2 + 45, self.y + 6)
                    self.y += 9
                else:
                    p.set_font("beng", "", 8.4)
                    p.set_text_color(*INK)
                    txt = clean(ch.text())
                    if not txt:
                        continue
                    for ln in self.wrap(txt, self.W - 20, 8.4):
                        p.set_xy(self.ML, self.y)
                        p.cell(self.W, 4.6, ln, align="C")
                        self.y += 4.6
                    self.y += 1.5
            self.y += 6
            self.box(self.ML + 4, start, self.W - 8, self.y - start, border=NAVY, lw=1.0)
            self.box(self.ML + 5.2, start + 1.2, self.W - 10.4, self.y - start - 2.4,
                     border=NAVY, lw=0.4)
            self.y += 3
            return

        if tag == "ol" and "q" in c:
            self.qlist(node, size=size)
            return

        if tag in ("ol", "ul"):
            self.plain_list(node, ordered=(tag == "ol"), size=size)
            return

        if tag in ("div", "p", "span"):
            runs = self.runs(node, {"size": size})
            blocks = [r for r in runs if r["t"] == "block"]
            if any(r["t"] not in ("block",) for r in runs):
                h = self.measure(runs, self.W, size)
                self.need(h)
                self.y += self.layout(runs, self.ML, self.W, size)
            for b in blocks:
                self.block(b["node"], size)
            return

        for ch in node.kids():
            self.block(ch, size)

    def callout(self, node):
        c = node.cls()
        if "method" in c:
            fill, border, size = (243, 251, 251), TEAL, fs(8.0)
        elif "note" in c:
            fill, border, size = (255, 250, 240), GOLD, fs(8.2)
        elif "trick" in c:
            fill, border, size = (246, 251, 251), TEAL, fs(8.3)
        elif "passage" in c:
            fill, border, size = (255, 253, 245), GOLD, fs(8.6)
        else:
            fill, border, size = (250, 250, 250), LINE, 7.8

        inner_w = self.W - 8
        pieces = []
        if "passage" in c:
            pt = node.kids("span", "pt")
            if pt:
                pieces.append(("pt", clean(pt[0].text())))
            for pnode in node.kids("p"):
                pieces.append(("p", self.runs(pnode, {"size": size})))
        elif "trick" in c:
            for h5 in node.kids("h5"):
                pieces.append(("h5", clean(h5.text())))
            for pnode in node.kids("p"):
                pieces.append(("p", self.runs(pnode, {"size": size})))
        else:
            pieces.append(("p", self.runs(node, {"size": size})))

        total = 2.4
        for kind, val in pieces:
            if kind == "pt":
                total += sc(3.3)
            elif kind == "h5":
                total += sc(4.4)
            else:
                total += self.measure(val, inner_w, size, lead=sc(size * 0.46 + 0.9))
        self.need(total + 2)
        start = self.y
        self.box(self.ML, start, self.W, total + sc(1.2), fill=fill, border=LINE, lw=0.2)
        self.box(self.ML, start, 1.3, total + sc(1.2), fill=border)
        self.y += sc(0.8)
        p = self.pdf
        for kind, val in pieces:
            if kind == "pt":
                p.set_font("beng", "B", 6.4)
                p.set_text_color(*border)
                p.set_xy(self.ML + 4, self.y)
                p.cell(inner_w, 3.2, val)
                self.y += 3.4
            elif kind == "h5":
                p.set_font("beng", "B", 8.8)
                p.set_text_color(*border)
                p.set_xy(self.ML + 4, self.y)
                p.cell(inner_w, 4.2, val)
                self.y += 4.6
            else:
                self.y += self.layout(val, self.ML + 4, inner_w, size,
                                      lead=sc(size * 0.46 + 0.9))
        p.set_text_color(*INK)
        self.y = max(self.y + sc(0.4), start + total + sc(1.2))
        self.y += sc(1.0)

    def plain_list(self, node, ordered, size=8.2):
        idx = 1
        for li in node.kids("li"):
            runs = self.runs(li, {"size": size})
            marker = f"{idx})" if ordered else "•"
            mw = self.sw(marker, "beng", "", size) + 1.5
            h = self.measure(runs, self.W - 8 - mw, size, lead=size * 0.46 + 0.9)
            self.need(h)
            p = self.pdf
            p.set_font("beng", "", size)
            p.set_text_color(*INK)
            p.set_xy(self.ML + 4, self.y)
            p.cell(mw, size * 0.46 + 0.9, marker)
            self.y += self.layout(runs, self.ML + 4 + mw, self.W - 8 - mw, size,
                                  lead=size * 0.46 + 0.9)
            idx += 1
        self.y += 0.8

    def qlist(self, node, size=None):
        size = fs(8.5) if size is None else size
        start = int(node.attrs.get("start", 1))
        lead = max(sc(4.0), 3.0)
        chip_w = 8.0
        for i, li in enumerate(node.kids("li")):
            runs = self.runs(li, {"size": size})
            chips = [r["s"] for r in runs if r["t"] == "chip"]
            blocks = [r["node"] for r in runs if r["t"] == "block"]
            inline = [r for r in runs if r["t"] not in ("chip", "block")]
            num = f"{start + i}."
            nw = self.sw(num, "beng", "B", size) + 1.2
            x = self.ML + 3
            w = self.W - 6 - nw - chip_w
            h = self.measure(inline, w, size, lead=lead)
            self.need(h + 1)
            p = self.pdf
            p.set_font("beng", "B", size)
            p.set_text_color(*NAVY)
            p.set_xy(x, self.y)
            p.cell(nw, lead, num)
            p.set_text_color(*INK)
            y_top = self.y
            self.y += self.layout(inline, x + nw, w, size, lead=lead)
            if chips:
                cw = 6.2
                self.box(self.pdf.w - self.MR - cw - 0.5, y_top + 0.35, cw, 3.7,
                         fill=(251, 253, 255), border=LINE, lw=0.2, radius=0.7)
                p.set_font("beng", "", 6.8)
                p.set_text_color(*MUTED)
                p.set_xy(self.pdf.w - self.MR - cw - 0.5, y_top + 0.35)
                p.cell(cw, 3.7, clean(chips[0]), align="C")
                p.set_text_color(*INK)
            if blocks:
                keep = self.ML
                self.ML = keep + nw + 3
                for b in blocks:
                    self.block(b, size)
                self.ML = keep
            self.y += sc(0.2)
        self.y += sc(0.5)


def section_pages(sec, scale):
    """Dry-run a section at the given scale and report how many pages it needs."""
    global SCALE
    SCALE = scale
    probe = Book()
    probe.block(sec)
    return len(probe.pdf.pages)


def main():
    global SCALE
    raw = open(SRC, encoding="utf-8").read()
    dom = DOM()
    dom.feed(raw)
    body = dom.root.find_all("body")
    root = body[0] if body else dom.root
    sections = root.find_all("section", "paper")

    # choose the largest scale that keeps each worksheet on a single page
    scales = []
    for i, sec in enumerate(sections):
        best, pages = 1.0, None
        for cand in (1.0, 0.96, 0.92, 0.88, 0.84, 0.80, 0.76, 0.72, 0.68, 0.64, 0.60):
            n = section_pages(sec, cand)
            if pages is None or n < pages:
                pages, best = n, cand
            if n <= 1:
                best = cand
                break
        scales.append(best)
        print(f"  section {i + 1}: scale {best:.2f} ({pages} page(s) minimum)")

    SCALE = 1.0
    book = Book()
    for sec, scale in zip(sections, scales):
        SCALE = scale
        book.block(sec)
    book.draw_footer()
    book.pdf.output(OUT)
    print("pages:", len(book.pdf.pages), "->", OUT)


if __name__ == "__main__":
    sys.exit(main())
