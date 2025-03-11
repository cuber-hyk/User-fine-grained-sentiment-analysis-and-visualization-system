<template>
  <div class="compare-container">
    <h2 class="title">商品对比</h2>
    <div id="three-container" v-if="compareList.length > 0"></div>
    <div v-else class="no-data">请先选择商品进行对比</div>

    <!-- 弹窗选择商品 -->
    <el-dialog :visible.sync="productDialogVisible" title="选择商品" @close="closeDialog" width="60%">
      <el-input v-model="searchQuery" placeholder="搜索商品名称" clearable @input="filterProducts" class="search-input"></el-input>
      <el-checkbox-group v-model="selectedProducts" class="product-list">
        <el-checkbox
          v-for="product in filteredProducts"
          :key="product.pid"
          :label="product.pid"
        >
          <div class="product-item">
            <img :src="product.image" alt="商品图片" class="product-image" />
            <span>{{ product.name }}</span>
          </div>
        </el-checkbox>
      </el-checkbox-group>
      <div class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="addSelectedProducts">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as THREE from 'three';
export default {
  data() {
    return {
      compareList: [], // 从 Vuex 获取对比的商品列表，这里先初始化为空
      allProducts: [
        { pid: "4", name: "商品4", image: "/path/to/image4.jpg" },
        { pid: "5", name: "商品5", image: "/path/to/image5.jpg" },
        { pid: "6", name: "商品6", image: "/path/to/image6.jpg" },
      ],
      selectedProducts: [],
      searchQuery: '', // 搜索框的输入值
      productDialogVisible: false, // 控制弹窗是否可见
      productAttributes: {
        stars: "评分",
        ratings: "评论数",
        discount_price: "折扣价",
        normal_price: "原价",
        about_this_item: "商品描述"
      },
      scene: null,
      camera: null,
      renderer: null,
      cardMeshes: []
    };
  },
  computed: {
    filteredProducts() {
      return this.allProducts.filter(product =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  mounted() {
    this.initThree();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onWindowResize);
  },
  methods: {
    initThree() {
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.camera.position.z = 5;
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.getElementById('three-container').appendChild(this.renderer.domElement);
      window.addEventListener('resize', this.onWindowResize);
      this.animate();
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.cardMeshes.forEach(mesh => {
        mesh.rotateY(0.01);
      });
      this.renderer.render(this.scene, this.camera);
    },
    createProductCard(product) {
      const geometry = new THREE.BoxGeometry(1, 1, 0.1);
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, 0, 0);
      this.scene.add(mesh);

      const texture = new THREE.TextureLoader().load(product.image);
      const textureMaterial = new THREE.MeshBasicMaterial({ map: texture });
      const textMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), textureMaterial);
      textMesh.position.set(0, 0, 0.1 / 2);
      this.scene.add(textMesh);

      this.cardMeshes.push(mesh);
    },
    openProductSelection() {
      this.productDialogVisible = true;
    },
    closeDialog() {
      this.productDialogVisible = false;
    },
    addSelectedProducts() {
      this.selectedProducts.forEach(pid => {
        const product = this.allProducts.find(p => p.pid === pid);
        if (product &&!this.compareList.find(p => p.pid === pid)) {
          this.compareList.push(product);
          this.createProductCard(product);
        }
      });
      this.closeDialog();
    },
    filterProducts() {
      // 该方法将在每次输入时触发，实时筛选商品
    }
  }
};
</script>

<style scoped>
.compare-container {
  padding: 30px;
  background: linear-gradient(145deg, #1e1e2f, #262d3d);
  border-radius: 15px;
  color: white;
  max-width: 1200px;
  margin: 40px auto;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.title {
  font-size: 28px;
  margin-bottom: 30px;
  color: #ffffff;
  font-weight: 600;
}

#three-container {
  width: 100%;
  height: 400px;
}

.no-data {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 20px;
}

.search-input {
  margin-bottom: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  border-radius: 8px;
  padding: 10px;
}

.product-list {
  max-height: 350px;
  overflow-y: auto;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 10px 0;
}

.product-item img {
  width: 50px;
  height: 50px;
  border-radius: 8px;
}

.el-dialog__body {
  padding: 20px;
  background-color: #2c3446;
  border-radius: 8px;
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.el-button {
  padding: 8px 20px;
  font-size: 16px;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.el-button:hover {
  background-color: #409eff;
  color: white;
}
</style>