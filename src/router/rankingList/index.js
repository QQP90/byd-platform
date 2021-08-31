export default [
    {
        path: 'projectRank',
        name: 'projectRank',
        component: () => import('../../views/rankingList/projectRank.vue')
    },
    {
        path: 'departmentRank',
        name: 'departmentRank',
        component: () => import('../../views/rankingList/departmentRank.vue')
    },
    {
        path: 'businessRank',
        name: 'businessRank',
        component: () => import('../../views/rankingList/businessRank.vue')
    },
    {
        path: 'mediaRank',
        name: 'mediaRank',
        component: () => import('../../views/rankingList/mediaRank.vue')
    }
]