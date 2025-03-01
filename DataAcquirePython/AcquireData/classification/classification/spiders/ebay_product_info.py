import csv

import scrapy
from scrapy import Selector
from fake_useragent import UserAgent
from pathlib import Path
from selenium import webdriver
from ..items import Product
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
class EbayProductInfoSpider(scrapy.Spider):
    name = "ebay_product_info"
    allowed_domains = ["www.ebay.com"]
    start_urls = ["https://www.ebay.com"]
    userAgent = UserAgent()


    headers = {
        'User-Agent': userAgent.random,
        'Accept-Language': 'en-US,en;q=0.9'
    }

    def __init__(self, *args, **kwargs):
        super(EbayProductInfoSpider, self).__init__(*args, **kwargs)
        chrome_options = Options()
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_argument('--lang=en-US')
        self.driver = webdriver.Chrome(options=chrome_options)

    def start_requests(self):
        file_path = Path(__file__).parent.parent / 'data' / 'ebay' / 'product' / 'product_href.csv'
        count = 0
        with open(file_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                url = row['href']
                pid = row['pid']
                yield scrapy.Request(url, headers=self.headers, meta={'pid': pid})

    def parse(self, response):
        self.driver.get(response.url)
        page_source = self.driver.page_source
        selector = Selector(text=page_source)
        product = Product()
        product['pid'] = response.meta['pid']
        product['name'] = selector.xpath('//*[@id="mainContent"]/div[1]/div[1]/h1/span/text()').get()
        product['discount_price'] = selector.xpath('//*[@id="mainContent"]/div[1]/div[3]/div/div/div[1]/span/text()').get() or 'no_price'
        product['normal_price'] = selector.xpath('//*[@id="mainContent"]/div[1]/div[3]/div/div/div[2]/span[1]/span[2]/text()').get() or 'no_price'
        product['stars'] = selector.xpath('//*[@id="STORE_INFORMATION"]/div/div/div[1]/div[1]/div[2]/div[2]/h4/span[1]/text()').get()
        product['ratings'] = selector.xpath('//*[@id="STORE_INFORMATION"]/div/div/div[2]/div/div/h2/span[2]/text()').get()
        product['image_url'] = selector.xpath('//*[@id="PicturePanel"]/div[1]/div/div[1]/div[1]/div[2]/div[4]/div[1]/img/@src').get()
        product['channel'] = 'ebay'
        product['about_this_item'] = 'ebay dont have this'
        product['classification'] = ''
        classification_str = ', '.join(selector.css('body > div.vi-evo > main > div.main-container > '
                                                 'div.vim.x-vi-evo-main-container.template-evo-avip > '
                                                 'div.x-vi-evo-main-container__atf-breadcrumbs > div > div > '
                                                 'div.vim.x-breadcrumb > div.x-breadcrumb__wrapper > div > nav > ul > '
                                                 'li > a > span::text ').getall())
        product['classification'] = classification_str
        yield product
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
