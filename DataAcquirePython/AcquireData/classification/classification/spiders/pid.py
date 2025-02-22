import scrapy
from ..items import HrefItem
import re

# https://www.amazon.com/s?i=specialty-aps&bbn=2562090011&rh=n%3A2562090011%2Cn%3A%252115690151%2Cn%3A15718271&
# ref=nav_em__nav_desktop_sa_intl_car_care_0_2_9_2

# https://www.amazon.com/s?i=specialty-aps&bbn=2562090011&rh=n%3A2562090011%2Cn%3A%252115690151%2Cn%3A2230642011&
# ref=nav_em__nav_desktop_sa_intl_car_electronics_accessories_0_2_9_3

#//*[@id="CardInstancetSXiMNojTPdhgGWXNID9Yg"]/div[2]/div[1]/a

class PidSpider(scrapy.Spider):
    name = "pid"
    allowed_domains = ["www.amazon.com"]
    start_urls = ["https://www.amazon.com"]
    ul_start = 9
    ul_end = 10
    li_start = 3
    li_end = 4

    def start_requests(self):
        url = f'https://www.amazon.com/b?node=281407&ref=sr_nr_n_1'
        yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        id_list = response.xpath(f'//*[@id="departments"]/ul/span/li/@id').getall()
        # classification_list = response.xpath(f'//*[@id="departments"]/ul/span/li/span/a/span[2]/text()').getall()

        for hid in id_list:
            pattern = re.compile(r'n/(.*)')
            href_item = HrefItem()
            href = pattern.search(hid)
            if href:
                href_item['href'] = href.group(1)
                print("DEBUG:")
                print("DEBUG:")
            # ['classification'] = cls
            yield href_item
