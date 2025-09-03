// 收藏功能相关的Vuex模块

export default {
    namespaced: true,
    state: {
        favorites: []
    },

    mutations: {
        // 设置用户的收藏列表
        SET_USER_FAVORITES(state, { userId, favorites }) {
            // 将收藏列表与用户ID关联存储
            const key = `favorites_${userId}`;
            localStorage.setItem(key, JSON.stringify(favorites));
            state.favorites = favorites;
        },

        // 添加商品到收藏列表
        ADD_TO_FAVORITES(state, { userId, product }) {
            // 检查商品是否已经在收藏列表中
            if (!state.favorites.some(item => item.pid === product.pid)) {
                state.favorites.push(product);
                // 保存到本地存储，与用户ID关联
                const key = `favorites_${userId}`;
                localStorage.setItem(key, JSON.stringify(state.favorites));
            }
        },

        // 从收藏列表中移除商品
        REMOVE_FROM_FAVORITES(state, { userId, productId }) {
            state.favorites = state.favorites.filter(item => item.pid !== productId);
            // 更新本地存储，与用户ID关联
            const key = `favorites_${userId}`;
            localStorage.setItem(key, JSON.stringify(state.favorites));
        },

        // 清空收藏列表
        CLEAR_FAVORITES(state, userId) {
            state.favorites = [];
            if (userId) {
                const key = `favorites_${userId}`;
                localStorage.removeItem(key);
            }
        },

        // 加载用户的收藏列表
        LOAD_USER_FAVORITES(state, userId) {
            if (userId) {
                const key = `favorites_${userId}`;
                const savedFavorites = localStorage.getItem(key);
                if (savedFavorites) {
                    try {
                        state.favorites = JSON.parse(savedFavorites);
                        console.log(`加载用户 ${userId} 的收藏列表:`, state.favorites);
                    } catch (error) {
                        console.error('解析收藏数据失败:', error);
                        state.favorites = [];
                    }
                } else {
                    console.log(`用户 ${userId} 没有收藏数据`);
                    state.favorites = [];
                }
            } else {
                state.favorites = [];
            }
        }
    },

    actions: {
        // 加载用户的收藏列表
        loadUserFavorites({ commit }, userId) {
            console.log('开始加载用户收藏列表:', userId);
            commit('LOAD_USER_FAVORITES', userId);
        },

        // 添加商品到收藏
        addToFavorites({ commit }, { userId, product }) {
            console.log('添加收藏:', { userId, product });
            commit('ADD_TO_FAVORITES', { userId, product });
        },

        // 移除收藏
        removeFromFavorites({ commit }, { userId, productId }) {
            console.log('移除收藏:', { userId, productId });
            commit('REMOVE_FROM_FAVORITES', { userId, productId });
        },

        // 清空收藏列表
        clearFavorites({ commit }, userId) {
            console.log('清空收藏列表:', userId);
            commit('CLEAR_FAVORITES', userId);
        },

        // 设置用户的收藏列表（用于从服务器同步）
        setUserFavorites({ commit }, { userId, favorites }) {
            console.log('设置用户收藏列表:', { userId, favorites });
            commit('SET_USER_FAVORITES', { userId, favorites });
        }
    },

    getters: {
        // 获取收藏列表
        getFavorites: state => state.favorites,

        // 检查商品是否已收藏
        isFavorited: state => productId => {
            return state.favorites.some(item => item.pid === productId);
        }
    }
};