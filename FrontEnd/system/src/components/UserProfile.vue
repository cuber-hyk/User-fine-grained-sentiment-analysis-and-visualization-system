<template>
  <div class="user-info-container" :class="`theme-${currentTheme}`">
    <div class="overlay" @click="closeProfile"></div>
    <div class="user-sidebar">
      <!-- 侧边栏头部 -->
      <div class="sidebar-header">
        <i class="el-icon-close close-icon" @click="closeProfile"></i>
        <h3 class="sidebar-title">个人中心</h3>
      </div>

      <!-- 用户头像和用户名 -->
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
        <div class="username-display">
          {{ user.username }}
        </div>
      </div>

      <!-- 侧边栏导航菜单 -->
      <div class="sidebar-menu">
        <div 
          class="menu-item" 
          :class="{ active: activeMenu === 'basic' }" 
          @click="activeMenu = 'basic'"
        >
          <i class="el-icon-user"></i>
          <span>基本信息</span>
        </div>
        <div 
          class="menu-item" 
          :class="{ active: activeMenu === 'favorites' }" 
          @click="activeMenu = 'favorites'"
        >
          <i class="el-icon-star-on"></i>
          <span>我的收藏</span>
        </div>
        <div 
          class="menu-item" 
          :class="{ active: activeMenu === 'password' }" 
          @click="activeMenu = 'password'"
        >
          <i class="el-icon-lock"></i>
          <span>修改密码</span>
        </div>
        <div 
          class="menu-item" 
          :class="{ active: activeMenu === 'phone' }" 
          @click="activeMenu = 'phone'"
        >
          <i class="el-icon-mobile-phone"></i>
          <span>修改手机号</span>
        </div>
        <div 
          class="menu-item" 
          :class="{ active: activeMenu === 'theme' }" 
          @click="activeMenu = 'theme'"
        >
          <i class="el-icon-brush"></i>
          <span>主题设置</span>
        </div>
      </div>

      <!-- 退出登录按钮 -->
      <div class="logout-button">
        <el-button type="danger" @click="handleLogout" size="medium" icon="el-icon-switch-button">
          退出登录
        </el-button>
      </div>
    </div>

    <!-- 右侧内容区域 -->
    <div class="content-area">
      <!-- 基本信息内容 -->
      <div v-show="activeMenu === 'basic'" class="content-panel">
        <h3 class="panel-title">基本信息</h3>
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
        
        <!-- 操作按钮 -->
        <div class="action-buttons">
          <el-button
            :type="isEditing ? 'warning' : 'primary'"
            @click="toggleEditMode"
          >
            {{ isEditing ? "取消编辑" : "编辑信息" }}
          </el-button>
        </div>
      </div>

      <!-- 修改密码内容 -->
      <div v-show="activeMenu === 'password'" class="content-panel">
        <h3 class="panel-title">修改密码</h3>
        <el-form :model="passwordForm" label-width="80px">
          <el-form-item label="原密码" required>
            <el-input v-model="passwordForm.oldPassword" type="password" show-password />
          </el-form-item>
          <el-form-item label="新密码" required>
            <el-input v-model="passwordForm.newPassword" type="password" show-password />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handlePasswordUpdate">确认修改</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 修改手机号内容 -->
      <div v-show="activeMenu === 'phone'" class="content-panel">
        <h3 class="panel-title">修改手机号</h3>
        <el-form :model="phoneForm" label-width="100px">
          <el-form-item label="原手机号" required>
            <el-input 
              v-model="phoneForm.oldPhone"
              placeholder="请输入原手机号"
              clearable
            />
          </el-form-item>
          <el-form-item label="新手机号" required>
            <el-input
              v-model="phoneForm.newPhone"
              placeholder="请输入新手机号"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handlePhoneUpdate">确认修改</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 我的收藏内容 -->
      <div v-show="activeMenu === 'favorites'" class="content-panel">
        <h3 class="panel-title">我的收藏</h3>
        <div v-if="favorites.length > 0" class="favorites-list">
          <el-card v-for="item in favorites" :key="item.pid" class="favorite-item">
            <div class="favorite-content">
              <div class="favorite-image">
                <el-image :src="item.image_url" fit="cover">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
              <div class="favorite-info">
                <h4 class="favorite-name">{{ item.name }}</h4>
                <div class="favorite-price">
                  <span class="discount-price">{{ item.discount_price }}</span>
                  <span v-if="item.normal_price !== item.discount_price" class="normal-price">{{ item.normal_price }}</span>
                </div>
                <div class="favorite-rating">
                  <i class="el-icon-star-on"></i>
                  <span>{{ item.stars }}</span>
                </div>
              </div>
              <div class="favorite-actions">
                <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="removeFromFavorites(item.pid)"></el-button>
                <el-button type="primary" size="mini" icon="el-icon-view" circle @click="viewProductDetails(item)"></el-button>
              </div>
            </div>
          </el-card>
        </div>
        <el-empty v-else description="暂无收藏商品"></el-empty>
      </div>
      
      <!-- 主题设置内容 -->
      <div v-show="activeMenu === 'theme'" class="content-panel">
        <h3 class="panel-title">主题设置</h3>
        <div class="theme-options">
          <div 
            class="theme-option" 
            :class="{ active: currentTheme === 'default' }" 
            @click="switchTheme('default')"
          >
            <div class="theme-preview default-theme"></div>
            <span class="theme-name">默认主题</span>
          </div>
          <div 
            class="theme-option" 
            :class="{ active: currentTheme === 'home' }" 
            @click="switchTheme('home')"
          >
            <div class="theme-preview home-theme"></div>
            <span class="theme-name">主页风格</span>
          </div>
        </div>
        <div class="theme-description">
          <p>当前主题: <span class="theme-current">{{ currentTheme === 'default' ? '默认主题' : '主页风格' }}</span></p>
          <p class="theme-tip">点击上方主题卡片可切换个人中心的显示风格</p>
        </div>
      </div>
    </div>

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
</template>

