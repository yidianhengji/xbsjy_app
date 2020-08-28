<template>
  <div class="amap-wrapper">
    <el-amap class="amap-box" :vid="vid"></el-amap>
  </div>
</template>

<script>
import VueAMap from "vue-amap";
import { KEY, PLUGIN, VERSION } from "../../util/mapConfig";
VueAMap.initAMapApiLoader({
  key: KEY,
  plugin: PLUGIN,
  v: VERSION
});
export default {
  name: "home",
  data() {
    return {
      vid: "amap-vue"
    };
  }
};
</script>

<style lang="stylus" scoped>
.amap-wrapper {
  width: 100%;
  height: 100%;
}
</style>
