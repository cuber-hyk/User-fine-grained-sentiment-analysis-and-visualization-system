import Mock from "mockjs";

// 商品搜索
Mock.mock(/\/api\/search\/get_list/, "get", {
  status: "success",
  data: [
    {
      id: "1",
      name: "联想ThinkBook16 pro",
      score: 86,
      price: "6299 - 8399",
    },
    {
      id: "2",
      name: "惠普星Book pro14",
      score: 84,
      price: "6000 - 7000",
    },
  ],
});

// 商品详情
Mock.mock(/\/api\/products\/get_obj/, "get", {
  status: "success",
  data: {
    id: "@id",
    name: "联想ThinkBook16 pro",
    score: "@integer(60, 100)",
    priceMin: 6299,
    priceMax: 8399,
    radar: {
      散热: "@float(6, 10, 1, 1)",
      GPU: "@float(6, 10, 1, 1)",
      屏幕: "@float(6, 10, 1, 1)",
      性能: "@float(6, 10, 1, 1)",
      续航: "@float(6, 10, 1, 1)",
    },
    sentiment: {
      正面: "@integer(40, 60)",
      负面: "@integer(10, 30)",
      中性: "@integer(20, 40)",
    },
    trends: new Array(7).fill(null).map(() => ({
      date: '@date("yyyy-MM-dd")',
      heat: "@float(3, 5, 1, 1)",
    })),
    reviews: {
      屏幕: ["分辨率高", "彩丰富"],
      GPU: ["一流", "够用"],
      散热: ["非常好", "正常"],
    },
    sources: {
      淘宝: "@float(3, 5, 1, 1)",
      京东: "@float(3, 5, 1, 1)",
      拼多多: "@float(3, 5, 1, 1)",
    },
  },
});

// 用户登录
Mock.mock(/\/api\/user\/login/, "post", (options) => {
  const { username, password } = JSON.parse(options.body);
  if (username === "admin" && password === "123456") {
    return {
      status: "success",
      data: {
        token: "mock-token-" + Date.now(),
        username: "admin",
        nickname: "管理员",
        avatar:
          "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
      },
    };
  }
  return {
    status: "error",
    error: {
      message: "用户名或密码错误",
    },
  };
});

// 用户注册
Mock.mock(/\/api\/user\/register/, "post", {
  status: "success",
  data: {
    message: "注册成功",
  },
});

// 用户退出
Mock.mock(/\/api\/user\/logout/, "post", {
  status: "success",
  data: {
    message: "退出成功",
  },
});

// 商品搜索接口
Mock.mock(/\/api\/search\/get_list/, "get", {
  status: "success",
  data: [
    {
      id: "1",
      name: "联想ThinkBook 16+ 2023",
      price: "6299-8399",
      score: 4.5,
    },
    {
      id: "2",
      name: "华为 MateBook X Pro",
      price: "7999-12999",
      score: 4.8,
    },
    {
      id: "3",
      name: "苹果 MacBook Pro",
      price: "9999-14999",
      score: 4.9,
    },
  ],
});

// 商品详情接口
Mock.mock(/\/api\/products\/get_obj/, "get", {
  status: "success",
  data: {
    id: "@id",
    name: "联想ThinkBook 16+ 2023",
    price: "6299-8399",
    score: 4.5,
    description: "全新第13代英特尔®酷睿™处理器，16英寸2.5K 120Hz高刷屏",
  },
});
