<template>
  <div class="user-info-container" :class="`theme-${currentTheme}`">
    <div class="overlay" @click="closeProfile"></div>
    <div class="user-sidebar">
      <!-- 侧边栏头部：只保留标题和关闭按钮 -->
      <div class="sidebar-header">
        <i class="el-icon-close close-icon" @click="closeProfile"></i>
        <h3 class="sidebar-title">个人中心</h3>
      </div>

      <!-- 用户头像和用户名区域 (在侧边栏显示) -->
      <div class="sidebar-user-info">
         <el-avatar :size="60" :src="getAvatarUrl(user.icon)" class="sidebar-avatar">
           {{ user.username?.charAt(0).toUpperCase() || "U" }}
         </el-avatar>
         <span class="sidebar-username">{{ user.username }}</span>
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
      <div v-show="activeMenu === 'basic'" class="content-panel basic-info-panel">
        <h3 class="panel-title">基本信息</h3>

        <!-- 用户信息概览区域 -->
        <div class="user-overview">
          <div class="avatar-display-wrapper">
             <el-upload
               action="#"
               :show-file-list="false"
               :before-upload="beforeAvatarUpload"
               :disabled="uploadingAvatar"
             >
               <el-avatar :size="80" :src="getAvatarUrl(user.icon)" class="user-avatar">
                 {{ user.username?.charAt(0).toUpperCase() || "U" }}
               </el-avatar>
               <div
                 v-if="isEditing"
                 class="avatar-edit-hint"
               >
                 <i class="el-icon-camera"></i>
                 <span>{{ uploadingAvatar ? '上传中...' : '点击更换头像' }}</span>
               </div>
             </el-upload>
          </div>
          <div class="user-details-display">
             <el-descriptions :column="1" border>
               <el-descriptions-item label="用户名">
                 <!-- Display mode -->
                 <template v-if="!isEditingUsername">
                    <span>{{ user.username }}</span>
                     <i
                         v-if="isEditing && !isEditingPassword && !isEditingPhone"
                         class="el-icon-edit edit-icon"
                         @click="startEditUsername"
                     ></i>
                 </template>
                 <!-- Editing mode -->
                 <template v-else>
                     <el-input
                       ref="usernameInput"
                       v-model="editForm.username"
                       placeholder="请输入新用户名"
                       size="small"
                       clearable
                       @keyup.enter.native="saveUsername"
                     />
                     <el-button
                         type="primary"
                         size="small"
                         @click="saveUsername"
                         :disabled="editForm.username.trim() === user.username.trim()"
                     >
                         确认修改
                     </el-button>
                      <el-button
                         type="info"
                         size="small"
                         @click="cancelEditUsername"
                     >
                         取消
                     </el-button>
                 </template>
               </el-descriptions-item>
               <el-descriptions-item label="手机号">
                 <span>{{ maskedPhone }}</span>
                  <i
                      v-if="isEditing && !isEditingPassword && !isEditingUsername && !isEditingPhone"
                      class="el-icon-edit edit-icon"
                      @click="startEditPhone"
                  ></i>
               </el-descriptions-item>
             </el-descriptions>
          </div>
        </div>

        <!-- 修改手机号表单 (仅在 isEditingPhone 模式下显示) -->
        <div v-if="isEditingPhone" class="sub-panel-section modify-phone-section">
             <h4 class="sub-panel-title">修改手机号</h4>
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
                  <el-button @click="cancelEditPhone">取消</el-button>
               </el-form-item>
             </el-form>
        </div>

        <!-- 修改密码表单 (仅在修改密码模式下显示) -->
        <div v-if="isEditingPassword" class="sub-panel-section modify-password-section">
             <h4 class="sub-panel-title">修改密码</h4>
             <el-form :model="passwordForm" label-width="80px">
               <el-form-item label="原密码" required>
                 <el-input v-model="passwordForm.oldPassword" type="password" show-password />
               </el-form-item>
               <el-form-item label="新密码" required>
                 <el-input v-model="passwordForm.newPassword" type="password" show-password />
               </el-form-item>
               <el-form-item>
                 <el-button type="primary" @click="handlePasswordUpdate">确认修改</el-button>
                 <el-button @click="cancelPasswordEdit">取消</el-button>
               </el-form-item>
             </el-form>
        </div>

        <!-- Action buttons -->
        <div class="action-buttons">
          <el-button
            v-if="!isEditing && !isEditingPassword && !isEditingUsername && !isEditingPhone"
            type="primary"
            @click="toggleEditMode"
            icon="el-icon-edit"
          >
            编辑信息
          </el-button>
          <el-button
            v-if="!isEditing && !isEditingPassword && !isEditingUsername && !isEditingPhone"
            type="info"
            @click="refreshUserInfo"
            icon="el-icon-refresh"
            :loading="refreshing"
          >
            刷新信息
          </el-button>
           <el-button
             v-if="isEditing && !isEditingPassword && !isEditingUsername && !isEditingPhone"
             type="warning"
             @click="toggleEditMode"
           >
             取消编辑
           </el-button>

           <el-button
               v-if="!isEditing && !isEditingPassword && !isEditingPhone"
               type="default"
               @click="startPasswordEdit"
           >
               修改密码
           </el-button>
        </div>
      </div>

      <!-- 我的收藏内容 -->
      <div v-show="activeMenu === 'favorites'" class="content-panel">
         <h3 class="panel-title">我的收藏</h3>
         
         <!-- 调试信息 -->
         <!-- <div class="debug-info" style="background: rgba(255,255,255,0.1); padding: 10px; margin-bottom: 15px; border-radius: 5px; font-size: 12px;">
           <p>当前用户ID: {{ user.userId }}</p>
           <p>收藏数量: {{ favorites.length }}</p>
           <p>收藏数据: {{ JSON.stringify(favorites) }}</p>
           <el-button size="mini" @click="loadFavorites" style="margin-top: 5px;">手动加载收藏</el-button>
         </div> -->
         
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
                <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="removeFromFavorites({ userId: user.userId, productId: item.pid })"></el-button>
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
            <span class="theme-name">蓝色科技</span>
          </div>
          <div
            class="theme-option"
            :class="{ active: currentTheme === 'light' }"
            @click="switchTheme('light')"
          >
            <div class="theme-preview light-theme"></div>
            <span class="theme-name">明亮简约</span>
          </div>
        </div>
        <div class="theme-description">
          <p>当前主题: <span class="theme-current">{{ currentTheme === 'default' ? '默认主题' : currentTheme === 'home' ? '主页风格' : currentTheme === 'light' ? '明亮简约' : '明亮简约' }}</span></p>
          <p class="theme-tip">点击上方主题卡片可切换个人中心的显示风格</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState, mapActions } from "vuex";

