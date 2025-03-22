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
### https://www.ebay.com/sch/58058/i.html?_nkw=all+categories&_sac=1&_sop=12&_oac=1

# 第二步
### 把记录好的url放入classification/classification/data/ebay/category_1/href.csv

# 第三步
### 依次运行ebay_product.py,  ebay_product_info.py

# 第四步
### 运行ebay_reviews.py