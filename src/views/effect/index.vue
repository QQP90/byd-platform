<template>
  <div class="effect-ctn">
    <a-tabs v-model="currentTabs" @tabClick="tabsChange" :animated="false">
      <a-tab-pane v-for="item in tabsList" :key="item.router" :tab="item.name">
      </a-tab-pane>
    </a-tabs>
    <!-- <div class="effect-data-type-ctn">
      <a-checkbox-group
        :options="checkboxOption"
        @change="checkboxChange"
        :value="effectDataType"
      ></a-checkbox-group>
    </div> -->
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Effect",
  computed: {
    ...mapState({
      effectDataType: (state) => [state.effectDataType],
    }),
    checkboxOption() {
      return [
        { label: "正常流量", value: 1 },
        { label: "异常流量", value: 2 },
      ];
    },
  },
  data() {
    return {
      currentTabs: "indexPanel",
      tabsList: [
        {
          name: "关键指标看板",
          router: "indexPanel",
        },
        {
          name: "趋势分析",
          router: "trendAnalysis",
        },
        {
          name: "指标占比分析",
          router: "indexProportion",
        },
        {
          name: "漏斗分析",
          router: "funnelAnalysis",
        },
        {
          name: "区域分析",
          router: "regionalAnalysis",
        },
        {
          name: "双指标分析",
          router: "indexAnalysis",
        },
      ],
    };
  },
  mounted() {
    const { name } = this.$route;
    this.currentTabs = name || "indexPanel";
  },
  methods: {
    tabsChange(key) {
      this.$store.commit("SET_EFFECT_DATA_TYPE", 1);
      this.$router.push(`/effect/${key}`);
    },
    checkboxChange(values) {
      if (values.length === 1) {
        this.$store.commit("SET_EFFECT_DATA_TYPE", values[0]);
        return;
      }
      if (values.length === 2) {
        const { effectDataType } = this;
        const currentValue = effectDataType[0];

        values.some((value) => {
          if (value != currentValue) {
            this.$store.commit("SET_EFFECT_DATA_TYPE", value);
            return;
          }
        });
      }
    },
  },
  components: {},
  watch: {
    $route(newVal) {
      const { name } = newVal;
      this.currentTabs = name || "indexPanel";
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
