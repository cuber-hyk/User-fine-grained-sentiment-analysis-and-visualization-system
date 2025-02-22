import scrapy
from pathlib import Path
import csv
from ..items import PidItem
import json
import os

log_path = Path(__file__).parent.parent / 'log' / 'product_pid.txt'


def debug(content):
    print("############DEBUG##############")
    print(content)
    print("############DEBUG##############")


class ProductPidSpider(scrapy.Spider):
    name = "product-pid"
    allowed_domains = ["www.amazon.com"]
    start_urls = ["https://www.amazon.com"]
    classification = ''


    def start_requests(self):
        os.makedirs(log_path, exist_ok=True)
        test_dir = Path(__file__).parent.parent / 'test'
        csv_dir = Path(__file__).parent.parent / 'data' / 'second-href-data-test'
        for csv_path in csv_dir.glob('*.csv'):

            with open(csv_path, mode='r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    classification = row['Classification']
                    href = row['Href']
                    url = f'https://www.amazon.com/{href}'
                    urls = [f'https://www.amazon.com/{href}', url + '?_encoding=UTF8&pg=2']
                    for url in urls:
                        yield scrapy.Request(url=url, callback=self.parse, meta={'classification': classification})



    def parse(self, response):
        pid_div = response.xpath(f'/html/body/div[1]/div[2]/div/div/div[1]/div/div/div[2]/div[1]')
        if not pid_div:
            with open(log_path, 'a') as f:
                f.write(f"{response.url}\n")
            return

        data_list_json = pid_div.xpath('@data-client-recs-list').get()
        if not data_list_json:
            with open(log_path, 'a') as f:
                f.write(f"{response.url}\n")
            return

        data_list = json.loads(data_list_json)

        if data_list:
            for item in data_list:
                pid = item.get('id')
                if pid:
                    pid_item = PidItem()
                    pid_item['pid'] = pid
                    pid_item['classification'] = response.meta['classification']
                    yield pid_item
                else:
                    with open(log_path, 'a') as f:
                        f.write(f"{response.url}\n")
        else:

            with open(log_path, 'a') as f:
                f.write(f"{response.url}\n")
