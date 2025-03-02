<template>
  <div class="user-info-container">
    <div class="overlay" @click="closeProfile"></div>
    <div class="user-modal">
      <el-card class="user-card">
        <i class="el-icon-close close-icon" @click="closeProfile"></i>

        <!-- 用户头像 -->
        <div class="user-header">
          <div class="avatar-wrapper">
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :disabled="!isEditing"
              :headers="uploadHeaders"
            >
              <el-avatar :size="80" :src="user.icon" class="user-avatar">
                {{ user.username?.charAt(0).toUpperCase() || "U" }}
              </el-avatar>
              <div
                v-if="isEditing"
                class="avatar-edit-hint"
                @click.stop="triggerAvatarUpload"
              >
                修改头像
              </div>
            </el-upload>
          </div>
        </div>

        <!-- 用户信息表格 -->
        <el-descriptions :column="1" border>
          <el-descriptions-item label="用户名">
            <div class="username-edit-wrapper">
              <span v-if="!isEditingUsername">{{ user.username }}</span>
              <el-input
                v-else
                ref="usernameInput"
                v-model="editForm.username"
                class="edit-input"
                @blur="saveUsername"
              />
              <i
                v-show="isEditing && !isEditingUsername"
                class="el-icon-edit edit-icon"
                @click="startEditUsername"
              ></i>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="手机号">
            <div class="phone-edit-wrapper">
              <span class="phone-number">{{ maskedPhone }}</span>
              <i
                v-show="isEditing"
                class="el-icon-edit edit-icon"
                @click="showPhoneDialog"
              ></i>
            </div>
          </el-descriptions-item>
        </el-descriptions>

        <!-- 修改密码区域 -->
        <div v-show="isEditing" class="password-modify-area">
          <el-button type="text" class="modify-btn" @click="showPasswordDialog">
            <span>修改密码</span>
          </el-button>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <el-button
            :type="isEditing ? 'warning' : 'primary'"
            @click="toggleEditMode"
          >
            {{ isEditing ? "取消编辑" : "编辑信息" }}
          </el-button>
          <!-- 独立的退出登录按钮 -->
          <el-button type="danger" @click="handleLogout"> 退出登录 </el-button>
        </div>
      </el-card>

      <!-- 修改手机号对话框 -->
      <modify-phone-dialog
        :visible="showPhoneModify"
        @close="showPhoneModify = false"
        @confirm="handlePhoneUpdate"
      />

      <!-- 修改密码对话框 -->
      <modify-password-dialog
        :visible.sync="showPasswordModify"
        @close="showPasswordModify = false"
        @confirm="handlePasswordUpdate"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import ModifyPhoneDialog from "../components/ModifyPhoneDialog.vue";
import ModifyPasswordDialog from "../components/ModifyPasswordDialog.vue";

export default {
  components: {
    ModifyPhoneDialog,
    ModifyPasswordDialog,
  },
  data() {
    return {
      isEditing: false,
      isEditingUsername: false,
      showPhoneModify: false,
      showPasswordModify: false,
      editForm: {
        username: "",
      },
      uploadUrl: process.env.VUE_APP_BASE_API + "/api/upload",
    };
  },
  computed: {
    ...mapState(["user"]),
    maskedPhone() {
      return this.user.phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
    },
    uploadHeaders() {
      return { Authorization: `Bearer ${this.user.token}` };
    },
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    async getUserInfo() {
      try {
        console.log("开始获取用户信息");
        console.log("当前用户状态:", JSON.stringify(this.user));
        
        // 检查是否有用户token
        if (!this.user.token) {
          this.$message.error("用户未登录，请先登录");
          return;
        }

        // 检查是否有用户ID
        if (!this.user.userId) {
          this.$message.error("用户ID不存在，无法获取用户信息");
          return;
        }

        // 构建请求参数，确保id为整数类型
        const formData = new URLSearchParams();
        formData.append("id", parseInt(this.user.userId, 10));

        console.log("请求参数:", formData.toString());
        console.log("请求头:", {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${this.user.token}`,
        });

        // 发送请求
        const res = await axios.post("/api/user/getUser", formData, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${this.user.token}`,
          },
        });

        console.log("获取用户信息响应状态:", res.status);
        console.log("获取用户信息响应数据:", res.data);
        
        // 检查响应数据
        if (res.status === 200) {
          if (res.data) {
            // 更新用户信息
            const updatedUser = { 
              ...this.user,
              // 确保使用正确的字段名称
              username: res.data.username || this.user.username,
              phone: res.data.phone || this.user.phone || '',
              icon: res.data.icon || this.user.icon || '',
              createTime: res.data.createTime,
              updateTime: res.data.updateTime
            };
            
            console.log("更新后的用户信息:", updatedUser);
            
            // 使用Vuex更新用户信息
            this.$store.commit('SET_USER', updatedUser);
            
            // 更新本地状态
            this.editForm.username = updatedUser.username;
            
            this.$message.success("获取用户信息成功");
          } else {
            console.warn("响应成功但数据为空");
            this.$message.warning("获取用户信息成功，但数据为空");
          }
        } else {
          throw new Error(`请求状态码异常: ${res.status}`);
        }
      } catch (error) {
        console.error("获取用户信息失败:", error);
        
        // 提供更详细的错误信息
        if (error.response) {
          console.error("错误响应:", error.response);
          this.$message.error(`获取用户信息失败: ${error.response.status} - ${error.response.data?.message || "未知错误"}`);
        } else if (error.request) {
          console.error("请求未收到响应:", error.request);
          this.$message.error("服务器无响应，请检查网络连接");
        } else {
          console.error("请求配置错误:", error.message);
          this.$message.error(`请求错误: ${error.message}`);
        }
      }
    },

    toggleEditMode() {
      this.isEditing = !this.isEditing;
      if (!this.isEditing) {
        this.isEditingUsername = false;
        this.editForm.username = this.user.username;
      }
    },

    startEditUsername() {
      this.isEditingUsername = true;
      this.$nextTick(() => {
        this.$refs.usernameInput.focus();
      });
    },

    saveUsername() {
      if (this.editForm.username.trim()) {
        this.user.username = this.editForm.username;
      }
      this.isEditingUsername = false;
    },

    beforeAvatarUpload(file) {
      const isImage = file.type.startsWith("image/");
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isImage) {
        this.$message.error("只能上传图片文件");
      }
      if (!isLt2M) {
        this.$message.error("头像大小不能超过2MB");
      }

      return isImage && isLt2M;
    },

    closeProfile() {
      this.$emit("close");
    },

    triggerAvatarUpload() {
      document.querySelector(".avatar-uploader .el-upload__input").click();
    },

    showPhoneDialog() {
      this.showPhoneModify = true;
    },

    showPasswordDialog() {
      this.showPasswordModify = true;
    },

    handlePasswordUpdate() {
      this.$message.success("密码修改成功");
      this.showPasswordModify = false;
    },

    handleLogout() {
      console.log("1. 点击退出按钮");
      this.$confirm("确定要退出登录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false,
      })
        .then(() => {
          console.log("2. 用户确认退出");
          return this.$store.dispatch("logout");
        })
        .then(() => {
          console.log("3. 退出成功");
          this.closeProfile(); // 关闭用户信息弹窗
          // 处理路由跳转错误
          this.$router.push("/").catch((error) => {
            if (error.name === "NavigationDuplicated") {
              // 忽略路由重复跳转错误
              return;
            }
            console.error("路由跳转错误:", error);
          });
        })
        .catch((err) => {
          if (err !== "cancel") {
            console.error("退出错误:", err);
          }
        });
    },
    // 简化头像上传成功处理，仅提示成功
    handleAvatarSuccess(response) {
      if (response.code === 0 && response.data.url) {
        this.user.icon = response.data.url;
        this.$message.success("头像上传成功");
      } else {
        this.$message.error(response.message || "头像上传失败");
      }
    },
    // 简化手机号更新处理，仅提示成功
    handlePhoneUpdate(newPhone) {
      this.user.phone = newPhone;
      this.$message.success("手机号修改成功");
      this.showPhoneModify = false;
    },
  },
};
</script>

