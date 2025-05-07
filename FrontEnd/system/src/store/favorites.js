// 收藏功能相关的Vuex模块

export default {
    state: {
        favorites: JSON.parse(localStorage.getItem('favorites') || '[]')
    },

    mutations: {
        // 添加商品到收藏列表
        ADD_TO_FAVORITES(state, product) {
            // 检查商品是否已经在收藏列表中
            if (!state.favorites.some(item => item.pid === product.pid)) {
                state.favorites.push(product);
                // 保存到本地存储
                localStorage.setItem('favorites', JSON.stringify(state.favorites));
            }
        },

        // 从收藏列表中移除商品
        REMOVE_FROM_FAVORITES(state, productId) {
            state.favorites = state.favorites.filter(item => item.pid !== productId);
            // 更新本地存储
            localStorage.setItem('favorites', JSON.stringify(state.favorites));
        },

        // 清空收藏列表
        CLEAR_FAVORITES(state) {
            state.favorites = [];
            localStorage.removeItem('favorites');
        }
    },

    actions: {
        // 添加商品到收藏
        addToFavorites({ commit }, product) {
            commit('ADD_TO_FAVORITES', product);
        },

        // 移除收藏
        removeFromFavorites({ commit }, productId) {
            commit('REMOVE_FROM_FAVORITES', productId);
        },

        // 清空收藏列表
        clearFavorites({ commit }) {
            commit('CLEAR_FAVORITES');
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