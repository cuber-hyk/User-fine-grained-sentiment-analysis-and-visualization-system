import scrapy
from scrapy.selector import Selector



try:
    from scrapy.spiders import Spider
except:
    from scrapy.spiders import BaseSpider as Spider
from scrapy.utils.response import get_base_url
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor as sle
from douban.items import DoubanItem

class doubanSpider(scrapy.Spider):
    name = "doubanSpider"
    allowed_domain = ['movie.douban.com']
    start_urls = ['https://movie.douban.com/top250']
    css_selector_test = '#content'

    def parse(self, response):
        selector = Selector(response)
        list_items = selector.css('#a-page > div > div.article > ol > li')
        test = selector.css(f'{self.css_selector_test}')
        name = test.css('h1::text')
        print("debug:")
        print(name)

        for item in list_items:
            movie_item = DoubanItem()
            movie_item['title'] = item.css('span.title::text').extract_first()
            movie_item['rating_num'] = item.css('span.rating_num::text').extract_first()
            movie_item['director'] = item.css('div.bd > p').extract_first()
            movie_item['quote'] = item.css('div.bd > p.quote').extract_first()
            print(movie_item['title'])
            yield movie_item
            # 生成的数据交给引擎

