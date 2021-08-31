export default [
  {
    path: "advertisingCampaign",
    name: "advertisingCampaign",
    component: () => import("../../views/project/advertisingCampaign.vue"),
  },
  {
    path: "projectInsight",
    name: "projectInsight",
    component: () => import("../../views/project/projectInsight.vue"),
  },
  {
    path: "anomalyTraffic",
    name: "anomalyTraffic",
    component: () => import("../../views/project/anomalyTraffic.vue"),
  },
];
