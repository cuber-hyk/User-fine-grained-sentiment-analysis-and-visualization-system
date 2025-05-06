<template>
  <div class="register-page">
    <div class="system-title">智评视界</div>
    <div class="register-container">
      <div class="register-card panel animate__animated animate__fadeIn">
        <h2 class="register-title">欢迎注册</h2>
        <p class="subtitle">请填写以下信息完成注册</p>
        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="rules"
          class="register-form"
        >
          <!-- 用户名输入 -->
          <el-form-item prop="username">
            <el-input
              v-model="registerForm.username"
              placeholder="Username"
              class="custom-input"
            >
              <template #prefix>
                <i class="el-icon-user"></i>
              </template>
            </el-input>
          </el-form-item>
          
          <!-- 手机号输入 -->
          <el-form-item prop="phone">
            <el-input
              v-model="registerForm.phone"
              placeholder="Phone"
              class="custom-input"
            >
              <template #prefix>
                <i class="el-icon-mobile-phone"></i>
              </template>
            </el-input>
          </el-form-item>


          <!-- 密码输入 -->
          <el-form-item prop="password">
            <el-input
              :type="passwordFieldType"
              v-model="registerForm.password"
              placeholder="Password"
              class="custom-input"
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

          
          <!-- 登录链接 -->
          <div class="login-link">
            <router-link to="/login">已有账号？去登录</router-link>
          </div>

          <!-- 注册按钮 -->
          <el-form-item>
            <el-button
              type="primary"
              @click="handleRegister"
              class="register-button"
              >注册</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import axios from "axios";

export default {
  computed: {
    ...mapState({
      registerForm: (state) => state.registerForm,
    }),
  },
  data() {
    return {
      passwordFieldType: "password",
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9]{4,26}$/,
            message: "用户名4-26位，仅包含字母和数字",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,20}$/,
            message: "密码8-20位，包含大写字母、小写字母、数字和特殊符号",
            trigger: "blur",
          },
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1\d{10}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    ...mapMutations({
      setRegisterForm: "SET_REGISTER_FORM",
    }),

    togglePasswordVisibility() {
      this.passwordFieldType =
        this.passwordFieldType === "password" ? "text" : "password";
    },

    async handleRegister() {
      this.$refs.registerFormRef.validate(async (valid) => {
        if (valid) {
          try {
            // 构造请求体，将注册数据作为参数传递
            const response = await axios({
              method: "post",
              url: "/api/user/register",
              data: {
                username: this.registerForm.username,
                password: this.registerForm.password,
                phone: this.registerForm.phone,
              },
              headers: {
                "Content-Type": "application/json",
              },
            });

            if (response.data.code === 200) {
              this.$message.success("注册成功");
              setTimeout(() => {
                this.$router.push("/login");
              }, 1000);
            } else {
              this.$message.error(response.data.message || "注册失败");
            }
          } catch (error) {
            console.error("注册错误:", error);
            this.$message.error(
              error.response?.data?.message || "注册失败，请稍后重试"
            );
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.register-page {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;
  margin: 0;
  padding: 20px;
  /* background-image: url("../assets/reg1.jpg"); */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px;
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

.register-card {
  width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.04) !important;
  border: 1px solid rgba(2, 166, 181, 0.3) !important;
  box-shadow: 0 0 20px rgba(2, 166, 181, 0.1);
  border-radius: 4px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  animation: fadeInUp 1s ease;
}

.register-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 25px rgba(2, 166, 181, 0.2);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.register-title {
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

.register-form {
  width: 100%;
}

.login-link {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.login-link a {
  color: rgba(2, 166, 181, 0.8);
  cursor: pointer;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
}

.login-link a:hover {
  color: #68f1fa;
  text-shadow: 0 0 5px rgba(2, 166, 181, 0.5);
}

.register-button {
  width: 100%;
  height: 40px;
  background: linear-gradient(135deg, rgba(2, 166, 181, 0.7), rgba(0, 78, 146, 0.7));
  border: 1px solid rgba(2, 166, 181, 0.3) !important;
  color: #fff !important;
  font-size: 16px;
  transition: all 0.3s ease;
}

.register-button:hover {
  background: linear-gradient(135deg, rgba(2, 166, 181, 0.9), rgba(0, 78, 146, 0.9));
  box-shadow: 0 0 15px rgba(2, 166, 181, 0.3);
  transform: translateY(-2px);
}

.custom-input {
  margin-bottom: 15px;
}

.custom-input :deep(.el-input__inner) {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(2, 166, 181, 0.3) !important;
  color: #fff !important;
  height: 40px;
  line-height: 40px;
  transition: all 0.3s ease;
}

/* 修改 placeholder 的颜色 */
.custom-input :deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.3) !important;
  font-size: 14px;
}

/* 兼容 Firefox */
.custom-input :deep(.el-input__inner::-moz-placeholder) {
  color: rgba(255, 255, 255, 0.3) !important;
  font-size: 14px;
}

/* 兼容 Edge */
.custom-input :deep(.el-input__inner::-ms-input-placeholder) {
  color: rgba(255, 255, 255, 0.3) !important;
  font-size: 14px;
}

/* 兼容 Chrome, Safari */
.custom-input :deep(.el-input__inner::-webkit-input-placeholder) {
  color: rgba(255, 255, 255, 0.3) !important;
  font-size: 14px;
}

.custom-input :deep(.el-input__inner):focus {
  border-color: rgba(2, 166, 181, 0.8) !important;
  box-shadow: 0 0 10px rgba(2, 166, 181, 0.5);
}

.custom-input :deep(.el-input__prefix),
.custom-input :deep(.el-input__suffix) {
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
