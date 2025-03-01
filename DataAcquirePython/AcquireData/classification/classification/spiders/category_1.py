import scrapy
import csv
from pathlib import Path

class Category1Spider(scrapy.Spider):
    name = "category_1"
    allowed_domains = ["www.ebay.com"]
    start_urls = ["https://www.ebay.com"]

    def start_requests(self):
        url = f'https://www.ebay.com/sch/i.html?_nkw=all+categories&_sac=1&_sop=12&_oac=1'
        yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        hrefs = response.xpath('//*[@id="x-refine__group__0"]/ul/li/ul/li/a/@href').extract()
        file_path = Path(__file__).parent.parent / 'data' / 'ebay' / 'category_1' / 'href.csv'
        with open(file_path, mode='a', encoding='utf-8', newline='') as file:
            writer = csv.writer(file)
            if file.tell() == 0:
                writer.writerow(['href'])
            for href in hrefs:
                writer.writerow([href])
        pass
