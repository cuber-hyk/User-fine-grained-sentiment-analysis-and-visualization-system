<template>
  <div class="login-container">
    <div class="background-animation">
      <div class="cube"></div>
      <div class="cube"></div>
      <div class="cube"></div>
      <div class="cube"></div>
    </div>

    <el-card class="login-card" v-if="!loading">
      <div slot="header" class="card-header">
        <span class="header-title">{{
          isLogin ? "用户登录" : "用户注册"
        }}</span>
      </div>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="80px"
        class="login-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="formData.username"
            placeholder="请输入用户名"
            class="input-field"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formData.password"
            type="password"
            placeholder="请输入密码"
            show-password
            class="input-field"
            prefix-icon="el-icon-lock"
          >
          </el-input>
        </el-form-item>

        <div class="btn-container">
          <el-button
            :loading="loading"
            @click="handleSubmit"
            class="submit-button"
          >
            {{ isLogin ? "登录" : "注册" }}
          </el-button>
          <div class="divider">
            <span>或者</span>
          </div>
          <el-button @click="toggleMode" class="toggle-button" type="text">
            {{ isLogin ? "还没有账号？立即注册" : "已有账号？立即登录" }}
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "Login",
  data() {
    return {
      isLogin: true,
      loading: false,
      formData: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, message: "用户名至少3个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码至少6个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    ...mapActions(["login", "register"]),
    async handleSubmit() {
      try {
        const valid = await this.$refs.formRef.validate();
        if (valid) {
          this.loading = true;
          if (this.isLogin) {
            await this.login(this.formData);
            this.$message.success("登录成功");
            this.$router.push("/");
          } else {
            await this.register(this.formData);
            this.$message.success("注册成功，请登录");
            this.isLogin = true;
          }
        }
      } catch (error) {
        this.$message.error(error.message || "操作失败");
      } finally {
        this.loading = false;
      }
    },
    toggleMode() {
      this.isLogin = !this.isLogin;
      this.$refs.formRef.resetFields();
    },
  },
};
</script>

<style>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #1a1f25, #242a33);
  position: relative;
  overflow: hidden;
}

/* 背景动画 */
.background-animation {
  position: absolute;
  width: 100%;
  height: 100%;
}

.cube {
  position: absolute;
  top: 80vh;
  left: 45vw;
  width: 10px;
  height: 10px;
  border: solid 1px #00ffff;
  transform-origin: top left;
  transform: scale(0) rotate(0deg) translate(-50%, -50%);
  animation: cube 12s ease-in forwards infinite;
}

.cube:nth-child(2) {
  animation-delay: 2s;
  left: 25vw;
  top: 40vh;
}

.cube:nth-child(3) {
  animation-delay: 4s;
  left: 75vw;
  top: 50vh;
}

.cube:nth-child(4) {
  animation-delay: 6s;
  left: 90vw;
  top: 10vh;
}

@keyframes cube {
  from {
    transform: scale(0) rotate(0deg) translate(-50%, -50%);
    opacity: 1;
  }
  to {
    transform: scale(20) rotate(960deg) translate(-50%, -50%);
    opacity: 0;
  }
}

.login-card {
  width: 420px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
  z-index: 1;
}

.card-header {
  text-align: center;
  padding: 25px 0;
  /* background: linear-gradient(90deg, #00c6fb, #005bea); */
  background: linear-gradient(
    90deg,
    rgba(0, 198, 251, 0.6),
    rgba(0, 94, 234, 0.6)
  ); /* 增加透明度 */
  margin: -20px -20px 20px -20px;
}

.card-header span {
  font-size: 24px;
  font-weight: 500;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 1px;
}

.login-form {
  padding: 20px 30px 0;
}

.input-field {
  border-radius: 8px;
  overflow: hidden;
}

.input-field .el-input__inner {
  height: 45px;
  line-height: 45px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  color: #2c3e50;
  font-size: 15px;
  padding-left: 45px;
}

.input-field .el-input__inner:focus {
  box-shadow: 0 0 0 2px rgba(0, 198, 251, 0.3);
}

.input-field .el-input__prefix {
  left: 15px;
  color: #00c6fb;
}

.el-form-item__label {
  color: #0b495b;
  font-weight: 500;
  font-size: 15px;
}

.btn-container {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.submit-button {
  width: 100%;
  height: 45px;
  font-size: 16px;
  font-weight: 500;
  color: #180303;
  background: linear-gradient(90deg, #00c6fb, #005bea);
  border: none;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 10px rgba(0, 198, 251, 0.6);
  background: linear-gradient(90deg, #00d4ff, #0066ff);
  color: #180303;
}

.submit-button:active {
  transform: translateY(0);
}

.divider {
  width: 100%;
  text-align: center;
  margin: 20px 0;
  position: relative;
}

.divider::before,
.divider::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 45%;
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider span {
  color: rgba(255, 255, 255, 0.6);
  background: transparent;
  padding: 0 10px;
  font-size: 14px;
}

.toggle-button {
  color: #00c6fb;
  font-size: 14px;
  padding: 0;
  margin: 0;
  transition: all 0.3s ease;
}

.toggle-button:hover {
  color: #00d4ff;
  text-decoration: none;
  transform: translateY(-1px);
}

/* 输入框placeholder样式 */
.el-input__inner::placeholder {
  color: #a0aec0;
}

/* 表单验证错误样式 */
.el-form-item.is-error .el-input__inner {
  border: 1px solid #ff4d4f;
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2);
}

/* 加载动画样式 */
.submit-button.is-loading {
  background: linear-gradient(90deg, #00c6fb, #005bea);
  opacity: 0.8;
}

/* 添加响应式光晕效果 */
.login-card::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.03),
    transparent
  );
  transform: rotate(45deg);
  animation: shine 20s linear infinite;
}

@keyframes shine {
  0% {
    transform: rotate(45deg) translateY(-100%);
  }
  100% {
    transform: rotate(45deg) translateY(100%);
  }
}

/* 标题居中 */
.header-title {
  text-align: center;
  font-size: 24px;
  font-weight: 500;
  color: #ffffff; /* 确保标题颜色清晰可见 */
}

/* 调整登录框颜色搭配 */
.login-card {
  background: rgba(255, 255, 255, 0.2); /* 更改为更柔和的背景色 */
  border: 1px solid rgba(255, 255, 255, 0.3); /* 边框颜色更柔和 */
}
</style> 