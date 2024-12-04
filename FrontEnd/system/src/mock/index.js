import Mock from 'mockjs'

// 模拟产品图片数据
const productImages = {
    '1': 'https://img14.360buyimg.com/n0/jfs/t1/142678/25/35404/64399/6426c93aF68549f87/d335611b8c1c0dc8.jpg',
    '2': 'https://img14.360buyimg.com/n0/jfs/t1/117805/29/23809/171538/642a6c8dF44d762c5/2b6b3ffc68d7bd13.jpg',
    '3': 'https://img14.360buyimg.com/n0/jfs/t1/143416/34/35454/62446/642a6c8dF8c132344/8c1c52c45844a6f1.jpg',
    '4': 'https://img14.360buyimg.com/n0/jfs/t1/141866/18/36099/171538/642a6c8dF44d762c5/2b6b3ffc68d7bd13.jpg'
}

// 模拟搜索列表接口
Mock.mock(/\/api\/search\/get_list/, 'get', (options) => {
    const searchName = new URLSearchParams(options.url.split('?')[1]).get('searchName')

    // 根据搜索关键词返回不同的结果
    const results = []

    // 防止 searchName 为 undefined 或 null
    if (searchName) {
        if (searchName.toLowerCase().includes('联想')) {
            results.push({
                id: '1',
                name: '联想ThinkBook16 pro',
                score: 86,
                price: '6299 - 8399',
                image: productImages['1']
            })
        }
        if (searchName.toLowerCase().includes('惠普')) {
            results.push({
                id: '2',
                name: '惠普星Book pro14',
                score: 84,
                price: '6000 - 7000',
                image: productImages['2']
            })
        }
        if (searchName.toLowerCase().includes('戴尔')) {
            results.push({
                id: '3',
                name: '戴尔 XPS 13',
                score: 88,
                price: '7999 - 9999',
                image: productImages['3']
            })
        }
        if (searchName.toLowerCase().includes('华硕')) {
            results.push({
                id: '4',
                name: '华硕 ZenBook',
                score: 85,
                price: '5999 - 7999',
                image: productImages['4']
            })
        }
    }

    // 如果没有匹配的结果或没有搜索关键词，返回所有商品
    if (results.length === 0) {
        results.push(
            {
                id: '1',
                name: '联想ThinkBook16 pro',
                score: 86,
                price: '6299 - 8399',
                image: productImages['1']
            },
            {
                id: '2',
                name: '惠普星Book pro14',
                score: 84,
                price: '6000 - 7000',
                image: productImages['2']
            },
            {
                id: '3',
                name: '戴尔 XPS 13',
                score: 88,
                price: '7999 - 9999',
                image: productImages['3']
            },
            {
                id: '4',
                name: '华硕 ZenBook',
                score: 85,
                price: '5999 - 7999',
                image: productImages['4']
            }
        )
    }

    return {
        status: 'success',
        data: results
    }
})

