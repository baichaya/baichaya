import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { BaVO, BaForm, BaQuery } from "./types";

/**
 * 查询BA设备表列表
 * @param query
 * @returns {*}
 */

export const listBa = (query?: BaQuery): AxiosPromise<BaVO[]> => {
  return request({
    url: "/ibms/ba/list",
    method: "get",
    params: query,
  });
};

/**
 * 查询BA设备表详细
 * @param id
 */
export const getBa = (id: string | number): AxiosPromise<BaVO> => {
  return request({
    url: "/ibms/ba/" + id,
    method: "get",
  });
};

/**
 * 新增BA设备表
 * @param data
 */
export const addBa = (data: BaForm) => {
  return request({
    url: "/ibms/ba",
    method: "post",
    data: data,
  });
};

/**
 * 修改BA设备表
 * @param data
 */
export const updateBa = (data: BaForm) => {
  return request({
    url: "/ibms/ba",
    method: "put",
    data: data,
  });
};

/**
 * 删除BA设备表
 * @param id
 */
export const delBa = (id: string | number | Array<string | number>) => {
  return request({
    url: "/ibms/ba/" + id,
    method: "delete",
  });
};
