import Vue from "vue";
import Vuex from "vuex";
import router from '@/router/index';
import departmentRank from "./rank/departmentRank";
import mediaRank from "./rank/mediaRank";
import projectRank from "./rank/projectRank";
import indexProportion from "./effect/proportion";
import doubleAnalysis from "./effect/doubleAnalysis";
import projectInsight from './project/projectInsight'

import {
  getUserInfo,
  getProjectRight,
  getModulesRight,
  updatePassword,
  updateUserPhone,
  getUserRootList,
} from "@/service/user.js";
import { message } from "ant-design-vue";

import rankRouter from "@/router/rankingList";
import effectRouter from "@/router/effect";
import projectRouter from "@/router/project";
import detailedRouter from "@/router/detailed";

Vue.use(Vuex);

const defaultMenuList = [
  {
    name: "排行榜",
    icon: "bar-chart",
    routeName: "rankingList",
    modelRootId: 1,
  },
  {
    name: "投放效果分析",
    icon: "pie-chart",
    routeName: "effect",
    modelRootId: 2,
  },
  {
    name: "项目分析",
    icon: "folder",
    routeName: "project",
    modelRootId: 3,
  },
  {
    name: "明细数据查询",
    icon: "file-search",
    routeName: "detailed",
    modelRootId: 4,
  },
]

const routerMap = {
  rankingList: {
    path: "/rankingList",
    name: "rankingList",
    component: () => import("@/views/rankingList/index.vue"),
    redirect: "/rankingList/businessRank",
    children: [...rankRouter],
  },
  effect: {
    path: "/effect",
    name: "effect",
    component: () => import("@/views/effect/index.vue"),
    redirect: "/effect/indexPanel",
    children: [...effectRouter],
  },
  project: {
    path: "/project",
    name: "project",
    component: () => import("@/views/project/index.vue"),
    redirect: "/project/advertisingCampaign",
    children: [...projectRouter],
  },
  detailed: {
    path: "/detailed",
    name: "detailed",
    component: () => import("@/views/detailed/index.vue"),
    redirect: "/detailed/detailData",
    children: [...detailedRouter],
  }
}

export default new Vuex.Store({
  state: {
    menuList: [],
    currentRoute: null,
    userDetail: null,
    modulesData: [],
    projectData: [],
    routerShow: true, // 控制路由骨架屏
    effectDataType: 1,
    downloadAuth: false,
    userAuth: null,
  },
  mutations: {
    SET_MENU_LIST(state, payload) {
      state.menuList = payload;
    },
    SET_CURRENT_ROUTE(state, payload) {
      state.currentRoute = payload;
    },
    SET_USER_DETAIL(state, payload) {
      state.userDetail = payload;
    },
    SET_MODULES_DATA(state, payload) {
      state.modulesData = payload;
    },
    SET_PROJECT_DATA(state, payload) {
      state.projectData = payload;
    },
    SET_ROUTER_SHOW(state, bool) {
      state.routerShow = bool;
    },
    SET_EFFECT_DATA_TYPE(state, payload) {
      state.effectDataType = payload;
    },
    SET_DOWNLOAD_AUTH(state, payload) {
      state.downloadAuth = payload;
    },
    SET_USER_AUTH(state, payload) {
      state.userAuth = payload
    }
  },
  actions: {
    async getUserInfo(context) {
      try {
        const res = await getUserInfo();
        context.commit("SET_USER_DETAIL", res.data);
      } catch (err) {
        context.commit("SET_USER_DETAIL", null);
        console.error(err);
      }
    },
    async getProjectRight(context) {
      try {
        const res = await getProjectRight();
        context.commit("SET_PROJECT_DATA", res.data);
      } catch (err) {
        context.commit("SET_PROJECT_DATA", []);
        console.error(err);
      }
    },
    async getModulesRight(context) {
      try {
        const res = await getModulesRight();
        context.commit("SET_MODULES_DATA", res.data);
      } catch (err) {
        context.commit("SET_MODULES_DATA", []);
        console.error(err);
      }
    },
    async updatePassword(context, obj) {
      try {
        const res = await updatePassword(obj);
        message.success("修改成功");
      } catch (err) {
        message.error("修改失败");
        console.error(err);
      }
    },
    async updateUserPhone(context, obj) {
      try {
        const res = await updateUserPhone(obj);
        message.success("修改成功");
      } catch (err) {
        message.error("修改失败");
        console.error(err);
      }
    },

    // 获取用户权限
    async getUserRootList(context) {
      try {
        const res = await getUserRootList();
        const { frontList, userTypeId } = res.data
        const { currentRoute } = context.state

        const menuList = []
        defaultMenuList.forEach(menu => {
          const hasAuth = frontList.some(item => item.modelRootId == menu.modelRootId)
          if (hasAuth) {
            menuList.push(menu)
            router.addRoute(routerMap[menu['routeName']])
          }
        })

        if (menuList.length > 0) {
          router.addRoute({
            path: "*",
            redirect: `/${menuList[0].routeName}`,
          });

          if (!currentRoute) {
            context.commit('SET_CURRENT_ROUTE', menuList[0].routeName)
          }

          if (currentRoute === 'user') {
            menuList.push({
              name: "用户中心",
              icon: "user",
              routeName: "user",
            })
          }

        }

        context.commit("SET_MENU_LIST", menuList);
        context.commit("SET_ROUTER_SHOW", false);
        context.commit("SET_USER_AUTH", res.data);
      } catch (error) {
        message.error("获取用户权限失败");
        console.error(error)
      }
    },
  },
  modules: {
    departmentRank,
    mediaRank,
    projectRank,
    indexProportion,
    doubleAnalysis,
    projectInsight
  },
});
