import request from './config';
import { API_PATH } from './path';

/**
 * 登录系统 resAuthUserlogin
 * 退出系统 resAuthUserlogout
 */
export const resAuthUserlogin = (data) => request(API_PATH + "auth/userlogin", data, "POST");
export const resAuthUserlogout = (data) => request(API_PATH + "auth/userlogout", data, "POST");

/**
 * 名称：用户管理
 * 分页 resBaseUserPage
 * 登录人信息 resBaseUserGetLoginUserInfo
 * 修改密码 resBaseUserUpdatePassword
 */
export const resBaseUserPage = (data) => request(API_PATH + "base/user/page", data, "GET");
export const resBaseUserGetLoginUserInfo = (data) => request(API_PATH + "base/user/getLoginUserInfo", data, "GET");
export const resBaseUserUpdatePassword = (data) => request(API_PATH + "base/user/updatePassword", data, "PUT");

/** 
 * 名称：字典管理
 * 根据字典code，查询值  resBaseDicNameByDicCode
 * 查询树 resBaseDictionaryQueryTree
 */
export const resBaseDicNameByDicCode = (data) => request(API_PATH + "base/dictionary/queryDicNameByDicCode", data, "GET");
export const resBaseDictionaryQueryTree = (data) => request(API_PATH + "base/dictionary/queryTree", data, "GET");

/**
 * 名称：角色管理
 * 分页 resBaseRolePage
 */
export const resBaseRolePage = (data) => request(API_PATH + "base/role/page", data, "GET");

/**
 * 名称：部门管理
 * 查询部门树 resBaseDepartmentQueryTree
 * 通过单位id查询 resBaseDepartmentQueryByCompanyId
 */
export const resBaseDepartmentQueryTree = (data) => request(API_PATH + "base/department/queryTree", data, "GET");
export const resBaseDepartmentQueryByCompanyId = (data) => request(API_PATH + "base/department/queryByCompanyId", data, "GET");

/**
 * 名称: 单位管理
 * 查询树 resBaseCompanyQueryTree
 * 分页 resBaseCompanyPage
 */
export const resBaseCompanyQueryTree = (data) => request(API_PATH + "base/company/queryTree", data, "GET");
export const resBaseCompanyPage = (data) => request(API_PATH + "base/company/page", data, "GET");

/**
 * 名称：菜单管理
 * 查询登录人的菜单，用于登陆后菜单栏的显示 resBaseMenuLoginUserMenuTree
 * 根据角色id查询菜单ids resBaseMenuQueryMenuIdByRoleId
 * 查询树,当传入roleId，关联用户,checked为true表示拥有 resBaseMenuQueryTree
 * 角色赋予菜单 resBaseMenuRoleAddMenus
 */
export const resBaseMenuLoginUserMenuTree = (data) => request(API_PATH + "base/menu/queryLoginUserMenuTree", data, "GET");
export const resBaseMenuQueryMenuIdByRoleId = (id) => request(API_PATH + "base/menu/queryMenuIdByRoleId/" + id, {}, "GET");
export const resBaseMenuQueryTree = (data) => request(API_PATH + "base/menu/queryTree", data, "GET");
export const resBaseMenuRoleAddMenus = (url, data) => request(API_PATH + "base/menu/roleAddMenus/" + url, data, "PUT");

/**
 * 名称：日志管理
 */
export const resBaseLogPage = (data) => request(API_PATH + "base/log/page", data, "GET");