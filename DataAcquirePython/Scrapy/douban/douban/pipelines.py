# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter

import json
import codecs
from collections import OrderedDict
class DoubanPipeline(object):
    def __init__(self):
        self.file = open('data.json', 'w', encoding='utf-8')

    def process_item(self, item, spider):
        item = dict(item)
        json_data = json.dumps(item, ensure_ascii=False, indent=2) + ',\n'
        self.file.write(json_data)
        print("json")
        return item

    def __del__(self):
        self.file.close()
