import scrapy
from Pid.items import PidItem

class PidspiderSpider(scrapy.Spider):
    name = "pidSpider"
    allowed_domain = ['www.amazon.com']
    start_urls = []
    num_page = 1
    css_selector = '#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.s-wide-grid-style.sg-row > div.sg-col-20-of-24.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span.rush-component.s-latency-cf-section > div.s-main-slot.s-result-list.s-search-results.sg-row > div'

    # search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.s-wide-grid-style.sg-row > div.sg-col-20-of-24.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span.rush-component.s-latency-cf-section > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(6)
    def start_requests(self):
        for num in range(1, self.num_page + 1):
            url = f'https://www.amazon.com/s?k=best+seller&page={num}'
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        # 使用正确的 CSS 选择器来获取列表项
        list_items = response.css(
            f'{self.css_selector}')

        for item in list_items:
            product_item = PidItem()
            # 提取 data-asin 属性值
            PID = item.css('[data-asin]::attr(data-asin)').get()
            if PID:
                product_item['pid'] = PID

            yield product_item
