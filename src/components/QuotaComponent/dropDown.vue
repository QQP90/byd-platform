<template>
  <div
    class="quota-dropDown"
    :style="
      show
        ? openMode === 'right'
          ? { display: 'block', bottom: '-100px', right: '120px' }
          : { display: 'block', top: '40px', left: offsetLeft }
        : { display: 'none' }
    "
  >
    <div class="quota-tabs">
      <div class="quota-row" v-for="(item, index) in optionsList" :key="index">
        <span
          :class="{
            'row-title': true,
            'can-select': selectAll,
            selected: selectedType(item),
          }"
          @click="clickTypeItem(item)"
          >{{ item.name }}</span
        >
        <div class="quota-tab-ctn">
          <span
            @click="clickItem(obj, item.id)"
            :class="{ selected: obj.selected, disabled: !canAdd }"
            v-for="obj in item.children"
            :key="obj.id"
            >{{ obj.name }}</span
          >
        </div>
      </div>
    </div>

    <Footer
      :selectAll="selectAll"
      :close="close"
      :confirm="dropConfirm"
      :selectAllItem="selectAllItem"
      :selectAllStatus="selectAllStatus"
    />
  </div>
</template>

<script>
import Footer from "./footer.vue";

export default {
  name: "QuotaDropDown",
  props: {
    show: {
      type: Boolean,
    },
    selectAll: {
      type: Boolean,
    },
    maxSelect: {
      type: Number,
      require: true,
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
    selectItem: {
      type: Function,
    },
    selectType: {
      type: Function,
    },
    selectAllItem: {
      type: Function,
    },
    selectAllStatus: {
      type: Boolean,
    },
    selectTypeList: {
      type: Array,
    },
    canAdd: {
      type: Boolean,
    },
    openMode: {
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
    optionsList() {
      const { values, options } = this;
      const newList = [];

      options.forEach((item) => {
        const { name, children, id } = item;

        let newChildren = [];

        children.forEach((child) => {
          const { name, id } = child;

          const selected = values.some((item) => item.id === child.id);

          newChildren.push({
            name,
            id,
            selected,
          });
        });

        newList.push({
          name,
          id,
          children: newChildren,
        });
      });

      return newList;
    },
    offsetLeft() {
      const { parentOffset } = this;
      const { innerWidth } = window;
      const difference = innerWidth - parentOffset;

      return difference < 512 ? `${difference - 512 - 20}px` : 0;
    },
  },
  methods: {
    clickItem(obj, parentId) {
      const { selectItem } = this;
      selectItem(obj, parentId);
    },
    clickTypeItem(obj) {
      const { selectType, selectAll } = this;
      selectAll && selectType(obj);
    },
    dropConfirm() {
      const { confirm } = this;
      confirm();
    },
    selectedType(obj) {
      const { selectTypeList } = this;
      return selectTypeList.some((item) => {
        return obj.id === item;
      });
    },
  },
  components: {
    Footer,
  },
};
</script>

<style lang="scss" scoped>
.quota-dropDown {
  position: absolute;
  width: 512px;
  padding: 16px 20px 0;
  background: #fff;
  box-shadow: 0px 0px 20px #ddd;
  transition: all 0.2s linear;
  z-index: 10;
  .quota-tabs {
    max-height: 472px;
    overflow: auto;
  }
  .quota-row {
    display: flex;
    font-size: 12px;
    cursor: default;

    .row-title {
      margin-right: 20px;
      padding: 5px 8px;
      height: 28px;
      color: #212121;
      font-size: 14px;
      &.can-select {
        &:hover,
        &.selected {
          background: #eff1f2;
        }
      }
    }

    .quota-tab-ctn {
      width: 370px;
      min-height: 25px;
      color: #7e8294;

      & > span {
        display: inline-block;
        margin: 0 5px 6px;
        padding: 5px 8px;
        font-size: 14px;
        &.disabled {
          color: #bebebe;
          cursor: not-allowed;
        }

        &:hover:not(.disabled),
        &.selected {
          background: #e8f3fa;
          color: #212121;
          cursor: default;
        }
      }
    }
  }
}
</style>
