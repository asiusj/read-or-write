<template>
  <div class="container is-centered">
    <div class="column pt-0">
      <PostList />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import PostList from "@/components/post-list.vue";
import store from "@/store";

@Component({
  components: {
    PostList
  }
})
export default class Base extends Vue {
  get User() {
    return store.getters.getUser;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
