<template>
    <el-dialog
      class="modify-dialog"
      title="修改手机号"
      :visible="visible"
      width="400px"
      @close="$emit('close')"
    >
      <el-form :model="form" label-width="100px">
        <!-- 原手机号 -->
        <el-form-item label="原手机号" required>
          <el-input 
            v-model="form.oldPhone"
            placeholder="请输入原手机号"
            clearable
          />
        </el-form-item>
  
        <!-- 新手机号 -->
        <el-form-item label="新手机号" required>
          <el-input
            v-model="form.newPhone"
            placeholder="请输入新手机号"
            clearable
          />
        </el-form-item>
      </el-form>
  
      <template #footer>
        <el-button @click="$emit('close')">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认修改</el-button>
      </template>
    </el-dialog>
  </template>
  
  <script>
  export default {
    props: ["visible"],
    data() {
      return {
        form: {
          oldPhone: "",
          newPhone: ""
        }
      };
    },
    methods: {
      handleConfirm() {
        const phoneReg = /^1[3-9]\d{9}$/;
  
        if (!phoneReg.test(this.form.oldPhone)) {
          this.$message.warning("原手机号格式错误");
          return;
        }
  
        if (!phoneReg.test(this.form.newPhone)) {
          this.$message.warning("新手机号格式错误");
          return;
        }
  
        if (this.form.oldPhone === this.form.newPhone) {
          this.$message.warning("新手机号不能与原手机号相同");
          return;
        }
  
        this.$emit("confirm", {
          oldPhone: this.form.oldPhone,
          newPhone: this.form.newPhone
        });
        this.$emit("close");
      }
    }
  };
  </script>
  
  <style scoped>
  /* 增强选择器层级确保生效 */
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
    font-weight: 500;
  }
  </style>