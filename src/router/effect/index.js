export default [
  {
    path: 'indexPanel',
    name: 'indexPanel',
    component: () => import('../../views/effect/indexPanel.vue')
  },
  {
    path: 'trendAnalysis',
    name: 'trendAnalysis',
    component: () => import('../../views/effect/trendAnalysis.vue')
  },
  {
    path: 'indexProportion',
    name: 'indexProportion',
    component: () => import('../../views/effect/indexProportion.vue')
  },
  {
    path: 'funnelAnalysis',
    name: 'funnelAnalysis',
    component: () => import('../../views/effect/funnelAnalysis.vue')
  },
  {
    path: 'regionalAnalysis',
    name: 'regionalAnalysis',
    component: () => import('../../views/effect/regionalAnalysis.vue')
  },
  {
    path: 'indexAnalysis',
    name: 'indexAnalysis',
    component: () => import('../../views/effect/indexAnalysis.vue')
  }
]