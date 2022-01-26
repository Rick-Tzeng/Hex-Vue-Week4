// API 站點
const url = "https://vue3-course-api.hexschool.io/v2";
// API Path
const path = "rick917jp6-api";

// 取得本機端 cookie 儲存的 Token
// 並將它加到發送 Request 的 headers 中
const token = document.cookie.replace(
  /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
  "$1"
);
axios.defaults.headers.common["Authorization"] = token;

const app = {
  data() {
    return {
      labels: ["產品名稱", "原價", "售價", "是否啟用", "查看細節"],
      // 利用 v-model 將新增產品的資料加入到 temp.data 裡
      temp: {
        data: {
          title: "",
          category: "",
          origin_price: 0,
          price: 0,
          unit: "",
          description: "",
          content: "",
          is_enabled: false,
          imageUrl: "",
        },
      },
      selectedProduct: {},
      products: [],
    };
  },
  methods: {
    // 確認使用者帳號登入狀態
    checkLogin() {
      // 取得 Token（Token 僅需要設定一次）
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      axios.defaults.headers.common["Authorization"] = token;
      axios
        .post(`${url}/api/user/check`)
        .then((res) => {
          alert("目前使用者登入中");
        })
        .catch((err) => {
          alert("沒登錄帳號, 請重新登入");
          window.location.assign("week2.html");
        });
    },
    // 取得後臺所有產品列表
    getProducts() {
      axios
        .get(`${url}/api/${path}/admin/products`)
        .then((res) => {
          this.products = res.data.products;
          if (!this.products.length) {
            alert("目前沒有任何產品資料, 請新增產品資料");
          } else {
            alert("已更新產品資料");
          }
        })
        .catch((err) => {
          if (window.location.pathname == "/week2.html") {
          } else alert("目前沒有任何產品資料, 請新增產品資料");
        });
    },
    // 新增一個產品
    addProduct() {
      axios
        .post(`${url}/api/${path}/admin/product`, this.temp)
        .then((res) => {
          alert("成功新增產品");
          this.temp = {
            data: {
              title: "",
              category: "",
              origin_price: 0,
              price: 0,
              unit: "",
              description: "",
              content: "",
              is_enabled: false,
              imageUrl: "",
            },
          };
          this.selectedProduct = {};
          this.getProducts();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    // 刪除一個產品
    removeProduct() {
      const id = this.selectedProduct.id;
      axios
        .delete(`${url}/api/${path}/admin/product/${id}`)
        .then((res) => {
          alert("成功刪除產品");
          this.selectedProduct = {};
          this.getProducts();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
  },
  // 生命週期（函式）
  created() {
    alert("登入成功");
    this.getProducts();
  },
};

Vue.createApp(app).mount("#app");
