import csv
import time
from datetime import datetime, timedelta
from queue import Queue

import scrapy
from numpy.random import random
from scrapy import Selector
from fake_useragent import UserAgent
from pathlib import Path
from selenium import webdriver
from selenium.common import NoSuchElementException
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from ..items import Review
from datetime import datetime, timedelta
from selenium.webdriver.remote.remote_connection import LOGGER
import random
import logging


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


class EbayGetReviewsSpider(scrapy.Spider):
    name = "ebay_get_reviews"
    allowed_domains = ["www.ebay.com"]
    start_urls = ["https://www.ebay.com"]
    userAgent = UserAgent()

    custom_settings = {
        'CONCURRENT_REQUESTS': 1,
        'CONCURRENT_REQUESTS_PER_DOMAIN': 1,
        'CONCURRENT_REQUESTS_PER_IP': 1,
        'DOWNLOAD_DELAY': 3,  # 手动控制延迟
    }

    headers = {
        'User-Agent': userAgent.random,
        'Accept-Language': 'en-US,en;q=0.9'
    }

    def __init__(self, *args, **kwargs):
        super(EbayGetReviewsSpider, self).__init__(*args, **kwargs)
        chrome_options = Options()
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_argument('--lang=en-US')
        self.url_queue = []
        self.driver = webdriver.Chrome(options=chrome_options)

    def closed(self, reason):
        self.driver.quit()

    def start_requests(self):
        test = 0

        if test:
            url = (
                f'https://www.ebay.com/fdbk/mweb_profile?fdbkType=FeedbackReceivedAsSeller&item_id=176665433847&username=matt_pal&filter=feedback_page%3ARECEIVED_AS_SELLER&sort=RELEVANCE,176665433847,Matt Pal')
            pid = url.split('item_id=')[1].split('&')[0]
            yield scrapy.Request(url=url, callback=self.parse, meta={'pid': pid})
        else:
            file_path = Path(__file__).parent.parent / 'data' / 'ebay' / 'product' / 'reviews_href_20250308.csv'

            with open(file_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    if row['href'] == '':
                        continue
                    else:
                        pid = row['pid']
                        url = row['href']
                        yield scrapy.Request(url, headers=self.headers, meta={'pid': pid})

    def parse(self, response):
        LOGGER.setLevel(logging.WARNING)
        self.driver.get(response.url)
        # page_source = self.driver.page_source
        # selector = Selector(text=page_source)
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
            ratings = selector.xpath('//*//svg/@data-test-type').getall()
            post_times = selector.xpath('//*[@id="mainContent"]//li//span/span/text()').getall()
            for content, rating, post_time in zip(contents, ratings, post_times):
                review = Review()
                review['pid'] = response.meta['pid']
                review['post_time'] = generate_random_date(post_time)
                review['content'] = content
                review['sentiment'] = rating
                reviews.append(review)
                # yield review
                # 尝试点击“下一页”按钮

                #//*[@id="mainContent"]/div[4]/div[5]/nav/ol/li[4]/a
                #//*[@id="mainContent"]/div[4]/div[5]/nav/ol/li[4]/a
                # //*[@id="mainContent"]/div[4]/div[5]/nav/ol/li[2]/a
                #//*[@id="mainContent"]/div[4]/div[5]/nav/a
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
                # #mainContent > div > div > div.fdbk-pagination > nav > a
                # next_button.click()
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

# shell test scrapy shell https://www.ebay.com/fdbk/mweb_profile?fdbkType=FeedbackReceivedAsSeller"&"item_id
# =275914428761"&"username=dysonofficial"&"filter=feedback_page%3ARECEIVED_AS_SELLER"&"q=275914428761"&"sort
# =RELEVANCE”&“page_id_item=11"&"sort_item=TIME"&"filter_image_item=false"&"filter_topic_item=

# response.xpath('//*[@id="s0-1-20-13-tabpanel-0"]/div/div/div[2]/ul/li/div/div[1]/div/div[3]/div/span/span/text()').get()all
# post time
# response.xpath('//*[@id="mainContent"]//li//span/span/text()').getall()

# rating
#  response.xpath('//*[@id="s0-1-20-13-tabpanel-0"]/div/div/div[2]/ul/li/div/div[1]/div/div[1]/svg/@data-test-type').getall()
# response.xpath('//*//svg/@data-test-type').getall()


# contents
# response.xpath('//*[@id="s0-1-20-13-tabpanel-0"]/div/div/div[2]/ul/li/div/div[2]/div/span/text()').getall()
# response.xpath('//*[@id="mainContent"]//ul/li/div/div[2]//span/text()').getall()

# https://www.ebay.com/fdbk/mweb_profile?fdbkType=FeedbackReceivedAsSeller"&"item_id=203649902277"&"username=tampaprinting"&"filter=feedback_page%3ARECEIVED_AS_SELLER&sort=RELEVANCE

# https://www.ebay.com/fdbk/mweb_profile?fdbkType=FeedbackReceivedAsSeller"&"item_id=306144887277"&"username=mytownsupply"&"filter=feedback_page%3ARECEIVED_AS_SELLER"&"sort=RELEVANCE
