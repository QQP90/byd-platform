<template>
  <div class="effect-ctn">
    <a-tabs v-model="currentTabs" @tabClick="tabsChange" :animated="false">
      <a-tab-pane v-for="item in tabsList" :key="item.router" :tab="item.name">
      </a-tab-pane>
      <span
        v-if="downloadRoot"
        slot="tabBarExtraContent"
        style="cursor: pointer"
        @click="detailedDownload"
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
  name: "detailed",
  data() {
    return {
      currentTabs: "detailData",
      tabsList: [
        {
          name: "明细数据",
          router: "detailData",
        },
        {
          name: "数据统计",
          router: "dataStatistics",
        },
      ],
    };
  },
  mounted() {
    const { name } = this.$route;
    this.currentTabs = name || "detailData";
  },
  methods: {
    tabsChange(key) {
      this.$router.push(`/detailed/${key}`);
    },
    detailedDownload() {
      this.$refs.children.detailedDownload();
    },
  },
  components: {},
  computed: {
    ...mapState({ userAuth: (state) => state.userAuth }),
    downloadRoot() {
      const { userAuth } = this;
      return (
        (userAuth.userTypeId == 1 && userAuth.projectDetail.downloadRoot) ||
        (userAuth.userTypeId == 0 && userAuth.downloadRoot)
      );
    },
  },
};
</script>

<style lang="less" scoped>
.effect-ctn {
  position: relative;
  .effect-data-type-ctn {
    position: absolute;
    top: 20px;
    right: 0;
  }
}
</style>
