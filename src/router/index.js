import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "",
    component: () => import("@/layout"),
    children: [
      { path: "/", redirect: "/login" },
      {
        path: "/home",
        name: "首页",
        component: () => import("@/views/home/home.vue")
      },
      {
        path: "/personnel",
        name: "人员管理",
        component: () => import("@/views/system/personnel/personnel.vue")
      },
      {
        path: "/dictionary",
        name: "字典管理",
        component: () => import("@/views/system/dictionary/dictionary.vue")
      },
      {
        path: "/role",
        name: "角色管理",
        component: () => import("@/views/system/role/role.vue")
      },
      {
        path: "/menus",
        name: "菜单管理",
        component: () => import("@/views/system/menus/menus.vue")
      },
      {
        path: "/department",
        name: "部门管理",
        component: () => import("@/views/system/department/department.vue")
      },
      {
        path: "/company",
        name: "单位管理",
        component: () => import("@/views/system/company/company.vue")
      },
      {
        path: "/log",
        name: "日志管理",
        component: () => import("@/views/system/logs/logs.vue")
      },
      {
        path: "/project",
        name: "项目管理",
        component: () => import("@/views/project/project.vue")
      },
      {
        path: "/document",
        name: "文档管理",
        component: () => import("@/views/document/document.vue")
      },
      {
        path: "/folder",
        name: "目录管理",
        component: () => import("@/views/document/folder.vue")
      },
      {
        path: "/retrieval",
        name: "全文检索",
        component: () => import("@/views/retrieval/retrieval.vue")
      },
      {
        path: "/environmentproject",
        name: "项目环境",
        component: () => import("@/views/environment/projectEnvironment/projectEnvironment.vue")
      },
      {
        path: "/environmentresources",
        name: "工作空间资源",
        component: () => import("@/views/environment/resources/resources.vue")
      },
      {
        path: "/environmentmanage",
        name: "工作空间管理",
        component: () => import("@/views/environment/manage/manage.vue")
      },
      {
        path: "/environmenttemplate",
        name: "工作空间模板",
        component: () => import("@/views/environment/template/template.vue")
      },
      {
        path: "/familyLibrary",
        name: "族库管理",
        component: () => import("@/views/project/familyLibraryProject.vue")
      },
      {
        path: "/familyLibraryFolder",
        name: "族目录",
        component: () => import("@/views/document/familyLibraryFolder.vue")
      },
      {
        path: "/familyLibraryDocument",
        name: "族文件管理",
        component: () => import("@/views/document/familyLibraryDocument.vue")
      },
      {
        path: "/about",
        name: "族文件管理",
        component: () => import("@/views/About.vue")
      },
      {
        path: "/pluginunit",
        name: "族文件管理",
        component: () => import("@/views/pluginunit/pluginunit.vue")
      }
    ]
  },
  {
    path: "/login",
    name: "登录",
    component: () => import("@/views/login/login.vue")
  },
  {
    path: "/register",
    name: "登录",
    component: () => import("@/views/register.vue")
  }
];

const router = new VueRouter({
  // mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  window.$count = 0;
  next();
});

export default router;
