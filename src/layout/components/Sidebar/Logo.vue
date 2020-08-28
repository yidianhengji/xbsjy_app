<template>
  <div class="sidebar-logo-container">
    <div class="sidebar-logo-link">
      <img class="sidebar-logo" src="../../../assets/logo.png" />
      <h1 class="sidebar-title">{{project}}</h1>
    </div>
  </div>
</template>

<script>
import { PROJECT_NAME } from "../../../api/path";
export default {
  data() {
    return {
      project: PROJECT_NAME
    };
  }
};
</script>

<style lang="stylus" scoped>
.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #344058;
  text-align: center;
  overflow: hidden;

  .sidebar-logo-link {
    display: inline-block;
    width: 100%;
    overflow: hidden;

    .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }
}
</style>
