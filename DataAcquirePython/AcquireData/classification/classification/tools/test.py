from pathlib import Path
import csv


file_path = Path(__file__).parent.parent / 'data' / 'ebay' / 'product' / 'reviews_href_20250308.csv'
with open(file_path, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        if row['href'] == '':
            pid = row['pid']
            username = row['username']
            url = f'https://www.ebay.com/fdbk/mweb_profile?fdbkType=FeedbackReceivedAsSeller&item_id={pid}&username={username}&filter=feedback_page%3ARECEIVED_AS_SELLER&sort=RELEVANCE'
            print(url)