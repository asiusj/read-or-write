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
                <span
                  v-else
                  :contenteditable="editMode"
                  @input="fieldChanges($event, 'title')"
                >{{post.title}}</span>
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
          <div :contenteditable="editMode" @input="fieldChanges($event, 'body')">{{post.fullText}}</div>
        </div>
        <div class="card-footer j-right p-2">
          <div class="buttons">
            <b-button
              type="is-light"
              v-if="editMode"
              icon-left="content-save"
              @click="savePost()"
            >Save</b-button>
            <b-button
              type="is-light"
              icon-left="pencil"
              v-if="Author.id===User.id && User.role === 1 && !editMode"
              @click="runEditMode()"
              :tag="preview ? 'router-link' : 'button'"
              :to="preview ? {name: 'post', params: {postId: post.id, editMode: true}} : {}"
            >Edit</b-button>
            <b-button
              type="is-light"
              icon-left="delete"
              v-if="Author.id===User.id && User.role === 1"
            >Delete</b-button>
            <b-button type="is-light" icon-left="thumb-up" v-if="User.role === 2">{{post.likes}}</b-button>
          </div>
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

export interface Editor {
  body: string | null;
  title: string | null;
}

@Component({
  data() {
    return {
      Author: {} as AppUser,
      editMode: false
    };
  }
})
export default class PostCard extends Vue {
  @Prop() post!: IPost;
  @Prop() preview!: boolean;
  editMode!: boolean;
  body?: string | null | InnerHTML = this.post.fullText;
  title?: string | null | InnerHTML = this.post.title;
  Author!: AppUser;
  description = this.post.description
    ? this.post.description
    : this.post.fullText;

  get User(): AppUser {
    return this.$store.getters.getUser;
  }

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
        author: this.Author
      };
      this.$store.dispatch("UpdatePost", newPost);
    });
  }

  fieldChanges(e: Event, field: keyof Editor) {
    let el: HTMLElement = e.target as HTMLElement;
    this[field] = el.textContent;
  }

  runEditMode() {
    this.editMode = true;
  }

  savePost() {
    this.editMode = false;
    let newPost = {
      ...this.post,
      fullText: this.body,
      title: this.title
    };
    this.$store.dispatch("UpdatePost", newPost);
  }

  mounted() {
    if (this.$route.params.editMode) {
      this.editMode = true;
    }
    if (!this.post.author) this.getPostAuthor();
    else {
      this.Author = this.post.author;
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
