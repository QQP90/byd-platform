<template>
  <span @click="download" class="down-load"><slot> 下载 </slot></span>
</template>
<script>
export default {
  props: {
    url: {
      type: String,
      default: "",
    },
  },
  computed: {
    downloadUrl() {
      const baseApiUrl = process.env.VUE_APP_BASE_URL;
      // const baseApiUrl = 'http://10.3.101.124:7100';
      const token = localStorage.getItem("token");
      return `${baseApiUrl}${this.url}&authorization=${token}`;
    },
  },
  methods: {
    download() {
      const userAgent = navigator.userAgent;
      if (userAgent.indexOf("Chrome") > -1) {
        window.open(this.downloadUrl, "_blank");
      } else {
        window.location.href = this.downloadUrl;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.down-load {
  display: inline-block;
  width: 77px;
  background-color: #0073c6;
  color: white;
  text-align: center;
  font-size: 12px;
  cursor: pointer;
}
</style>
