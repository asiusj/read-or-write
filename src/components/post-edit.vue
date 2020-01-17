<template>
  <section>
      
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
@Component
export default class PostEdit extends Vue {
  @Prop() id!: string;
}
</script>

<style lang="scss" scoped>
</style>
