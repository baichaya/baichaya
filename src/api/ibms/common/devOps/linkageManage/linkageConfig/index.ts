import request from "@/utils/request";
import { AxiosPromise } from "axios";
import {
  LinkageConfigVO,
  LinkageConfigForm,
  LinkageConfigQuery,
} from "@/api/ibms/common/devOps/linkageManage/linkageConfig/types";

/**
 * 查询联动配置列表
 * @param query
 * @returns {*}
 */

export const listLinkageConfig = (
  query?: LinkageConfigQuery
): AxiosPromise<LinkageConfigVO[]> => {
  return request({
    url: "/linkageManage/linkageConfig/list",
    method: "get",
    params: query,
  });
};

/**
 * 查询联动配置详细
 * @param id
 */
export const getLinkageConfig = (
  id: string | number
): AxiosPromise<LinkageConfigVO> => {
  return request({
    url: "/linkageManage/linkageConfig/" + id,
    method: "get",
  });
};

/**
 * 新增联动配置
 * @param data
 */
export const addLinkageConfig = (data: LinkageConfigForm) => {
  return request({
    url: "/linkageManage/linkageConfig",
    method: "post",
    data: data,
  });
};

/**
 * 修改联动配置
 * @param data
 */
export const updateLinkageConfig = (data: LinkageConfigForm) => {
  return request({
    url: "/linkageManage/linkageConfig",
    method: "put",
    data: data,
  });
};

/**
 * 删除联动配置
 * @param id
 */
export const delLinkageConfig = (
  id: string | number | Array<string | number>
) => {
  return request({
    url: "/linkageManage/linkageConfig/" + id,
    method: "delete",
  });
};
