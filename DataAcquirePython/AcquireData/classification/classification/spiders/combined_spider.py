import csv
import time
from datetime import datetime, timedelta
import scrapy
from scrapy import Selector
from fake_useragent import UserAgent
from pathlib import Path
from selenium import webdriver
from selenium.common import NoSuchElementException
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from ..items import Product, Review

def generate_random_date(post_time):
    today = datetime.now().date()
    if post_time == 'Past month':
        months = random.randint(1, 6)
        days = random.randint(1, 30)
    elif post_time == 'Past 6 months':
        months = random.randint(6, 12)
        days = random.randint(1, 30)
    else:
        months = random.randint(12, 36)
        days = random.randint(1, 30)

    # 计算随机日期
    random_date = today - timedelta(days=days) - timedelta(days=months * 30)
    return random_date

class CombinedSpider(scrapy.Spider):
    name = "combined_spider"
    allowed_domains = ["www.ebay.com"]
    start_urls = ["https://www.ebay.com"]
    userAgent = UserAgent()
    website = 'walmart'

    headers = {
        'User-Agent': userAgent.random,
        'Accept-Language': 'en-US,en;q=0.9'
    }

    custom_settings = {
        'CONCURRENT_REQUESTS': 1,
        'CONCURRENT_REQUESTS_PER_DOMAIN': 1,
        'CONCURRENT_REQUESTS_PER_IP': 1,
        'DOWNLOAD_DELAY': 3,  # 手动控制延迟
    }

    def __init__(self, *args, **kwargs):
        super(CombinedSpider, self).__init__(*args, **kwargs)
        chrome_options = Options()
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_argument('--lang=en-US')
        self.driver = webdriver.Chrome(options=chrome_options)

    def closed(self, reason):
        self.driver.quit()

    def start_requests(self):
        if self.website == 'ebay':
            file_path = Path(__file__).parent.parent / 'data' / 'ebay' / 'category_1' / 'href.csv'
        else:
            file_path =  Path(__file__).parent.parent / 'data' / 'ebay' / 'category_1' / 'walmart_href.csv'
        with open(file_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                url = row['href']
                yield scrapy.Request(url, headers=self.headers, callback=self.parse_product_hrefs)

    def parse_product_hrefs(self, response):
        self.driver.get(response.url)
        page_source = self.driver.page_source
        selector = Selector(text=page_source)
        if self.website == 'ebay':
            product_hrefs = selector.xpath('//*[@id="srp-river-results"]/ul/li/div/div[2]/a/@href').extract()
        else:
            product_hrefs = selector.xpath('//*//section/div/div/div/div/a/@href').extract()

        # 获取当前日期
        current_date = datetime.now()
        # 格式化为 YYYYMMDD
        formatted_date = current_date.strftime("%Y%m%d")
        if self.website == 'ebay':
            file_path = Path(__file__).parent.parent / 'data' / 'ebay' / 'product' / f'product_href_{formatted_date}.csv'
        else:
            file_path = Path(__file__).parent.parent / 'data' / 'walmart' / 'product' / f'product_href_{formatted_date}.csv'

        with open(file_path, 'a', encoding='utf-8', newline='') as f:
            csv_writer = csv.writer(f)
            if f.tell() == 0:
                csv_writer.writerow(['href', 'pid'])
            if self.website == 'ebay':
                for href in product_hrefs:
                    pid = href.split('/itm/')[1].split('?')[0]
                    href = href.split('?')[0]
                    csv_writer.writerow([href, pid])
                    yield scrapy.Request(href, headers=self.headers, meta={'pid': pid}, callback=self.parse_product_info)
            else:
                for href in product_hrefs:
                    pid = href.split('?')[0].split('/')[-1]
                    csv_writer.writerow([href, pid])
                    yield scrapy.Request(href, headers=self.headers, meta={'pid': pid}, callback=self.parse_product_info)

    def parse_product_info(self, response):
        self.driver.get(response.url)
        page_source = self.driver.page_source
        selector = Selector(text=page_source)
        product = Product()
        product['pid'] = response.meta['pid']
        product['name'] = selector.xpath('//*[@id="mainContent"]/div[1]/div[1]/h1/span/text()').get()
        product['discount_price'] = selector.xpath('//*[@id="mainContent"]/div[1]/div[3]/div/div/div[1]/span/text()').get() or 'no_price'
        product['normal_price'] = selector.xpath('//*[@id="mainContent"]/div[1]/div[3]/div/div/div[2]/span[1]/span[2]/text()').get() or 'no_price'
        product['stars'] = selector.xpath('//*[@id="STORE_INFORMATION"]/div/div/div[1]/div[1]/div[2]/div[2]/h4/span[1]/text()').get()
        product['ratings'] = selector.xpath('//*[@id="STORE_INFORMATION"]/div/div/div[2]/div/div/h2/span[2]/text()').get()
        product['image_url'] = selector.xpath('//*[@id="PicturePanel"]/div[1]/div/div[1]/div[1]/div[2]/div[4]/div[1]/img/@src').get()
        product['channel'] = 'ebay'
        product['about_this_item'] = 'ebay dont have this'
        product['classification'] = ''
        classification_str = ', '.join(selector.css('body > div.vi-evo > main > div.main-container > '
                                                 'div.vim.x-vi-evo-main-container.template-evo-avip > '
                                                 'div.x-vi-evo-main-container__atf-breadcrumbs > div > div > '
                                                 'div.vim.x-breadcrumb > div.x-breadcrumb__wrapper > div > nav > ul > '
                                                 'li > a > span::text ').getall())
        product['classification'] = classification_str

        # 获取当前日期
        current_date = datetime.now()
        # 格式化为 YYYYMMDD
        formatted_date = current_date.strftime("%Y%m%d")
        file_path = Path(__file__).parent.parent / 'data' / 'ebay' / 'product' / f'reviews_href_{formatted_date}.csv'
        href = selector.xpath('//*[@id="STORE_INFORMATION"]/div/div/div[2]/div/div/div[2]/a/@href').get()
        with open(file_path, mode='a', encoding='utf-8', newline='') as file:
            writer = csv.writer(file)
            pid = response.meta['pid']
            if file.tell() == 0:
                writer.writerow(['href', 'pid'])
            writer.writerow([href, pid])

        yield product

        if href:
            yield scrapy.Request(href, headers=self.headers, meta={'pid': pid}, callback=self.parse_reviews)

    def parse_reviews(self, response):
        self.driver.get(response.url)
        reviews = []
        cnt = 0
        while True:
            cnt = cnt + 1
            if cnt >= 30:
                break
            WebDriverWait(self.driver, 100).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "#mainContent"))
            )
            page_source = self.driver.page_source
            selector = Selector(text=page_source)
            contents = selector.xpath('//*[@id="mainContent"]//ul/li/div/div[2]//span/text()').getall()
            if contents == '' or contents == [] or len(contents) <= 5:
                break
            ratings = selector.xpath('//*//svg/@data-test-type').getall()
            post_times = selector.xpath('//*[@id="mainContent"]//li//span/span/text()').getall()
            for content, rating, post_time in zip(contents, ratings, post_times):
                review = Review()
                review['pid'] = response.meta['pid']
                review['post_time'] = generate_random_date(post_time)
                review['content'] = content
                review['sentiment'] = rating
                reviews.append(review)

            try:
                element = self.driver.find_element(By.XPATH,
                                                   '//*[@aria-label="Next page"]')
                self.driver.execute_script("arguments[0].scrollIntoView(true);", element)
                WebDriverWait(self.driver, 100).until(
                    EC.element_to_be_clickable((By.XPATH,
                                                '//*[@aria-label="Next page"]'))
                )
                next_button = self.driver.find_element(
                    By.XPATH,
                    '//*[@aria-label="Next page"]'
                )
                self.driver.execute_script("arguments[0].click();", next_button)
                time.sleep(2)
                print("点击“下一页”按钮，加载更多评论...")
            except NoSuchElementException:
                print("没有更多分页，爬取结束。")
                break
            except Exception as e:
                print("点击“下一页”按钮时发生错误:", e)
                break

        for review in reviews:
            yield review