export default {
  name: 'UserProfile',
  components: {
  },
  data() {
    return {
      isEditing: false,
      isEditingPassword: false,
      isEditingUsername: false,
      isEditingPhone: false,
      activeMenu: 'basic',
      currentTheme: 'default',
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
      refreshing: false,
      uploadingAvatar: false,
    };
  },
  computed: {
    ...mapState(["user"]),
    maskedPhone() {
      return this.user.phone ? this.user.phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2") : '';
    },
    uploadHeaders() {
      return { Authorization: `Bearer ${this.user.token}` };
    },
    favorites() {
      return this.$store.state.favorites.favorites || [];
    }
  },
  watch: {
    // 监听用户ID变化，自动加载对应的收藏列表
    'user.userId': {
      handler(newUserId, oldUserId) {
        if (newUserId && newUserId !== oldUserId) {
          console.log('用户ID变化，加载新用户的收藏列表:', newUserId);
          this.$store.dispatch('favorites/loadUserFavorites', newUserId);
        }
      },
      immediate: true
    }
  },
  created() {
    this.getUserInfo();
    
    const savedTheme = localStorage.getItem('userProfileTheme');
    if (savedTheme) {
      this.currentTheme = savedTheme;
    }
    
    this.editForm.username = this.user.username;
    
    // 加载当前用户的收藏列表
    if (this.user.userId) {
      this.$store.dispatch('favorites/loadUserFavorites', this.user.userId);
    }
  },
  methods: {
    ...mapActions(['fetchProductDetails', 'updateUserBasicInfo', 'updateUserPhone', 'updateUserPassword', 'updateUserUsername', 'updateUserIcon']),
    
    // 收藏相关的actions
    removeFromFavorites({ userId, productId }) {
      if (userId) {
        this.$store.dispatch('favorites/removeFromFavorites', { 
          userId, 
          productId 
        });
        this.$message.success('已从收藏中移除');
      }
    },
    
    async getUserInfo() {
      try {
        console.log("开始获取用户信息");
        console.log("当前用户状态:", JSON.stringify(this.user));
        
        if (!this.user.token) {
          this.$message.error("用户未登录，请先登录");
          return;
        }

        if (!this.user.userId) {
          this.$message.error("用户ID不存在，无法获取用户信息");
          return;
        }

        this.$message.info('正在获取用户信息...');

        const formData = new URLSearchParams();
        formData.append("id", parseInt(this.user.userId, 10));

        console.log("请求参数:", formData.toString());
        console.log("请求头:", {
          "Content-Type": "application/x-www-form-urlencoded",
          "token": this.user.token,
        });

        const res = await axios.post("/api/user/getUser", formData, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "token": this.user.token,
          },
        });

        console.log("获取用户信息响应状态:", res.status);
        console.log("获取用户信息响应数据:", res.data);
        
        if (res.status === 200) {
          if (res.data) {
            const updatedUser = { 
              ...this.user,
              username: res.data.username || this.user.username,
              phone: res.data.phone || this.user.phone || '',
              icon: res.data.icon || this.user.icon || '',
              createTime: res.data.createTime,
              updateTime: res.data.updateTime
            };
            
            console.log("更新后的用户信息:", updatedUser);
            
            this.$store.commit('SET_USER', updatedUser);
            
            this.editForm.username = updatedUser.username;
            
            // 重新加载用户的收藏列表
            if (updatedUser.userId) {
              this.$store.dispatch('favorites/loadUserFavorites', updatedUser.userId);
            }
            
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
      if (!this.isEditingPassword && !this.isEditingUsername && !this.isEditingPhone) {
        this.isEditing = !this.isEditing;
        if (!this.isEditing) {
          this.isEditingUsername = false;
          this.isEditingPhone = false;
          this.editForm.username = this.user.username;
          this.phoneForm = { oldPhone: '', newPhone: '' };
        }
      }
    },

    startEditUsername() {
      if (this.isEditing && !this.isEditingPassword && !this.isEditingPhone) {
        this.isEditingUsername = true;
        this.editForm.username = this.user.username;
        this.$nextTick(() => {
          if (this.$refs.usernameInput) {
            this.$refs.usernameInput.focus();
          }
        });
      }
    },

    cancelEditUsername() {
      this.isEditingUsername = false;
      this.editForm.username = this.user.username;
    },

    async saveUsername() {
      if (!this.isEditingUsername) return;

      const newUsername = this.editForm.username.trim();
      if (!newUsername) {
        this.$message.warning("用户名不能为空");
        return;
      }
      if (newUsername === this.user.username.trim()) {
        this.$message.info("用户名未改变");
        this.cancelEditUsername();
        return;
      }

      try {
        this.$message.info('正在更新用户名...');
        
        // 调用用户名更新接口
        const response = await axios.post('/api/user/updateUserUsername', {
          id: this.user.userId,
          newUsername: newUsername
        }, {
          headers: {
            'Content-Type': 'application/json',
            'token': this.user.token
          }
        });

        if (response.data && response.data.code === 200) {
          this.$message.success("用户名更新成功");
          // 更新本地用户信息
          const updatedUser = { ...this.user, username: newUsername };
          this.$store.commit('SET_USER', updatedUser);
          this.cancelEditUsername();
          
          // 自动刷新用户信息，确保数据同步
          await this.refreshUserInfo();
        } else {
          this.$message.error(response.data?.message || "用户名更新失败");
        }
      } catch (error) {
        console.error('用户名更新失败:', error);
        if (error.response) {
          this.$message.error(`用户名更新失败: ${error.response.data?.message || '未知错误'}`);
        } else if (error.request) {
          this.$message.error("服务器无响应，请检查网络连接");
        } else {
          this.$message.error(`请求错误: ${error.message}`);
        }
      }
    },

    startEditPhone() {
      if (this.isEditing && !this.isEditingPassword && !this.isEditingUsername) {
        this.isEditingPhone = true;
        this.phoneForm = { oldPhone: '', newPhone: '' };
      }
    },

    cancelEditPhone() {
      this.isEditingPhone = false;
      this.phoneForm = { oldPhone: '', newPhone: '' };
    },

    async beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('头像只能是 JPG/PNG/GIF 格式!');
        return false;
      }
      if (!isLt2M) {
        this.$message.error('头像大小不能超过 2MB!');
        return false;
      }

      // 显示上传进度
      this.$message.info('开始上传头像...');
      
      // 直接调用头像更新方法
      await this.handleAvatarUpload(file);
      return false; // 阻止默认上传行为
    },

    async handleAvatarUpload(file) {
      try {
        this.uploadingAvatar = true;
        this.$message.info('正在上传头像...');
        
        // 创建 FormData 对象
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', this.user.userId);
        
        // 调用图片上传接口
        const uploadResponse = await axios.post('/api/image/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'token': this.user.token
          }
        });
        
        if (uploadResponse.data && uploadResponse.data.code === 200) {
          const iconUrl = uploadResponse.data.data;
          
          this.$message.info('图片上传成功，正在更新头像...');
          
          // 尝试使用 JSON 格式更新头像
          try {
            const updateResponse = await this.updateUserIconJson(iconUrl);
            if (updateResponse) {
              this.$message.success('头像更新成功');
              // 更新本地用户信息
              const updatedUser = { ...this.user, icon: iconUrl };
              this.$store.commit('SET_USER', updatedUser);
              // 重新获取用户信息
              await this.refreshUserInfo();
              return;
            }
          } catch (jsonError) {
            console.log('JSON格式更新失败，尝试form-urlencoded格式:', jsonError);
            
            // 如果JSON格式失败，尝试form-urlencoded格式
            try {
              const updateResponse = await this.updateUserIconForm(iconUrl);
              if (updateResponse) {
                this.$message.success('头像更新成功');
                // 更新本地用户信息
                const updatedUser = { ...this.user, icon: iconUrl };
                this.$store.commit('SET_USER', updatedUser);
                // 重新获取用户信息
                await this.refreshUserInfo();
                return;
              }
            } catch (formError) {
              console.error('form-urlencoded格式也失败:', formError);
              this.$message.error('头像更新失败，请稍后重试');
            }
          }
        } else {
          this.$message.error(uploadResponse.data?.message || '图片上传失败');
        }
      } catch (error) {
        console.error('头像上传失败:', error);
        if (error.response) {
          this.$message.error(`头像上传失败: ${error.response.data?.message || '未知错误'}`);
        } else {
          this.$message.error('头像上传失败，请检查网络连接');
        }
      } finally {
        this.uploadingAvatar = false;
      }
    },

    // 使用JSON格式更新头像
    async updateUserIconJson(iconUrl) {
      try {
        const response = await axios.post('/api/user/updateUserIcon', {
          iconFile: iconUrl,
          id: this.user.userId
        }, {
          headers: {
            'Content-Type': 'application/json',
            'token': this.user.token
          }
        });
        
        if (response.data && response.data.code === 200) {
          return true;
        } else {
          throw new Error(response.data?.message || '头像更新失败');
        }
      } catch (error) {
        console.error('JSON格式头像更新失败:', error);
        throw error;
      }
    },

    // 使用form-urlencoded格式更新头像
    async updateUserIconForm(iconUrl) {
      try {
        const formData = new URLSearchParams();
        formData.append('iconFile', iconUrl);
        formData.append('id', this.user.userId);
        
        const response = await axios.post('/api/user/updateUserIcon', formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'token': this.user.token
          }
        });
        
        if (response.data && response.data.code === 200) {
          return true;
        } else {
          throw new Error(response.data?.message || '头像更新失败');
        }
      } catch (error) {
        console.error('form-urlencoded格式头像更新失败:', error);
        throw error;
      }
    },

    closeProfile() {
      this.isEditing = false;
      this.isEditingPassword = false;
      this.isEditingUsername = false;
      this.isEditingPhone = false;
      this.phoneForm = { oldPhone: '', newPhone: '' };
      this.passwordForm = { oldPassword: '', newPassword: '' };
      this.$emit("close");
    },

    async handlePasswordUpdate() {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,20}$/;

      if (!this.passwordForm.oldPassword) {
        this.$message.warning("请输入原密码");
        return;
      }

      if (!this.passwordForm.newPassword) {
        this.$message.warning("请输入新密码");
        return;
      }
      if (!passwordRegex.test(this.passwordForm.newPassword)) {
        this.$message.warning("新密码需 8 到 20 位，包含数字、大写字母、小写字母和特殊符号至少各一位");
        return;
      }
      if (this.passwordForm.newPassword === this.passwordForm.oldPassword) {
        this.$message.warning("新密码不能与原密码相同");
        return;
      }

      try {
        this.$message.info('正在更新密码...');
        
        // 调用密码更新接口
        const response = await axios.post('/api/user/updateUserPassword', {
          id: this.user.userId,
          password: this.passwordForm.oldPassword,
          newPassword: this.passwordForm.newPassword
        }, {
          headers: {
            'Content-Type': 'application/json',
            'token': this.user.token
          }
        });

        if (response.data && response.data.code === 200) {
          this.$message.success("密码修改成功，请用新密码重新登录");
          this.passwordForm = { oldPassword: "", newPassword: "" };
          this.isEditingPassword = false;
          // 自动登出并跳转到登录页
          await this.$store.dispatch('logout');
          this.$router.push('/login');
          return;
        } else {
          this.$message.error(response.data?.message || "密码修改失败");
        }
      } catch (error) {
        console.error('密码修改请求出错:', error);
        if (error.response) {
          console.error("错误响应数据:", error.response.data);
          this.$message.error(`请求出错：${error.response.data?.message || error.message || "未知后端错误"}`);
        } else if (error.request) {
          console.error("请求未收到响应:", error.request);
          this.$message.error("服务器无响应，请检查网络连接");
        } else {
          console.error("请求配置错误:", error.message);
          this.$message.error(`请求错误: ${error.message || "未知错误"}`);
        }
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
          this.closeProfile();
          this.$router.push("/").catch((error) => {
            if (error.name === "NavigationDuplicated") {
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

    switchTheme(theme) {
      if (this.currentTheme === theme) return;
      
      this.currentTheme = theme;
      
      localStorage.setItem('userProfileTheme', theme);
      
      this.$message.success(`已切换到${theme === 'default' ? '默认主题' : theme === 'home' ? '主页风格' : theme === 'light' ? '明亮简约' : '明亮简约'}`);
    },

    viewProductDetails(product) {
      if (product && (product.pid || product.id)) {
        const productId = product.pid || product.id;
        this.closeProfile();
        this.$router.push({ name: 'ProductDetail', params: { id: productId } });
      } else {
        console.error('Invalid product object for viewing details:', product);
        this.$message.error('无法查看商品详情，商品信息不完整');
      }
    },

    startPasswordEdit() {
      this.toggleEditMode();
      this.isEditingPassword = true;
      this.passwordForm = { oldPassword: '', newPassword: '' };
    },

    cancelPasswordEdit() {
      this.isEditingPassword = false;
      this.passwordForm = { oldPassword: '', newPassword: '' };
    },

    getAvatarUrl(icon) {
      if (!icon) return '';
      if (icon.startsWith('http')) return icon;
      return `http://localhost:8080/${icon.replace(/^\//, '')}`;
    },

    async handlePhoneUpdate() {
      if (!this.phoneForm.oldPhone || !this.phoneForm.newPhone) {
        this.$message.warning("请填写完整的手机号信息");
        return;
      }

      // 验证手机号格式
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(this.phoneForm.newPhone)) {
        this.$message.warning("请输入正确的手机号格式");
        return;
      }

      if (this.phoneForm.oldPhone === this.phoneForm.newPhone) {
        this.$message.warning("新手机号不能与原手机号相同");
        return;
      }

      try {
        this.$message.info('正在更新手机号...');
        
        // 调用手机号更新接口
        const response = await axios.post('/api/user/updateUserPhone', {
          id: this.user.userId,
          phone: this.phoneForm.oldPhone,
          newPhone: this.phoneForm.newPhone
        }, {
          headers: {
            'Content-Type': 'application/json',
            'token': this.user.token
          }
        });

        if (response.data && response.data.code === 200) {
          this.$message.success("手机号更新成功");
          // 更新本地用户信息
          const updatedUser = { ...this.user, phone: this.phoneForm.newPhone };
          this.$store.commit('SET_USER', updatedUser);
          this.cancelEditPhone();
          
          // 自动刷新用户信息，确保数据同步
          await this.refreshUserInfo();
        } else {
          this.$message.error(response.data?.message || "手机号更新失败");
        }
      } catch (error) {
        console.error('手机号更新失败:', error);
        if (error.response) {
          this.$message.error(`手机号更新失败: ${error.response.data?.message || '未知错误'}`);
        } else if (error.request) {
          this.$message.error("服务器无响应，请检查网络连接");
        } else {
          this.$message.error(`请求错误: ${error.message}`);
        }
      }
    },

    async refreshUserInfo() {
      this.refreshing = true;
      try {
        await this.getUserInfo();
        this.$message.success("用户信息已刷新");
      } catch (error) {
        console.error("刷新用户信息失败:", error);
        this.$message.error("刷新用户信息失败");
      } finally {
        this.refreshing = false;
      }
    },

    async loadFavorites() {
      if (this.user.userId) {
        this.$store.dispatch('favorites/loadUserFavorites', this.user.userId);
        this.$message.success('收藏列表已手动加载');
      } else {
        this.$message.error('用户ID不存在，无法加载收藏列表');
      }
    }
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
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 10px;
  margin-bottom: 20px;
  padding-bottom: 20px;
}

.favorite-item {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  margin-bottom: 15px;
  flex-shrink: 0;
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

/* Sidebar User Info */
.sidebar-user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info-container[class*="theme-home"] .sidebar-user-info {
   border-bottom: 1px solid rgba(2, 166, 181, 0.3);
}

.sidebar-avatar {
   border: 2px solid #409eff;
   margin-bottom: 10px;
}

.user-info-container[class*="theme-home"] .sidebar-avatar {
   border: 2px solid #02a6b5;
}

.sidebar-username {
   color: #fff;
   font-size: 16px;
   font-weight: bold;
}

/* 主页风格主题 - 侧边栏用户名 */
.user-info-container[class*="theme-home"] .sidebar-username {
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
  padding: 30px;
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
  margin-bottom: 30px;
  color: #409eff;
  font-size: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  font-weight: bold;
}

/* 主页风格主题 - 面板标题 */
.user-info-container[class*="theme-home"] .panel-title {
  color: #fff;
  text-shadow: 0 0 15px rgba(2, 166, 181, 0.5);
  border-bottom: 1px solid rgba(2, 166, 181, 0.3);
}

/* 基本信息面板内部布局 */
.basic-info-panel .user-overview {
    display: flex;
    align-items: center;
    gap: 40px;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
}

/* 主页风格主题下的用户信息概览样式 */
.user-info-container[class*="theme-home"] .basic-info-panel .user-overview {
    border-bottom: 1px solid rgba(2, 166, 181, 0.3);
}

.basic-info-panel .avatar-display-wrapper {
    position: relative;
    flex-shrink: 0;
}

/* Customize avatar size if needed */
.basic-info-panel .user-avatar {
   /* size is set via el-avatar prop */
   border: 3px solid #409eff;
}
/* 主页风格主题下的头像边框 */
.user-info-container[class*="theme-home"] .basic-info-panel .user-avatar {
   border: 2px solid #02a6b5;
}

/* Position and style for avatar edit hint */
.basic-info-panel .avatar-edit-hint {
   position: absolute;
   bottom: 0;
   left: 0;
   right: 0;
   text-align: center;
   color: #fff;
   background-color: rgba(0, 0, 0, 0.5);
   font-size: 13px;
   cursor: pointer;
   transition: background-color 0.3s;
   white-space: nowrap;
   line-height: 1.5;
   padding: 2px 0;
}

.basic-info-panel .avatar-edit-hint:hover {
   background-color: rgba(0, 0, 0, 0.7);
}

/* User details display (username and phone) */
.basic-info-panel .user-details-display {
    flex: 1;
}

/* Adjust el-descriptions item style if needed */
.basic-info-panel ::v-deep .el-descriptions-item__label {
    width: 100px;
    font-weight: bold;
    color: #606266;
    position: relative; /* For absolute positioning of edit icon */
    padding-right: 30px; /* Add space for the icon */
}

.user-info-container[class*="theme-home"] .basic-info-panel ::v-deep .el-descriptions-item__label {
    color: rgba(255, 255, 255, 0.8);
}

.basic-info-panel ::v-deep .el-descriptions-item__content {
    color: #303133;
    display: flex; /* Use flexbox to align text and edit icon */
    align-items: center;
    gap: 10px; /* Space between text and icon */
}

.user-info-container[class*="theme-home"] .basic-info-panel ::v-deep .el-descriptions-item__content {
     color: #ffffff;
}

/* Style for the edit icon next to username/phone */
.basic-info-panel .edit-icon {
    cursor: pointer;
    color: #409eff; /* Default icon color */
    font-size: 16px;
    transition: color 0.2s ease;
}

.user-info-container[class*="theme-home"] .basic-info-panel .edit-icon {
     color: #02a6b5;
}

.basic-info-panel .edit-icon:hover {
    color: #66b1ff; /* Hover color */
}

.user-info-container[class*="theme-home"] .basic-info-panel .edit-icon:hover {
     color: #04d9e3;
}

/* Style for the username input and buttons when editing inline */
.basic-info-panel .el-descriptions-item__content > .el-input {
    flex-grow: 1; /* Allow input to take available space */
    max-width: 200px; /* Limit input width if needed */
}

.basic-info-panel .el-descriptions-item__content > .el-button {
    flex-shrink: 0; /* Prevent buttons from shrinking */
}

/* Hide the edit icon next to phone number in basic info display */
.basic-info-panel .phone-display-wrapper .edit-icon {
    display: none;
}

/* Form styles within basic info panel */
/* Modify phone section is now standalone */
.basic-info-panel .modify-phone-section {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px dashed #dcdfe6;
}

/* 主页风格主题下的手机修改区域样式 */
.user-info-container[class*="theme-home"] .basic-info-panel .modify-phone-section {
    border-top: 1px dashed rgba(2, 166, 181, 0.3);
}

.basic-info-panel .sub-panel-title {
    margin-top: 0;
    margin-bottom: 25px;
    font-size: 18px;
    color: #303133;
    font-weight: bold;
}
/* 主页风格主题下的子面板标题 */
.user-info-container[class*="theme-home"] .basic-info-panel .sub-panel-title {
    color: #fff;
}

/* Adjust form item margin if needed */
.basic-info-panel .el-form-item {
    margin-bottom: 20px;
}

/* Adjust action buttons spacing */
.basic-info-panel .action-buttons {
    margin-top: 40px;
    display: flex;
    gap: 15px;
    justify-content: flex-start;
}

/* Ensure input/button styles are consistent within basic info panel */
.basic-info-panel ::v-deep .el-input__inner {
    border-radius: 4px;
}

.basic-info-panel ::v-deep .el-button {
    border-radius: 4px;
    padding: 10px 20px;
}

/* Remove the username action buttons margin style as inline buttons are used */
/* .username-action-buttons { */
/*     margin-top: 15px; */
/*     margin-bottom: 0; */
/*     text-align: left; */
/* } */

/* Style for the phone form's confirm button - adjust margin as needed */
.modify-phone-section .el-form-item__content .el-button--primary {
    margin-left: 0 !important; /* Override default form-item button margin */
}



/* 主题选项容器 */
.theme-options {
  display: flex;
  gap: 30px; /* Add some space between options */
  margin-bottom: 20px;
  flex-wrap: wrap; /* Allow wrapping on smaller screens */
}

.theme-option {
  padding: 15px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  display: flex;
  flex-direction: column; /* Stack preview and name */
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  background-color: #fff;
  width: 150px; /* Give options a fixed width */
  text-align: center;
}

.theme-option:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.theme-option.active {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
  background-color: #ecf5ff;
}

/* 主题预览区域 */
.theme-preview {
  width: 120px; /* Set width */
  height: 80px; /* Set height */
  border-radius: 4px;
  margin-bottom: 10px; /* Space below preview */
  border: 1px solid #dcdfe6;
  background-color: #e4e7ed;
  transition: all 0.3s ease;
  overflow: hidden; /* Hide overflow */
  position: relative; /* For absolute positioning of theme styles if needed */
}

/* 默认主题预览 */
.theme-preview.default-theme {
  background: linear-gradient(to bottom right, #409eff, #66b1ff);
}

/* 主页风格主题预览 */
.theme-preview.home-theme {
  background: linear-gradient(to bottom right, #000428, #004e92);
}

.theme-preview.light-theme {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border: 1px solid #e0e0e0;
}

.theme-name {
  font-size: 14px;
  color: #606266;
}

.theme-option.active .theme-name {
  color: #409eff;
  font-weight: bold;
}

.theme-description {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  color: #606266;
  font-size: 14px;
}

.user-info-container[class*="theme-home"] .content-area {
  background: linear-gradient(135deg, #000428 0%, #004e92 100%);
}

/* 主页风格主题下，基本信息表格深蓝背景（包括td） */
.user-info-container[class*="theme-home"] .basic-info-panel ::v-deep .el-descriptions table,
.user-info-container[class*="theme-home"] .basic-info-panel ::v-deep .el-descriptions tr,
.user-info-container[class*="theme-home"] .basic-info-panel ::v-deep .el-descriptions td {
  background: rgba(0, 43, 84, 0.95) !important;
}

/* 明亮简约主题下左侧边栏字体、icon、选中项 */
.user-info-container.theme-light .user-sidebar {
  background: #fff !important;
  color: #222 !important;
}
.user-info-container.theme-light .sidebar-username,
.user-info-container.theme-light .sidebar-title {
  color: #222 !important;
}
.user-info-container.theme-light .menu-item {
  color: #222 !important;
}
.user-info-container.theme-light .menu-item.active {
  background: #e3f0ff !important;
  color: #409eff !important;
  border-left-color: #409eff !important;
}
.user-info-container.theme-light .menu-item i {
  color: #409eff !important;
}
.user-info-container.theme-light .logout-button .el-button {
  background: #409eff !important;
  color: #fff !important;
}

/* 主页风格主题下侧边栏和字体 */
.user-info-container.theme-home {
  background: linear-gradient(135deg, #000428 0%, #004e92 100%) !important;
}
.user-info-container.theme-home .user-sidebar {
  background: #002b54 !important;
  color: #fff !important;
  border-right: 1px solid #02a6b5 !important;
}
.user-info-container.theme-home .sidebar-username,
.user-info-container.theme-home .sidebar-title {
  color: #02a6b5 !important;
}
.user-info-container.theme-home .menu-item {
  color: #fff !important;
}
.user-info-container.theme-home .menu-item.active {
  background: #013a63 !important;
  color: #02a6b5 !important;
  border-left-color: #02a6b5 !important;
}
.user-info-container.theme-home .menu-item i {
  color: #02a6b5 !important;
}
.user-info-container.theme-home .logout-button .el-button {
  background: #02a6b5 !important;
  color: #fff !important;
}

/* 默认主题下侧边栏和字体 */
.user-info-container.theme-default {
  background: #f5f7fa !important;
}
.user-info-container.theme-default .user-sidebar {
  background: #2c3e50 !important;
  color: #fff !important;
  border-right: 1px solid #409eff !important;
}
.user-info-container.theme-default .sidebar-username,
.user-info-container.theme-default .sidebar-title {
  color: #fff !important;
}
.user-info-container.theme-default .menu-item {
  color: #fff !important;
}
.user-info-container.theme-default .menu-item.active {
  background: #409eff !important;
  color: #fff !important;
  border-left-color: #fff !important;
}
.user-info-container.theme-default .menu-item i {
  color: #fff !important;
}
.user-info-container.theme-default .logout-button .el-button {
  background: #409eff !important;
  color: #fff !important;
}

/* 蓝色科技主题下内容面板字体高亮 */
.user-info-container.theme-home .content-panel,
.user-info-container.theme-home .content-panel * {
  color: #fff !important;
}
/* 蓝色科技主题下收藏卡片标题、价格、评分等字体高亮 */
.user-info-container.theme-home .favorite-item,
.user-info-container.theme-home .favorite-item * {
  color: #fff !important;
}
.user-info-container.theme-home .favorite-name {
  color: #fff !important;
}
.user-info-container.theme-home .discount-price {
  color: #F56C6C !important;
}
.user-info-container.theme-home .normal-price {
  color: #b0c4de !important;
}
.user-info-container.theme-home .favorite-rating {
  color: #FFD700 !important;
}
/* 蓝色科技主题下按钮文字高亮 */
.user-info-container.theme-home .el-button,
.user-info-container.theme-home .el-button span {
  color: #fff !important;
}
/* 蓝色科技主题下表格内容字体高亮 */
.user-info-container.theme-home .basic-info-panel ::v-deep .el-descriptions-item__content,
.user-info-container.theme-home .basic-info-panel ::v-deep .el-descriptions-item__content span,
.user-info-container.theme-home .basic-info-panel ::v-deep .el-descriptions-item__content input {
  color: #fff !important;
}
/* 蓝色科技主题下收藏卡片按钮背景色和icon */
.user-info-container.theme-home .favorite-actions .el-button {
  background: #02a6b5 !important;
  color: #fff !important;
  border: none !important;
}
.user-info-container.theme-home .favorite-actions .el-button .el-icon-delete {
  color: #fff !important;
}
.user-info-container.theme-home .favorite-actions .el-button .el-icon-view {
  color: #fff !important;
}

/* 蓝色科技主题下基本信息表格背景色统一为深蓝色 */
.user-info-container.theme-home .basic-info-panel ::v-deep .el-descriptions,
.user-info-container.theme-home .basic-info-panel ::v-deep .el-descriptions table,
.user-info-container.theme-home .basic-info-panel ::v-deep .el-descriptions tr,
.user-info-container.theme-home .basic-info-panel ::v-deep .el-descriptions td,
.user-info-container.theme-home .basic-info-panel ::v-deep .el-descriptions-item__label,
.user-info-container.theme-home .basic-info-panel ::v-deep .el-descriptions-item__content {
  background: rgba(0, 43, 84, 0.85) !important;
  border-color: #02a6b5 !important;
}
/* 蓝色科技主题下按钮背景色高亮蓝色，去除白色底 */
.user-info-container.theme-home .el-button {
  background: #02a6b5 !important;
  color: #fff !important;
  border: none !important;
}
.user-info-container.theme-home .el-button[type="default"] {
  background: #013a63 !important;
  color: #fff !important;
}
.user-info-container.theme-home .el-button[type="warning"] {
  background: #f39c12 !important;
  color: #fff !important;
}
.user-info-container.theme-home .el-button[type="info"] {
  background: #34495e !important;
  color: #fff !important;
}
</style>