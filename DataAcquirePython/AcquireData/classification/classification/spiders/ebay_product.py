import csv
import datetime

import scrapy
from scrapy import Selector
from fake_useragent import UserAgent
from pathlib import Path
from selenium import webdriver
from datetime import datetime
class EbayPidSpider(scrapy.Spider):
    name = "ebay_product"
    allowed_domains = ["www.ebay.com"]
    start_urls = ["https://www.ebay.com"]
    userAgent = UserAgent()

    headers = {
        'User-Agent': userAgent.random,
        'Accept-Language': 'en-US,en;q=0.9'
    }

    def __init__(self, *args,  **kwargs):
        super(EbayPidSpider, self).__init__(*args, **kwargs)
        self.driver = webdriver.Chrome()

    def start_requests(self):
        file_path = Path(__file__).parent.parent / 'data' / 'ebay' / 'category_1' / 'href.csv'
        with open(file_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                url = row['href']
                yield scrapy.Request(url, headers=self.headers)

    def parse(self, response):
        self.driver.get(response.url)
        page_source = self.driver.page_source
        selector = Selector(text=page_source)
        product_hrefs = selector.xpath('//*[@id="srp-river-results"]/ul/li/div/div[2]/a/@href').extract()
        # print(product_hrefs)
        # product_hrefs = response.xpath('//*[@id="srp-river-results"]/ul/li/div/div[2]/a/@href').extract()
        # 获取当前日期
        current_date = datetime.now()
        # 格式化为 YYYYMMDD
        formatted_date = current_date.strftime("%Y%m%d")
        file_path = Path(__file__).parent.parent / 'data' / 'ebay' / 'product' / f'product_href_{formatted_date}.csv'
        with open(file_path, 'a', encoding='utf-8', newline='') as f:
            csv_writer = csv.writer(f)
            if f.tell() == 0:
                csv_writer.writerow(['href', 'pid'])
            for href in product_hrefs:
                pid = href.split('/itm/')[1].split('?')[0]
                href = href.split('?')[0]
                csv_writer.writerow([href, pid])
        pass

#category_1
# response.xpath('//*[@id="x-refine__group__0"]/ul/li/ul/li/a/@href')


# response.xpath('//*[@id="srp-river-results"]/ul/li/div/div[2]/a/@href')
# product_href and pid


#classification
# response.css('body > div.vi-evo > main > div.main-container > div.vim.x-vi-evo-main-container.template-evo-avip >
# div.x-vi-evo-main-container__atf-breadcrumbs > div > div > div.vim.x-breadcrumb > div.x-breadcrumb__wrapper > div >
# nav > ul > li > a > span::text ').getall()

#price response.xpath('//*[@id="mainContent"]/div[1]/div[3]/div/div/div[1]/span/text()')

#product_name response.xpath('//*[@id="mainContent"]/div[1]/div[1]/h1/span/text()')
#image src  response.xpath('//*[@id="PicturePanel"]/div[1]/div/div[1]/div[1]/div[2]/div[4]/div[1]/img/@src')
#stars  response.xpath('//*[@id="mainContent"]/div[1]/div[2]/div/div[2]/ul/li[1]/a/span/text()')
# ratings //*[@id="STORE_INFORMATION"]/div/div/div[2]/div/div/h2/span[2]
# channel = ebay

# 天选网址
# https://www.ebay.com/sch/58058/i.html?_nkw=all+categories"&"_sac=1"&"_sop=12"&"_oac=1
