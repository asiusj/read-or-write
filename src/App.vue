<template>
  <div id="app">
    <b-navbar class="is-secondary">
      <template slot="brand">
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <img src="../src/assets/read-write-brand.png" alt="ReadWrite" />
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item tag="router-link" :to="{ path: '/' }">Home</b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ path: '/about' }">About</b-navbar-item>
        <b-navbar-item
          v-if="User.role===1"
          tag="router-link"
          :to="{ name: 'user', params: {userId: User.id} }"
        >My Posts</b-navbar-item>
        <b-navbar-item v-if="User.role===1" tag="router-link" :to="{ name: 'new', params: {editMode: true} }"><b-icon size="is-small" icon="plus"></b-icon><span>Add new post</span></b-navbar-item>
      </template>
      <template slot="end">
        <b-navbar-item tag="router-link" v-if="!User.id" :to="{ path: '/auth' }">Auth, guest</b-navbar-item>
        <b-navbar-dropdown v-else :label="NameToShow">
          <b-navbar-item tag="router-link" :to="{ path: '/settings' }">Config</b-navbar-item>
          <b-navbar-item @click="logout()">Log out</b-navbar-item>
        </b-navbar-dropdown>
      </template>
    </b-navbar>
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppUser from "./models/user";

@Component({})
export default class Base extends Vue {
  get User(): AppUser {
    return this.$store.getters.getUser;
  }
  get NameToShow(): string {
    return this.User.name ? this.User.name : this.User.login;
  }
  logout() {
    this.$store.dispatch("LogoutUser");
  }
}
</script>

<style lang="scss">
@import "@/assets/custom-stl.scss";
</style>
