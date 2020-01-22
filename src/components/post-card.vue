<template>
  <section v-if="Post" class="margin-top-32 max-width-550 container">
    <div class="card">
      <div class="card-content">
        <div class="card-header media">
          <div class="media j-between flex-wrap full-width pad1 p-0-2">
            <div class="media-left full-width">
              <h2 class="title is-4">
                <router-link
                  v-if="preview"
                  :to="{name: 'post', params: {postId: Post.id}}"
                >{{Post.title}}</router-link>
                <span
                  v-else
                  :contenteditable="editMode"
                  @input="fieldChanges($event, 'title')"
                  :style="{display: editMode ? 'block' : '' }"
                >{{Post.title}}</span>
              </h2>
            </div>
            <div class="media-right flex-1-0-auto">
              <time class="is-flex j-right items-flex-end flex-column">
                <span class="font-size-min">{{Post.createdAt | dateFormat}}</span>
                <span class="font-size-min">{{Author.name? Author.name : Author.login}}</span>
              </time>
            </div>
          </div>
        </div>
        <div class="content" v-if="preview">{{Description | substr}}</div>
        <div class="content" v-else>
          <div
            :contenteditable="editMode"
            @input="fieldChanges($event, 'fullText')"
          >{{Post.fullText}}</div>
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
              :to="preview ? {name: 'post', params: {postId: Post.id, editMode: true}} : {}"
            >Edit</b-button>
            <b-button
              type="is-light"
              icon-left="delete"
              v-if="Author.id===User.id && User.role === 1"
              @click="deletePost()"
            >Delete</b-button>
            <b-button type="is-light" v-if="User.role === 2" @click="likeUpdate()">
              <b-icon
                icon="thumb-up"
                size="is-small"
                :type="postHasUserLike() ? 'is-dark': 'is-favourite'"
              ></b-icon>
              <span>{{Post.likes}}</span>
            </b-button>
            <div v-else class="button" style="cursor: default; border: none">
              <b-icon icon="thumb-up" size="is-small" type="is-favourite"></b-icon>
              <span>{{Post.likes}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue, ProvideReactive } from "vue-property-decorator";
import IPost from "../models/post";
import AppUser from "../models/user";
import Axios from "axios";

export interface Editor {
  fullText: string | null;
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
  @Prop() incomingPost!: IPost;
  @Prop() preview!: boolean;
  private post!: IPost;
  private description?: string | null | InnerHTML;
  private static maxTitleLength: number = 16;
  private editMode!: boolean;
  private Author!: AppUser;
  private fullText!: InnerHTML | string;
  private title!: InnerHTML | string;
  get User(): AppUser {
    return this.$store.getters.getUser;
  }

  get Description() {
    return this.description;
  }

  get Post() {
    return this.post;
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
    this[field] = el.textContent as string;
  }

  runEditMode() {
    this.editMode = true;
    this.title = this.post.title;
    this.fullText = this.post.fullText;
  }

  savePost() {
    this.editMode = false;
    let newPost = {
      ...this.post,
      fullText: this.fullText,
      title: this.title,
      updatedAt: new Date(Date.now())
    };
    if (this.$route.name === "new") {
      this.$store.dispatch("AddNewPost", newPost);
    } else {
      this.$store.dispatch("UpdatePost", newPost);
    }
  }

  deletePost() {
    this.$store.dispatch("DeletePost", this.post.id);
    if (!this.preview) {
      this.$router.push("/");
    }
  }

  postHasUserLike(): boolean {
    return this.post.usersLiked.indexOf(this.User.id) >= 0;
  }

  likeUpdate() {
    const i = this.post.usersLiked.indexOf(this.User.id);
    if (i >= 0) {
      this.post.usersLiked.splice(i, 1);
      this.post.likes--;
    } else {
      this.post.usersLiked.push(this.User.id);
      this.post.likes++;
    }
    this.$store.dispatch("UpdatePost", this.post);
  }

  beforeMount() {
    if (this.incomingPost) {
      this.post = this.incomingPost;
    } else {
      this.post = {
        author: this.User,
        id: Date.now(),
        userId: this.User.id,
        createdAt: new Date(Date.now()),
        likes: 0,
        title: "",
        description: "",
        fullText: ""
      } as IPost;
    }
    this.description = this.post.description
      ? this.post.description
      : this.post.fullText;
    if (!this.post.author) this.getPostAuthor();
    else {
      this.Author = this.post.author;
    }
  }
  mounted() {
    if (this.$route.params.editMode || this.$route.name === "new") {
      this.runEditMode();
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
