<template>
  <section>
    <PostCard v-if="Post" :post="Post" />
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import PostCard from "@/components/post-card.vue";
import IPost from "@/models/post";
import Axios from "axios";

@Component({
  components: {
    PostCard
  }
})
export default class Post extends Vue {
  get AllPosts(): IPost[] {
    return this.$store.getters.getAllPosts;
  }
  get Post(): IPost | undefined {
    let post: IPost | undefined;
    if (this.AllPosts.length) {
      post = this.AllPosts.find(item => {
        return item.id === parseInt(this.$route.params.postId);
      });
    } else {
      Axios.get(
        process.env.VUE_APP_API_URL + "/posts?id=" + this.$route.params.postId
      ).then(response => {
        this.$store.dispatch("SetAllPosts", response.data);
      });
    }

    return post;
  }
}
</script>

<style lang="scss" scoped>
</style>
