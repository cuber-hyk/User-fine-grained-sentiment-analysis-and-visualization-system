import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios' // 引入axios库

//插件安装，vue遵循单向数据流
Vue.use(Vuex)

//创建并导出store实例
export default new Vuex.Store({

    //state所有组件共享的数据
    //使用数据：
    //1.this.$store.state.xxx（script中）
    //2.通过辅助函数mapState（简化） ,mapMutations（简化)映射方法

    state: {
        currentProduct: null,
        searchResults: null,
        productDetails: null,
        sentimentData: null,
        trendsData: null,
        reviewsData: null,
        sourcesData: null
    },

    //通过mutations修改state数据
    //mutations必须是同步的（便于监测数据变化，记录调试）
    mutations: {

        //定义修改state的方法。所有mutations方法的第一个参数是state。
        //注意：组件调用mutations,this.$store.commit('方法名',参数),参数只能是一次，如果需要多个参数，可以用对象(obj){cout:1,name:'xxx'}传参

        //搜索商品
        SET_SEARCH_RESULTS(state, results) {
            state.searchResults = results
        },
        //设置当前商品
        SET_CURRENT_PRODUCT(state, product) {
            state.currentProduct = product
        },
        //设置商品详情
        SET_PRODUCT_DETAILS(state, details) {
            state.productDetails = details
        },
        //设置情感分析数据
        SET_SENTIMENT_DATA(state, data) {
            state.sentimentData = data
        },
        //设置趋势分析数据
        SET_TRENDS_DATA(state, data) {
            state.trendsData = data
        },
        //设置评论数据
        SET_REVIEWS_DATA(state, data) {
            state.reviewsData = data
        },
        //设置来源分析数据
        SET_SOURCES_DATA(state, data) {
            state.sourcesData = data
        }
    },

    //actions是异步操作，可以包含异步操作，可以触发mutations
    //组件调用actions,this.$store.dispatch('方法名',参数),参数可以是一次，也可以是对象(obj){cout:1,name:'xxx'}传参
    //发请求属于异步操作，在actions中处理，mutations中修改state
    actions: {
        searchProducts({ commit }, searchName) {
            axios({
                url: '/api/search/get_list',
                method: 'get',
                params: {
                    searchName: searchName
                }
            }).then(result => {
                if (result.data.status === 'success') {
                    commit('SET_SEARCH_RESULTS', result.data.data)
                }
            }).catch(error => {
                console.error('搜索商品失败:', error)
                this._vm.$message.error('搜索失败，请重试')   // 全局提示
            })
        },

        fetchProductDetails({ commit }, productId) {
            axios({
                url: '/api/products/get_obj',
                method: 'get',
                params: {
                    product_id: productId
                }
            }).then(result => {
                if (result.data.status === 'success') {
                    const data = result.data.data
                    commit('SET_CURRENT_PRODUCT', data)
                    commit('SET_PRODUCT_DETAILS', data)
                    this._vm.$nextTick(() => {
                        commit('SET_SENTIMENT_DATA', data.sentiment)
                        commit('SET_TRENDS_DATA', data.trends)
                        commit('SET_REVIEWS_DATA', data.reviews)
                        commit('SET_SOURCES_DATA', data.sources)
                    })
                }
            }).catch(error => {
                console.error('获取商品详情失败:', error)
                this._vm.$message.error('获取商品详情失败，请重试')
            })
        }
    }

    //基于state派生出其他数据，可以用getters
    // getters: {
    //     // 定义计算属性，可以获取state中的数据，也可以进行一些计算
    //     // 组件调用getters,this.$store.getters.方法名    
    //     getProductDetails(state) {
    //         return state.productDetails
    //     }
    // }

}) 