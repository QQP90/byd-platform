<template>
  <a-layout-sider
    :style="{
      flex: '0 0 190px',
      'max-width': '190px',
      'min-width': '190px',
      width: '190px',
    }"
    class="global-sider"
  >
    <div class="sider-logo">
      <img src="@/assets/img/logo.png" alt="" />
      <p>灵犀AI运营管理平台</p>
    </div>
    <a-skeleton
      active
      :paragraph="{
        rows: 4,
        width: ['100%', '100%', '100%', '100%'],
      }"
      :title="false"
      :loading="routerShow"
    >
      <a-menu @select="selectMenu" :selected-keys="[currentRoute]">
        <a-menu-item v-for="item in menuList" :key="item.routeName">
          <a-icon :type="item.icon"></a-icon>
          <span>{{ item.name }}</span>
        </a-menu-item>
      </a-menu>
    </a-skeleton>
  </a-layout-sider>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "GlobalSider",
  data() {
    return {};
  },
  computed: {
    ...mapState({
      menuList: (state) => state.menuList,
      currentRoute: (state) => state.currentRoute,
      routerShow: (state) => state.routerShow,
    }),
  },
  methods: {
    ...mapMutations(["SET_MENU_LIST", "SET_CURRENT_ROUTE"]),
    selectMenu({ key }) {
      if (key != "user") {
        const menuList = [...this.menuList];
        if (menuList[menuList.length - 1].routeName === "user") {
          const newMenuList = menuList.slice(0, menuList.length - 1);
          this.SET_MENU_LIST(newMenuList);
        }
      }

      this.SET_CURRENT_ROUTE(key);
      this.$router.push({ name: key });
    },
  },
  created() {
    const pattern = new RegExp(/\/[d|e|r|p|u][a-zA-Z]+/);
    const result = pattern.exec(window.location.href);
    let key = null;
    if (result) {
      key = result[0].replace("/", "");
      this.SET_CURRENT_ROUTE(key);
    }
  },
};
</script>

<style scope lang="scss">
.global-sider {
  background: #0073c6;

  .sider-logo {
    padding-top: 20px;
    text-align: center;
    color: #fff;
    font-size: 18px;
    p {
      margin-top: 10px;
    }
  }

  .ant-menu-inline,
  .ant-menu-vertical,
  .ant-menu-vertical-left {
    border-right: 0;
  }

  .ant-menu {
    background: #0073c6;
    color: #fff;
  }

  .ant-menu-item {
    padding-left: 40px;
  }

  .ant-menu-item:hover,
  .ant-menu-item-active,
  .ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open,
  .ant-menu-submenu-active,
  .ant-menu-submenu-title:hover {
    color: #0073c6;
    background: #e6f9ff;
  }

  .ant-menu-item-selected {
    color: #0073c6;
    font-weight: bold;
  }

  .ant-layout-sider-children {
    background: #0073c6;
  }
  .ant-skeleton {
    li {
      height: 40px;
    }
  }
}
</style>
