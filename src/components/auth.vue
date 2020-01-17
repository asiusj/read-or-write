<template>
  <div class="container is-centered">
    <div class="column">
      <section class="form margin-top-32" v-if="!User.id">
        <b-field label="email">
          <b-input v-model="email"></b-input>
        </b-field>

        <b-field label="password">
          <b-input v-model="password"></b-input>
        </b-field>

        <b-field class="has-text-centered">
          <button @click="submit()" class="button is-primary">Sign in</button>
        </b-field>
      </section>
      <section class="form" v-else>
        <div
          class="has-text-centered margin-top-32"
        >{{User.name ? User.name : User.login}}, are you leaving already?</div>
        <b-field class="has-text-centered margin-top-32">
          <button @click="logout()" class="button is-primary">Log out</button>
        </b-field>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Axios from "axios";
import AppUser from "../models/user";
@Component
export default class Auth extends Vue {
  email: string = "";
  password: string = "";
  passwordErrors: string[] = [];
  get User(): AppUser {
    return this.$store.getters.getUser;
  }
  submit() {
    // console.log("email: " + this.email + "\npassword: " + this.password);
    Axios.get<AppUser[]>(
      process.env.VUE_APP_API_URL + "/users?email=" + this.email
    ).then(response => {
      if (response.data.length) {
        let user: AppUser = response.data[0];
        console.log(user);
        console.log("\n" + this.password);
        if (user.password === this.password) {
          this.$store.dispatch("SetUser", user);
        } else {
          this.passwordErrors.push("Wrong email-password pair!");
        }
      }
    });
  }
  logout() {
    this.$store.dispatch("LogoutUser");
  }
}
</script>

<style lang="scss" scoped>
</style>
