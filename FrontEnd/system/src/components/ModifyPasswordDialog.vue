<template>
  <el-dialog
    class="modify-dialog"
    title="修改密码"
    :visible="visible"
    width="400px"
    @close="handleClose"
  >
    <el-form :model="form" label-width="80px">
      <el-form-item label="原密码" required>
        <el-input v-model="form.oldPassword" type="password" show-password />
      </el-form-item>
      <el-form-item label="新密码" required>
        <el-input v-model="form.newPassword" type="password" show-password />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认修改</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  props: ["visible"],
  computed: {
    ...mapState(['user']),
    storedPassword() {
      return this.user.password;
    }
  },
  data() {
    return {
      form: {
        oldPassword: "",
        newPassword: "",
      },
      passwordRegex: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,20}$/
    };
  },
  methods: {
    ...mapActions(['updateUserInfo']),
    async handleConfirm() {
      if (!this.form.oldPassword) {
        this.$message.warning("请输入原密码");
        return;
      }
      if (this.form.oldPassword!== this.storedPassword) {
        this.$message.warning("原密码输入错误");
        return;
      }
      if (!this.form.newPassword) {
        this.$message.warning("请输入新密码");
        return;
      }
      if (!this.passwordRegex.test(this.form.newPassword)) {
        this.$message.warning("新密码需 8 到 20 位，包含数字、大写字母、小写字母和特殊符号至少各一位");
        return;
      }
      if (this.form.newPassword === this.form.oldPassword) {
        this.$message.warning("新密码不能与原密码相同");
        return;
      }

      try {
        const response = await this.updateUserInfo({
          userId: this.user.userId,
          password: this.form.newPassword
        });

        if (response.code === 200) {
          this.$message.success("密码修改成功");
          this.$emit("confirm");
          this.$emit("close");
        } else {
          this.$message.error(response.message || "密码修改失败");
        }
      } catch (error) {
        console.error('密码修改请求出错:', error);
        this.$message.error("请求出错，请稍后重试");
      }
    },
    handleClose() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.modify-dialog {
  --dialog-text-color: #666;
}

.modify-dialog :deep(.el-input .el-input__inner) {
  color: var(--dialog-text-color) !important;
  font-weight: 500;
}

.modify-dialog :deep(.el-input .el-input__inner::placeholder) {
  color: #999 !important;
}

.modify-dialog :deep(.el-input.is-active .el-input__inner) {
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

.modify-dialog :deep(.el-form-item__label) {
  color: var(--el-color-primary) !important;
}
</style>