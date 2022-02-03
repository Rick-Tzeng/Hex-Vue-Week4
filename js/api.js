// ESM 具名匯入 createApp 方法
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';
// ESM 匿名匯入分頁元件
import pagination from './pagination.js';

// 宣告要使用的 Modal
let updateModal = null;
let deleteModal = null;

const app = createApp({
  data() {
    return {
      // 遠端 API 站點 & API Path
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'rick917jp6-api',

      labels: ['分類', '產品名稱', '原價', '售價', '是否啟用', '編輯產品'],
      products: [],
      // 存放分頁資訊
      pagination: {},
      // 利用 v-model 將新增產品的資料加入到 tempProduct 裡
      tempProduct: {
        imagesUrl: [],
      },
      // 在開啟「建立新的產品」或是「編輯」的 Modal 時, 用來判斷呼叫其對應的 API 使用
      isNewProduct: false,
    };
  },
  // 把分頁元件區域註冊在根元件上
  components: {
    pagination,
  },
  // 生命週期： Vue 初始化掛載完成
  mounted() {
    // 取得本機端 cookie 儲存的 Token, 並將它加到 axios 發送 Request 的 headers 中
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
    axios.defaults.headers.common['Authorization'] = token;

    this.checkLogin();
  },
  methods: {
    // 確認使用者帳號的登入狀態, 是否還在 token 的有效期限內
    checkLogin() {
      const apiPath = `${this.apiUrl}/api/user/check`;
      axios
        .post(apiPath)
        .then((res) => {
          this.getAllProducts();
        })
        .catch((err) => {
          alert('Token 已失效, 請重新登入', err.response.data.message);
          window.location.assign('login.html');
        });
    },

    // 取得儲存在遠端站點所有的產品列表與分頁資訊（參數預設值為 1）
    getAllProducts(page = 1) {
      // query 的用法：「API網址/?變數=特定值」
      const apiPath = `
        ${this.apiUrl}/api/${this.apiPath}/admin/products/?page=${page}`;

      axios
        .get(apiPath)
        .then((res) => {
          const { products, pagination } = res.data;
          this.products = products;
          this.pagination = pagination;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },

    // 利用 whichModal 的判斷給定 isNewProduct 的值
    openModal(whichModal, item) {
      // 新增
      if (whichModal === 'add') {
        this.isNewProduct = true;
        this.tempProduct = {
          imagesUrl: [],
        };
        updateModal.show();
      }
      // 編輯
      else if (whichModal === 'edit') {
        this.isNewProduct = false;
        // 利用展開的方式淺層複製選定的產品, 避免原來的資料一併被改動
        this.tempProduct = { ...item };
        updateModal.show();
      }
      // 刪除
      else if (whichModal === 'delete') {
        this.tempProduct = { ...item };
        deleteModal.show();
      }
    },
  },
});

// 全域註冊：新增、編輯 Modal 元件
app.component('productModal', {
  props: ['apiUrl', 'apiPath', 'product', 'isNewProduct'],
  mounted() {
    updateModal = new bootstrap.Modal(document.getElementById('productModal'), {
      backdrop: 'static',
      keyboard: false,
    });
  },
  methods: {
    updateProduct() {
      // 編輯產品 API
      let apiSite = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.product.id}`;
      let httpMethod = 'put';
      // 如果是新增產品則將 apiSite 換成建立產品的 API, 方法換成 post
      if (this.isNewProduct) {
        apiSite = `${this.apiUrl}/api/${this.apiPath}/admin/product/`;
        httpMethod = 'post';
      }

      axios[httpMethod](apiSite, { data: this.product })
        .then((res) => {
          alert(res.data.message);
          updateModal.hide();
          this.$emit('update');
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    // 新增更多圖片
    createImages() {
      this.product.imagesUrl = [];
      this.product.imagesUrl.push('');
    },
  },
  template: '#productModal',
});

// 全域註冊：刪除產品 Modal 元件
app.component('delProductModal', {
  props: ['apiUrl', 'apiPath', 'product'],
  mounted() {
    deleteModal = new bootstrap.Modal(
      document.getElementById('delProductModal'),
      { backdrop: 'static', keyboard: false }
    );
  },
  methods: {
    delProduct() {
      const apiSite = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.product.id}`;

      axios
        .delete(apiSite)
        .then((res) => {
          alert(res.data.message);
          deleteModal.hide();
          this.$emit('update');
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
  },
  template: '#delProductModal',
});

app.mount('#app');