<script>
import axios from "axios";
import { mapState, mapActions } from "vuex";
import ModifyPhoneDialog from "../components/ModifyPhoneDialog.vue";
import ModifyPasswordDialog from "../components/ModifyPasswordDialog.vue";

export default {
  name: 'UserProfile',
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
      activeMenu: 'basic', // 当前激活的菜单项
      currentTheme: 'default', // 当前主题，默认为默认主题
      editForm: {
        username: "",
      },
      passwordForm: {
        oldPassword: "",
        newPassword: "",
      },
      phoneForm: {
        oldPhone: "",
        newPhone: "",
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
    favorites() {
      return this.$store.state.favorites.favorites;
    }
  },
  created() {
    this.getUserInfo();
    
    // 从本地存储读取主题设置
    const savedTheme = localStorage.getItem('userProfileTheme');
    if (savedTheme) {
      this.currentTheme = savedTheme;
    }
  },
  methods: {
    ...mapActions(['removeFromFavorites', 'fetchProductDetails']),
    
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

    async handlePasswordUpdate() {
      // 如果是从侧边栏直接修改密码
      if (this.activeMenu === 'password') {
        const phoneReg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,20}$/;
        
        if (!this.passwordForm.oldPassword) {
          this.$message.warning("请输入原密码");
          return;
        }
        if (this.passwordForm.oldPassword !== this.user.password) {
          this.$message.warning("原密码输入错误");
          return;
        }
        if (!this.passwordForm.newPassword) {
          this.$message.warning("请输入新密码");
          return;
        }
        if (!phoneReg.test(this.passwordForm.newPassword)) {
          this.$message.warning("新密码需 8 到 20 位，包含数字、大写字母、小写字母和特殊符号至少各一位");
          return;
        }
        if (this.passwordForm.newPassword === this.passwordForm.oldPassword) {
          this.$message.warning("新密码不能与原密码相同");
          return;
        }

        try {
          const response = await this.$store.dispatch('updateUserInfo', {
            userId: this.user.userId,
            password: this.passwordForm.newPassword,
            oldPassword: this.passwordForm.oldPassword
          });

          if (response.code === 200) {
            this.$message.success("密码修改成功");
            this.passwordForm.oldPassword = "";
            this.passwordForm.newPassword = "";
          } else {
            this.$message.error(response.message || "密码修改失败");
          }
        } catch (error) {
          console.error('密码修改请求出错:', error);
          this.$message.error("请求出错，请稍后重试");
        }
      } else {
        // 从对话框修改密码的原有逻辑
        this.$message.success("密码修改成功");
        this.showPasswordModify = false;
      }
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
    // 处理手机号更新
    async handlePhoneUpdate(data) {
      // 如果是从侧边栏直接修改手机号
      if (this.activeMenu === 'phone') {
        const phoneReg = /^1[3-9]\d{9}$/;

        if (!phoneReg.test(this.phoneForm.oldPhone)) {
          this.$message.warning("原手机号格式错误");
          return;
        }

        if (!phoneReg.test(this.phoneForm.newPhone)) {
          this.$message.warning("新手机号格式错误");
          return;
        }

        if (this.phoneForm.oldPhone === this.phoneForm.newPhone) {
          this.$message.warning("新手机号不能与原手机号相同");
          return;
        }

        try {
          const response = await this.$store.dispatch('updateUserPhone', {
            phone: this.phoneForm.newPhone
          });

          if (response.code === 200) {
            this.$message.success("手机号修改成功");
            this.phoneForm.oldPhone = "";
            this.phoneForm.newPhone = "";
          } else {
            this.$message.error(response.message || "手机号修改失败");
          }
        } catch (error) {
          console.error('手机号修改请求出错:', error);
          this.$message.error("请求出错，请稍后重试");
        }
      } else {
        // 从对话框修改手机号的原有逻辑
        if (data && data.newPhone) {
          this.user.phone = data.newPhone;
          this.$message.success("手机号修改成功");
        }
        this.showPhoneModify = false;
      }
    },
    
    // 切换主题
    switchTheme(theme) {
      if (this.currentTheme === theme) return;
      
      this.currentTheme = theme;
      
      // 保存用户主题偏好到本地存储
      localStorage.setItem('userProfileTheme', theme);
      
      this.$message.success(`已切换到${theme === 'default' ? '默认主题' : '主页风格'}`);
    },
  },
};
</script>

