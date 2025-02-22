import scrapy
from pathlib import Path
import csv
from ..items import SecondHrefItem


def debug(content):
    print("############DEBUG##############")
    print(content)
    print("############DEBUG##############")


class SecondHrefSpider(scrapy.Spider):
    name = "second-href"
    allowed_domains = ["www.amazon.com"]
    start_urls = ["https://www.amazon.com"]
    first_cls = ''

    def start_requests(self):
        csv_path = Path(__file__).parent.parent / 'data' / 'first-href-data.csv'
        with open(csv_path, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                classification = row['Classification']
                href = row['Href']
                self.first_cls = classification
                url = f'https://www.amazon.com/{href}'
                yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        a_tags = response.xpath(f'/html/body/div[1]/div[2]/div[1]/div/div[2]/div/div/div[2]/div[2]/div/a')

        if a_tags:
            for a in a_tags:
                second_href_item = SecondHrefItem()
                second_href_item['href'] = a.xpath('@href').get()
                second_href_item['classification'] = a.xpath('text()').get()
                current_url = response.url
                url_parts = current_url.split('/')
                second_href_item['first_classification'] = url_parts[3]
                yield second_href_item
        else:
            log_path = Path(__file__).parent.parent / 'log' / 'second-href.txt'
            with open(log_path, 'a') as f:
                f.write(f"{response.url}\n")
