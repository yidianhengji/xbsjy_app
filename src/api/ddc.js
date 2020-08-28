import request from "./config";
import { API_PATH } from "./path";

/**
 * 名称：项目管理
 * 查询树 resDdcProjectQueryTree
 * 根据上级目录id分页 resDdcProjectPageByUpFolderId
 */
export const resDdcProjectQueryTree = data =>
  request(API_PATH + "ddc/project/queryTree", data, "GET");
export const resDdcProjectPageByUpFolderId = data =>
  request(API_PATH + "ddc/folder/pageByUpFolderId", data, "GET");

/**
 * 名称：文档管理-目录
 * 查询目录树 resDdcFolderQueryTree
 * 查询项目目录树 resDdcFolderQueryProFolTree
 * 检出 resDdcDocumentCheckOut
 * 检入 resDdcDocumentCheckIn
 * 释放 resDdcDocumentUnlock
 * 新增版本 resDdcDocumentAddVersion
 * 锁定 resDdcDocumentLockDoc
 * 解锁 resDdcDocumentUnLockDoc
 * 文件记录 resDdcDocumentdetailQueryBydocumentId
 */
export const resDdcFolderQueryTree = data =>
  request(API_PATH + "ddc/folder/queryTree", data, "GET");
export const resDdcFolderQueryProFolTree = data =>
  request(API_PATH + "ddc/folder/queryProFolTree", data, "GET");
export const resDdcDocumentInfo = documentId =>
  request(API_PATH + "ddc/document/info/" + documentId, {}, "GET");
export const resDdcDocumentCheckOut = documentId =>
  request(API_PATH + "ddc/document/checkOut/" + documentId, {}, "PUT");
export const resDdcDocumentUnlock = documentId =>
  request(API_PATH + "ddc/document/free/" + documentId, {}, "PUT");
export const resDdcDocumentAddVersion = data =>
  request(API_PATH + "ddc/document/addVersion", data, "POST");
export const resDdcDocumentLockDoc = documentId =>
  request(API_PATH + "ddc/document/lockDoc/" + documentId, {}, "PUT");
export const resDdcDocumentUnLockDoc = documentId =>
  request(API_PATH + "ddc/document/unLockDoc/" + documentId, {}, "PUT");
export const resDdcDocumentCheckIn = data =>
  request(API_PATH + "ddc/document/checkIn", data, "POST");
export const resDdcDocumentdetailQueryBydocumentId = documentId =>
  request(
    API_PATH + "ddc/documentdetail/queryBydocumentId/" + documentId,
    {},
    "GET"
  );
//根据文档列出赋权的用户
export const docListUserByDocId = docId =>
  request(API_PATH + "ddc/docauthority/listUserByDocId/" + docId, {}, "GET");
export const folderListAuthUsers = folderId =>
  request(
    API_PATH + "ddc/folderauthority/listAuthUsers/" + folderId,
    {},
    "GET"
  );
export const proListAuthUsers = projectId =>
  request(
    API_PATH + "ddc/projectauthority/listAuthUsers/" + projectId,
    {},
    "GET"
  );

/**
 * 名称：全文检索
 * 分页查询 resEsDocSearchPage
 */
export const resEsDocSearchPage = data => request(API_PATH + "ddc/esDocSearch/page", data, "GET");

/**
 * 名称：工作空间
 * 根据相对路径生成树 resWorkspacedirQueryTree
 * 校验重名文件,返回重复的文件路径 
 * 查询工作空间的变量类型 resWorkspaceGetVariateTypeByWorkspaceId
 */
export const resWorkspacedirQueryTree = data => request(API_PATH + "ddc/workspacedir/queryTree", data, "GET");
export const resWorkspacedirPage = data => request(API_PATH + "ddc/workspace/page", data, "GET");
export const resWorkspacedirVerifyDuplicateFile = data => request(API_PATH + "ddc/workspacedir/verifyDuplicateFile", data, "GET");
export const resWorkspaceGetVariateTypeByWorkspaceId = data => request(API_PATH + "ddc/workspace/getVariateTypeByWorkspaceId", data, "GET");
export const resWorkspaceGetClassifyid = data => request(API_PATH + "ddc/workspace/getClassifyid", data, "GET");

/**
 * 名称：工作空间环境变量表
 * 分页查询 resWorkspacevariatePage
 * 查询支持软件版本的变量类型 resWorkspaceGetVariateTypeBySoft
 */
export const resWorkspacevariatePage = data => request(API_PATH + "ddc/workspacevariate/page", data, "GET")
export const resWorkspaceGetVariateTypeBySoft = data => request(API_PATH + "ddc/workspace/getVariateTypeBySoft", data, "GET")


/**
 * 名称：工作空间参数值表
 * 分页查询 resWorkspacevariatevaluePage
 * 新增 resWorkspacevariatevalueSave
 * 修改 resWorkspacevariatevalueUpdate
 * 单个查询 resWorkspacevariatevalueInfo
 * 删除 resWorkspacevariatevalueDelete
 */
export const resWorkspacevariatevalueSave = data => request(API_PATH + "ddc/workspacevariatevalue/save", data, "POST")
export const resWorkspacevariatevalueUpdate = data => request(API_PATH + "ddc/workspacevariatevalue/update", data, "PUT")
export const resWorkspacevariatevaluePage = data => request(API_PATH + "ddc/workspacevariatevalue/page", data, "GET")
export const resWorkspacevariatevalueInfo = data => request(API_PATH + "ddc/workspacevariatevalue/info", data, "GET")
export const resWorkspacevariatevalueDelete = data => request(API_PATH + "ddc/workspacevariatevalue/delete" + data, null, "DELETE")

/**
 * 名称：工作空间资源
 * 删除 resWorkspacedirDelete
 */
export const resWorkspacedirDelete = data => request(API_PATH + "ddc/workspacedir/delete", data, "DELETE")

/**
 * 名称：工作空间配置
 * 新增 resWorkspaceconfigSave
 */
export const resWorkspaceconfigSave = data => request(API_PATH + "ddc/workspaceconfig/save", data, "POST")
export const resWorkspacePage = data => request(API_PATH + "ddc/workspace/page", data, "GET")
export const resWorkspaceconfigDelete = data => request(API_PATH + "ddc/workspaceconfig/delete/" + data, null, "DELETE")

/**
 * 名称：权限
 * 查询用户项目权限 resProjectauthorityQueryProAuthOfUser
 * 查询用户目录权限 resFolderauthorityQueryFolAuthOfUser
 * 查询用户文档权限 resDocauthorityQueryDocAuthOfUser
 */
export const resProjectauthorityQueryProAuthOfUser = data => request(API_PATH + "ddc/projectauthority/queryProAuthOfUser", data, "GET")
export const resFolderauthorityQueryFolAuthOfUser = data => request(API_PATH + "ddc/folderauthority/queryFolAuthOfUser", data, "GET")
export const resDocauthorityQueryDocAuthOfUser = data => request(API_PATH + "ddc/docauthority/queryDocAuthOfUser", data, "GET")
