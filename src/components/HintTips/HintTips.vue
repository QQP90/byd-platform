<template>
  <span ref="container" class="hint-modal">
    <span @click="modalShow" class="title"><slot></slot></span>
    <div class="modal" v-show="isShow">
      <a-icon class="close-icon" type="close" @click="modalClose" />
      <p>{{ title }}</p>
      <div class="content-box" v-html="content">
        <div></div>
      </div>
    </div>
  </span>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    }, // 标题
    content: {
      type: String,
      default: "",
    }, // 内容块
  },
  data() {
    return {
      isShow: false, // 控制提示框吓显示
    };
  },
  mounted() {},
  methods: {
    modalShow() {
      if (this.isShow) {
        return;
      } else {
        this.isShow = true;
        window.addEventListener("mousedown", this.otherClose);
      }
    },
    modalClose() {
      this.isShow = false;
    },
    otherClose(e) {
      if (this.isShow === false) return;
      if (!this.$refs.container.contains(e.target)) this.isShow = false;
    },
  },
  destroyed() {
    window.removeEventListener("mousedown", this.otherClose);
  },
};
</script>
<style lang="less" scoped>
.hint-modal {
  position: relative;
  font-size: 12px;
}
.title {
  cursor: pointer;
  color: #7e8294;
}
.modal {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  padding: 16px 24px 24px 24px;
  background: #ffffff;
  border-radius: 4px;
  z-index: 1;
  box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05),
    0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);
  .close-icon {
    position: absolute;
    top: 10px;
    right: 10px;
  }
  .content-box {
    overflow: auto;
    max-height: 180px;
    width: 300px;
  }
  > p {
    margin-right: 24px;
  }
}
</style>
