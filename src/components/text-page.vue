<template>
  <section v-if="ready">
    <section class="hero is-dark">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">{{sourse.header}}</h1>
        </div>
      </div>
    </section>
    <div class="container is-centered margin-top-32">
      <div class="column">
        <article class="media">
          <div class="media-content">
            <div class="content">
              <div v-html="sourse.body"></div>
              <time class="margin-top-32 is-flex j-right">
                {{sourse.date | dateFormat}}  
                <span class="subtitle media-right">{{sourse.author}}</span>
              </time>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import axios from "axios";
import { ITextPage } from "@/models/cache";

@Component
export default class TextPage extends Vue {
  @Prop() pageId!: number;
  ready: boolean = false;
  sourse!: ITextPage;
  mounted() {
    this.getPage();
  }
  getPage() {
    axios
      .get<ITextPage[]>(process.env.VUE_APP_API_URL + "/text-pages")
      .then(responce => {
        let p: ITextPage[] = responce.data;
        let targetPage = p.filter(page => {
          return page.id === this.pageId;
        });
        let pageContent = targetPage[0];
        if (pageContent.type === "string") {
          pageContent.body = pageContent.body as string;
          pageContent.body = pageContent.body.replace(/\n/g, "</p><p>");
          pageContent.body = `<p>${pageContent.body}</p>`;
        }
        // let now = new Date();
        // pageContent.date = now.toISOString();
        this.sourse = pageContent;
        this.ready = true;
      });
  }
}
</script>

<style lang="scss" scoped>
</style>
