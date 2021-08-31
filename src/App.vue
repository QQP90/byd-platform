<template>
  <div id="app">
    <a-config-provider :locale="zh_CN">
      <router-view v-if="login"></router-view>
      <BaseLayout v-else />
    </a-config-provider>
  </div>
</template>

<script>
import BaseLayout from "@/components/BaseLayout/BaseLayout.vue";
import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
export default {
  name: "App",
  components: {
    BaseLayout,
  },
  data() {
    return {
      zh_CN,
    };
  },
  created() {
    const { query } = this.$route;
    const { token } = query;
    if (!localStorage.getItem("token")) {
      localStorage.setItem("token", token);
      localStorage.setItem("tokenTime", new Date().getTime());
    }
  },
  computed: {
    login() {
      return this.$route.name === "login";
    },
  },
};
</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>
