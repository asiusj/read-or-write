import Vue from 'vue';
import Vuex from 'vuex';
import AppUser, { Guest } from '@/models/user';
import IPost from '@/models/post';
import Cache from '@/models/cache';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: Guest as AppUser,
        cache: {
            allPost: [],
            textPages: [],
            userPosts: []
        } as Cache
    },
    mutations: {
        setUser: (state, user: AppUser) => {
            state.user = user;
        },
        setAllPosts: (state, posts: IPost[]) => {
            if (state.cache.allPost.length) {
                posts = posts.filter(post => {
                    let notExist = true;
                    state.cache.allPost.forEach(existingPost => {
                        if (existingPost.id === post.id) {
                            notExist = false;
                        }
                    });
                    return notExist;
                });
                state.cache.allPost = [...state.cache.allPost, ...posts];
            } else {
                state.cache.allPost = posts;
            }
        },
        updatePost: (state, post: IPost) => {
            let postIndex = state.cache.allPost.findIndex(item => {
                if (item.id === post.id) {
                    return true;
                }
            });
            state.cache.allPost[postIndex] = post;
        }
    },
    actions: {
        SetUser: (ctx, user: AppUser) => {
            ctx.commit('setUser', user);
        },
        SetAllPosts: (ctx, posts: IPost[] | IPost) => {
            let p = posts as IPost[];
            if (!p.length) {
                p = new Array();
                p.push(posts as IPost);
            }
            ctx.commit('setAllPosts', p);
        },
        LogoutUser: ctx => {
            ctx.commit('setUser', Guest);
        },
        UpdatePost: (ctx, post: IPost) => {
            ctx.commit('updatePost', post);
        }
    },
    modules: {},
    getters: {
        getUser: state => {
            return state.user;
        },
        getUserPosts: (state, userId: number): IPost[] => {
            let userPosts = state.cache.allPost.filter(item => {
                return item.userId === userId;
            });
            return userPosts;
        },
        getAllPosts: (state): IPost[] => {
            return state.cache.allPost;
        }
    }
    // plugins: [createPersistedState()]
});
