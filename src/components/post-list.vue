<template>
  <section>
    <div class="container is-centered" v-if="Posts.length">
      <div class="column pt-0">
        <PostCard v-for="post in Posts" :key="post.id" :incomingPost="post" :preview="true" />
        <Pagination
          :currentPostPage="currentPostPage"
          :showPostPerPage="showPostPerPage"
          :key="'pagination'+currentPostPage"
        />
      </div>
    </div>
    <NoConnection v-else />
  </section>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
  Watch,
  Provide,
  PropSync
} from "vue-property-decorator";
import PostCard from "@/components/post-card.vue";
import Pagination from "@/components/pagination.vue";
import IPost from "@/models/post";
import Axios from "axios";
import NoConnection from "@/views/no-connection.vue";

@Component({
  components: {
    PostCard,
    Pagination,
    NoConnection
  }
})
export default class PostList extends Vue {
  currentPostPage: number = 1;
  showPostPerPage: number = 10;
  posts!: IPost[];

  get Posts(): IPost[] {
    let posts: IPost[] = this.$route.params.userId
      ? this.$store.getters.getUserPosts
      : this.$store.getters.getAllPosts;
    posts = posts.sort((a, b) => {
      return a.id - b.id;
    });
    if (posts.length >= this.showPostPerPage) {
      posts = posts.slice(
        (this.currentPostPage - 1) * this.showPostPerPage,
        this.showPostPerPage + (this.currentPostPage - 1) * this.showPostPerPage
      );
    }
    return posts;
  }

  getCurrentPagePosts() {
    Axios.get(
      process.env.VUE_APP_API_URL +
        "/posts?_limit=" +
        this.showPostPerPage +
        "&_page=" +
        this.currentPostPage +
        (this.$route.params.userId
          ? "&_userId=" + this.$route.params.userId
          : "")
    ).then(response => {
      this.$store.dispatch("SetPosts", response.data);
    });
  }
  mounted() {
    if (this.$route.params.page) {
      this.currentPostPage = parseInt(this.$route.params.page);
    }
    this.getCurrentPagePosts();
  }
  @Watch("$route", { immediate: true, deep: true })
  onUrlChange(newVal: any) {
    if (newVal.params.page) {
      this.currentPostPage = newVal.params.page;
    } else {
      this.currentPostPage = 1;
    }
    this.getCurrentPagePosts();
  }
}
</script>

<style lang="scss" scoped>
</style>
