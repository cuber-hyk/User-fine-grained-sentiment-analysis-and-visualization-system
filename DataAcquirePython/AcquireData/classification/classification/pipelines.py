# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface

import pymysql
import mysql.connector
import csv
import os
import json

from scrapy.exceptions import DropItem

from .items import HrefItem, SecondHrefItem, PidItem, Product,Review
from pathlib import Path

class ClassificationPipeline:
    def __init__(self, mysql_host, mysql_db, mysql_user, mysql_password, mysql_port):
        self.cursor = None
        self.connection = None
        self.mysql_host = mysql_host
        self.mysql_db = mysql_db
        self.mysql_user = mysql_user
        self.mysql_password = mysql_password
        self.mysql_port = mysql_port

    @classmethod
    def from_crawler(cls, crawler):
        return cls(
            mysql_host
            =crawler.settings.get('MYSQL_HOST'),
            mysql_db
            =crawler.settings.get('MYSQL_DATABASE'),
            mysql_user
            =crawler.settings.get('MYSQL_USER'),
            mysql_password
            =crawler.settings.get('MYSQL_PASSWORD'),
            mysql_port
            =crawler.settings.get('MYSQL_PORT')
        )

    def open_spider(self, spider):
        try:
            self.connection = mysql.connector.connect(
                host=self.mysql_host,
                user=self.mysql_user,
                password=self.mysql_password,
                database=self.mysql_db,
                port=self.mysql_port
            )
            self.cursor = self.connection.cursor()
            print("SUCCESS!!!")
        except mysql.connector.Error as e:
            print("ERROR!!!!!!!!!!!")
            spider.logger.error(f"Error connecting to MySQL: {e}")

    def close_spider(self, spider):
        self.connection.close()


    def process_item(self, item, spider):
        if isinstance(item, HrefItem):
            href_item = HrefItem(item)
            href = href_item.get('href')  # 正确提取 href 字段
            classification = href_item.get('classification')
            if href and classification:
                with open(f'data/first-href-data.csv', mode='a', encoding='utf-8', newline='') as file:
                    writer = csv.writer(file)
                    if file.tell() == 0:
                        writer.writerow(['Href', 'Classification'])
                    # 写入数据
                    writer.writerow([href, classification])

        elif isinstance(item, SecondHrefItem):
            second_href_item = SecondHrefItem(item)
            href = second_href_item.get('href')  # 正确提取 href 字段
            classification = second_href_item.get('classification')
            first_classification = second_href_item.get('first_classification')
            data_dir = Path(__file__).parent / 'data' / 'second-href-data-final'
            if href and classification:
                os.makedirs(data_dir, exist_ok=True)
                file_path = data_dir / f'{first_classification}.csv'
                with open(file_path, mode='a', newline='', encoding='utf-8') as file:
                    writer = csv.writer(file)
                    # 如果文件是空的，写入表头
                    if file.tell() == 0:
                        writer.writerow(['Href', 'Classification'])
                    # 写入数据
                    writer.writerow([href, classification])

        elif isinstance(item, PidItem):
            pid_item = PidItem(item)
            pid = pid_item.get('pid')
            classification = pid_item.get('classification')
            data_dir = Path(__file__).parent / 'data' / 'pid-data-final2'
            if pid and classification:
                os.makedirs(data_dir, exist_ok=True)
                file_path = data_dir / f'pid.csv'
                with open(file_path, mode='a', newline='', encoding='utf-8') as file:
                    writer = csv.writer(file)
                    # 如果文件是空的，写入表头
                    if file.tell() == 0:
                        writer.writerow(['Pid', 'Classification'])
                    # 写入数据
                    writer.writerow([pid, classification])

        elif isinstance(item, Product):
            try:
                insert_sql = """
                               INSERT INTO original_data_tb_product (name, stars, pid, ratings, discount_price, 
                               normal_price, about_this_item, create_time, update_time, channel, image_url, classification)
                               VALUES (%s, %s, %s, %s, %s, %s, %s, NOW(), NOW(), %s, %s, %s)
                               """

                values = (
                    item['name'],  # 商品名称
                    item['stars'],  # 星级评分
                    item['pid'],  # 商品 ID
                    item['ratings'],  # 评分数量
                    item['discount_price'],  # 折扣价
                    item['normal_price'],  # 正常价
                    item['about_this_item'],  # 商品描述
                    item['channel'],  # 渠道信息
                    item['image_url'],  # 图片链接
                    item['classification'],  # 类别
                )
                self.cursor.execute(insert_sql, values)
                self.connection.commit()
            except mysql.connector.Error as e:
                print(f"MySQL Error Code: {e.errno}")
                print(f"MySQL Error Message: {e.msg}")
                print(f"Item data: {item}")
                raise DropItem(f"Error inserting item into MySQL: {e}")
        elif isinstance(item, Review):
            try:
                insert_sql = """
                                INSERT INTO original_data_tb_reviews (title, rating, content, post_time, pid, rid, 
                                create_time, update_time)
                                VALUES (%s, %s, %s, %s, %s, %d, NOW(), NOW())
                            """

                values = (
                    item['title'],
                    item['rating'],
                    item['content'],
                    item['post_time'],
                    item['pid'],
                    item['rid'],
                    item['create_time'],
                    item['update_time'],
                    # item['user'],
                    # item['style'],
                )
                self.cursor.execute(insert_sql, values)
                self.connection.commit()
            except mysql.connector.Error as e:
                print(f"MySQL Error Code: {e.errno}")
                print(f"MySQL Error Message: {e.msg}")
                print(f"Item data: {item}")
                raise DropItem(f"Error inserting item into MySQL: {e}")





