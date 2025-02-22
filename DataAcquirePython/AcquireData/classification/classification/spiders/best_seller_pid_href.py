from typing import Iterable

import scrapy
from ..items import HrefItem
from scrapy import Request


class BestSellerPidHrefSpider(scrapy.Spider):
    name = "best-seller-pid-href"
    allowed_domains = ["www.amazon.com"]
    start_urls = ["https://www.amazon.com"]

    def start_requests(self):
        url = f'https://www.amazon.com/gp/bestsellers/?ref_=nav_cs_bestsellers'
        yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        a_tags = response.xpath(f'/html/body/div[1]/div[1]/div[2]/div/div/div/div[2]/div/div[1]/div/div/div[2]/div/a')

        for a in a_tags:
            print(a)
            href_item = HrefItem()
            href_item['href'] = a.xpath('@href').get()
            href_item['classification'] = a.xpath('text()').get()
            # print(f"href: {href_item['href']}, text: {href_item['text']}")
            yield href_item


