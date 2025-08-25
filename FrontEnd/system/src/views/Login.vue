<template>
  <div class="login-container">
    <!-- <div class="back-home" @click="goHome">
      <i class="el-icon-arrow-left"></i> 返回主页
    </div> -->
    <div class="system-title">智评视界</div>
    <div class="login-panel panel animate__animated animate__fadeIn">
      <h2 class="panel-title">欢迎登录</h2>
      <p class="subtitle">请输入手机号和密码登录</p>
      <el-form
        :model="loginForm"
        :rules="rules"
        ref="loginForm"
        label-width="0"
        class="login-form"
      >
        <el-form-item prop="phone">
          <el-input
            v-model="loginForm.phone"
            placeholder="请输入手机号"
            prefix-icon="el-icon-mobile-phone"
            class="input-field"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            :type="showPassword ? 'text' : 'password'"
            v-model="loginForm.password"
            placeholder="请输入密码"
            class="input-field"
          >
            <template #prefix>
              <i class="el-icon-lock"></i>
            </template>
            <template #suffix>
              <i
                class="el-icon-view"
                @click="togglePasswordVisibility"
                style="cursor: pointer"
              ></i>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="rememberPassword" class="remember-password">记住密码</el-checkbox>
        </el-form-item>

        <el-form-item class="form-item-register">
          <span class="register-link" @click="handleRegister"
            >没有账号？去注册</span
          >
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="handleLogin"
            class="login-button"
            :loading="loading"
          >
            {{ loading ? "登录中..." : "立即登录" }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import axios from "axios";

export default {
  name: "Login",
  data() {
    // 密码验证规则
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'));
      } else if (value.length < 8 || value.length > 20) {
        callback(new Error('密码长度需8-20位'));
      } else if (!/[A-Z]/.test(value)) {
        callback(new Error('密码需包含大写字母'));
      } else if (!/[a-z]/.test(value)) {
        callback(new Error('密码需包含小写字母'));
      } else if (!/[0-9]/.test(value)) {
        callback(new Error('密码需包含数字'));
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        callback(new Error('密码需包含特殊符号'));
      } else {
        callback();
      }
    };

    return {
      showPassword: false,
      loading: false,
      rememberPassword: false,
      loginForm: {
        phone: "",
        password: "",
      },
      rules: {
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1\d{10}$/,
            message: "请输入有效的手机号",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
      },
    };
  },
  created() {
    // 检查是否有保存的登录信息
    const savedLoginInfo = localStorage.getItem('loginInfo');
    if (savedLoginInfo) {
      try {
        const loginInfo = JSON.parse(savedLoginInfo);
        this.loginForm.phone = loginInfo.phone || '';
        this.loginForm.password = loginInfo.password || '';
        this.rememberPassword = true;
      } catch (e) {
        console.error('Error parsing saved login info:', e);
        localStorage.removeItem('loginInfo');
      }
    } else {
      this.$store.commit("CLEAR_LOGIN_FORM");
    }
  },
  methods: {
    ...mapMutations(["SET_USER"]),

    async handleLogin() {
      try {
        // 表单验证
        await this.$refs.loginForm.validate();
        this.loading = true;

        // 请求数据
        const requestData = {
          phone: this.loginForm.phone,
          password: this.loginForm.password,
        };

        // 调用登录接口，使用 JSON 格式
        const response = await axios.post("/api/user/login", requestData, {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 5000,
        });

        if (response.data.code === 200) {
          const userData = response.data.data;

          // 提交用户数据到Vuex
          this.SET_USER({
            userId: userData.userId,
            username: userData.username,
            token: userData.token,
            phone: this.loginForm.phone,
          });

          // 处理记住密码功能
          if (this.rememberPassword) {
            // 保存登录信息到本地存储
            localStorage.setItem('loginInfo', JSON.stringify({
              phone: this.loginForm.phone,
              password: this.loginForm.password
            }));
          } else {
            // 如果取消了记住密码，则清除之前保存的登录信息
            localStorage.removeItem('loginInfo');
          }

          this.$message.success("登录成功");
          // 检查是否有重定向URL，如果有则跳转到该URL，否则跳转到主页
          const redirectUrl = this.$route.query.redirect || "/home";
          this.$router.push(redirectUrl);
        } else {
          this.$message.error(response.data.message || "登录失败");
        }
      } catch (error) {
        console.error("登录失败:", error);
        if (error.response) {
          this.$message.error(error.response.data.message || "登录失败");
        } else {
          this.$message.error("登录失败，请检查网络连接");
        }
      } finally {
        this.loading = false;
      }
    },

    handleRegister() {
      this.$router.push("/register"); // 跳转到注册页面
    },

    goHome() {
      this.$router.push("/home"); // 跳转到主页
    },

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword; // 切换密码显示/隐藏
    },
  },
};
</script>

