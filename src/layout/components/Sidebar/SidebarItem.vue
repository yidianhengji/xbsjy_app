<template>
  <div>
    <el-submenu
      v-if="item.children && item.children.length > 0"
      :index="String(item.menuId)"
    >
      <template slot="title">
        <i :class="item.pictureUrl"></i>
        <span v-show="!isNest">{{ item.menuName }}</span>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.pageUrl"
        :item="child"
        :isNest="isNest"
      ></sidebar-item>
    </el-submenu>
    <el-menu-item v-else :index="item.pageUrl" :key="item.menuId">
      <i :class="item.pictureUrl"></i>
      <span slot="title">{{ item.menuName }}</span>
    </el-menu-item>
  </div>
</template>

<script>
export default {
  name: "SidebarItem",
  props: {
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style></style>
