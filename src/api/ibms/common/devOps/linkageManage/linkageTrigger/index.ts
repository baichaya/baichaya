import request from "@/utils/request";
import { AxiosPromise } from "axios";
import {
  LinkageTriggerVO,
  LinkageTriggerForm,
  LinkageTriggerQuery,
} from "@/api/ibms/common/devOps/linkageManage/linkageTrigger/types";

/**
 * 查询触发器列表
 * @param query
 * @returns {*}
 */

export const listLinkageTrigger = (
  query?: LinkageTriggerQuery
): AxiosPromise<LinkageTriggerVO[]> => {
  return request({
    url: "/linkageManage/linkageTrigger/list",
    method: "get",
    params: query,
  });
};

/**
 * 查询触发器详细
 * @param id
 */
export const getLinkageTrigger = (
  id: string | number
): AxiosPromise<LinkageTriggerVO> => {
  return request({
    url: "/linkageManage/linkageTrigger/" + id,
    method: "get",
  });
};

/**
 * 新增触发器
 * @param data
 */
export const addLinkageTrigger = (data: LinkageTriggerForm) => {
  return request({
    url: "/linkageManage/linkageTrigger",
    method: "post",
    data: data,
  });
};

/**
 * 修改触发器
 * @param data
 */
export const updateLinkageTrigger = (data: LinkageTriggerForm) => {
  return request({
    url: "/linkageManage/linkageTrigger",
    method: "put",
    data: data,
  });
};

/**
 * 删除触发器
 * @param id
 */
export const delLinkageTrigger = (
  id: string | number | Array<string | number>
) => {
  return request({
    url: "/linkageManage/linkageTrigger/" + id,
    method: "delete",
  });
};
