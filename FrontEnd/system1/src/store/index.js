import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentProduct: null,
    searchResults: null,
    productDetails: null,
    sentimentData: null,
    trendsData: null,
    reviewsData: null,
    sourcesData: null,

    // 用户相关状态
    loginForm: {
      phone: '',
      password: '',
    },
    registerForm: {
      username: '',
      password: '',
      phone: '',
    },
    user: JSON.parse(localStorage.getItem('user')) || {
      userId: null,
      username: "",
      phone: "",
      icon: "",
      createTime: "",
      updateTime: "",
      token: "",
      password: "" // 新增密码字段
    },
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

      const password = state.user.password;
      state.user = {
        ...state.user,
        ...userData,
        password
      };
      localStorage.setItem('user', JSON.stringify(state.user));
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
      state.compareList = [];
    },
    CLEAR_LOGIN_FORM(state) {
      state.loginForm = {
        phone: '',
        password: '',
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
    async handleLogin({ commit }, loginData) {
      try {
        const response = await axios.post('/api/user/login', {
          phone: loginData.phone,
          password: loginData.password,
        });

        if (response.data.code === 200) {
          const loginResult = response.data.data;

          const userResponse = await axios.post('/api/user/getUser',
            `id=${loginResult.id}`,
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }
          );

          if (userResponse.data) {
            const userData = {
              userId: userResponse.data.id,
              username: userResponse.data.username || `用户${userResponse.data.id.slice(-4)}`,
              phone: userResponse.data.phone,
              icon: userResponse.data.icon || '',
              createTime: userResponse.data.createTime,
              updateTime: userResponse.data.updateTime,
              token: loginResult.token,
              password: loginData.password // 存储密码
            };
            commit('SET_USER', userData);
            commit('CLEAR_LOGIN_FORM');
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
        // 构造请求参数
        const formData = new URLSearchParams();
        formData.append('id', state.user.userId);

        const response = await axios.post('/api/user/getUser', formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${state.user.token}`
          }
        });

        // API直接返回User对象，不是包装在data中
        if (response.data) {
          const userData = {
            userId: response.data.id, // 使用返回的id
            username: response.data.username,
            phone: response.data.phone,
            icon: response.data.icon || '',
            createTime: response.data.createTime,
            updateTime: response.data.updateTime,
            token: state.user.token,
            password: response.data.password // 从响应中获取密码
          };
          commit('SET_USER', userData);
          return userData;
        } else {
          throw new Error('获取用户信息失败');
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
        throw error;
      }
    },
    // store.js 中修改
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        try {
          commit('LOGOUT');
          commit('CLEAR_LOGIN_FORM');
          console.log("[Vuex] 退出逻辑执行完成");
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    },

    async searchProducts({ commit }, searchName) {
      try {
        const result = await axios.get('/api/search/get_list', { params: { searchName } });
        if (result.data.status === 'success') {
          commit('SET_SEARCH_RESULTS', result.data.data);
        } else {
          throw new Error('搜索失败');
        }
      } catch (error) {
        console.error('搜索商品失败:', error);
        throw error;
      }
    },

    async fetchProductDetails({ commit }, productId) {
      try {
        const result = await axios.get('/api/products/get_obj', { params: { product_id: productId } });
        if (result.data.status === 'success') {
          const data = result.data.data;
          commit('SET_CURRENT_PRODUCT', data);
          commit('SET_PRODUCT_DETAILS', data);
          commit('SET_SENTIMENT_DATA', data.sentiment);
          commit('SET_TRENDS_DATA', data.trends);
          commit('SET_REVIEWS_DATA', data.reviews);
          commit('SET_SOURCES_DATA', data.sources);
        } else {
          throw new Error('获取商品详情失败');
        }
      } catch (error) {
        console.error('获取商品详情失败:', error);
        throw error;
      }
    },

    async updateUserInfo({ state, commit }, userUpdateInfo) {
      try {
        // 验证原密码（如果要更新密码）
        if (userUpdateInfo.password && userUpdateInfo.oldPassword !== state.user.password) {
          throw new Error('原密码输入错误');
        }

        // 根据API文档，使用POST请求和x-www-form-urlencoded格式
        const formData = new URLSearchParams();
        formData.append('id', state.user.userId);
        if (userUpdateInfo.username) formData.append('username', userUpdateInfo.username);
        if (userUpdateInfo.password) formData.append('password', userUpdateInfo.password);
        if (userUpdateInfo.icon) formData.append('icon', userUpdateInfo.icon);

        const response = await axios.post('/api/user/updateUserInfo', formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${state.user.token}`
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

        // 构造请求参数
        const formData = new URLSearchParams();
        formData.append('phone', phone);
        formData.append('id', state.user.userId);

        const response = await axios.post('/api/user/updateUserPhone', formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${state.user.token}`
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
    }
  },
});