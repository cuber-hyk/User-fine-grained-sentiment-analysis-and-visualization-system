# 注意事项
## settings.py中的Database - Mysql
## 改成对应的服务器IP 对应的mysql账户信息
```
MYSQL_HOST = '43.139.160.67'
MYSQL_DATABASE = 'analysis_reviews'
MYSQL_USER = 'analysis_reviews'
MYSQL_PASSWORD = 'analysis_reviews'
MYSQL_PORT = 3306
```
---

# 第一步
### 在ebay这个网址搜索你想要的品类并记录url
### https://www.ebay.com/sch/i.html?_nkw=all+categories

# 第二步
### 把记录好的url放入classification/classification/data/ebay/category_1/href.csv

# 第三步
### cd \classification\classification
### 在terminal用scrapy crawl ebay_product 
### 完成之后再用scrapy crawl ebay_product_info

# 第四步
### terminal 中 scrapy crawl ebay_get_reviews