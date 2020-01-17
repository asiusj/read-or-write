import Vue from 'vue';
import VueRouter from 'vue-router';
import Base from '@/components/base.vue';
import Post from '@/components/post.vue';
import TextPage from '@/components/text-page.vue';
import Auth from '@/components/auth.vue';
import PostList from '@/components/post-list.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'home',
        component: Base
    },
    {
        path: '/posts/:page',
        name: 'post-list',
        component: Base,
        props: true
    },
    {
        path: '/post/:postId',
        name: 'post',
        component: Post,
        props: true
    },
    {
        path: '/user/:userId',
        name: 'user',
        component: Post,
        props: true
    },
    {
        path: '/about',
        name: 'about',
        component: TextPage,
        props: {
            pageId: 0
        }
    },
    {
        path: '/auth',
        name: 'auth',
        component: Auth
    }
];

const router = new VueRouter({
    routes
});

export default router;
