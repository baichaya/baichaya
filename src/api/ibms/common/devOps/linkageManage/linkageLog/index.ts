import request from "@/utils/request";
import { AxiosPromise } from "axios";
import {
  LinkageLogVO,
  LinkageLogForm,
  LinkageLogQuery,
} from "@/api/ibms/common/devOps/linkageManage/linkageLog/types";

/**
 * 查询联动执行日志列表
 * @param query
 * @returns {*}
 */

export const listLinkageLog = (
  query?: LinkageLogQuery
): AxiosPromise<LinkageLogVO[]> => {
  return request({
    url: "/linkageManage/linkageLog/list",
    method: "get",
    params: query,
  });
};

/**
 * 查询联动执行日志详细
 * @param id
 */
export const getLinkageLog = (
  id: string | number
): AxiosPromise<LinkageLogVO> => {
  return request({
    url: "/linkageManage/linkageLog/" + id,
    method: "get",
  });
};

/**
 * 新增联动执行日志
 * @param data
 */
export const addLinkageLog = (data: LinkageLogForm) => {
  return request({
    url: "/linkageManage/linkageLog",
    method: "post",
    data: data,
  });
};

/**
 * 修改联动执行日志
 * @param data
 */
export const updateLinkageLog = (data: LinkageLogForm) => {
  return request({
    url: "/linkageManage/linkageLog",
    method: "put",
    data: data,
  });
};

/**
 * 删除联动执行日志
 * @param id
 */
export const delLinkageLog = (id: string | number | Array<string | number>) => {
  return request({
    url: "/linkageManage/linkageLog/" + id,
    method: "delete",
  });
};