<style scoped>
/* 样式部分保持不变 */
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;
  margin: 0;
  padding: 20px;
  /* background-image: url("../assets/log5.jpg"); */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.back-home {
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 20px;
  color: #ffffff;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;
}

.back-home:hover {
  color: #2980b9;
}

.system-title {
  margin-top: 80px;
  margin-bottom: 50px;
  font-size: 48px;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 0 15px rgba(2, 166, 181, 0.7);
  letter-spacing: 5px;
}

.login-panel {
  width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.04) !important;
  border: 1px solid rgba(2, 166, 181, 0.3) !important;
  box-shadow: 0 0 20px rgba(2, 166, 181, 0.1);
  border-radius: 4px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.login-panel:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 25px rgba(2, 166, 181, 0.2);
}

.panel-title {
  font-size: 24px;
  color: #ffffff;
  text-align: center;
  margin-bottom: 20px;
  text-shadow: 0 0 15px rgba(2, 166, 181, 0.5);
  letter-spacing: 1px;
}

.subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  margin-bottom: 30px;
}

.login-form {
  width: 100%;
}

.form-item-register {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.register-link {
  color: rgba(2, 166, 181, 0.8);
  cursor: pointer;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
}

.register-link:hover {
  color: #68f1fa;
  text-shadow: 0 0 5px rgba(2, 166, 181, 0.5);
}

.remember-password {
  color: #606266;
  font-size: 14px;
  margin-bottom: 10px;
}

.login-button {
  width: 100%;
  height: 40px;
  background: linear-gradient(135deg, rgba(2, 166, 181, 0.7), rgba(0, 78, 146, 0.7));
  border: 1px solid rgba(2, 166, 181, 0.3) !important;
  color: #fff !important;
  font-size: 16px;
  transition: all 0.3s ease;
}

.login-button:hover {
  background: linear-gradient(135deg, rgba(2, 166, 181, 0.9), rgba(0, 78, 146, 0.9));
  box-shadow: 0 0 15px rgba(2, 166, 181, 0.3);
  transform: translateY(-2px);
}

.input-field {
  margin-bottom: 15px;
}

.input-field :deep(.el-input__inner) {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(2, 166, 181, 0.3) !important;
  color: #fff !important;
  height: 40px;
  line-height: 40px;
  transition: all 0.3s ease;
}

/* 修改 placeholder 的颜色 */
.input-field :deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.3) !important;
  font-size: 14px;
}

/* 兼容 Firefox */
.input-field :deep(.el-input__inner::-moz-placeholder) {
  color: rgba(255, 255, 255, 0.3) !important;
  font-size: 14px;
}

/* 兼容 Edge */
.input-field :deep(.el-input__inner::-ms-input-placeholder) {
  color: rgba(255, 255, 255, 0.3) !important;
  font-size: 14px;
}

/* 兼容 Chrome, Safari */
.input-field :deep(.el-input__inner::-webkit-input-placeholder) {
  color: rgba(255, 255, 255, 0.3) !important;
  font-size: 14px;
}

.input-field :deep(.el-input__inner):focus {
  border-color: rgba(2, 166, 181, 0.8) !important;
  box-shadow: 0 0 10px rgba(2, 166, 181, 0.5);
}

.input-field :deep(.el-input__prefix),
.input-field :deep(.el-input__suffix) {
  color: rgba(255, 255, 255, 0.7);
}

:deep(.el-form-item__error) {
  color: #ff9f7f;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  text-shadow: 0 0 5px rgba(255, 159, 127, 0.3);
}

/* 添加密码图标的样式 */
.el-icon-view {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
}

.el-icon-view:hover {
  color: #68f1fa;
  text-shadow: 0 0 5px rgba(2, 166, 181, 0.5);
}
</style>
