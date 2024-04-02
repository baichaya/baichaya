import request from "@/utils/request";
import { AxiosPromise } from "axios";
import {
  MethodVO,
  MethodForm,
  MethodQuery,
} from "@/api/ibms/common/devOps/linkageManage/method/types";

/**
 * 查询方法列表
 * @param query
 * @returns {*}
 */

export const listMethod = (query?: MethodQuery): AxiosPromise<MethodVO[]> => {
  return request({
    url: "/linkageManage/method/list",
    method: "get",
    params: query,
  });
};

/**
 * 查询方法详细
 * @param id
 */
export const getMethod = (id: string | number): AxiosPromise<MethodVO> => {
  return request({
    url: "/linkageManage/method/" + id,
    method: "get",
  });
};

/**
 * 新增方法
 * @param data
 */
export const addMethod = (data: MethodForm) => {
  return request({
    url: "/linkageManage/method",
    method: "post",
    data: data,
  });
};

/**
 * 修改方法
 * @param data
 */
export const updateMethod = (data: MethodForm) => {
  return request({
    url: "/linkageManage/method",
    method: "put",
    data: data,
  });
};

/**
 * 删除方法
 * @param id
 */
export const delMethod = (id: string | number | Array<string | number>) => {
  return request({
    url: "/linkageManage/method/" + id,
    method: "delete",
  });
};
