<template>
  <div class="insight-tabs-ctn" ref="tabsCtn">
    <div
      :class="scrollLeft === 0 ? 'insight-btn disabled' : 'insight-btn'"
      @click="insightClick('left')"
    >
      <a-icon type="left" />
    </div>

    <div class="insight-tabs-scroll" :style="`width:${ctnWidth - 48 * 2}px`">
      <div
        class="insight-tabs"
        :style="`left:${scrollLeft}px`"
        ref="tabsScroll"
      >
        <div
          v-for="item in tabsList"
          :class="currnetTab === item.id ? 'insight-tab selected' : 'insight-tab'"
          :key="item.id"
          @click="clickToSelect(item.id)"
        >
          <p>{{ item.name }}</p>
          <p>{{ item.value }}</p>
        </div>
      </div>
    </div>

    <div
      :class="scrollLeft === maxLeft ? 'insight-btn disabled' : 'insight-btn'"
      @click="insightClick('right')"
    >
      <a-icon type="right" />
    </div>
  </div>
</template>

<script>
export default {
  name: "InsightTabsScroll",
  model: {
    prop: "currnetTab",
  },
  props: {
    tabsList: {
      type: Array,
      required: true,
    },
    currnetTab: {
      type: String,
      default: '0',
    },
  },
  data() {
    return {
      ctnWidth: 1450,
      scrollLeft: 0,
      maxLeft: 0,
    };
  },
  computed: {},
  mounted() {
    this.ctnWidth = this.$refs.tabsCtn.clientWidth;
    const { clientWidth } = this.$refs.tabsScroll;
    const { ctnWidth } = this;
    const maxLeft = -(clientWidth - (ctnWidth - 48 * 2));
    this.maxLeft = maxLeft;
  },
  methods: {
    insightClick(type) {
      const { scrollLeft, maxLeft } = this;
      let newLeft;

      if (type === "right") {
        newLeft = scrollLeft - 110;
        this.scrollLeft = newLeft < maxLeft ? maxLeft : newLeft;
        return;
      }
      if (type === "left") {
        newLeft = scrollLeft + 110;
        this.scrollLeft = newLeft > 0 ? 0 : newLeft;
        return;
      }
    },
    clickToSelect(index) {
      this.selectedTab = index;

      this.$emit("input", index);
      this.$emit("change", index);
    },
  },
};
</script>

<style lang="less" scoped>
.insight-tabs-ctn {
  display: flex;
  width: 100%;
  height: 48px;
  background: #fff;
  .insight-btn {
    width: 48px;
    height: 48px;
    line-height: 48px;
    font-size: 28px;
    text-align: center;
    color: #ddd;
    cursor: pointer;
    transition: all 0.2s linear;
    &:hover {
      color: #eaeaea;
    }
    &.disabled {
      cursor: not-allowed;
    }
  }
  .insight-tabs-scroll {
    position: relative;
    overflow: hidden;
    .insight-tabs {
      display: flex;
      position: absolute;
      top: 0;
      height: 100%;
      transition: all 0.3s ease-out;
      .insight-tab {
        border: 1px solid rgba(0, 0, 0, 0.14901960784313725);
        border-radius: 2px;
        margin-right: 10px;
        padding: 6px 5px 0;
        min-width: 100px;
        height: 48px;
        background: #fff;
        text-align: center;
        font-size: 12px;
        cursor: pointer;

        &.selected {
          border-color: #0073c6;
          background: #0073c6;
          color: #fff;
        }
        &:last-child {
          margin-right: 0;
        }
        & > p {
          margin: 0;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>