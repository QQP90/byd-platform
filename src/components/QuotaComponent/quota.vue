<template>
  <div
    class="quota-wrapper"
    :style="styleObj"
    v-click-outside="handleOutSide"
    ref="wrapper"
  >
    <div class="quota-select" @click="showDrop">
      <span>{{ inputString }}</span>
      <a-icon
        :class="{ 'select-icon': true, rotate: show }"
        type="down"
      ></a-icon>
    </div>

    <DropDown
      :show="show"
      :options="options"
      :values="valuesList"
      :selectAll="selectAll"
      :maxSelect="maxSelect"
      :close="closeDrop"
      :confirm="confirm"
      :selectItem="selectItem"
      :selectAllItem="selectAllItem"
      :selectAllStatus="selectAllStatus"
      :selectType="selectType"
      :selectTypeList="selectTypeList"
      :canAdd="canAdd"
      :openMode="openMode"
      :parentOffset="offsetLeft"
    />
  </div>
</template>

<script>
import DropDown from "./dropDown.vue";
import ClickOutside from "vue-click-outside";

const initOffsetLeft = (element, count) => {
  if (element.nodeName === "BODY") {
    return count + element.offsetLeft;
  } else {
    return initOffsetLeft(element.offsetParent, count + element.offsetLeft);
  }
};

export default {
  name: "QuotaComponent",
  props: {
    placeholder: {
      type: String,
      default: "请选择",
    },
    styleObj: {
      type: Object,
    },
    selectAll: {
      type: Boolean,
      default: false,
    },
    max: {
      type: Number,
      default: 2,
    },
    options: {
      type: Array,
      default: () => {
        return [];
      },
    },
    values: {
      type: Array,
      default: () => {
        return [];
      },
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
    openMode: {
      type: String,
      default: "left",
    },
  },
  computed: {
    maxSelect() {
      return this.selectAll ? 9999 : this.max;
    },
    canAdd() {
      const { valuesList, maxSelect } = this;
      // 如果可选最大值为1 则不开启禁用
      if (maxSelect === 1) {
        return true;
      }
      return valuesList.length < maxSelect;
    },
    inputString() {
      const { placeholder, valuesList } = this;
      const stringList = valuesList.map((item) => item.name);
      return stringList.length ? stringList.join("&") : placeholder;
    },
    allItems() {
      const { options } = this;
      const allItems = [];
      options.forEach((item) => {
        const { children } = item;
        children.forEach((child) => {
          allItems.push({ ...child, parentId: item.id });
        });
      });
      return allItems;
    },
    selectAllStatus() {
      const { allItems, valuesList } = this;
      return allItems.length === valuesList.length;
    },
  },
  data() {
    return {
      show: this.isOpen,
      valuesList: JSON.parse(JSON.stringify(this.values)),
      selectTypeList: [],
      offsetLeft: 0,
    };
  },
  mounted() {
    const { wrapper } = this.$refs;
    const offsetLeft = initOffsetLeft(wrapper, 0);
    this.offsetLeft = offsetLeft;
  },
  methods: {
    showDrop() {
      this.show = true;
    },
    closeDrop() {
      if (this.show) {
        this.show = false;
      }
    },
    handleOutSide() {
      this.show && this.confirm();
    },
    confirm() {
      const { closeDrop, valuesList } = this;
      const values = JSON.parse(JSON.stringify(valuesList));
      this.$emit("input", values);
      this.$emit("change", values);
      this.$emit("onConfirm", values);
      closeDrop();
    },
    selectItem(obj, parentId) {
      const { id } = obj;
      const {
        valuesList,
        canAdd,
        selectTypeList,
        options,
        selectAll,
        maxSelect,
      } = this;
      let index = -1;
      valuesList.some((item, i) => {
        if (item.id === id) {
          index = i;
          return;
        }
      });

      if (maxSelect === 1) {
        // 如果可选最大值为1 直接替换原已选
        valuesList.shift();
        valuesList.push({ ...obj, parentId });
        return false;
      }

      if (index === -1) {
        // 添加到已选
        canAdd && valuesList.push({ ...obj, parentId });

        if (selectAll) {
          let selectChildCount = 0;
          let childrenLength = 0;

          options.some((item) => {
            const { id, children } = item;
            childrenLength = children.length;

            if (id === parentId) {
              valuesList.forEach((item) => {
                const { parentId } = item;
                if (parentId === id) {
                  selectChildCount++;
                }
              });
              return;
            }
          });

          if (
            selectChildCount === childrenLength &&
            !selectTypeList.includes(parentId)
          ) {
            selectTypeList.push(parentId);
          }
        }
      } else {
        // 从已选删除
        valuesList.splice(index, 1);

        if (selectAll) {
          selectTypeList.some((item, index) => {
            if (item === parentId) {
              selectTypeList.splice(index, 1);
              return;
            }
          });
        }
      }
    },
    selectType(obj) {
      const { id, children } = obj;
      const { selectTypeList, valuesList } = this;
      const index = selectTypeList.indexOf(id);

      const dealChildren = (add) => {
        children.forEach((child) => {
          const { name, id } = child;
          let equalIndex = -1;

          valuesList.some((item, index) => {
            const itemId = item.id;
            if (id === itemId) {
              equalIndex = index;
              return;
            }
          });

          if (add && equalIndex === -1) {
            valuesList.push({
              name,
              id,
            });
          }

          if (!add && equalIndex > -1) {
            valuesList.splice(equalIndex, 1);
          }
        });
      };

      if (index > -1) {
        selectTypeList.splice(index, 1);
        dealChildren(false);
      } else {
        selectTypeList.push(obj.id);
        dealChildren(true);
      }
    },
    selectAllItem() {
      const { valuesList, allItems, options } = this;
      if (valuesList.length < allItems.length) {
        this.valuesList = [...allItems];
        options.forEach((item) => {
          this.selectTypeList.push(item.id);
        });
      } else {
        this.valuesList = [];
        this.selectTypeList = [];
      }
    },
  },
  directives: {
    ClickOutside,
  },
  components: {
    DropDown,
  },
  watch: {
    values(newValue) {
      this.valuesList = JSON.parse(JSON.stringify(newValue));
    },
  },
};
</script>

<style lang="scss" scoped>
.quota-wrapper {
  position: relative;
  width: 160px;
  user-select: none;
  background: #fff;

  .quota-select {
    position: relative;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    width: 100%;
    height: 32px;
    line-height: 32px;
    padding: 0 22px 0 12px;
    font-size: 12px;
    color: #212121;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    .select-icon {
      position: absolute;
      top: 10px;
      right: 10px;
      transition: all 0.2s linear;
      &.rotate {
        top: 9px;
        transform: rotate(180deg);
      }
    }
  }
}
</style>