<style scoped>
/* 样式部分保持不变 */
.user-info-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  z-index: 999;
}

.user-modal {
  position: fixed;
  top: 100px;
  right: 20px;
  width: 300px;
  background-color: #fff;
  animation: slideIn 0.3s ease;
  z-index: 1000;
}

.close-icon {
  position: absolute;
  top: 15px;
  right: 15px;
  transition: all 0.3s;
}
.close-icon:hover {
  transform: rotate(90deg);
}
.user-card {
  background-color: #f5f7fa;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.user-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding: 24px;
  position: relative;
  margin: 20px 0;
  text-align: center;
}

.avatar-uploader {
  cursor: pointer;
  position: relative;
}

.user-avatar {
  border: 2px solid #409eff;
  background: #f0f2f5;
}

.avatar-edit-hint {
  position: absolute;
  bottom: -15px; /* 调整与头像的距离 */
  left: 0;
  right: 0;
  text-align: center;
  color: #409eff;
  font-size: 13px;
  cursor: pointer;
  transition: color 0.3s;
  white-space: nowrap; /* 防止文字换行 */
  line-height: 1.5;
  padding-top: 8px; /* 增加文字与头像的间距 */
}

/* 头像容器添加底部内边距 */
.avatar-wrapper {
  position: relative;
  margin-right: 20px;
  padding-bottom: 25px; /* 为提示文字预留空间 */
  display: inline-block;
  margin: 0 auto; /* 水平居中 */
}
.avatar-edit-hint:hover {
  color: #337ecc;
}

.username-edit-wrapper,
.phone-edit-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.edit-icon {
  color: #409eff;
  cursor: pointer;
  transition: color 0.3s;
}

.edit-icon:hover {
  color: #337ecc;
}
@media (max-width: 768px) {
  .user-modal {
    width: 90%;
    right: 5%;
  }
}
.action-buttons {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  gap: 32px;
}

/* 输入框样式 */
.user-card ::v-deep .el-input__inner {
  color: #666 !important;
  background-color: #f8f9fa;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 8px 12px;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.user-card ::v-deep .el-input.is-active .el-input__inner {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}
@media (max-width: 640px) {
  .username-edit-wrapper,
  .phone-edit-wrapper {
    flex-direction: column;
    align-items: flex-start;
  }
  .edit-icon {
    margin-left: 0;
    margin-top: 8px;
  }
}
.modify-btn > span {
  margin-right: 0px;
}
.password-modify-area {
  padding: 0 24px;
  text-align: right; /* 核心右对齐设置 */
}
/* 按钮样式优化 */
.modify-btn {
  padding: 0;
  color: #409eff;
  transition: color 0.3s;
}
.modify-btn:hover {
  color: #337ecc;
  padding-right: 0;
}
/* 文字间距调整 */
.modify-btn span {
  letter-spacing: 0.5px;
  display: inline-block;
  padding-right: 4px;
}
</style>