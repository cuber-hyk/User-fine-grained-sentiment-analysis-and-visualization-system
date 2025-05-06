// 模拟数据文件

// 模拟情感分析数据
export const mockSentimentData = {
    sentiment: {
        Positive: 65,
        Negative: 15,
        Neutral: 20
    }
    // sentiment: {
    //     正面: 65,
    //     负面: 15,
    //     中性: 20
    // }
};

// 模拟时间趋势数据
export const mockTrendsData = [
    { year: 2023, month: 1, count: 45 },
    { year: 2023, month: 2, count: 52 },
    { year: 2023, month: 3, count: 61 },
    { year: 2023, month: 4, count: 58 },
    { year: 2023, month: 5, count: 63 },
    { year: 2023, month: 6, count: 72 },
    { year: 2023, month: 7, count: 80 },
    { year: 2023, month: 8, count: 85 },
    { year: 2023, month: 9, count: 78 },
    { year: 2023, month: 10, count: 82 },
    { year: 2023, month: 11, count: 91 },
    { year: 2023, month: 12, count: 95 }
];

// 模拟来源数据
export const mockSourcesData = {
    sources: {
        'Amazon': { value: 3.5, icon: require('@/assets/img/amazon.png') },
        'eBay': { value: 4.5, icon: require('@/assets/img/ebay.png') },
        'Walmart': { value: 3.5, icon: require('@/assets/img/walmart.png') },
        'ASOS': { value: 4.3, icon: require('@/assets/img/asos.png') },
        'ZARA': { value: 3.8, icon: require('@/assets/img/zara.png') }
    }
};

// 模拟评论数据
export const mockReviewsData = {
    reviews: {
        // '外观设计': ['设计简约大方', '颜色很好看', '做工精细'],
        // '性能表现': ['运行速度快', '性能稳定', '发热控制良好'],
        // '屏幕显示': ['色彩鲜艳', '分辨率高', '护眼模式实用'],
        // '电池续航': ['续航时间长', '充电速度快', '待机时间久'],
        // '性价比': ['价格合理', '配置高', '值得购买']
        'Appearance Design': ['Sleek and minimalist design', 'Attractive colors', 'Fine craftsmanship'],
        'Performance': ['Fast operation', 'Stable performance', 'Good heat dissipation control'],
        'Display': ['Vibrant colors', 'High resolution', 'Practical eye protection mode'],
        'Battery Life': ['Long battery life', 'Fast charging speed', 'Long standby time'],
        'Value for Money': ['Reasonable price', 'High configuration', 'Worth buying']
    }
};

// 模拟产品详情数据
export const mockProductDetails = {
    // pid: 'sample001',
    // name: '智能手机 Pro Max',
    // image_url: 'https://img.icons8.com/color/452/smartphone.png',
    // stars: '4.8',
    // discount_price: '¥3999',
    // normal_price: '¥4299',
    sentiment: mockSentimentData.sentiment,
    sources: mockSourcesData.sources,
    reviews: mockReviewsData.reviews
};

// 模拟搜索结果数据
export const mockSearchResults = [
    { id: 'sample001', name: '智能手机 Pro Max' },
    { id: 'sample002', name: '智能手表 Ultra' },
    { id: 'sample003', name: '无线耳机 Pro' },
    { id: 'sample004', name: '平板电脑 Air' },
    { id: 'sample005', name: '笔记本电脑 Book' }
];