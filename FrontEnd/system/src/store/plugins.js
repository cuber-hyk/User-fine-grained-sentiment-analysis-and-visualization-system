// 持久化存储插件
export const persistencePlugin = store => {
  // 从 localStorage 恢复状态
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      if (user && user.token) {
        store.commit('SET_USER', user);
        // 同时将 token 保存到 sessionStorage
        window.sessionStorage.setItem('token', user.token);
      }
    } catch (e) {
      console.error('Error parsing user from localStorage:', e);
    }
  }

  // 监听状态变化，保存到 localStorage
  store.subscribe((mutation, state) => {
    if (mutation.type === 'SET_USER' || mutation.type === 'LOGOUT') {
      localStorage.setItem('user', JSON.stringify(state.user));
      
      // 同时更新 sessionStorage 中的 token
      if (state.user && state.user.token) {
        window.sessionStorage.setItem('token', state.user.token);
      } else {
        window.sessionStorage.removeItem('token');
      }
    }
  });
}; 