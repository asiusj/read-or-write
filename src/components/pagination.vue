<template>
  <section class="max-width-550 container">
    <hr />
    <b-pagination
      :total="postsCount"
      :current.sync="currentPostPage"
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
        :to="`/posts/${props.page.number}`"
      >{{ props.page.number }}</b-pagination-button>
    </b-pagination>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import PostCard from "@/components/post-card.vue";
import IPost from "@/models/post";
import Axios from "axios";

@Component({
  data() {
    return {
      postsCount: 0
    };
  }
})
export default class Pagination extends Vue {
  @Prop() currentPostPage!: number;
  @Prop() showPostPerPage!: number;
  postsCount!: number;
  getAllPostsCount() {
    Axios.get<IPost[]>(process.env.VUE_APP_API_URL + "/posts").then(
      response => {
        this.postsCount = response.data.length;
      }
    );
  }
  mounted() {
    this.getAllPostsCount();
  }
}
</script>

<style lang="scss" scoped>
</style>
