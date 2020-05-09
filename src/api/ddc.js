import request from './config';
import { API_PATH } from './path';

/**
 * 名称：项目管理
 * 查询树 resDdcProjectQueryTree
 */
export const resDdcProjectQueryTree = (data) => request(API_PATH + "ddc/project/queryTree", data, "GET");


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
export const resDdcFolderQueryTree = (data) => request(API_PATH + "ddc/folder/queryTree", data, "GET");
export const resDdcFolderQueryProFolTree = (data) => request(API_PATH + "ddc/folder/queryProFolTree", data, "GET");
export const resDdcDocumentInfo = (documentId) => request(API_PATH + "ddc/document/info/" + documentId, {}, "GET");
export const resDdcDocumentCheckOut = (documentId) => request(API_PATH + "ddc/document/checkOut/" + documentId, {}, "PUT");
export const resDdcDocumentUnlock = (documentId) => request(API_PATH + "ddc/document/unlock/" + documentId, {}, "PUT");
export const resDdcDocumentAddVersion = (data) => request(API_PATH + "ddc/document/addVersion", data, "POST");
export const resDdcDocumentLockDoc = (documentId) => request(API_PATH + "ddc/document/lockDoc/" + documentId, {}, "PUT");
export const resDdcDocumentUnLockDoc = (documentId) => request(API_PATH + "ddc/document/unLockDoc/" + documentId, {}, "PUT");
export const resDdcDocumentCheckIn = (data) => request(API_PATH + "ddc/document/checkIn", data, "POST");
export const resDdcDocumentdetailQueryBydocumentId = (documentId) => request(API_PATH + "ddc/documentdetail/queryBydocumentId/" + documentId, {}, "GET");