<template>
  <div class="login-container">
    <div class="back-home" @click="goHome">
      <i class="el-icon-arrow-left"></i> 返回主页
    </div>
    <div class="login-box animate__animated animate__fadeIn">
      <h2 class="title">欢迎登录</h2>
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
    return {
      showPassword: false,
      loading: false,
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
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            pattern:
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,20}$/,
            message: "密码需8-20位，包含大写字母、小写字母、数字、特殊符号",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.$store.commit("CLEAR_LOGIN_FORM");
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

          this.$message.success("登录成功");
          this.$router.push("/"); // 登录成功后跳转到主页
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
      this.$router.push("/"); // 跳转到主页
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
  justify-content: left;
  align-items: center;
  height: 100vh;
  margin: 0;
  padding: 20px;
  background-image: url("../assets/log5.jpg");
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

.login-box {
  width: 360px;
  padding: 40px;
  background-color: rgba(255, 255, 255, 0.6);
  margin-left: 150px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.title {
  font-size: 24px;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

.subtitle {
  font-size: 14px;
  color: #666;
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
  color: #007bff;
  cursor: pointer;
  text-decoration: none;
  font-size: 14px;
}

.register-link:hover {
  color: #0056b3;
}

.login-button {
  width: 100%;
  height: 40px;
  background: linear-gradient(135deg, #00eaffce, #0983caaf);
  border: none;
  font-size: 16px;
  transition: all 0.3s ease;
}

.login-button:hover {
  background: linear-gradient(135deg, #0092b3e5, #003f7f);
  box-shadow: 0 6px 12px rgba(0, 86, 179, 0.6);
}

.input-field {
  margin-bottom: 15px;
}

.input-field :deep(.el-input__inner) {
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #333;
  height: 40px;
  line-height: 40px;
  transition: all 0.3s ease;
}

/* 修改 placeholder 的颜色 */
.input-field :deep(.el-input__inner::placeholder) {
  color: #99999990 !important;
  font-size: 14px;
}

/* 兼容 Firefox */
.input-field :deep(.el-input__inner::-moz-placeholder) {
  color: #99999990 !important;
  font-size: 14px;
}

/* 兼容 Edge */
.input-field :deep(.el-input__inner::-ms-input-placeholder) {
  color: #99999990 !important;
  font-size: 14px;
}

/* 兼容 Chrome, Safari */
.input-field :deep(.el-input__inner::-webkit-input-placeholder) {
  color: #99999990 !important;
  font-size: 14px;
}

.input-field :deep(.el-input__inner):focus {
  border-color: #409eff;
  box-shadow: 0 0 5px rgba(64, 158, 255, 0.3);
}

.input-field :deep(.el-input__prefix),
.input-field :deep(.el-input__suffix) {
  color: #666;
}

:deep(.el-form-item__error) {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
}

/* 添加密码图标的样式 */
.el-icon-view {
  font-size: 16px;
  color: #909399;
}

.el-icon-view:hover {
  color: #409eff;
}
.el-input :deep(.el-input__inner) {
  color: rgba(0, 0, 0, 0.616) !important;
}
</style>
