<template>
  <a-layout class="global-ctn">
    <GlobalSider />

    <a-layout>
      <GlobalHeader />
      <a-layout-content class="body-ctn">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import GlobalSider from "./GlogalSider.vue";
import GlobalHeader from "./GlogalHeader.vue";
import { mapActions } from "vuex";

export default {
  name: "BaseLayout",
  components: {
    GlobalSider,
    GlobalHeader,
  },
  methods: {
    ...mapActions(["getUserRootList"]),
  },
  async created() {
    await this.getUserRootList();
  },
};
</script>

<style scope lang="scss">
.global-ctn {
  min-height: 100%;

  .body-ctn {
    padding: 20px;
    background: #eff1f2;
  }
}
</style>
