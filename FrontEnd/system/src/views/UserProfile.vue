<template>
  <!-- No changes to template section -->
</template>

<script>
import axios from 'axios';

export default {
  // No changes to component options

  methods: {
    async handleAvatarChange(file) {
      try {
        const formData = new FormData();
        formData.append('iconFile', file);
        formData.append('id', this.user.userId);
        
        const res = await axios.post('/api/user/updateUserIcon', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (res.data && (res.data.code === 0 || res.data.code === 200)) {
          this.$message.success('头像更新成功');
          await this.getUserInfo();
        } else {
          this.$message.error(res.data?.message || '头像更新失败');
        }
      } catch (err) {
        console.error('更新头像失败:', err);
        this.$message.error('头像更新失败');
      }
    },
  },
};
</script>

<style>
  /* No changes to style section */
</style> 