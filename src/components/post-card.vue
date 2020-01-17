<template>
  <section class="margin-top-32 max-width-550 container">
    <div class="card">
      <div class="card-content">
        <div class="card-header media">
          <div class="media j-between full-width pad1 p-0-2">
            <div class="media-left">
              <h2 class="title is-4">
                <router-link
                  v-if="preview"
                  :to="{name: 'post', params: {postId: post.id}}"
                >{{post.title}}</router-link>
                <span v-else>{{post.title}}</span>
              </h2>
            </div>
            <div class="media-right">
              <time class="is-flex j-right items-flex-end flex-column">
                <span class="font-size-min">{{post.createdAt | dateFormat}}</span>
                <span class="font-size-min">{{Author.name? Author.name : Author.login}}</span>
              </time>
            </div>
          </div>
        </div>
        <div class="content" v-if="preview">{{Description | descriptionLength}}</div>
        <div class="content" v-else>
          <div>{{post.fullText}}</div>
          <div class="card-footer"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import IPost from "../models/post";
import AppUser from "../models/user";
import Axios from "axios";
@Component({
  data() {
    return {
      Author: {} as AppUser
    };
  }
})
export default class PostCard extends Vue {
  @Prop() post!: IPost;
  @Prop() preview!: boolean;
  Author!: AppUser;
  description = this.post.description
    ? this.post.description
    : this.post.fullText;

  get Description() {
    return this.description;
  }

  getPostAuthor() {
    Axios.get<AppUser[]>(
      process.env.VUE_APP_API_URL + "/users?id=" + this.post.userId
    ).then(response => {
      this.Author = response.data[0];
      let newPost = {
        ...this.post,
        ...{ author: this.Author }
      };
      this.$store.dispatch("UpdatePost", newPost);
    });
  }
  mounted() {
    if (!this.post.author) this.getPostAuthor();
    else {
      this.Author = this.post.author;
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
