<template>
  <section>
    <div class="container is-centered" v-if="Posts.length">
      <div class="column pt-0">
        <PostCard v-for="post in Posts" :key="post.id" :post="post" :preview="true" />
        <Pagination
          :currentPostPage="currentPostPage + 1"
          :showPostPerPage="showPostPerPage"
          :key="'pagination'+currentPostPage"
        />
      </div>
    </div>
    <NoConnection v-else/>
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
  },
  data() {
    return {
      // Posts: []
    };
  }
})
export default class PostList extends Vue {
  @Prop() userId!: number;
  @Prop() page!: string;
  currentPostPage: number = 0;
  showPostPerPage: number = 10;
  posts!: IPost[];
  // @Provide() Posts: IPost[] = this.getPosts();
  get Posts(): IPost[] {
    let posts: IPost[] = this.$store.getters.getAllPosts;
    posts = posts.sort((a, b) => {
      return a.id - b.id;
    });
    if (posts.length >= this.showPostPerPage) {
      posts = posts.slice(
        this.currentPostPage * this.showPostPerPage,
        this.showPostPerPage + this.currentPostPage * this.showPostPerPage
      );
    }

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
      console.log(this.$route.params.page);
      this.currentPostPage = parseInt(this.$route.params.page) - 1;
    }
    this.getCurrentPagePosts();
  }
  @Watch("$route", { immediate: true, deep: true })
  onUrlChange(newVal: any) {
    if (newVal.params.page) {
      this.currentPostPage = newVal.params.page - 1;
    } else {
      this.currentPostPage = 0;
    }
    this.getCurrentPagePosts();
  }
}
</script>

<style lang="scss" scoped>
</style>
