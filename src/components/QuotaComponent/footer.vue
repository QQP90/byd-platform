<template>
  <div class="quota-footer">
    <a-checkbox v-if="selectAll" :checked="selectAllStatus" @change="selectAllItem">全选</a-checkbox>

    <div class="button-ctn">
      <a-button size="small" @click="close">取消</a-button>

      <a-button type="primary" size="small" @click="confirm">确定</a-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "QuotaFooter",
  props: {
    selectAll: {
      type: Boolean,
    },
    close: {
      type: Function,
    },
    confirm: {
      type: Function,
    },
    selectAllItem: {
      type: Function,
    },
    selectAllStatus: {
      type: Boolean,
    },
  },
  data() {
    return {};
  },
  computed: {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.quota-footer {
  border-top: 1px solid #eff1f2;
  height: 50px;
  line-height: 50px;

  .button-ctn {
    float: right;
    height: 100%;

    .ant-btn {
      border-radius: 2px;
      &:first-child {
        margin-right: 8px;
      }
    }
  }
}
</style>