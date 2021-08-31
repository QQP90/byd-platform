<template>
  <div
    class="media-wrapper"
    :style="styleObj"
    v-click-outside="handleOutSide"
    ref="wrapper"
  >
    <div class="media-select" @click="showDrop">
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
      :close="closeDrop"
      :confirm="confirm"
      :selectAllStatus="selectAllStatus"
      :selectAllItem="selectAllItem"
      :selectItem="selectItem"
      :mode="mode"
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
  name: "MediaComponent",
  model: {
    prop: "values",
    event: "change",
  },
  props: {
    placeholder: {
      type: String,
      default: "请选择",
    },
    styleObj: {
      type: Object,
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
    mode: {
      type: String,
      default: "normal",
    },
  },
  computed: {
    inputString() {
      const { placeholder, valuesList } = this;
      const stringList = valuesList.map((item) => item.name);
      return stringList.length ? stringList.join("&") : placeholder;
    },
    selectAllStatus() {
      const { options, valuesList } = this;
      return options.length === valuesList.length;
    },
  },
  data() {
    return {
      show: this.isOpen,
      valuesList: JSON.parse(JSON.stringify(this.values)),
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
      if (this.show) this.confirm();
    },
    confirm() {
      const { closeDrop, valuesList } = this;
      const values = JSON.parse(JSON.stringify(valuesList));

      this.$emit("input", values);
      this.$emit("change", values);
      this.$emit("onConfirm", values);
      closeDrop();
    },
    selectItem(obj) {
      const { mode } = this;
      let valuesList = JSON.parse(JSON.stringify(this.valuesList));
      let index = -1;

      if (mode === "normal") {
        valuesList.shift();
        valuesList.push(obj);
      } else {
        valuesList.some((item, i) => {
          if (item.id === obj.id) {
            index = i;
            return;
          }
        });

        if (index > -1) {
          valuesList.splice(index, 1);
        } else {
          valuesList.push(obj);
        }
      }

      this.$emit("change", valuesList);

      // this.valuesList = valuesList;
    },
    selectAllItem() {
      const { valuesList, options } = this;
      if (valuesList.length === options.length) {
        this.$emit("change", []);
        // this.valuesList = [];
      } else {
        this.$emit("change", [...options]);
        // this.valuesList = [...options];
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
.media-wrapper {
  position: relative;
  width: 160px;
  user-select: none;

  .media-select {
    position: relative;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    width: 100%;
    height: 32px;
    line-height: 32px;
    padding: 0 22px 0 12px;
    font-size: 14px;
    color: #212121;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
