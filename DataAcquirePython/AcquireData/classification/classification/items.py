# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


# best seller下各个类别的href和类名title
class HrefItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    classification = scrapy.Field()
    href = scrapy.Field()
    pass


# 各个类别下的二级href和类名title
class SecondHrefItem(scrapy.Item):
    classification = scrapy.Field()
    href = scrapy.Field()
    first_classification = scrapy.Field()
    pass


class PidItem(scrapy.Item):
    pid = scrapy.Field()
    classification = scrapy.Field()
    pass


class Product(scrapy.Item):
    pid = scrapy.Field()
    name = scrapy.Field()
    stars = scrapy.Field()
    discount_price = scrapy.Field()
    normal_price = scrapy.Field()
    ratings = scrapy.Field()
    about_this_item = scrapy.Field()
    classification = scrapy.Field()
    channel = scrapy.Field()
    image_url = scrapy.Field()


class Review(scrapy.Item):
    user = scrapy.Field()
    pid = scrapy.Field()
    title = scrapy.Field()
    rating = scrapy.Field()
    post_time = scrapy.Field()
    content = scrapy.Field()
    style = scrapy.Field()
    sentiment = scrapy.Field()

