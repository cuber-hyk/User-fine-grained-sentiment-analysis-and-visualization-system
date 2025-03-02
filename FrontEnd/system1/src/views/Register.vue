<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-card">
        <h2 class="register-title">Here Sign Up</h2>
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
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url("../assets/reg1.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px;
}

.register-card {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  padding: 40px;
  text-align: center;
  animation: fadeInUp 1s ease;
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
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

.register-form {
  width: 320px;
  margin: 0 auto;
}

.custom-input ::placeholder {
  color: rgba(128, 128, 128, 0.525) !important;
}

.login-link {
  text-align: right;
  margin-bottom: 15px;
}

.login-link a {
  color: #007bff;
  text-decoration: none;
  font-size: 14px;
}

.login-link a:hover {
  text-decoration: underline;
}

.register-button {
  width: 100%;
  height: 48px;
  line-height: 24px;
  border-radius: 24px;
  background: linear-gradient(135deg, #00eaffce, #0983caaf);
  color: white;
  font-weight: bold;
  font-size: 16px;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.4);
}

.register-button:hover {
  background: linear-gradient(135deg, #0092b3e5, #003f7f);
  box-shadow: 0 6px 12px rgba(0, 86, 179, 0.6);
}

.custom-input :deep(.el-input__inner) {
  color: rgba(0, 0, 0, 0.616) !important;
}
</style>
