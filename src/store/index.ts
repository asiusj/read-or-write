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
            allPosts: [],
            textPages: []
        } as Cache
    },
    mutations: {
        setUser: (state, user: AppUser) => {
            Vue.set(state, 'user', user);
        },
        setAllPosts: (state, posts: IPost[]) => {
            if (state.cache.allPosts.length) {
                posts = posts.filter(post => {
                    let notExist = true;
                    state.cache.allPosts.forEach(existingPost => {
                        if (existingPost.id === post.id) {
                            notExist = false;
                        }
                    });
                    return notExist;
                });
                state.cache = {
                    ...state.cache,
                    allPosts: [...state.cache.allPosts, ...posts]
                };
            } else {
                state.cache = { ...state.cache, allPosts: posts };
            }
        },
        updatePost: (state, post: IPost) => {
            let postIndex = state.cache.allPosts.findIndex(item => {
                if (item.id === post.id) {
                    return true;
                }
            });
            Vue.set(state.cache.allPosts, postIndex, post);
        },
        deletePost: (state, postId: number) => {
            let postIndex = state.cache.allPosts.findIndex(item => {
                if (item.id === postId) {
                    return true;
                }
            });
            let newCache = state.cache;
            newCache.allPosts.splice(postIndex, 1);
            state = { ...state, cache: newCache };
        },
        addNewPost: (state, post: IPost) => {
            let newCache = state.cache;
            newCache.allPosts.push(post);
            state = { ...state, cache: newCache };
        }
    },
    actions: {
        SetUser: (ctx, user: AppUser) => {
            ctx.commit('setUser', user);
        },
        SetPosts: (ctx, posts: IPost[] | IPost) => {
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
        },
        DeletePost: (ctx, postId: number) => {
            ctx.commit('deletePost', postId);
        },
        AddNewPost: (ctx, post: IPost) => {
            ctx.commit('addNewPost', post);
        }
    },
    modules: {},
    getters: {
        getUser: state => {
            return state.user;
        },
        getUserPosts: state => {
            let userPosts = state.cache.allPosts.filter(item => {
                return item.userId === state.user.id;
            });
            return userPosts;
        },
        getAllPosts: (state): IPost[] => {
            return state.cache.allPosts;
        }
    },
    plugins: [createPersistedState()]
});
