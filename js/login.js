// ESM 具名匯出 createApp 方法
import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js";

createApp({
  data() {
    return {
      // API 站點
      apiUrl: "https://vue3-course-api.hexschool.io/v2",
      // 利用 v-model 將使用者輸入 input 的資料雙向綁定在 user 裡面
      user: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    login() {
      // 使用者登入, 發送 POST 要求 API 至遠端伺服器驗證帳號
      const loginApi = `${this.apiUrl}/admin/signin`;
      axios
        .post(loginApi, this.user)
        .then((res) => {
          // 取得 token 將它寫入本機端的 cookie 中, expires 則是 token 的有效期限
          const { token, expired } = res.data;
          document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
          window.location.assign("products.html");
        })
        .catch((err) => {
          // 當 Promise 回傳失敗時, 會出現彈跳窗告知帳號驗證錯誤的訊息
          const { data } = err.response;
          alert(data.message + "\n" + data.error.message);
        });
    },
  },
}).mount("#app");
