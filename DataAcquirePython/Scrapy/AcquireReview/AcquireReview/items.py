# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class AcquireReviewItem(scrapy.Item):
    # define the fields for your item here like:
    pid = scrapy.Field()
    title = scrapy.Field()
    rating = scrapy.Field()
    post_time = scrapy.Field()
    content = scrapy.Field()


class BasicInfo(scrapy.Item):
    name = scrapy.Field()
    pid = scrapy.Field()
    stars = scrapy.Field()
    discount_price = scrapy.Field()
    normal_price = scrapy.Field()
    other_info = scrapy.Field()
    ratings = scrapy.Field()
    about_this_item = scrapy.Field()
    # other_info_title = scrapy.Field()
    # other_info_content = scrapy.Field()

