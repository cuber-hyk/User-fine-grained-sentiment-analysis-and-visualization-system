import scrapy
from scrapy.selector import Selector
import json
import re
from AcquireReview.items import AcquireReviewItem
from AcquireReview.items import BasicInfo

from anticaptchaofficial.recaptchav2proxyless import *


class ReviewspiderSpider(scrapy.Spider):
    name = "reviewSpider"
    lastPid = ''
    allowed_domains = ["www.amazon.com"]
    start_urls = []
    input_file = 'test.json'
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    pid_list = [item['pid'] for item in data if item.get('pid')]
    count = 0
    def start_requests(self):

        for pid in self.pid_list:
            infoUrl = f'https://www.amazon.com/dp/{pid}/ref=cm_cr_arp_d_product_top?ie=UTF8&th=1'
            yield scrapy.Request(url=infoUrl, meta={
                'dont_redirect': True,
                'handle_httpstatus_list': [301, 302]}, callback=self.parse)
            for page in range(1, 11):
                url = f'https://www.amazon.com/product-reviews/{pid}/ref=cm_cr_dp_d_show_all_btm?ie=UTF8&reviewerType=all_reviews/&pageNumber={page}'
                yield scrapy.Request(url=url, meta={
                        'dont_redirect': True,
                        'handle_httpstatus_list': [301, 302]}, callback=self.parse)
    # https://www.amazon.com/product-reviews/B08D8XHNXQ/ref=cm_cr_dp_d_show_all_btm?ie=UTF8&reviewerType=all_reviews
    # 'dont_redirect': True是禁止重定向
    # Request.meta 中的 handle_httpstatus_list 键可以用来指定每个request所允许的response code。

    def parse(self, response):
        if response.url.split('/')[3] == 'dp':
            star_5_extract = response.xpath(
                '//*[@id="histogramTable"]/li[1]/span/a/div[3]/span[1]/text()').extract_first()
            star_4_extract = response.xpath(
                '//*[@id="histogramTable"]/li[1]/span/a/div[3]/span[2]/text()').extract_first()
            star_3_extract = response.xpath(
                '//*[@id="histogramTable"]/li[1]/span/a/div[3]/span[3]/text()').extract_first()
            star_2_extract = response.xpath(
                '//*[@id="histogramTable"]/li[1]/span/a/div[3]/span[4]/text()').extract_first()
            star_1_extract = response.xpath(
                '//*[@id="histogramTable"]/li[1]/span/a/div[3]/span[5]/text()').extract_first()

            star_1 = 'None%'
            star_2 = 'None%'
            star_3 = 'None%'
            star_4 = 'None%'
            star_5 = 'None%'


            if star_5_extract is not None:
                star_5 = re.search(r'\d+%', star_5_extract).group(0)
            if star_4_extract is not None:
                star_5 = re.search(r'\d+%', star_4_extract).group(0)
            if star_3_extract is not None:
                star_5 = re.search(r'\d+%', star_3_extract).group(0)
            if star_2_extract is not None:
                star_5 = re.search(r'\d+%', star_2_extract).group(0)
            if star_1_extract is not None:
                star_5 = re.search(r'\d+%', star_1_extract).group(0)


            product_name = response.xpath('//*[@id="productTitle"]/text()').extract_first()
            ratings = response.xpath('//*[@id="acrCustomerReviewText"]/text()').extract_first()
            # //*[@id="histogramTable"]/li[1]/span/a/div[3]/span[1]/text()
            price_whole = response.xpath(
                '//*[@id="corePriceDisplay_desktop_feature_div"]/div[1]/span/span[2]/span[2]/text()').extract_first()

            # //*[@id="corePriceDisplay_desktop_feature_div"]/div[1]/span[2]/span[2]/span[2]/text()
            # //*[@id="corePriceDisplay_desktop_feature_div"]/div[1]/span[4]/span[2]/span/span[2]
            # //*[@id="corePriceDisplay_desktop_feature_div"]/div[2]/span/span[1]/span[2]/span/span[2]
            price_fraction = response.xpath(
                '//*[@id="corePriceDisplay_desktop_feature_div"]/div[1]/span[3]/span[2]/span[3]/text()').extract_first()

            price = response.xpath('//span[@class="a-price a-text-price"]/span[1]/text()').extract_first()

            if price_whole is None:
                price_whole = ''
            if price_fraction is None:
                price_fraction = ''
            if price is None:
                price = ''
            if product_name is None:
                product_name = 'None'
            if ratings is None:
                ratings = 'None'

            # //*[@id="feature-bullets"]/ul/li[2]/span/text()
            about_this_item = response.xpath('//*[@id="feature-bullets"]/ul/li/span/text()').extract()

            # 其他信息
            # //table[@class="a-normal a-spacing-micro"]/tbody/tr
            other_info_title = response.xpath('//table[@class="a-normal a-spacing-micro"]/tr/td[1]/span/text()').extract()
            other_info_content = response.xpath('//table[@class="a-normal a-spacing-micro"]//tr/td[2]/span/text()').extract()


            basic_info = BasicInfo()
            basic_info['name'] = product_name
            basic_info['stars'] = [star_5, star_4, star_3, star_2, star_1]
            basic_info['pid'] = response.url.split('/')[-2]
            basic_info['ratings'] = ratings
            basic_info['other_info'] = dict(zip(other_info_title, other_info_content))
            basic_info['discount_price'] = '$ '+price_whole + '.' + price_fraction
            basic_info['normal_price'] = price
            basic_info['about_this_item'] = about_this_item
            # basic_info['other_info_title'] = other_info_title
            # basic_info['other_info_content'] = other_info_content
            yield basic_info
        else:
            # 使用 XPath 提取内容
            # //*[@id="customer_review-R1VE3959R5VJ3N"]/div[4]/span/span/text()
            content_list = response.xpath('//*[@id="cm_cr-review_list"]/div/div/div/div/span/span/text()').extract()

            # 提取评论标题
            # //*[@id="customer_review-R1VE3959R5VJ3N"]/div[2]/a/span[2]
            title_list = response.xpath('//*[@id="cm_cr-review_list"]/div/div/div/div/a/span/text()').extract()

            # 提取星级评分
            # //*[@id="customer_review-R1VE3959R5VJ3N"]/div[2]/a/i/span
            # //*[@id="customer_review-R1VE3959R5VJ3N"]/div[2]/a/i/span
            # //*[@id="customer_review-R1VE3959R5VJ3N"]/div[2]/a/span[1]
            star_list = response.xpath('//*[@id="cm_cr-review_list"]/div/div/div/div[2]/a/i/span/text()').extract()

            # 提取日期
            # //*[@id="customer_review-R1VE3959R5VJ3N"]/span
            date_list = response.xpath('//*[@id="cm_cr-review_list"]/div/div/div/span/text()').extract()




            for content, star, date, title in zip(content_list, star_list, date_list, title_list):
                review_item = AcquireReviewItem()
                review_item['title'] = title
                review_item['rating'] = star
                review_item['content'] = content
                review_item['post_time'] = date
                review_item['pid'] = response.url.split('/')[-3]
                yield review_item


