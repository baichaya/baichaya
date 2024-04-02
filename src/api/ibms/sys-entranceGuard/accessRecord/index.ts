import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { AccessRecordVO, AccessRecordForm, AccessRecordQuery } from "./types";

/**
 * 查询门禁记录列表
 * @param query
 * @returns {*}
 */

export const listAccessRecord = (
  query?: AccessRecordQuery
): AxiosPromise<AccessRecordVO[]> => {
  return request({
    url: "/ibms/accessRecord/list",
    method: "get",
    params: query,
  });
};

/**
 * 查询门禁记录详细
 * @param id
 */
export const getAccessRecord = (
  id: string | number
): AxiosPromise<AccessRecordVO> => {
  return request({
    url: "/ibms/accessRecord/" + id,
    method: "get",
  });
};

/**
 * 新增门禁记录
 * @param data
 */
export const addAccessRecord = (data: AccessRecordForm) => {
  return request({
    url: "/ibms/accessRecord",
    method: "post",
    data: data,
  });
};

/**
 * 修改门禁记录
 * @param data
 */
export const updateAccessRecord = (data: AccessRecordForm) => {
  return request({
    url: "/ibms/accessRecord",
    method: "put",
    data: data,
  });
};

/**
 * 删除门禁记录
 * @param id
 */
export const delAccessRecord = (
  id: string | number | Array<string | number>
) => {
  return request({
    url: "/ibms/accessRecord/" + id,
    method: "delete",
  });
};
