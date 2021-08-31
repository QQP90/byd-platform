export default [
  {
    path: "detailData",
    name: "detailData",
    component: () => import("../../views/detailed/detailData.vue"),
  },
  {
    path: "dataStatistics",
    name: "dataStatistics",
    component: () => import("../../views/detailed/dataStatistics.vue"),
  },
];
