"""Fix CDMX typo (convíaban → convertían) and update 2010-2014 academia desc (remove Guille, add Ernesto Moreno + Raquel Segura)."""
import pathlib, sys

ROOT = pathlib.Path(r"C:/Users/Jorge/Desktop/Code Claude/mi-clon/src/i18n/dictionaries")

# === Typo fix (ES only, since I made the typo only in ES) ===
TYPO_OLD = "el calor conv\\u00EDaban cada punto"
TYPO_NEW = "el calor convert\\u00EDan cada punto"

# === Academia desc update — replace existing "Aquí se forman ... y toda la primera generación." sentence per language ===
ACADEMIA = {
    "es.ts": (
        'Aqu\\u00ED se forman \\u00C1lex Ruiz, Momo Gonz\\u00E1lez, Guille Collado, Bea Gonz\\u00E1lez y toda la primera generaci\\u00F3n.',
        'Aqu\\u00ED se forman \\u00C1lex Ruiz, Momo Gonz\\u00E1lez, Bea Gonz\\u00E1lez, Ernesto Moreno, Raquel Segura y toda la primera generaci\\u00F3n.',
    ),
    "en.ts": (
        'Here we trained \\u00C1lex Ruiz, Momo Gonz\\u00E1lez, Guille Collado, Bea Gonz\\u00E1lez and the entire first generation.',
        'Here we trained \\u00C1lex Ruiz, Momo Gonz\\u00E1lez, Bea Gonz\\u00E1lez, Ernesto Moreno, Raquel Segura and the entire first generation.',
    ),
    "fr.ts": (
        '\\u00C1lex Ruiz, Momo Gonz\\u00E1lez, Guille Collado, Bea Gonz\\u00E1lez',
        '\\u00C1lex Ruiz, Momo Gonz\\u00E1lez, Bea Gonz\\u00E1lez, Ernesto Moreno, Raquel Segura',
    ),
    "pt.ts": (
        'Álex Ruiz, Momo González, Guille Collado, Bea González',
        'Álex Ruiz, Momo González, Bea González, Ernesto Moreno, Raquel Segura',
    ),
    "sv.ts": (
        'Álex Ruiz, Momo González, Guille Collado, Bea González',
        'Álex Ruiz, Momo González, Bea González, Ernesto Moreno, Raquel Segura',
    ),
}

# Typo fix
es_path = ROOT / "es.ts"
raw = es_path.read_bytes().decode("utf-8")
if raw.count(TYPO_OLD) == 1:
    raw = raw.replace(TYPO_OLD, TYPO_NEW, 1)
    es_path.write_bytes(raw.encode("utf-8"))
    print("[es.ts] typo OK")
elif raw.count(TYPO_OLD) == 0:
    print("[es.ts] typo NOT FOUND (already fixed?)")
else:
    print(f"[es.ts] typo appears {raw.count(TYPO_OLD)} times — abort")
    sys.exit(1)

# Academia desc updates
for fname, (old, new) in ACADEMIA.items():
    path = ROOT / fname
    raw = path.read_bytes().decode("utf-8")
    if raw.count(old) != 1:
        print(f"[{fname}] academia desc match {raw.count(old)} — abort")
        sys.exit(1)
    raw = raw.replace(old, new, 1)
    path.write_bytes(raw.encode("utf-8"))
    print(f"[{fname}] academia OK")

print("ALL DONE")
