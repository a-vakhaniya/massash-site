#!/usr/bin/env python3
"""Fix crosssell tile-tags hrefs and sp-svc-link hrefs across service pages.

Usage:
    python generator/fix_crosssell_pricelist.py

Test mode: only FILES list is processed. Comment out entries to limit scope.
"""

import os
import re

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ── CROSSSELL TAG DEFINITIONS ──────────────────────────────────────────────

MASSAGE_TAGS = [
    ("/massage/klassicheskiy/",  "Классический",    "tag-outline terra"),
    ("/massage/sportivnyy/",     "Спортивный",      "tag-outline terra"),
    ("/massage/limfodrenazh/",   "Лимфодренаж",     "tag-outline terra"),
    ("/massage/tayskiy/",        "Тайский",         "tag-outline terra"),
    ("/massage/antistress/",     "Антистрессовый",  "tag-outline terra"),
    ("/massage/antitsellyulit/", "Антицеллюлитный", "tag-outline terra"),
    ("/massage/pir/",            "ПИР",             "tag-outline terra"),
]

TRAINING_TAGS = [
    ("/training/funkcionalnyy/", "Функциональный тренинг", "tag-outline muted"),
    ("/training/lfk/",           "ЛФК",                    "tag-outline muted"),
    ("/training/osanka/",        "Осанка",                  "tag-outline muted"),
    ("/training/spine/",         "Боли в спине",            "tag-outline muted"),
    ("/training/pohudenie/",     "Похудение",               "tag-outline muted"),
    ("/training/55plus/",        "55+",                     "tag-outline muted"),
    ("/training/online/",        "Онлайн",                  "tag-outline muted"),
]

REHAB_TAGS = [
    ("/rehab/osanka/",       "Осанка",         "tag-outline terra"),
    ("/rehab/osteohondroz/", "Остеохондроз",   "tag-outline terra"),
    ("/rehab/shoulder/",     "Плечо и рука",   "tag-outline terra"),
    ("/rehab/ploskostopie/", "Плоскостопие",   "tag-outline terra"),
    ("/rehab/postop/",       "После операции", "tag-outline terra"),
    ("/rehab/insult/",       "После инсульта", "tag-outline terra"),
    ("/rehab/perelom/",      "Переломы",       "tag-outline terra"),
]

# eyebrow text (lowercase substring) → tag list
# "тренировки" matches both "ТРЕНИРОВКИ" and "Оздоровительные тренировки"
TILE_EYEBROW_TAGS = {
    "массаж":       MASSAGE_TAGS,
    "тренировки":   TRAINING_TAGS,
    "реабилитация": REHAB_TAGS,
}

# ── SP-SVC-LINK MAPPING ────────────────────────────────────────────────────
# sp-svc-name text (lowercase substring) → correct href

SVC_LINKS = [
    # Rehab — order matters: more specific first
    ("реабилитация после эндопротезирования",      "/rehab/endoprotez/"),
    ("реабилитация после операции на позвоночнике", "/rehab/postop/"),
    ("реабилитация после переломов",               "/rehab/perelom/"),
    ("реабилитация плеча",                         "/rehab/shoulder/"),
    ("восстановление после инсульта",              "/rehab/insult/"),
    ("восстановление после чмт",                   "/rehab/cmt/"),
    ("восстановление при остеохондрозе",           "/rehab/osteohondroz/"),
    ("исправление осанки",                         "/rehab/osanka/"),
    ("коррекция плоскостопия",                     "/rehab/ploskostopie/"),
    # Massage
    ("классический массаж",    "/massage/klassicheskiy/"),
    ("спортивный массаж",      "/massage/sportivnyy/"),
    ("лимфодренажный массаж",  "/massage/limfodrenazh/"),
    ("антицеллюлитный массаж", "/massage/antitsellyulit/"),
    ("антистрессовый массаж",  "/massage/antistress/"),
    ("оздоровительный массаж", "/massage/ozdorovitelnyy/"),
    ("тайский массаж",         "/massage/tayskiy/"),
    ("пир",                    "/massage/pir/"),
    # Training
    ("функциональный тренинг",           "/training/funkcionalnyy/"),
    ("коррекция осанки и позвоночника",  "/training/osanka/"),
    ("тренировки для снижения веса",     "/training/pohudenie/"),
    ("тренировки при болях в спине",     "/training/spine/"),
    ("тренировки для старшего возраста", "/training/55plus/"),
    ("онлайн-тренировки",                "/training/online/"),
    ("лфк",                              "/training/lfk/"),
]

# ── FILES ──────────────────────────────────────────────────────────────────

