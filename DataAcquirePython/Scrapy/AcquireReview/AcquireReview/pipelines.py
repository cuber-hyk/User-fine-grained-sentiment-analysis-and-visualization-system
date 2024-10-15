# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html
import os

# useful for handling different item types with a single interface
from itemadapter import ItemAdapter
import json
from AcquireReview.items import AcquireReviewItem
from AcquireReview.items import BasicInfo

class AcquireReviewPipeline:

    def __init__(self):
        self.files = None

    def open_spider(self, spider):
        self.files = {}

    def close_spider(self, spider):
        for file in self.files.values():
            file.seek(file.tell() - 2, os.SEEK_SET)  # 移动到倒数第二个字符
            file.write('\n]')
            file.close()
    # def __init__(self):
    #     # self.file = open('ReviewData.json', 'w', encoding='utf-8')
    #     # self.file = open('TestData.json', 'w', encoding='utf-8')

    def process_item(self, item, spider):
        if isinstance(item, AcquireReviewItem):
            review_item = AcquireReviewItem(item)
            pid = review_item['pid']
            # if pid not in self.files:
            # filename = f'{pid}_product_data.json'
            # filepath = os.path.join('data', filename)
            # 存储在 data 目录下
                # os.makedirs(os.path.dirname(filepath), exist_ok=True)
                # self.files[pid] = open(filepath, 'w', encoding='utf-8')
                # self.files[pid].write('[\n')
            line = json.dumps(dict(review_item), ensure_ascii=False, indent=4) + ',\n'
            self.files[pid].write(line)

        elif isinstance(item, BasicInfo):
            basic_info = BasicInfo(item)
            pid = basic_info['pid']
            filename = f'{pid}_product_data.json'
            filepath = os.path.join('data', filename)
            if not os.path.exists(filepath):
                os.makedirs(os.path.dirname(filepath), exist_ok=True)
            self.files[pid] = open(filepath, 'w', encoding='utf-8')
            self.files[pid].write('[\n')
            line = json.dumps(dict(basic_info), ensure_ascii=False, indent=4) + ',\n'
            self.files[pid].write(line)
            # self.files[pid].write('}\n')

        return item




        # 创建或获取文件对象


        # 写入 JSON 数据


        # self.file.write('[\n')
        # self.file.write(reviewItem['name'])
        #
        # item = dict(item)
        # json_data = json.dumps(item, ensure_ascii=False, indent=2) + ',\n'
        # self.file.write((json_data))
        # return item

    # def __del__(self):
    #     self.file.write(']')
    #     self.file.close()
