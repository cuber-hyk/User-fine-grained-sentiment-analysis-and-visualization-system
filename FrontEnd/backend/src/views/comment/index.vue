<template>
  <div class="comment-container">
    <!-- 筛选区域 -->
    <el-card class="filter-card">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="情感倾向">
          <el-select v-model="filterForm.sentiment" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="正面" value="positive"></el-option>
            <el-option label="负面" value="negative"></el-option>
            <el-option label="中性" value="neutral"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="评分范围">
          <el-select v-model="filterForm.score" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="5星" value="5"></el-option>
            <el-option label="4星及以上" value="4"></el-option>
            <el-option label="3星及以上" value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="时间范围">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleFilter">筛选</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 评论列表 -->
    <el-card class="comment-list">
      <div slot="header" class="list-header">
        <span>评论列表</span>
        <div class="header-right">
          <el-radio-group v-model="sortBy" size="small">
            <el-radio-button label="time">最新</el-radio-button>
            <el-radio-button label="score">评分</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <el-table v-loading="loading" :data="commentList" style="width: 100%">
        <el-table-column
          prop="content"
          label="评论内容"
          min-width="300"
          show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column prop="score" label="评分" width="120">
          <template slot-scope="scope">
            <el-rate v-model="scope.row.score" disabled show-score> </el-rate>
          </template>
        </el-table-column>

        <el-table-column prop="sentiment" label="情感倾向" width="100">
          <template slot-scope="scope">
            <el-tag :type="getSentimentType(scope.row.sentiment)">
              {{ scope.row.sentiment }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="评论时间" width="180">
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          :current-page="page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Comment",
  data() {
    return {
      loading: false,
      filterForm: {
        sentiment: "",
        score: "",
        dateRange: [],
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      sortBy: "time",
      commentList: [],
      page: 1,
      pageSize: 10,
      total: 0,
    };
  },
  methods: {
    handleFilter() {
      this.page = 1;
      this.fetchCommentList();
    },
    resetFilter() {
      this.filterForm = {
        sentiment: "",
        score: "",
        dateRange: [],
      };
      this.handleFilter();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchCommentList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchCommentList();
    },
    getSentimentType(sentiment) {
      const types = {
        正面: "success",
        负面: "danger",
        中性: "info",
      };
      return types[sentiment] || "info";
    },
    async fetchCommentList() {
      this.loading = true;
      try {
        // 模拟数据
        this.commentList = Array(10)
          .fill(null)
          .map((_, index) => ({
            id: index + 1,
            content: "这是一条评论内容，描述了产品的使用体验...",
            score: Math.floor(Math.random() * 3) + 3,
            sentiment: ["正面", "负面", "中性"][Math.floor(Math.random() * 3)],
            createTime: new Date().toLocaleString(),
          }));
        this.total = 100;
      } finally {
        this.loading = false;
      }
    },
  },
  created() {
    this.fetchCommentList();
  },
};
</script>

<style scoped>
.comment-container {
  padding: 20px;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
