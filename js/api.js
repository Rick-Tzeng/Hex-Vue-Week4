// ESM 具名匯出 createApp 方法
import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js";

// 宣告要使用的 Modal
let addProductModal = null;
let editProductModal = null;
let delProductModal = null;

createApp({
  data() {
    return {
      // 遠端 API 站點 & 我的 API Path
      apiUrl: "https://vue3-course-api.hexschool.io/v2",
      apiPath: "rick917jp6-api",

      labels: ["分類", "產品名稱", "原價", "售價", "是否啟用", "編輯產品"],

      // 利用 v-model 將新增產品的資料加入到 tempProduct 裡
      tempProduct: {
        imagesUrl: [],
      },
      products: [],
    };
  },
  // 生命週期： Vue 初始化掛載完成
  mounted() {
    // 初始化要使用的 Modal
    addProductModal = new bootstrap.Modal(
      document.getElementById("addProductModal"),
      { keyboard: false }
    );
    editProductModal = new bootstrap.Modal(
      document.getElementById("editProductModal"),
      { keyboard: false }
    );
    delProductModal = new bootstrap.Modal(
      document.getElementById("delProductModal"),
      { keyboard: false }
    );
    // 取得本機端 cookie 儲存的 Token, 並將它加到 axios 發送 Request 的 headers 中
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common["Authorization"] = token;

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
          alert("Token 已失效, 請重新登入", err.response.data.message);
          window.location.assign("login.html");
        });
    },

    // 取得儲存在遠端站點所有的產品列表
    getAllProducts() {
      const apiPath = `${this.apiUrl}/api/${this.apiPath}/admin/products`;

      axios
        .get(apiPath)
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },

    // 利用 whichModal 的變數來判斷觸發打開哪一個 Modal
    openModal(whichModal, item) {
      // 新增
      if (whichModal === "add") {
        this.tempProduct = {
          imagesUrl: [],
        };
        addProductModal.show();
      }
      // 編輯
      else if (whichModal === "edit") {
        // 利用展開的方式淺層複製選定的產品, 避免原來的資料一併被改動
        this.tempProduct = { ...item };
        editProductModal.show();
      }
      // 刪除
      else if (whichModal === "delete") {
        this.tempProduct = { ...item };
        delProductModal.show();
      }
    },

    // 新增產品
    addProduct() {
      const apiPath = `${this.apiUrl}/api/${this.apiPath}/admin/product`;

      axios
        .post(apiPath, { data: this.tempProduct })
        .then((res) => {
          alert(res.data.message);
          addProductModal.hide();
          this.getAllProducts();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },

    // 編輯產品
    editProduct() {
      const apiPath = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;

      axios
        .put(apiPath, { data: this.tempProduct })
        .then((res) => {
          alert(res.data.message);
          editProductModal.hide();
          this.getAllProducts();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },

    // 刪除產品
    delProduct() {
      const apiPath = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;

      axios
        .delete(apiPath)
        .then((res) => {
          alert(res.data.message);
          delProductModal.hide();
          this.getAllProducts();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },

    // 新增更多圖片
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push("");
    },
  },
}).mount("#app");
