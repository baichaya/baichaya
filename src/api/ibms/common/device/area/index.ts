import request from "@/utils/request";
import { AxiosPromise } from "axios";
import {
  AreaVO,
  AreaForm,
  AreaQuery,
} from "@/api/ibms/common/device/area/types";

/**
 * 查询区域列表
 * @param query
 * @returns {*}
 */

export const listArea = (query?: AreaQuery): AxiosPromise<AreaVO[]> => {
  return request({
    url: "/ibms/area/list",
    method: "get",
    params: query,
  });
};
/**
 * 查询区域列表
 * @param query
 * @returns {*}
 */

export const selectAreaTree = (query?: AreaQuery): AxiosPromise<AreaVO[]> => {
  return request({
    url: "/ibms/area/selectAreaTree",
    method: "get",
    params: query,
  });
};

/**
 * 查询区域详细
 * @param id
 */
export const getArea = (id: string | number): AxiosPromise<AreaVO> => {
  return request({
    url: "/ibms/area/" + id,
    method: "get",
  });
};

/**
 * 新增区域
 * @param data
 */
export const addArea = (data: AreaForm) => {
  return request({
    url: "/ibms/area",
    method: "post",
    data: data,
  });
};

/**
 * 修改区域
 * @param data
 */
export const updateArea = (data: AreaForm) => {
  return request({
    url: "/ibms/area",
    method: "put",
    data: data,
  });
};

/**
 * 删除区域
 * @param id
 */
export const delArea = (id: string | number | Array<string | number>) => {
  return request({
    url: "/ibms/area/" + id,
    method: "delete",
  });
};
