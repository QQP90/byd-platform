<template>
  <div
    class="media-dropDown"
    :style="show ? { display: 'block', left: offsetLeft } : { display: 'none' }"
  >
    <div class="media-tabs">
      <span
        @click="clickItem(item)"
        v-for="item in options"
        :key="item.id"
        :class="{ selected: isSelected(item.id), disabled: item.disabled }"
      >
        {{ item.name }}
      </span>
    </div>

    <Footer
      :close="close"
      :confirm="dropConfirm"
      :selectAllStatus="selectAllStatus"
      :selectAllItem="selectAllItem"
      :mode="mode"
    />
  </div>
</template>

<script>
import Footer from "./footer.vue";

export default {
  name: "MediaDropDown",
  props: {
    show: {
      type: Boolean,
    },
    options: {
      type: Array,
      require: true,
    },
    values: {
      type: Array,
      require: true,
    },
    close: {
      type: Function,
    },
    confirm: {
      type: Function,
    },
    selectAllStatus: {
      type: Boolean,
    },
    selectAllItem: {
      type: Function,
    },
    selectItem: {
      type: Function,
    },
    mode: {
      type: String,
    },
    parentOffset: {
      type: Number,
    },
  },
  data() {
    return {};
  },
  computed: {
    offsetLeft() {
      const { parentOffset } = this;
      const { innerWidth } = window;
      const difference = innerWidth - parentOffset;

      return difference < 512 ? `${difference - 512 - 20}px` : 0;
    },
  },
  methods: {
    dropConfirm() {
      const { confirm } = this;
      confirm();
    },
    clickItem(obj) {
      const { selectItem } = this;
      selectItem(obj);
    },
    isSelected(objId) {
      const { values } = this;
      return values.some((item) => item.id === objId);
    },
  },
  components: {
    Footer,
  },
};
</script>

<style lang="scss" scoped>
.media-dropDown {
  position: absolute;
  top: 40px;
  width: 512px;
  min-height: 202px;
  padding: 16px 20px 0;
  background: #fff;
  box-shadow: 0px 0px 20px #ddd;
  transition: all 0.2s linear;
  z-index: 10;

  .media-tabs {
    min-height: 136px;
    color: #7e8294;
    & > span {
      display: inline-block;
      margin: 0 4px 6px 4px;
      padding: 5px 8px;

      &.disabled {
        background: #f5f5f5;
        color: rgba(0, 0, 0, 0.25);
        cursor: not-allowed;
      }

      &:hover,
      &.selected {
        &:not(.disabled) {
          background: #e8f3fa;
          color: #212121;
          cursor: default;
        }
      }
    }
  }
}
</style>