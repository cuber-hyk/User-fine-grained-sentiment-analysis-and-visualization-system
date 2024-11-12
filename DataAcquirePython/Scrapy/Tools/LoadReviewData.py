import json
import os
from datetime import datetime
from pathlib import Path
from time import strptime
import re

import mysql.connector

# 连接到MySQL数据库
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="gdlsd030312",
    database="analysis_reviews"
)

cursor = db.cursor()
folder_path = ''
directory = 'TestForLoadData'
path = Path(directory)

try:
    for file in path.rglob('*'):
        if file.is_file():
            with open(file, 'r', encoding='utf-8') as f:
                data = json.load(f)

            product_data = data[0]
            product_pid = product_data['pid']

            # 处理评论信息
            for review_data in data[1:]:
                if review_data['pid'] == product_pid:
                    review_pid = review_data['pid']
                    review_title = review_data.get('title', '')
                    review_rating = float(review_data['rating'].split()[0])
                    review_content = review_data['content']
                    review_post_time = review_data['post_time']
                    date_str = review_post_time.split('on ')[1]
                    review_post_time = datetime.strptime(date_str, '%B %d, %Y')

                    # 插入评论信息
                    sql_review = """
                            INSERT INTO original_data_tb_reviews (pid, title, rating, content, post_time)
                            VALUES (%s, %s, %s, %s, %s)
                            """
                    values_review = (review_pid, review_title, review_rating, review_content, review_post_time)
                    cursor.execute(sql_review, values_review)

            # 提交事务
            db.commit()
except Exception as e:
    # 如果出现异常，回滚事务
    db.rollback()
    print(f"An error occurred: {e}")
finally:
    # 关闭连接
    cursor.close()
    db.close()