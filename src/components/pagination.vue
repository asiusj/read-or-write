<template>
  <section v-if="postsCount" class="max-width-550 container">
    <hr />
    <b-pagination
      :total="postsCount"
      :current.sync="CurrentPage"
      :range-before="1"
      :range-after="1"
      :per-page="showPostPerPage"
      :icon-prev="'chevron-left'"
      :icon-next="'chevron-right'"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page"
    >
      <b-pagination-button
        slot-scope="props"
        :page="props.page"
        :id="`page${props.page.number}`"
        tag="router-link"
        :to="($route.params.userId ? {name: 'user', params: {user: $route.params.userId,  page: parseInt(props.page.number)}} : {name: 'post-list', params: {page: props.page.number}})"
      >{{ props.page.number }}</b-pagination-button>
      <b-pagination-button
        slot="previous"
        slot-scope="props"
        :page="props.page"
        :tag="props.page.number < 1 ? 'a' : 'router-link'"
        :to="($route.params.userId ? {name: 'user', params: {user: $route.params.userId,  page: parseInt(props.page.number)}} : {name: 'post-list', params: {page: props.page.number}})"
      >
        <b-icon icon="chevron-left"></b-icon>
      </b-pagination-button>

      <b-pagination-button
        slot="next"
        slot-scope="props"
        :page="props.page"
        :tag="props.page.number > Math.ceil(postsCount / showPostPerPage) ? 'a' : 'router-link'"
        :to="($route.params.userId ? {name: 'user', params: {user: $route.params.userId,  page: parseInt(props.page.number)}} : {name: 'post-list', params: {page: props.page.number}})"
      >
        <b-icon icon="chevron-right"></b-icon>
      </b-pagination-button>
    </b-pagination>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import PostCard from "@/components/post-card.vue";
import IPost from "@/models/post";
import Axios from "axios";

@Component({
  data() {
    return {
      postsCount: 0,
      // CurrentPage: 1
    };
  }
})
export default class Pagination extends Vue {
  @Prop() currentPostPage!: number;
  @Prop() showPostPerPage!: number;
  get CurrentPage(): number {
    let cp: number;
    if (this.$route.params.page && !this.currentPostPage) {
      cp = parseInt(this.$route.params.page);
    } else {
      cp = this.currentPostPage;
    }
    return cp;
  }
  postsCount!: number;
  getAllPostsCount() {
    Axios.get<IPost[]>(
      process.env.VUE_APP_API_URL +
        "/posts" +
        (this.$route.params.userId
          ? "?userId=" + this.$route.params.userId
          : "")
    ).then(response => {
      this.postsCount = response.data.length;
    });
  }
  @Watch("$route", { immediate: true, deep: true })
  onUrlChange(newVal: any) {
    this.getAllPostsCount();
  }
  mounted() {
    this.getAllPostsCount();
  }
}
</script>

<style lang="scss" scoped>
</style>
