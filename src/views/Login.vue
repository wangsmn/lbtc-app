<template>
  <div class="Login">
    <div class="contain">
      <van-form @submit="onSubmit">
        <van-field
          v-model="username"
          name="用户名"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <div class="submit">
          <van-button round block type="info" native-type="submit"
            >登录</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { userLogin } from "@/api/index";
import { Toast } from "vant";
export default {
  name: "Login",
  props: {},
  components: {},
  data() {
    return {
      username: "",
      password: "",
    };
  },
  computed: {
    ...mapState(["token"]),
  },
  watch: {},
  methods: {
    ...mapMutations(["SET_TOKEN", "SET_USER"]),
    onSubmit() {
      userLogin({ userName: this.username, passWord: this.password })
        .then((res) => {
          if (res.rspMsg === "操作成功") {
            this.SET_TOKEN(res.data.token);
            this.SET_USER(res.data.user);
            console.log(res)
            this.$router.push("/Home");
          } else {
            Toast.fail(res.rspMsg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped lang="less">
.Login {
  width: 100%;
  height: 100%;
  background: url(~@/assets/bg1.png) center no-repeat;
  background-size: cover;
  .contain {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    background: url(~@/assets/bg2.png) center no-repeat;
    background-size: 100%;

    .submit {
      width: 94%;
      margin: 40px auto 0;
    }
  }
}
</style>