FILES = [
    "rehab/insult/index.html",
    "rehab/osanka/index.html",
    "rehab/osteohondroz/index.html",
    "rehab/shoulder/index.html",
    "rehab/postop/index.html",
    "rehab/ploskostopie/index.html",
    "rehab/perelom/index.html",
    "rehab/cmt/index.html",
    "rehab/endoprotez/index.html",
    "rehab/programma-vosstanovleniya/index.html",
    "massage/klassicheskiy/index.html",
    "massage/sportivnyy/index.html",
    "massage/limfodrenazh/index.html",
    "massage/antistress/index.html",
    "massage/antitsellyulit/index.html",
    "massage/ozdorovitelnyy/index.html",
    "massage/pir/index.html",
    "massage/tayskiy/index.html",
    "training/funkcionalnyy/index.html",
    "training/lfk/index.html",
    "training/osanka/index.html",
    "training/pohudenie/index.html",
    "training/spine/index.html",
    "training/55plus/index.html",
    "training/online/index.html",
]

# ── HELPERS ────────────────────────────────────────────────────────────────

def fix_crosssell_tile(html, eyebrow_key, new_tags):
    """
    Find the crosssell-tile-tags div whose parent body has an eyebrow
    containing eyebrow_key, and replace all anchors inside with new_tags.
    Returns (html, changed: bool).
    """
    # Locate the eyebrow div with this text
    eyebrow_re = re.compile(
        r'class="crosssell-tile-eyebrow[^"]*">[^<]*'
        + re.escape(eyebrow_key)
        + r'[^<]*</div>',
        re.IGNORECASE,
    )
    m_eyebrow = eyebrow_re.search(html)
    if not m_eyebrow:
        return html, False

    # From that position, find the next crosssell-tile-tags div
    tags_re = re.compile(
        r'(<div class="crosssell-tile-tags[^"]*">)(.*?)(</div>)',
        re.DOTALL,
    )
    m_tags = tags_re.search(html, m_eyebrow.end())
    if not m_tags:
        return html, False

    # Check if hrefs already match
    current_hrefs = re.findall(r'<a href="([^"]+)"', m_tags.group(2))
    expected_hrefs = [t[0] for t in new_tags]
    if current_hrefs == expected_hrefs:
        return html, False

    # Detect indentation of the opening <div>
    line_start = html.rfind('\n', 0, m_tags.start()) + 1
    outer_indent = ''
    for ch in html[line_start:m_tags.start()]:
        if ch in ' \t':
            outer_indent += ch
        else:
            break
    inner_indent = outer_indent + '  '

    # Build new inner content
    anchor_lines = '\n'.join(
        f'{inner_indent}<a href="{href}" class="{cls}">{text}</a>'
        for href, text, cls in new_tags
    )
    new_content = f'\n{anchor_lines}\n{outer_indent}'

    new_html = (
        html[:m_tags.start(2)]
        + new_content
        + html[m_tags.start(3):]
    )
    return new_html, True


def fix_svc_links(html):
    """
    Fix href="#" in sp-svc-link anchors by looking at the sp-svc-name
    text in the same sp-svc-item. Returns (html, count).
    """
    lines = html.split('\n')
    result = []
    current_name = None
    count = 0

    for line in lines:
        m = re.search(r'class="sp-svc-name">([^<]+)<', line)
        if m:
            current_name = m.group(1).strip().lower()

        if (current_name
                and 'class="sp-svc-link"' in line
                and 'href="#"' in line):
            new_href = None
            for key, href in SVC_LINKS:
                if key in current_name:
                    new_href = href
                    break
            if new_href:
                line = line.replace('href="#"', f'href="{new_href}"', 1)
                count += 1
                current_name = None  # reset: one link per item

        result.append(line)

    return '\n'.join(result), count


# ── MAIN ───────────────────────────────────────────────────────────────────

def fix_file(rel_path):
    path = os.path.join(BASE, rel_path)
    if not os.path.exists(path):
        print(f'[ERR] {rel_path}: fail not found')
        return

    with open(path, encoding='utf-8') as f:
        html = f.read()

    original = html
    tags_fixed = 0

    for eyebrow_key, new_tags in TILE_EYEBROW_TAGS.items():
        html, changed = fix_crosssell_tile(html, eyebrow_key, new_tags)
        if changed:
            tags_fixed += 1

    html, links_fixed = fix_svc_links(html)

    if html != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f'[OK] {rel_path}: {tags_fixed} tag blocks, {links_fixed} price links fixed')
    else:
        print(f'[--] {rel_path}: no changes')


if __name__ == '__main__':
    for f in FILES:
        fix_file(f)
