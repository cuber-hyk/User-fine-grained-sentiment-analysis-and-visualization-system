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
    'base': { // 定义一个基础的数据源列表，包含网站和图标
        sources: {
            'Amazon': { value: 3.5, icon: require('../assets/img/amazon.png') },
            'eBay': { value: 4.5, icon: require('../assets/img/ebay.png') },
            'Walmart': { value: 3.5, icon: require('../assets/img/walmart.png') },
            'ASOS': { value: 4.3, icon: require('../assets/img/asos.png') },
            'ZARA': { value: 3.8, icon: require('../assets/img/zara.png') }
        }
    },
    'sample001': { // 为商品ID 'sample001' 添加模拟数据 (与base数量相同)
        sources: {
            'Amazon': { value: 3.5, icon: require('../assets/img/amazon.png') },
            'eBay': { value: 4.5, icon: require('../assets/img/ebay.png') },
            'Walmart': { value: 3.5, icon: require('../assets/img/walmart.png') },
            'ASOS': { value: 4.3, icon: require('../assets/img/asos.png') },
            'ZARA': { value: 3.8, icon: require('../assets/img/zara.png') }
        }
    },
    'sample002': { // 为商品ID 'sample002' 添加另一组模拟数据 (数量不同)
        sources: {
            'Amazon': { value: 2.8, icon: require('../assets/img/amazon.png') },
            'eBay': { value: 3.1, icon: require('../assets/img/ebay.png') },
            'Walmart': { value: 4.0, icon: require('../assets/img/walmart.png') },
            'ASOS': { value: 2.5, icon: require('../assets/img/asos.png') },
            'ZARA': { value: 3.9, icon: require('../assets/img/zara.png') }
        }
    },
     'sample003': { // 为商品ID 'sample003' 添加另一组模拟数据 (数量不同)
        sources: {
            'Amazon': { value: 4.2, icon: require('../assets/img/amazon.png') },
            'eBay': { value: 3.8, icon: require('../assets/img/ebay.png') },
            'Walmart': { value: 2.9, icon: require('../assets/img/walmart.png') },
            'ASOS': { value: 4.8, icon: require('../assets/img/asos.png') },
            'ZARA': { value: 3.0, icon: require('../assets/img/zara.png') }
        }
    },
    'sample004': { // 为商品ID 'sample004' 添加模拟数据
        sources: {
            'Amazon': { value: 3.0, icon: require('../assets/img/amazon.png') },
            'eBay': { value: 3.2, icon: require('../assets/img/ebay.png') },
            'Walmart': { value: 3.8, icon: require('../assets/img/walmart.png') },
            'ASOS': { value: 2.9, icon: require('../assets/img/asos.png') },
            'ZARA': { value: 4.0, icon: require('../assets/img/zara.png') }
        }
    },
    'sample005': { // 为商品ID 'sample005' 添加模拟数据
        sources: {
            'Amazon': { value: 4.5, icon: require('../assets/img/amazon.png') },
            'eBay': { value: 4.0, icon: require('../assets/img/ebay.png') },
            'Walmart': { value: 4.3, icon: require('../assets/img/walmart.png') },
            'ASOS': { value: 3.5, icon: require('../assets/img/asos.png') },
            'ZARA': { value: 4.1, icon: require('../assets/img/zara.png') }
        }
    }
    // 可以根据需要为更多商品ID添加模拟数据
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
// 修改 mockProductDetails 为一个函数，根据 pid 返回模拟数据
export const mockProductDetails = (pid) => {
    const baseProduct = { // 基础模拟产品信息
        pid: pid || 'sample001', // 使用传入的pid或默认值
        id: pid || 'sample001', // 保持id和pid一致
        name: `模拟商品 ${pid || '001'}`, 
        image_url: 'https://img.icons8.com/color/452/smartphone.png', // 默认图片
        stars: '4.8',
        discount_price: '¥3999',
        normal_price: '¥4299',
        ratings: Math.floor(Math.random() * 1000) + 100 // 随机评论数
    };

    // 根据pid提供不同的模拟数据
    const dataByPid = {
        'sample001': {
            sentiment: { Positive: 65, Negative: 15, Neutral: 20 },
            sources: mockSourcesData.base.sources,
            reviews: mockReviewsData.reviews,
            trends: mockTrendsData,
            aspectOpinions: [
                 { aspect: "外观", opinions: ["好看"], sentiments: ["pos"] },
                 { aspect: "性能", opinions: ["流畅"], sentiments: ["pos"] }
            ] // 示例数据
        },
        'sample002': {
             sentiment: { Positive: 30, Negative: 50, Neutral: 20 },
             sources: mockSourcesData.sample002.sources,
             reviews: mockReviewsData.reviews,
             trends: mockTrendsData.map(item => ({ ...item, count: Math.floor(item.count * 0.7) })) ,// 不同的趋势数据
             aspectOpinions: [
                 { aspect: "电池", opinions: ["不耐用"], sentiments: ["neg"] },
                 { aspect: "屏幕", opinions: ["模糊"], sentiments: ["neg"] }
            ] // 示例数据
        },
        'sample003': {
             sentiment: { Positive: 80, Negative: 10, Neutral: 10 },
             sources: mockSourcesData.sample003.sources,
             reviews: mockReviewsData.reviews,
             trends: mockTrendsData.map(item => ({ ...item, count: Math.floor(item.count * 1.3) })) ,// 不同的趋势数据
              aspectOpinions: [
                 { aspect: "价格", opinions: ["划算"], sentiments: ["pos"] },
                 { aspect: "物流", opinions: ["快"], sentiments: ["pos"] }
            ] // 示例数据
        }
        // 可以根据需要为更多pid添加数据
    };

    // Get a list of available source data keys (excluding 'base' if it's just a template)
    const sourceKeys = Object.keys(mockSourcesData).filter(key => key !== 'base');
    // Randomly select a source key
    const randomSourceKey = sourceKeys[Math.floor(Math.random() * sourceKeys.length)];
    // Get the sources data for the randomly selected key
    const randomSources = mockSourcesData[randomSourceKey].sources;

    // Combine base product info with data specific to the pid (if needed) and the random sources
    // Note: This keeps other data like sentiment/reviews tied to the pid if defined in dataByPid
    const specificDataForPid = dataByPid[pid] || {}; // Get pid-specific data or an empty object

    return { 
        ...baseProduct, 
        ...specificDataForPid, // Include other pid-specific data (sentiment, etc.)
        sources: randomSources // Use the randomly selected sources data
    };
};

// 模拟搜索结果数据
export const mockSearchResults = [
    { id: 'sample001', name: '智能手机 Pro Max' },
    { id: 'sample002', name: '智能手表 Ultra' },
    { id: 'sample003', name: '无线耳机 Pro' },
    { id: 'sample004', name: '平板电脑 Air' },
    { id: 'sample005', name: '笔记本电脑 Book' }
];