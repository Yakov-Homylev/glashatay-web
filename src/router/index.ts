import { createRouter, createWebHistory } from 'vue-router';
import Main from '@/pages/Main.vue';
import AdDetails from '@/pages/AdDetails.vue';
import CreateAd from '@/pages/CreateAd.vue';
import Auth from '@/pages/Auth.vue';
import User from '@/pages/User.vue';

const routes = [
    {
        path: '/',
        name: 'Main',
        component: Main,
    },
    {
        path: '/ad/:id',
        name: 'AdDetails',
        component: AdDetails,
        props: true,
    },
    {
        path: '/ad/create',
        name: 'CreateAd',
        component: CreateAd,
    },
    {
        path: '/auth',
        name: 'Auth',
        component: Auth,
    },
    {
        path: '/user/:id',
        name: 'User',
        component: User,
        props: true,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
