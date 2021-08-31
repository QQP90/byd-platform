<template>
  <a-layout-header class="global-header">
    <div @click="logout">
      <a-icon type="logout" />
      <span>退出登录</span>
    </div>

    <div @click="toUser">
      <a-icon type="user" />
      <span>用户中心</span>
    </div>

    <div
      @click="toManager"
      v-if="userAuth && userAuth.backList && userAuth.backList.length > 0"
    >
      <a-icon type="appstore" theme="filled" />
      <span>管理后台</span>
    </div>
  </a-layout-header>
</template>

<script>
import { mapState, mapMutations } from "vuex";
const managerUrl = process.env.VUE_APP_MANAGER_URL;

export default {
  name: "GlobalHeader",
  data() {
    return {};
  },
  computed: {
    ...mapState(["menuList", "userAuth"]),
    managerUrl() {
      const { userAuth } = this;
      const token = localStorage.getItem("token");
      return `${managerUrl}${
        userAuth.userTypeId == 1 ? "schedule/schedulingPlan" : ""
      }?token=${token}`;
    },
  },
  methods: {
    ...mapMutations(["SET_MENU_LIST", "SET_CURRENT_ROUTE"]),
    toUser() {
      if (this.$route.name != "user") {
        const menuList = [...this.menuList];
        if (menuList[menuList.length - 1].routeName !== "user") {
          menuList.push({
            name: "用户中心",
            icon: "user",
            routeName: "user",
          });
          this.SET_MENU_LIST(menuList);
        }
        this.SET_CURRENT_ROUTE("user");
        this.$router.push({ name: "user" });
      }
    },
    toManager() {
      const { managerUrl } = this;

      let winOpen = window.open("", "_blank");

      setTimeout(function () {
        winOpen.location.href = managerUrl;
      }, 0);
    },
    logout() {
      localStorage.clear();
      window.location.reload();
    },
  },
};
</script>

<style scope lang="scss">
.global-header {
  height: 50px;
  line-height: 50px;
  background: #fff;
  color: #141934;

  & > div {
    float: right;
    margin: 0 20px;
    cursor: pointer;
    & > span {
      padding-left: 2px;
    }
  }
}
</style>
