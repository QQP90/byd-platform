<template>
  <div class="login-ctn">
    <div class="logo-ctn">
      <img src="@/assets/img/logo-2.png" alt="" />
    </div>
    <div class="title-ctn">灵犀AI运营管理平台</div>
    <div class="login">
      <p class="title">登 录</p>
      <p class="type-check">
        <span :class="{ checked: loginType === 0 }">
          <a-checkbox
            :checked="loginType === 0"
            @change="onTypeChange(0)"
          ></a-checkbox>
          <span>内部用户</span>
        </span>
        <span class="type-line"></span>
        <span :class="{ checked: loginType === 1 }">
          <a-checkbox
            :checked="loginType === 1"
            @change="onTypeChange(1)"
          ></a-checkbox>
          <span>广告代理</span>
        </span>
      </p>

      <p class="input-ctn">
        <a-input
          v-model="account"
          :placeholder="loginType === 0 ? '请输入工号' : '请输入手机号码'"
          @pressEnter="pressEnter"
        ></a-input>
      </p>
      <p class="input-ctn">
        <a-input-password
          v-model="password"
          placeholder="请输入密码"
          @pressEnter="pressEnter"
        ></a-input-password>
      </p>
      <p class="button-ctn">
        <a-button
          type="primary"
          block
          @click="submitLogin"
          :loading="loginLoading"
          >登录</a-button
        >
      </p>
    </div>
  </div>
</template>

<script>
import { phoneCheck } from "@/assets/js/utils";
import { login } from "@/service/user.js";

const managerUrl = process.env.VUE_APP_MANAGER_URL;

export default {
  name: "Login",
  data() {
    return {
      loginType: 0,
      account: undefined,
      password: undefined,
      loginLoading: false,
    };
  },
  mounted() {
    localStorage.clear();
  },
  methods: {
    submitLogin() {
      const { loginType, account, password } = this;

      if (loginType === 0 && !account) {
        this.$message.error("工号不能为空");
        return false;
      }

      if (loginType === 1) {
        if (!account) {
          this.$message.error("手机号码不能为空");
          return false;
        }

        if (account && !phoneCheck(account)) {
          this.$message.error("手机号码格式错误");
          return false;
        }
      }

      if (!password) {
        this.$message.error("密码不能为空");
        return false;
      }

      this.login({
        account,
        password,
        userType: loginType,
      });
    },
    pressEnter() {
      this.submitLogin();
    },
    async login(obj) {
      this.loginLoading = true;

      try {
        const res = await login(obj);
        const { data, code } = res;
        const { message, authorization } = data;
        const { userType } = obj;

        this.loginLoading = false;

        if (authorization) {
          this.$message.success(`${code}:${message}`);
          localStorage.setItem("token", authorization);
          localStorage.setItem("tokenTime", new Date().getTime());

          if (userType === 1) {
            window.location.href = `${managerUrl}schedule/schedulingPlan?token=${authorization}`;
          } else {
            this.$router.replace("/");
          }
        } else {
          this.$message.error(`${code}:${message}`);
        }
      } catch (error) {
        this.loginLoading = false;
        this.$message.error("登录错误，请重试");
      }
    },
    onTypeChange(value) {
      this.loginType = value;
    },
  },
  components: {},
};
</script>

<style lang="less" scoped>
.login-ctn {
  width: 100%;
  height: 100%;
  padding-top: 100px;
  background: url("../../assets/img/login-bg.png") no-repeat;
  background-size: cover;
  .logo-ctn {
    margin: 0 auto;
    width: 180px;
    height: 25px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .title-ctn {
    margin-top: 20px;
    font-size: 36px;
    color: #fff;
    text-align: center;
    font-weight: bold;
  }
  .login {
    margin: 50px auto;
    width: 674px;
    height: 378px;
    padding: 40px;
    background-color: #fff;
    .title {
      margin: 0 auto 40px;
      font-size: 30px;
      color: #030303;
      font-weight: bold;
      text-align: center;
    }
    .type-check {
      display: flex;
      margin: 0 auto 10px;
      width: 378px;
      height: 24px;
      & > span {
        display: inline-block;
        height: 24px;
        &.checked {
          color: #0073c6;
        }

        & > span {
          padding-left: 10px;
        }
      }
      .type-line {
        border-right: 1px solid #999;
        margin: 0 22px;
      }
    }
    .input-ctn {
      margin: 0 auto 20px;
      width: 378px;
      height: 50px;

      /deep/ .ant-input {
        height: 50px;
      }
    }
    .button-ctn {
      margin: 0 auto;
      width: 378px;
      height: 50px;
      /deep/ .ant-btn {
        height: 50px;
        font-size: 14px;
      }
    }
  }
}
</style>
