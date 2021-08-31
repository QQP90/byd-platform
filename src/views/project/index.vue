<template>
  <div class="project-ctn">
    <a-tabs v-model="currentTabs" @tabClick="tabsChange" :animated="false">
      <a-tab-pane v-for="item in tabsList" :key="item.router" :tab="item.name">
      </a-tab-pane>
      <span
        slot="tabBarExtraContent"
        style="cursor: pointer"
        v-if="userAuth.downloadRoot"
        @click="projectDownload"
      >
        <a-icon type="download" />下载数据
      </span>
    </a-tabs>
    <router-view ref="children"></router-view>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Project",
  data() {
    return {
      currentTabs: "advertisingCampaign",
      tabsList: [
        {
          name: "广告活动列表",
          router: "advertisingCampaign",
        },
        {
          name: "项目洞察",
          router: "projectInsight",
        },
        // {
        //   name: "异常流量",
        //   router: "anomalyTraffic",
        // },
      ],
    };
  },
  mounted() {
    const { name } = this.$route;
    this.currentTabs = name || "advertisingCampaign";
  },
  methods: {
    tabsChange(key) {
      this.$router.push(`/project/${key}`);
    },
    projectDownload() {
      this.$refs.children.projectDownload();
    },
  },
  components: {},
  computed: {
    ...mapState(["userAuth"]),
  },
};
</script>

<style lang="less" scoped></style>
