import scrapy
from pathlib import Path
import os
import csv
from ..items import Product

log_path = Path(__file__).parent.parent / 'log' / 'product_info.txt'
failed_pid = Path(__file__).parent.parent / 'log' / 'failed_pid.csv'

class ProductInfoSpider(scrapy.Spider):




    name = "product-info"
    allowed_domains = ["www.amazon.com"]
    start_urls = ["https://www.amazon.com"]

    def start_requests(self):
        is_test = 0
        pid_dir = Path(__file__).parent.parent / 'data' / 'split-task'
        pid_path = Path(__file__).parent.parent / 'data' / 'triplets' / 'pids_triplets.csv'
        if is_test:
            url = "https://www.amazon.com/dp/B09L45VFCN/"
            yield scrapy.Request(url=url, callback=self.parse, meta={'classification': "test"})

        else:
            files = [f for f in pid_dir.iterdir() if f.is_file()]
            file_path = pid_path
            with open(file_path, mode='r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    # print(pid)
                    # classification = row['Classification']
                    pid = row['Pid']
                    url = f'https://www.amazon.com/dp/{pid}'
                    yield scrapy.Request(url=url, callback=self.parse, meta={'pid': pid})

    def parse(self, response):
        product = Product()
        product['name'] = response.xpath(f'//*[@id="productTitle"]/text()').get()
        html_pid = response.xpath(f'//*[@id="title_feature_div"]/@data-csa-c-asin').get()
        pid = response.meta['pid']
        product['pid'] = pid
        if html_pid is None:
            with open(failed_pid, mode='a', encoding='utf-8') as file:
                writer = csv.writer(file)
                # 如果文件是空的，写入表头
                if file.tell() == 0:
                    writer.writerow(['pid'])
                # 写入数据
                writer.writerow([pid])
            return

        image_url = response.xpath(f'//*[@id="landingImage"]/@src').get()
        product['image_url'] = image_url
        product['stars'] = response.xpath(f'//*[@id="acrPopover"]/span[1]/a/span/text()').get()
        product['ratings'] = response.xpath('//*[@id="acrCustomerReviewText"]/text()').extract_first()
        product['about_this_item'] = ' '.join(response.xpath('//*[@id="feature-bullets"]/ul/li/span/text()').extract())
        price_whole = response.xpath('//*[@id="corePriceDisplay_desktop_feature_div"]/div[1]/span[2]/span[2]/span[2]'
                                     '/text()').extract_first() or 'xx'
        price_frac = response.xpath('//*[@id="corePriceDisplay_desktop_feature_div"]/div[1]/span[2]/span[2]/span[3]'
                                    '/text()').extract_first() or 'xx'
        normal_price = '$' + price_whole + '.' + price_frac
        normal_price2 = response.xpath('//*[@id="corePriceDisplay_desktop_feature_div"]/div[1]/span[1]/text()').extract_first()
        product['channel'] = 'amazon'
        product['discount_price'] = normal_price if normal_price else 'no price'
        product['normal_price'] = normal_price2 if normal_price2 else 'no price'
        product['classification'] = response.xpath('//*[@id="wayfinding-breadcrumbs_feature_div"]/ul/li[5]/span/a/text()').get().strip()
        yield product