<style scoped>
.user-info-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  z-index: 999;
}

/* 收藏列表样式 */
.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 10px;
}

.favorite-item {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.favorite-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.favorite-content {
  display: flex;
  align-items: center;
}

.favorite-image {
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: 4px;
  margin-right: 15px;
}

.favorite-image .el-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.favorite-info {
  flex: 1;
}

.favorite-name {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.favorite-price {
  margin-bottom: 5px;
}

.discount-price {
  color: #F56C6C;
  font-weight: bold;
  font-size: 16px;
}

.normal-price {
  text-decoration: line-through;
  color: #909399;
  margin-left: 8px;
  font-size: 14px;
}

.favorite-rating {
  display: flex;
  align-items: center;
  color: #E6A23C;
}

.favorite-rating i {
  margin-right: 5px;
}

.favorite-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
}

/* 侧边栏样式 */
.user-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100%;
  background-color: #2c3e50;
  color: #fff;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  animation: slideInLeft 0.3s ease;
  transition: background-color 0.3s ease;
}

/* 主页风格主题 - 侧边栏 */
.user-info-container[class*="theme-home"] .user-sidebar {
  background: linear-gradient(135deg, #000428 0%, #004e92 100%);
  border-right: 1px solid rgba(2, 166, 181, 0.3);
}

/* 侧边栏头部 */
.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 主页风格主题 - 侧边栏头部 */
.user-info-container[class*="theme-home"] .sidebar-header {
  border-bottom: 1px solid rgba(2, 166, 181, 0.3);
  background: linear-gradient(
    90deg,
    rgba(2, 166, 181, 0.1) 0%,
    rgba(2, 166, 181, 0.2) 50%,
    rgba(2, 166, 181, 0.1) 100%
  );
}

.sidebar-title {
  font-size: 18px;
  margin: 0;
  color: #fff;
  text-align: center;
}

/* 主页风格主题 - 侧边栏标题 */
.user-info-container[class*="theme-home"] .sidebar-title {
  text-shadow: 0 0 15px rgba(2, 166, 181, 0.5);
}

.close-icon {
  position: absolute;
  top: 20px;
  right: 20px;
  color: #fff;
  transition: all 0.3s;
  cursor: pointer;
}

.close-icon:hover {
  transform: rotate(90deg);
  color: #409eff;
}

/* 主页风格主题 - 关闭图标 */
.user-info-container[class*="theme-home"] .close-icon:hover {
  color: #02a6b5;
}

/* 用户头像和用户名 */
.user-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* 主页风格主题 - 用户头部 */
.user-info-container[class*="theme-home"] .user-header {
  border-bottom: 1px solid rgba(2, 166, 181, 0.3);
}

.avatar-wrapper {
  position: relative;
  margin-bottom: 15px;
  padding-bottom: 25px;
}

.avatar-uploader {
  cursor: pointer;
  position: relative;
}

.user-avatar {
  border: 2px solid #409eff;
  background: #f0f2f5;
}

/* 主页风格主题 - 用户头像 */
.user-info-container[class*="theme-home"] .user-avatar {
  border: 2px solid #02a6b5;
}

.avatar-edit-hint {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  color: #409eff;
  font-size: 13px;
  cursor: pointer;
  transition: color 0.3s;
  white-space: nowrap;
  line-height: 1.5;
}

/* 主页风格主题 - 头像编辑提示 */
.user-info-container[class*="theme-home"] .avatar-edit-hint {
  color: #02a6b5;
}

.avatar-edit-hint:hover {
  color: #66b1ff;
}

/* 主页风格主题 - 头像编辑提示悬停 */
.user-info-container[class*="theme-home"] .avatar-edit-hint:hover {
  color: #68f1fa;
}

.username-display {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  margin-top: 5px;
}

/* 主页风格主题 - 用户名显示 */
.user-info-container[class*="theme-home"] .username-display {
  text-shadow: 0 0 10px rgba(2, 166, 181, 0.5);
}

/* 侧边栏菜单 */
.sidebar-menu {
  flex: 1;
  padding: 20px 0;
}

.menu-item {
  padding: 15px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  border-left: 3px solid transparent;
}

.menu-item i {
  margin-right: 10px;
  font-size: 18px;
}

.menu-item:hover {
  background-color: rgba(64, 158, 255, 0.1);
  border-left-color: #409eff;
}

/* 主页风格主题 - 菜单项悬停 */
.user-info-container[class*="theme-home"] .menu-item:hover {
  background-color: rgba(2, 166, 181, 0.1);
  border-left-color: #02a6b5;
}

.menu-item.active {
  background-color: rgba(64, 158, 255, 0.2);
  border-left-color: #409eff;
  color: #409eff;
}

/* 主页风格主题 - 活动菜单项 */
.user-info-container[class*="theme-home"] .menu-item.active {
  background-color: rgba(2, 166, 181, 0.2);
  border-left-color: #02a6b5;
  color: #02a6b5;
}

/* 退出登录按钮 */
.logout-button {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

/* 主页风格主题 - 退出登录按钮 */
.user-info-container[class*="theme-home"] .logout-button {
  border-top: 1px solid rgba(2, 166, 181, 0.3);
}

/* 内容区域 */
.content-area {
  position: fixed;
  top: 0;
  left: 250px;
  width: calc(100% - 250px);
  height: 100%;
  background-color: #f5f7fa;
  padding: 30px;
  overflow-y: auto;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
  transition: background-color 0.3s ease;
}

/* 主页风格主题 - 内容区域 */
.user-info-container[class*="theme-home"] .content-area {
  background: linear-gradient(135deg, #000428 0%, #004e92 100%);
  color: #ffffff;
}

.content-panel {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

/* 主页风格主题 - 内容面板 */
.user-info-container[class*="theme-home"] .content-panel {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(2, 166, 181, 0.3);
  backdrop-filter: blur(10px);
  box-shadow: 0 0 20px rgba(2, 166, 181, 0.1);
  position: relative;
}

/* 主页风格主题 - 内容面板装饰 */
.user-info-container[class*="theme-home"] .content-panel::before,
.user-info-container[class*="theme-home"] .content-panel::after {
  content: '';
  position: absolute;
  width: 15px;
  height: 15px;
}

.user-info-container[class*="theme-home"] .content-panel::before {
  top: -2px;
  left: -2px;
  border-top: 2px solid #02a6b5;
  border-left: 2px solid #02a6b5;
}

.user-info-container[class*="theme-home"] .content-panel::after {
  bottom: -2px;
  right: -2px;
  border-bottom: 2px solid #02a6b5;
  border-right: 2px solid #02a6b5;
}

.panel-title {
  margin-top: 0;
  margin-bottom: 20px;
  color: #409eff;
  font-size: 18px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

/* 主页风格主题 - 面板标题 */
.user-info-container[class*="theme-home"] .panel-title {
  color: #fff;
  text-shadow: 0 0 15px rgba(2, 166, 181, 0.5);
  border-bottom: 1px solid rgba(2, 166, 181, 0.3);
}

/* 表单样式 */
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

/* 主页风格主题 - 编辑图标 */
.user-info-container[class*="theme-home"] .edit-icon {
  color: #02a6b5;
}

.user-info-container[class*="theme-home"] .edit-icon:hover {
  color: #68f1fa;
}

.action-buttons {
  margin-top: 24px;
  display: flex;
  justify-content: flex-start;
  gap: 16px;
}

/* 输入框样式 */
.content-panel ::v-deep .el-input__inner {
  color: #666 !important;
  background-color: #f8f9fa;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 8px 12px;
  transition: all 0.3s;
}

.content-panel ::v-deep .el-input.is-active .el-input__inner {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

/* 主页风格主题 - 输入框 */
.user-info-container[class*="theme-home"] .content-panel ::v-deep .el-input__inner {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(2, 166, 181, 0.3) !important;
  color: #fff !important;
}

.user-info-container[class*="theme-home"] .content-panel ::v-deep .el-input.is-active .el-input__inner {
  border-color: #02a6b5 !important;
  box-shadow: 0 0 0 2px rgba(2, 166, 181, 0.1);
}

/* 主题设置样式 */
.theme-options {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.theme-option {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  width: 120px;
}

.theme-option:hover {
  transform: translateY(-5px);
}

.theme-option.active {
  border-color: #409eff;
}

/* 主页风格主题 - 主题选项激活 */
.user-info-container[class*="theme-home"] .theme-option.active {
  border-color: #02a6b5;
}

.theme-preview {
  height: 80px;
  width: 100%;
}

.default-theme {
  background-color: #2c3e50;
  position: relative;
}

.default-theme::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.1) 20%, transparent 20%);
}

.home-theme {
  background: linear-gradient(135deg, #000428 0%, #004e92 100%);
  position: relative;
}

.home-theme::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 35%, rgba(2, 166, 181, 0.2) 0%, transparent 25%),
    radial-gradient(circle at 75% 65%, rgba(2, 166, 181, 0.2) 0%, transparent 25%);
}

.theme-name {
  display: block;
  text-align: center;
  padding: 8px 0;
  background-color: #f5f7fa;
  color: #333;
  font-size: 14px;
}

/* 主页风格主题 - 主题名称 */
.user-info-container[class*="theme-home"] .theme-name {
  background-color: rgba(2, 166, 181, 0.1);
  color: #fff;
}

.theme-description {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #409eff;
}

/* 主页风格主题 - 主题描述 */
.user-info-container[class*="theme-home"] .theme-description {
  background-color: rgba(2, 166, 181, 0.1);
  border-left: 4px solid #02a6b5;
}

.theme-current {
  font-weight: bold;
  color: #409eff;
}

/* 主页风格主题 - 当前主题 */
.user-info-container[class*="theme-home"] .theme-current {
  color: #02a6b5;
  text-shadow: 0 0 10px rgba(2, 166, 181, 0.5);
}

.theme-tip {
  margin-top: 10px;
  font-size: 13px;
  color: #909399;
}

/* 主页风格主题 - 主题提示 */
.user-info-container[class*="theme-home"] .theme-tip {
  color: rgba(255, 255, 255, 0.7);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .user-sidebar {
    width: 200px;
  }
  .content-area {
    left: 200px;
    width: calc(100% - 200px);
  }
  .theme-options {
    flex-direction: column;
    align-items: center;
  }
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

/* 动画效果 */
@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>