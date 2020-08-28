export const CODETYPE_SEX = "SYSTEM_SEX"; // 系统管理-性别
export const PROJECT_TYPE = "PROJECT_TYPE"; // 项目管理-项目分类
export const PROJECT_POWER = "PROJECT_POWER"; // 项目管理-项目权限
export const FOLDER_POWER = "FOLDER_POWER"; // 目录管理-目录权限
export const FOLDER_DOCUMENT = "FOLDER_DOCUMENT"; // 目录管理-文档权限

export const PROJECT_ENVIRONMENT = "PROJECT_ENVIRONMENT"; // 项目环境
export const SOFTWARE_SUPPORT = "SOFTWARE_SUPPORT"; // 软件支持
export const SOFTWARE_VERSION = "SOFTWARE_VERSION"; // 软件版本
export const ENVIRONMENT_VARIABLE_TYPE = "ENVIRONMENT_VARIABLE_TYPE"; // 环境变量类型
export const WORKSPACE_CLASSIFICATION = "WORKSPACE_CLASSIFICATION"; // 工作空间分类

export const PLUGINTYPE = "PLUGINTYPE"; // 插件管理

export const POWER_TYPE = { // 权限操作类型
  READ: { key: "1", value: "查看" },
  WRITE: { key: "2", value: "修改" },
  DELETE: { key: "3", value: "删除" },
  FILE_READ: { key: "4", value: "文件读" },
  FILE_WRITE: { key: "5", value: "文件写" },
  RELEASE: { key: "6", value: "释放" },
  UNLOCK: { key: "7", value: "解锁/锁定" },
  SETTING_PERMISSIONS: { key: "8", value: "设置权限" },
  CREATESUBDIRECTORIES: { key: "9", value: "创建目录" },
  CREATEDOCUMENT: { key: "10", value: "新建文件" }
}