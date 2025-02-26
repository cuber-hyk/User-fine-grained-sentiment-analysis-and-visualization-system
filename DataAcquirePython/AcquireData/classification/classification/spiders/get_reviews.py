import csv
from ..items import Review
import scrapy
from pathlib import Path

class GetReviewsSpider(scrapy.Spider):
    name = "get_reviews"
    allowed_domains = ["www.amazon.com"]

    def start_requests(self):
        pid_dir = Path(__file__).parent.parent / 'data' / 'crawled_product'
        files = [f for f in pid_dir.iterdir() if f.is_file()]
        is_test = 1
        if is_test:
            url = (f'https://www.amazon.com/product-reviews/B09L45VFCN/'
                   f'&reviewerType=all_reviews')
            yield scrapy.Request(url=url, meta={
                            'dont_redirect': True,
                            'handle_httpstatus_list': [301, 302]}, callback=self.parse)
        else:
            with open(files[0], mode='r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    pid = row['pid']
                    for page_num in range(1, 11):
                        url = (f'https://www.amazon.com/product-reviews/{pid}'
                               f'/ref=cm_cr_dp_d_show_all_btm?ie=UTF8&reviewerType=all_reviews/&pageNumber={page_num}')
                        yield scrapy.Request(url=url, meta={
                            'dont_redirect': True,
                            'handle_httpstatus_list': [301, 302]}, callback=self.parse)

    def parse(self, response):
        # 正常解析逻辑
        print(response)
        review_list = response.xpath('//*[@id="cm_cr-review_list"]')
        print(review_list)
        test_data = response.xpath('//*[@id="customer_review-R10KR0BH2FSIG0"]/div[2]/h5/a/span[2]/text()').get()
        test_title = response.xpath('/html/body/div[1]/div[2]/div/div[1]/div/div[1]/div[5]/div[3]/div/ul[1]/li[1]'
                                    '/span/div/div/div[2]/h5/a/span[2]/text()').get()
        print(test_data)
        print(test_title)
        content_list = response.xpath('//*[@id="cm_cr-review_list"]/div/div/div/div/span/span/text()').extract()
        print(content_list)
        title_list = response.xpath('//*[@id="cm_cr-review_list"]/div/div/div/div/a/span/text()').extract()
        star_list = response.xpath('//*[@id="cm_cr-review_list"]/div/div/div/div[2]/a/i/span/text()').extract()
        date_list = response.xpath('//*[@id="cm_cr-review_list"]/div/div/div/span/text()').extract()
        user_list = response.xpath('//*[@id="cm_cr-review_list"]/div/div/div/a/div[2]/span/text()').extract()
        style_list = response.xpath('//*[@id="cm_cr-review_list"]/div/span/div/div/div[3]/a[1]/text()').extract()

        for content, star, date, title in zip(content_list, star_list, date_list, title_list):
            review_item = Review()
            # review_item['user'] = user
            review_item['title'] = title
            review_item['rating'] = star
            review_item['content'] = content
            review_item['post_time'] = date
            review_item['pid'] = response.url.split('/')[-2]
            # review_item['style'] = style.split(':')[0]
            yield review_item



# '//*[@id="customer_review-R10KR0BH2FSIG0"]/div[2]/h5/a/span[2]'
#  '//*[@id="customer_review-R1M8QY0B28R9XT"]/div[2]/h5/a/span[2]'
# '//*[@id="cm_cr-review_list"]'
# '/html/body/div[1]/div[2]/div/div[1]/div/div[1]/div[5]/div[3]/div/ul[1]/li[2]/span/div/div/div[2]/h5/a/span[2]'
# '/html/body/div[1]/div[2]/div/div[1]/div/div[1]/div[5]/div[3]/div/ul[1]/li[1]/span/div/div/div[2]/h5/a/span[2]'
#https://www.amazon.com/ABCs-Trucks-Boats-Planes-Trains/product-reviews/1531912222/ref=cm_cr_dp_d_show_all_btm?ie=UTF8&reviewerType=all_reviews