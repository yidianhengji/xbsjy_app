<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { resAuthUserlogout } from "./api";
export default {
  created() {
    document.addEventListener("logout", async () => {
      await resAuthUserlogout();
      this.$router.push({ path: "/login" });
    });
  }
};
</script>

<style lang="stylus"></style>
