import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import router from '../router';
import { persistencePlugin } from './plugins';
import { mockProductDetails } from '@/mock/mockData.js';
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
    aspectOpinions: null,  // 主题挖掘数据
    activeAspect: '', // 新增：当前选中的主题词
    lastProductId: null, // 新增：记录上一个商品ID
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
      console.log('[Store] SET_USER called with:', userData); // Log input userData
      console.log('[Store] After SET_USER, state.user is:', JSON.parse(JSON.stringify(state.user))); // Log state.user (deep copy to avoid reactivity issues in log)
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
      console.log('[Store] LOGOUT called. state.user is now:', JSON.parse(JSON.stringify(state.user))); // Log state.user after logout
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
      if (!product) {
        state.currentProduct = null;
        state.lastProductId = null;
        state.activeAspect = '';
        return;
      }
      // 只有商品pid变化时才重置activeAspect
      if (!state.lastProductId || state.lastProductId !== product.pid) {
        state.activeAspect = '';
      }
      state.currentProduct = product;
      state.lastProductId = product.pid;
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
    SET_ASPECT_OPINIONS(state, data) {
      state.aspectOpinions = data;
      // 只有当当前 activeAspect 不在新数据中时才重置
      if (Array.isArray(data) && data.length > 0) {
        const exists = data.some(item => item.aspect === state.activeAspect);
        if (!exists) {
          state.activeAspect = data[0].aspect;
        }
      } else {
        state.activeAspect = '';
      }
    },
    SET_USER_PHONE(state, newPhone) {
      if (state.user) {
        state.user.phone = newPhone;
        // 同时更新 localStorage 中的用户数据以保持持久化
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    SET_USER_USERNAME(state, newUsername) {
      if (state.user) {
        state.user.username = newUsername;
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    SET_USER_ICON(state, newIconUrl) {
      if (state.user) {
        state.user.icon = newIconUrl;
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    SET_ACTIVE_ASPECT(state, aspect) { // 新增：设置当前选中的主题词
       state.activeAspect = aspect;
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
          console.log('[Store Action] fetchUserInfo received data:', response.data); // Log fetched data
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
    async fetchProductDetails({ commit, dispatch }, product) {
      try {
        console.log('正在获取商品详情，传入参数:', product);

        // 支持传入对象或直接传入 pid
        const pid = typeof product === 'object' ? (product.pid || product.id) : product;

        if (!pid) {
          console.error('pid 为空，传入的参数:', product);
          throw new Error('商品ID不能为空');
        }

        // **调用真实 API 获取核心商品信息**
        const infoResponse = await axios({
          url: '/api/product/getProductInfoByPid',
          method: 'get',
          params: { pid: pid.toString() },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          timeout: 30000 // 增加超时时间到30秒
        });

        console.log('商品详情API响应:', infoResponse);

        if (infoResponse.data.code === 200) {
          const productInfo = infoResponse.data.data;
          console.log('获取到的商品信息:', productInfo);

          // 获取对应 pid 的模拟数据，用于填充其他部分（暂时保留，如果全部切换为真实接口再移除）
          const mockDetailsForPid = mockProductDetails(pid);

          // 合并真实的核心商品信息和模拟数据中的其他部分
          const mergedDetails = {
              ...mockDetailsForPid, // 以模拟数据为基础，获取sources, reviews, trends, aspectOpinions的模拟数据
              ...productInfo, // 用真实API返回的核心信息（pid, name, image_url, stars, discount_price, normal_price, ratings）覆盖模拟数据
              pid: pid, // 确保pid正确
              id: pid // 确保id正确
          };

          // 更新商品详情（可能仍然需要保留，如果其他地方依赖此状态）
          commit('SET_PRODUCT_DETAILS', mergedDetails);

          // 同时更新 currentProduct 状态
          commit('SET_CURRENT_PRODUCT', { pid: pid, ...mergedDetails });

          // ** 调用真实 API 获取主题挖掘数据 **
          try {
            // 从 sessionStorage 获取 token
            const token = window.sessionStorage.getItem('token');

            // 检查 mergedDetails 是否已包含 aspectOpinions 数据 (如果 mock 数据提供了)
            if (!mergedDetails.aspectOpinions) { // 如果 mock data 不包含，或者未来移除 mock data
                const aspectResponse = await axios({
                  url: '/api/product/getProductAspectOpinionsByPid',
                  method: 'post',
                  data: [pid.toString()],
                  headers: {
                    'Content-Type': 'application/json',
                    'token': token
                  },
                  timeout: 30000 // 增加超时时间到30秒
                });

                if (aspectResponse.data.code === 200) {
                   commit('SET_ASPECT_OPINIONS', aspectResponse.data.data); // 直接设置 AspectOpinions 状态
                } else {
                  console.error('获取主题挖掘数据失败:', aspectResponse.data.message);
                }
            } else {
                 // 如果 mock data 提供了 aspectOpinions，直接使用 mock data 中的
                 commit('SET_ASPECT_OPINIONS', mergedDetails.aspectOpinions);
                console.log('Using mock aspect opinions data.');
            }

          } catch (aspectError) {
            console.error('获取主题挖掘数据失败:', aspectError);
          }

          // ** 调用真实 API 获取评论热度趋势数据 **
          try {
              const trendResponse = await axios({
                  url: '/api/product/getTrend',
                  method: 'get',
                  params: { pid: pid.toString() },
                   headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                  },
                  timeout: 30000 // 增加超时时间到30秒
              });

              console.log('评论热度趋势API响应:', trendResponse);

              if (trendResponse.data.code === 200) {
                  // 假设后端返回的数据格式可以直接用于图表，或者需要简单转换
                  // 根据API文档，data字段是一个数组，格式示例未给出，假设是 { year: ..., month: ..., count: ... } 的数组
                  // 这里直接将返回的 data 数组提交给 mutation
                  commit('SET_TRENDS_DATA', trendResponse.data.data);
                  console.log('评论热度趋势数据已更新', trendResponse.data.data);
              } else {
                  console.error('获取评论热度趋势数据失败:', trendResponse.data.message);
                  commit('SET_TRENDS_DATA', null); // 获取失败时清空数据
                }
          } catch (trendError) {
              console.error('获取评论热度趋势数据失败:', trendError);
              commit('SET_TRENDS_DATA', null); // 获取失败时清空数据
          }

          // ** 调用真实 API 获取情感极性分析数据 **
          try {
              const token = window.sessionStorage.getItem('token');
              const sentimentResponse = await axios({
                  url: '/api/product/getProductAspectSentimentsByPid', // 使用之前确定的接口
                  method: 'post',
                  data: [pid.toString()], // 接口需要一个包含 pid 的数组作为请求体
                   headers: {
                    'Content-Type': 'application/json',
                    'token': token
                  },
                  timeout: 30000 // 增加超时时间到30秒
              });

              console.log('情感极性分析API响应:', sentimentResponse);

              if (sentimentResponse.data.code === 200 && sentimentResponse.data.data) {
                  // 根据接口返回的数据结构，累加正面、负面、中性评论数
                  let totalPositive = 0;
                  let totalNegative = 0;
                  let totalNeutral = 0;

                  sentimentResponse.data.data.forEach(item => {
                    totalPositive += item.positiveOpinions;
                    totalNegative += item.negativeOpinions;
                    totalNeutral += item.neutralOpinions;
                  });

                  // 将累加结果格式化为 SentimentChart 期望的数据结构
                  const formattedSentimentData = {
                    Positive: totalPositive,
                    Negative: totalNegative,
                    Neutral: totalNeutral
                  };

                  commit('SET_SENTIMENT_DATA', formattedSentimentData); // 更新 store 中的情感数据
                  console.log('情感极性分析数据已更新', formattedSentimentData);
              } else {
                  console.error('获取情感极性分析数据失败:', sentimentResponse.data.message);
                  commit('SET_SENTIMENT_DATA', null); // 获取失败时清空数据
              }

          } catch (sentimentError) {
              console.error('获取情感极性分析数据失败:', sentimentError);
              commit('SET_SENTIMENT_DATA', null); // 获取失败时清空数据
          }


        } else {
          console.error('获取商品详情失败:', infoResponse.data);
          throw new Error(infoResponse.data.message || '获取商品详情失败');
        }
      } catch (error) {
        console.error('处理商品详情或调用API失败:', error);
        console.error('错误详情:', error.response?.data);
        this._vm.$message.error(error.message || '获取商品详情失败，请重试');
        // 发生错误时清空相关状态
        commit('SET_PRODUCT_DETAILS', null);
        commit('SET_ASPECT_OPINIONS', null); // 清空主题挖掘数据
        commit('SET_TRENDS_DATA', null); // 清空趋势数据
        // 处理403无权限，自动登出并跳转
        if (error.response && error.response.status === 403) {
          this._vm.$message.error('登录已过期或无权限，请重新登录');
          await dispatch('logout');
          router.push('/login');
          return;
        }
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

    // 新增或修改 updateUserInfo action 来统一处理用户名、密码、头像更新
    async updateUserInfo({ commit }, payload) {
        try {
             // 验证 payload 中至少包含 id
             if (!payload || payload.id === undefined) {
                 throw new Error('更新用户信息参数不完整: 缺少用户ID');
             }

             const token = window.sessionStorage.getItem('token');
             if (!token) {
                 throw new Error('未登录或 token 已失效');
             }

             // 构造符合 UserUpdateInfoDTO 结构的 JSON 请求体
             const requestData = {
                 id: payload.id,
                 // 只包含 payload 中存在的字段
                 ...(payload.username !== undefined && { username: payload.username }),
                 ...(payload.newPassword !== undefined && { newPassword: payload.newPassword }),
                 ...(payload.oldPassword !== undefined && { password: payload.oldPassword }), // 映射 oldPassword 到 password
                 ...(payload.icon !== undefined && { icon: payload.icon }),
             };

             console.log('Sending updateUserInfo request data (JSON):', requestData);

             const response = await axios.post('/api/user/updateUserInfo', requestData, {
                 headers: {
                     'Content-Type': 'application/json',
                     'token': token
                 }
             });

             // 根据API文档，成功返回 code 为 0，也处理 code 为 200 的情况以兼容之前的发现
             if (response.data && (response.data.code === 0 || response.data.code === 200)) {
                 console.log('updateUserInfo success response:', response.data);
                 // 更新本地 store 状态
                 if (payload.username !== undefined) {
                     commit('SET_USER_USERNAME', payload.username);
                 }
                 if (payload.icon !== undefined) {
                     // 假设后端返回的 icon 是可以直接使用的 URL
                     commit('SET_USER_ICON', payload.icon);
                 }
                 // 注意：修改密码成功后，通常不直接更新 store 中的密码字段，以强制用户重新登录。
                 // 如果业务需要更新，可以在这里添加相应的 mutation 调用。

                 return response; // 返回完整的响应对象
             } else {
                 console.error('updateUserInfo backend error:', response.data);
                 throw new Error(response.data?.message || '更新用户信息失败');
             }

        } catch (error) {
            console.error('updateUserInfo request or processing failed:', error);
             if (error.response && error.response.data && error.response.data.message) {
                 throw new Error(`更新用户信息失败: ${error.response.data.message}`);
             } else if (error.response && error.response.status) {
                 throw new Error(`请求失败，状态码 ${error.response.status}`);
             } else {
                 throw new Error(`请求出错，请检查网络或稍后重试: ${error.message}`);
             }
        }
    },

    async updateUserPhone({ state, commit }, payload) {
      try {
        // 验证 payload 参数
        if (!payload || payload.id === undefined || payload.phone === undefined || payload.newPhone === undefined) {
           console.error('updateUserPhone action received incomplete payload:', payload);
           throw new Error('更新手机号参数不完整');
        }
        if (!state.user || !state.user.token) {
            throw new Error('用户未登录或 token 不存在');
        }

        // 从 sessionStorage 获取 token (如果 axios 拦截器已设置，这里可省略)
        const token = window.sessionStorage.getItem('token');
        if (!token) {
            throw new Error('未登录或 token 已失效');
        }


        // 构造符合 UserUpdatePhoneDTO 结构的 JSON 请求体
        const requestData = {
          id: payload.id, // 用户 ID
          phone: payload.phone, // 旧手机号
          newPhone: payload.newPhone // 新手机号
        };

        // 设置请求头，确保 Content-Type 是 application/json
        const requestHeaders = {
           'Content-Type': 'application/json',
           'token': token // 如果 axios 拦截器已设置，这里可省略
        };

        console.log('Sending phone update request data (JSON):', requestData); // 调试信息
        console.log('Sending phone update request headers:', requestHeaders); // 调试信息

        // 发送 POST 请求，axios 会自动将 requestData (JS对象) 序列化为 JSON
        const response = await axios.post('/api/user/updateUserPhone', requestData, { headers: requestHeaders });

        // 根据API文档检查响应结果
        if (response.data && response.data.code === 200) {
          console.log('手机号更新成功响应:', response.data);
          // 更新成功，更新本地状态
          // 使用 SET_USER_PHONE mutation 更新 state 中的手机号
          commit('SET_USER_PHONE', payload.newPhone);

          return response; // 返回完整的响应对象，而不是 response.data
        } else {
          // 处理错误情况
          console.error('后端返回错误:', response.data);
          throw new Error(response.data?.message || '更新手机号失败');
        }
      } catch (error) {
        console.error('更新手机号请求或处理失败:', error); // 优化错误日志
        // 检查 error.response 获取更多后端返回的错误详情
        if (error.response && error.response.data && error.response.data.message) {
           console.error('后端错误信息:', error.response.data.message); // 再次打印后端错误信息
           throw new Error(`更新手机号失败: ${error.response.data.message}`);
        } else if (error.response && error.response.status) { // 检查非 200 状态码错误
            console.error('请求失败，状态码:', error.response.status);
             throw new Error(`请求失败，状态码 ${error.response.status}`);
        } else { // 处理网络错误等
           throw new Error(`请求出错，请检查网络或稍后重试: ${error.message}`);
        }
      }
    },

    // 新增：修改用户密码
    async updateUserPassword(context, payload) {
      try {
        if (!payload || !payload.id || !payload.password || !payload.newPassword) {
          throw new Error('缺少必要参数');
        }
        const token = window.sessionStorage.getItem('token');
        if (!token) {
          throw new Error('未登录或 token 已失效');
        }
        const requestData = {
          password: payload.password,
          id: payload.id,
          newPassword: payload.newPassword
        };
        const response = await axios.post('/api/user/updateUserPassword', requestData, {
          headers: {
            'Content-Type': 'application/json',
            'token': token
          }
        });
        return response;
      } catch (error) {
        console.error('updateUserPassword error:', error);
        throw error;
      }
    },

    // 新增：修改用户名
    async updateUserUsername(context, payload) {
      try {
        if (!payload || !payload.id || !payload.newUsername) {
          throw new Error('缺少必要参数');
        }
        const token = window.sessionStorage.getItem('token');
        if (!token) {
          throw new Error('未登录或 token 已失效');
        }
        const requestData = {
          id: payload.id,
          newUsername: payload.newUsername
        };
        const response = await axios.post('/api/user/updateUserUsername', requestData, {
          headers: {
            'Content-Type': 'application/json',
            'token': token
          }
        });
        return response;
      } catch (error) {
        console.error('updateUserUsername error:', error);
        throw error;
      }
    },

    // 新增：修改用户头像
    async updateUserIcon(context, payload) {
      try {
        if (!payload || !payload.id || !payload.iconFile) {
          throw new Error('缺少必要参数');
        }
        const token = window.sessionStorage.getItem('token');
        if (!token) {
          throw new Error('未登录或 token 已失效');
        }
        const requestData = {
          iconFile: payload.iconFile,
          id: payload.id
        };
        const response = await axios.post('/api/user/updateUserIcon', requestData, {
          headers: {
            'Content-Type': 'application/json',
            'token': token
          }
        });
        return response;
      } catch (error) {
        console.error('updateUserIcon error:', error);
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