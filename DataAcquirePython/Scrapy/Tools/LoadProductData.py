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
            product_name = product_data['name']
            product_ratings = int(product_data['ratings'].replace(',', '').split()[0])
            product_normal_price = float(product_data['normal_price'].replace('$', '').strip())
            product_discount_price = float(product_data['discount_price'].replace('$', '').strip())

            # 开始一个事务
            db.start_transaction()

            cursor.execute("SELECT pid FROM original_data_tb_product WHERE pid = %s", (product_pid,))
            result = cursor.fetchone()

            if result:
                product_id = result[0]
            else:
                # 插入商品信息
                sql_product = """
                        INSERT INTO original_data_tb_product (pid, name, discount_price, normal_price, ratings)
                        VALUES (%s, %s, %s, %s, %s)
                        """
                values_product = (product_pid, product_name, product_discount_price, product_normal_price, product_ratings)
                cursor.execute(sql_product, values_product)
                product_id = cursor.lastrowid

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