// 模拟商品详情接口
Mock.mock(/\/api\/products\/get_obj/, 'get', (options) => {
    // 从URL参数中提取产品ID
    const product_id = new URLSearchParams(options.url.split('?')[1]).get('product_id')
    // 根据不同的商品ID返回不同的详情数据
    const products = {
        '1': {
            id: '1',
            name: '联想ThinkBook16 pro',
            score: 86,
            priceMin: 6299,
            priceMax: 8399,
            image: productImages['1'],
            radar: {
                散热: 10.5,
                GPU: 8.8,
                屏幕: 8.1,
            },
            sentiment: {
                正面: 50,
                负面: 20,
                中性: 30
            },
            trends: [
                { date: '2024-01-01', heat: 4.7 },
                { date: '2024-01-02', heat: 4.5 },
                { date: '2024-01-03', heat: 4.8 },
                { date: '2024-01-04', heat: 4.6 },
                { date: '2024-01-05', heat: 4.9 }
            ],
            reviews: {
                屏幕: ['分辨率高', '色彩丰富'],
                GPU: ['一流', '够用'],
                散热: ['非常好', '正常'],
                性能: ['流畅', '强悍'],
                续航: ['持久', '快充'],
                外观: ['金属', '商务风']
            },
            sources: {
                淘宝: 4.3,
                京东: 3.5,
                拼多多: 3.5,
                天猫: 4.5,
                唯品会: 3.8
            }
        },
        '2': {
            id: '2',
            name: '惠普星Book pro14',
            score: 84,
            priceMin: 6000,
            priceMax: 7000,
            image: productImages['2'],
            radar: {
                散热: 9.5,
                GPU: 8.2,
                屏幕: 8.8,
            },
            sentiment: {
                正面: 45,
                负面: 25,
                中性: 30
            },
            trends: [
                { date: '2024-01-01', heat: 4.2 },
                { date: '2024-01-02', heat: 4.4 },
                { date: '2024-01-03', heat: 4.6 },
                { date: '2024-01-04', heat: 4.3 },
                { date: '2024-01-05', heat: 4.5 }
            ],
            reviews: {
                屏幕: ['护眼', '清晰度高'],
                GPU: ['性能稳定', '游戏流畅'],
                散热: ['温度适中', '风扇安静'],
                性能: ['办公够用', '多任务流畅'],
                续航: ['续航优秀', '快充给力'],
                外观: ['时尚', '轻薄']
            },
            sources: {
                淘宝: 4.1,
                京东: 4.0,
                拼多多: 3.8,
                天猫: 4.2,
                唯品会: 3.9
            }
        },
        '3': {
            id: '3',
            name: '戴尔 XPS 13',
            score: 88,
            priceMin: 7999,
            priceMax: 9999,
            image: productImages['3'],
            radar: {
                散热: 10.0,
                GPU: 8.5,
                屏幕: 8.9,
            },
            sentiment: {
                正面: 50,
                负面: 10,
                中性: 40
            },
            trends: [
                { date: '2024-01-01', heat: 4.8 },
                { date: '2024-01-02', heat: 4.6 },
                { date: '2024-01-03', heat: 4.9 },
                { date: '2024-01-04', heat: 4.7 },
                { date: '2024-01-05', heat: 4.8 }
            ],
            reviews: {
                屏幕: ['屏幕清晰', '色彩饱满'],
                GPU: ['性能强劲', '游戏流畅'],
                散热: ['散热快', '不闷热'],
                性能: ['办公轻松', '多任务流畅'],
                续航: ['续航长', '快充充电'],
                外观: ['时尚', '轻薄']
            },
            sources: {
                淘宝: 4.4,
                京东: 4.3,
                拼多多: 4.1,
                天猫: 4.4,
                唯品会: 4.2
            }
        },
        '4': {
            id: '4',
            name: '华硕 ZenBook',
            score: 85,
            priceMin: 5999,
            priceMax: 7999,
            image: productImages['4'],
            radar: {
                散热: 9.0,
                GPU: 7.8,
                屏幕: 8.5,
            },
            sentiment: {
                正面: 40,
                负面: 30,
                中性: 30
            },
            trends: [
                { date: '2024-01-01', heat: 4.3 },
                { date: '2024-01-02', heat: 4.1 },
                { date: '2024-01-03', heat: 4.4 },
                { date: '2024-01-04', heat: 4.2 },
                { date: '2024-01-05', heat: 4.3 }
            ],
            reviews: {
                屏幕: ['屏幕清晰', '色彩饱满'],
                GPU: ['性能强劲', '游戏流畅'],
                散热: ['散热快', '不闷热'],
                性能: ['办公轻松', '多任务流畅'],
                续航: ['续航长', '快充充电'],
                外观: ['时尚', '轻薄']
            },
            sources: {
                淘宝: 4.0,
                京东: 3.9,
                拼多多: 3.7,
                天猫: 4.0,
                唯品会: 3.8
            }
        }
    }

    return {
        status: 'success',
        data: products[product_id] || products['1'] // 如果找不到对应ID的商品，返回默认商品
    }
}) 