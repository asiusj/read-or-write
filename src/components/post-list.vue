<template>
  <section>
    <div class="container is-centered">
      <div class="column pt-0">
        <PostCard v-for="post in Posts" :key="post.id" :post="post" :preview="true" />
        <Pagination :currentPostPage="currentPostPage + 1" :showPostPerPage="showPostPerPage" />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import PostCard from "@/components/post-card.vue";
import Pagination from "@/components/pagination.vue";
import IPost from "@/models/post";
import Axios from "axios";

@Component({
  components: {
    PostCard,
    Pagination
  }
})
export default class PostList extends Vue {
  @Prop() userId!: number;
  currentPostPage: number = 0;
  showPostPerPage: number = 10;

  get Posts(): IPost[] {
    let posts: IPost[] = this.$store.getters.getAllPosts;
    posts = posts.sort((a, b) => {
      return a.id - b.id;
    });
    console.log(posts);
    posts = posts.slice(
      this.currentPostPage * this.showPostPerPage
    );
    console.log(posts);
    console.log(
      this.currentPostPage * this.showPostPerPage,
      this.showPostPerPage
    );
    return posts;
  }

  getCurrentPagePosts() {
    Axios.get(
      process.env.VUE_APP_API_URL +
        "/posts?_limit=" +
        this.showPostPerPage +
        "&_start=" +
        this.currentPostPage * this.showPostPerPage
    ).then(response => {
      this.$store.dispatch("SetAllPosts", response.data);
    });
  }
  mounted() {
    if (this.$route.params.page) {
      this.currentPostPage = parseInt(this.$route.params.page) - 1;
    }
    this.getCurrentPagePosts();
  }
}
</script>

<style lang="scss" scoped>
</style>
