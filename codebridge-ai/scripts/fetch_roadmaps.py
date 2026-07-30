import json
import sys
from pathlib import Path

import requests
from bs4 import BeautifulSoup

BASE_URL = 'https://roadmap.sh'
ROADMAPS_URL = f'{BASE_URL}/roadmaps/'
OUTPUT_PATH = Path(__file__).resolve().parents[1] / 'data' / 'roadmaps.json'

# Desired category names as they appear on the site
CATEGORY_NAMES = [
    'New Roadmaps',
    'Role Based Roadmaps',
    'Skill Based Roadmaps',
    'Absolute Beginners',
    'Best Practices',
]

def fetch_roadmaps():
    """Fetch roadmap listings from roadmap.sh and write to data/roadmaps.json"""
    try:
        resp = requests.get(ROADMAPS_URL, timeout=15)
        resp.raise_for_status()
    except Exception as e:
        print(f'Failed to fetch roadmap list: {e}', file=sys.stderr)
        sys.exit(1)

    soup = BeautifulSoup(resp.text, 'html.parser')
    categories: dict[str, list[dict]] = {}

    # Iterate over each heading (h2) that matches our category list
    for heading in soup.find_all('h2'):
        category_name = heading.get_text(strip=True)
        if category_name not in CATEGORY_NAMES:
            continue
        # The next sibling that is a <div> with a class containing 'grid' holds the roadmap cards
        grid_div = heading.find_next_sibling()
        while grid_div and (grid_div.name != 'div' or not grid_div.get('class') or 'grid' not in grid_div.get('class')):
            grid_div = grid_div.find_next_sibling()
        if not grid_div:
            continue
        # Extract each roadmap card link
        for a_tag in grid_div.find_all('a', href=True):
            title = a_tag.get_text(strip=True)
            href = a_tag['href']
            slug = href.strip('/').split('/')[-1]
            # No subtitle is provided in this listing; leave empty
            subtitle = ''
            # Simple placeholder icon – first character of the title
            icon = title[0] if title else ''
            entry = {
                'slug': slug,
                'title': title,
                'subtitle': subtitle,
                'icon': icon,
            }
            categories.setdefault(category_name, []).append(entry)

    # Ensure output directory exists and write JSON
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump({'categories': categories}, f, ensure_ascii=False, indent=2)
    print(f'Successfully wrote {OUTPUT_PATH}')

if __name__ == '__main__':
    fetch_roadmaps()
