<script>
import { mapState } from 'vuex';

export default {
  name: 'NavBar',
  computed: {
    ...mapState(['user']),
    isLoggedIn() {
      return !!this.user.token;
    },
    userAvatar() {
      return this.user.icon || `https://ui-avatars.com/api/?name=${this.user.username?.charAt(0) || 'U'}&size=128&background=3d3d3d&color=fff`;
    }
  },
  mounted() {
    // 如果用户已登录但没有完整信息，尝试获取用户信息
    if (this.isLoggedIn && (!this.user.phone || !this.user.createTime)) {
      this.fetchUserData();
    }
  },
  methods: {
    async fetchUserData() {
      try {
        await this.$store.dispatch('fetchUserInfo');
        console.log('User data fetched in NavBar');
      } catch (error) {
        console.error('Failed to fetch user data in NavBar:', error);
      }
    }
  }
}
</script> 