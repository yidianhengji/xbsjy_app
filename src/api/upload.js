import request from "./config";
import { API_PATH } from "./path";

/**
 * 名称：文件管理
 * 文件下载 resFilesystemFileDownLoad
 */
export const resFilesystemFileDownLoad = fileId =>
  request(API_PATH + "filesystem/file/downLoad/" + fileId, {}, "GET");
