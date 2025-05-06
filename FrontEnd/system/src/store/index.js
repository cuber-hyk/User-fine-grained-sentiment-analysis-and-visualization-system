import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import router from '../router';
import { persistencePlugin } from './plugins';
import { mockReviewsData, mockSourcesData } from '@/mock/mockData.js';
import favoritesModule from './favorites';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    favorites: favoritesModule
  },
  state: {
    currentProduct: null,  // 当前选中的商品  
    searchResults: null,  // 搜索结果
    productDetails: null,  // 商品详情
    sentimentData: null,  // 情感分析数据
    trendsData: null,  // 趋势分析数据
    reviewsData: null,  // 评论数据
    sourcesData: null,  // 来源数据
    showMockData: true,  // 是否显示模拟数据

    // 用户相关状态
    loginForm: {
      phone: '',
      password: '',
      rememberPassword: false,
    },
    registerForm: {
      username: '',
      password: '',
      phone: '',
    },
    user: (() => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          return parsedUser;
        }
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
        localStorage.removeItem('user'); // 清除无效数据
      }

      // 默认空用户
      return {
        userId: null,
        username: "",
        phone: "",
        icon: "",
        createTime: "",
        updateTime: "",
        token: "",
        password: ""
      };
    })(),
    compareList: [],
  },

  mutations: {
    SET_LOGIN_FORM(state, formData) {
      state.loginForm = { ...state.loginForm, ...formData };
    },
    SET_REGISTER_FORM(state, formData) {
      state.registerForm = { ...state.registerForm, ...formData };
    },
    SET_USER(state, userData) {
      if (!userData.icon) {
        const username = userData.username || 'User';
        const initial = username.charAt(0).toUpperCase();
        userData.icon = `https://ui-avatars.com/api/?name=${initial}&size=128&background=3d3d3d&color=fff`;
      }

      // 确保保留现有密码
      const password = state.user.password;

      // 创建新的用户对象
      state.user = {
        ...state.user,
        ...userData,
        password
      };


      localStorage.setItem('user', JSON.stringify(state.user));

      // 同时将 token 保存到 sessionStorage
      if (state.user.token) {
        window.sessionStorage.setItem('token', state.user.token);
      }
    },
    LOGOUT(state) {
      state.user = {
        userId: null,
        username: "",
        phone: "",
        icon: "",
        createTime: "",
        updateTime: "",
        token: "",
        password: ""
      };
      localStorage.removeItem('user');
      // 如果用户选择了不记住密码，则清除保存的登录信息
      if (!state.loginForm.rememberPassword) {
        localStorage.removeItem('loginInfo');
      }
      // 同时清除 sessionStorage 中的 token
      window.sessionStorage.removeItem('token');
      state.compareList = [];
    },
    CLEAR_LOGIN_FORM(state) {
      state.loginForm = {
        phone: '',
        password: '',
        rememberPassword: state.loginForm.rememberPassword
      };
    },
    SET_SEARCH_RESULTS(state, results) {
      state.searchResults = results;
    },
    SET_CURRENT_PRODUCT(state, product) {
      state.currentProduct = product;
    },
    SET_PRODUCT_DETAILS(state, details) {
      state.productDetails = details;
    },
    SET_SENTIMENT_DATA(state, data) {
      state.sentimentData = data;
    },
    SET_TRENDS_DATA(state, data) {
      state.trendsData = data;
    },
    SET_REVIEWS_DATA(state, data) {
      state.reviewsData = data;
    },
    SET_SOURCES_DATA(state, data) {
      state.sourcesData = data;
    },
    ADD_TO_COMPARE_LIST(state, product) {
      if (!state.compareList.some(p => p.pid === product.pid)) {
        state.compareList.push(product);
      }
    },
    REMOVE_FROM_COMPARE_LIST(state, productId) {
      state.compareList = state.compareList.filter(p => p.pid !== productId);
    },
  },

  actions: {
    async handleLogin({ commit, dispatch }, loginData) {
      try {
        const response = await axios.post('/api/user/login', {
          phone: loginData.phone,
          password: loginData.password,
        });

        if (response.data.code === 200) {
          // 确保 token 存在于返回数据中
          if (!response.data.data || !response.data.data.token) {
            throw new Error('登录响应中未找到token');
          }

          // 检查用户ID是否存在
          const userId = response.data.data.userId || response.data.data.id;
          if (!userId) {
            throw new Error('登录响应中未找到用户ID');
          }

          const userData = {
            userId: userId,
            username: response.data.data.username,
            token: response.data.data.token,
            password: loginData.password
          };


          // 先设置用户基本信息和token
          commit('SET_USER', userData);
          commit('CLEAR_LOGIN_FORM');

          // 设置全局默认请求头，包含token
          axios.defaults.headers.common['token'] = userData.token;

          // 立即获取完整的用户信息
          try {
            await dispatch('fetchUserInfo');
          } catch (error) {
            console.error('Failed to fetch user info after login:', error);
          }

          return true;
        } else {
          throw new Error(response.data.message || '登录失败');
        }
      } catch (error) {
        console.error('登录失败:', error);
        throw error;
      }
    },

    async handleRegister({ state, commit }) {
      try {
        const response = await axios.post('/api/user/register', {
          registerFormDTO: {
            username: state.registerForm.username,
            password: state.registerForm.password,
            phone: state.registerForm.phone
          }
        }, {
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (response.data.code === 200) {
          commit('CLEAR_LOGIN_FORM'); // 注册成功后清空登录表单
          return true;
        } else {
          throw new Error(response.data.message || '注册失败');
        }
      } catch (error) {
        console.error('注册失败:', error);
        throw error;
      }
    },

    async fetchUserInfo({ state, commit }) {
      try {

        // 从 sessionStorage 获取 token
        const token = window.sessionStorage.getItem('token');

        if (!token) {
          console.error('No token available for getUser request');
          throw new Error('未登录或 token 已失效');
        }

        if (!state.user.userId) {
          console.error('No userId available for getUser request');
          throw new Error('用户ID不存在，无法获取用户信息');
        }

        // 构造请求参数
        const formData = new URLSearchParams();
        formData.append('id', state.user.userId);

        const response = await axios({
          method: 'post',
          url: '/api/user/getUser',
          data: formData,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'token': token
          }
        });


        // 处理响应...
        if (response.data) {
          const userData = {
            userId: response.data.id,
            username: response.data.username,
            phone: response.data.phone,
            icon: response.data.icon || '',
            createTime: response.data.createTime,
            updateTime: response.data.updateTime,
            token: token,
            password: state.user.password // 保留原密码
          };
          commit('SET_USER', userData);
          return userData;
        } else {
          throw new Error('获取用户信息失败');
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
        console.error('错误详情:', error.response?.data);
        throw error;
      }
    },

    logout({ commit }) {
      return new Promise((resolve, reject) => {
        try {
          // 清除请求头中的token
          delete axios.defaults.headers.common['token'];

          commit('LOGOUT');
          commit('CLEAR_LOGIN_FORM');
          console.log("[Vuex] 退出逻辑执行完成");
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    },

    // 搜索商品
    searchProducts({ commit }, name) {
      return axios({
        url: '/api/product/SearchProductByName',
        method: 'get',
        params: {
          name: name
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'token': window.sessionStorage.getItem('token')
        }
      }).then(result => {
        console.log('搜索结果:', result.data);
        if (result.data.code === 200) {
          if (!result.data.data || !Array.isArray(result.data.data)) {
            console.error('返回数据格式错误:', result.data);
            throw new Error('返回数据格式错误');
          }
          const transformedData = result.data.data.map(item => ({
            pid: item.pid,  // 保持原始的 pid
            id: item.pid,   // 为了兼容性也保留 id
            name: item.name || '',
            score: item.stars || '',
            price: item.discount_price || '',
            image: ''
          }));
          console.log('转换后的搜索结果:', transformedData);
          commit('SET_SEARCH_RESULTS', transformedData);
          return transformedData;
        } else {
          console.error('搜索失败:', result.data.message);
          throw new Error(result.data.message || '搜索失败');
        }
      }).catch(error => {
        console.error('搜索错误:', error);
        this._vm.$message.error(error.message || '搜索失败，请重试');
        throw error;
      });
    },

    // 获取商品详情
    async fetchProductDetails({ commit }, product) {
      try {
        console.log('正在获取商品详情，传入参数:', product);

        // 支持传入对象或直接传入 pid
        const pid = typeof product === 'object' ? (product.pid || product.id) : product;

        if (!pid) {
          console.error('pid 为空，传入的参数:', product);
          throw new Error('商品ID不能为空');
        }

        // 1. 获取基本信息
        const infoResponse = await axios({
          url: '/api/product/getProductInfoByPid',
          method: 'get',
          params: { pid: pid.toString() },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });

        console.log('商品详情API响应:', infoResponse);

        if (infoResponse.data.code === 200) {
          const productInfo = infoResponse.data.data;
          console.log('获取到的商品信息:', productInfo);

          // 更新商品详情
          commit('SET_PRODUCT_DETAILS', {
            ...productInfo,
            pid: pid,
            reviews: mockReviewsData.reviews,
            sources: mockSourcesData.sources
          });

          // 继续获取其他数据...
          // 2. 获取情感分析数据
          try {
            // 获取正面情感Top方面词
            const positiveResponse = await axios({
              url: '/api/product/getTopNAspect',
              method: 'get',
              params: {
                pid: pid.toString(),
                limit: 10,
                kind: '1'  // 使用'1'表示正面情感
              },
              headers: {
                'Content-Type': 'application/json'
              }
            });

            // 获取负面情感Top方面词
            const negativeResponse = await axios({
              url: '/api/product/getTopNAspect',
              method: 'get',
              params: {
                pid: pid.toString(),
                limit: 10,
                kind: '-1'  // 使用'-1'表示负面情感
              },
              headers: {
                'Content-Type': 'application/json'
              }
            });

            console.log('情感分析响应 - 正面:', positiveResponse.data);
            console.log('情感分析响应 - 负面:', negativeResponse.data);

            if (positiveResponse.data.code === 0 && negativeResponse.data.code === 0) {
              commit('SET_SENTIMENT_DATA', {
                positive: positiveResponse.data.data,
                negative: negativeResponse.data.data
              });
            } else {
              console.error('获取情感分析数据失败:',
                positiveResponse.data.message || negativeResponse.data.message);
            }
          } catch (sentimentError) {
            console.error('获取情感分析数据失败:', sentimentError);
          }

          // 3. 获取评论趋势数据
          try {
            const trendResponse = await axios({
              url: '/api/product/getTrend',
              method: 'get',
              params: {
                pid: pid.toString()
                //pid: 256809724068
              },
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            });

            console.log('趋势数据响应:', trendResponse.data);

            if (trendResponse.data.code === 200) {
              commit('SET_TRENDS_DATA', trendResponse.data.data);
            } else {
              console.error('获取趋势数据失败:', trendResponse.data.message);
            }
          } catch (trendError) {
            console.error('获取趋势数据失败:', trendError);
          }

        } else {
          console.error('获取商品详情失败:', infoResponse.data);
          throw new Error(infoResponse.data.message || '获取商品详情失败');
        }
      } catch (error) {
        console.error('获取商品详情失败:', error);
        console.error('错误详情:', error.response?.data);
        this._vm.$message.error(error.message || '获取商品详情失败，请重试');
        throw error;
      }
    },

    // 获取商品比较数据
    async compareProducts(pidList) {
      try {
        const response = await axios({
          url: '/api/product/compare',
          method: 'get',
          params: { pidList },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });

        if (response.data.code === 0) {
          return response.data.data;
        } else {
          throw new Error(response.data.message || '比较商品失败');
        }
      } catch (error) {
        console.error('比较商品失败:', error);
        throw error;
      }
    },

    async updateUserInfo({ state, commit }, userUpdateInfo) {
      try {
        // 验证原密码（如果要更新密码）
        if (userUpdateInfo.password && userUpdateInfo.oldPassword !== state.user.password) {
          throw new Error('原密码输入错误');
        }

        // 从 sessionStorage 获取 token
        const token = window.sessionStorage.getItem('token');

        // 根据API文档，使用POST请求和x-www-form-urlencoded格式
        const formData = new URLSearchParams();
        formData.append('id', state.user.userId);
        if (userUpdateInfo.username) formData.append('username', userUpdateInfo.username);
        if (userUpdateInfo.password) formData.append('password', userUpdateInfo.password);
        if (userUpdateInfo.icon) formData.append('icon', userUpdateInfo.icon);

        const response = await axios.post('/api/user/updateUserInfo', formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'token': token
          }
        });

        if (response.data.code === 200) {
          // 更新成功后，合并新旧数据
          const newUserData = {
            ...state.user,
            username: userUpdateInfo.username || state.user.username,
            icon: userUpdateInfo.icon || state.user.icon,
            password: userUpdateInfo.password || state.user.password,
            updateTime: new Date().toISOString()
          };

          commit('SET_USER', newUserData);
          return response.data;
        } else {
          throw new Error(response.data.message || '更新用户信息失败');
        }
      } catch (error) {
        console.error('更新用户信息失败:', error);
        throw error;
      }
    },

    async updateUserPhone({ state, commit }, { phone }) {
      try {
        // 验证参数
        if (!phone) {
          throw new Error('手机号不能为空');
        }
        if (!state.user.userId) {
          throw new Error('用户ID不能为空');
        }

        // 从 sessionStorage 获取 token
        const token = window.sessionStorage.getItem('token');

        // 构造请求参数
        const formData = new URLSearchParams();
        formData.append('phone', phone);
        formData.append('id', state.user.userId);

        const response = await axios.post('/api/user/updateUserPhone', formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'token': token
          }
        });

        // 根据API文档检查响应结果
        if (response.data && response.data.code === 200) {
          // 更新成功，更新本地状态
          const newUserData = {
            ...state.user,
            phone,
            updateTime: new Date().toISOString()
          };
          commit('SET_USER', newUserData);
          return response.data;
        } else {
          // 处理错误情况
          throw new Error(response.data?.message || '更新手机号失败');
        }
      } catch (error) {
        console.error('更新手机号失败:', error);
        throw error;
      }
    },

    setupAxiosInterceptors() {
      axios.interceptors.request.use(
        config => {
          // 从 sessionStorage 获取 token
          const token = window.sessionStorage.getItem('token');

          if (token) {
            // 使用 token 作为请求头
            config.headers['token'] = token;
          }
          return config;
        },
        error => {
          return Promise.reject(error);
        }
      );

      // 响应拦截器处理401错误（token过期或无效）
      axios.interceptors.response.use(
        response => {
          return response;
        },
        error => {
          if (error.response && error.response.status === 401) {
            this.dispatch('logout');
            router.push('/login');
          }
          return Promise.reject(error);
        }
      );
    }
  },

  plugins: [persistencePlugin],
});