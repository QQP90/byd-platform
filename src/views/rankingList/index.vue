<template>
  <div class="rank-box">
    <a-tabs v-model="activeKey" @tabClick="tabsChange" :animated="false">
      <a-tab-pane v-for="item in paneList" :key="item.router" :tab="item.name">
      </a-tab-pane>
    </a-tabs>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "RankingList",
  computed: {
    ...mapState({}),
  },
  data() {
    return {
      activeKey: "projectRank",
      paneList: [
        {
          name: "事业部榜单",
          router: "businessRank",
        },
        {
          name: "部门榜单",
          router: "departmentRank",
        },
        {
          name: "项目榜单",
          router: "projectRank",
        },
        {
          name: "媒体榜单",
          router: "mediaRank",
        },
      ],
    };
  },
  mounted() {
    // for (let i = 0, len = this.paneList.length; i < len; i++) {
    //   let active = this.paneList[i].router;
    //   if (this.$route.path.indexOf(active) > -1) {
    //     this.activeKey = active;
    //     return;
    //   }
    // }
    const { name } = this.$route;
    this.activeKey = name || "projectRank";
  },
  methods: {
    tabsChange(key) {
      this.$router.push(`/rankingList/${key}`);
      // switch (key) {
      //   case "project":
      //     this.$router.push("/rankingList/projectRank");
      //     break;
      //   case "business":
      //     this.$router.push("/rankingList/businessRank");
      //     break;
      //   case "media":
      //     this.$router.push("/rankingList/mediaRank");
      //     break;
      //   case "department":
      //     this.$router.push("/rankingList/departmentRank");
      //     break;
      // }
    },
  },
};
</script>


<style  lang="less">
.select-underline
  .ant-select-selection--multiple
  .ant-select-selection__rendered {
  margin-left: 5px;
  margin-bottom: -3px;
  height: auto;
  max-height: 30px;
  max-width: 200px;
  overflow: auto;
  overflow-y: hidden;
}
.select-underline
  .ant-select-selection--multiple
  .ant-select-selection__choice {
  overflow: initial;
}
// 调整内部样式
.select-underline ul,
.select-underline ol {
  display: flex !important;
}
.select-underline .ant-select-selection--multiple > ul > li,
.select-underline
  .ant-select-selection--multiple
  .ant-select-selection__rendered
  > ul
  > li {
  margin-top: 3px;
  height: 22px;
  line-height: 22px;
  font-size: 14px;
  width: auto;
  max-height: 200px;
}
.select-underline .ant-select-search--inline .ant-select-search__field__wrap {
  max-width: 0px !important;
}
.select-underline .ant-select-selection__rendered::-webkit-scrollbar {
  /*滚动条整体样式*/
  height: 5px;
}
.select-underline .ant-select-selection__rendered::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: lightskyblue;
}
.select-underline .ant-select-selection__rendered::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: #ededed;
}
</style>
