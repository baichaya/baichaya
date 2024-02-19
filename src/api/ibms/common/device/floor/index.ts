import request from "@/utils/request";
import { AxiosPromise } from "axios";
import {
  FloorVO,
  FloorForm,
  FloorQuery,
} from "@/api/ibms/common/device/floor/types";
import { AreaVO } from "@/api/ibms/common/device/area/types";

/**
 * 查询楼层列表
 * @param query
 * @returns {*}
 */

export const listFloor = (query?: FloorQuery): AxiosPromise<FloorVO[]> => {
  return request({
    url: "/ibms/floor/list",
    method: "get",
    params: query,
  });
};
/**
 * 查询区域楼栋列表
 * @param query
 * @returns {*}
 */

export const areaBuildingTree = (
  query?: FloorQuery
): AxiosPromise<AreaVO[]> => {
  return request({
    url: "/ibms/floor/selectByAreaBuilding",
    method: "get",
    params: query,
  });
};

/**
 * 查询楼层详细
 * @param id
 */
export const getFloor = (id: string | number): AxiosPromise<FloorVO> => {
  return request({
    url: "/ibms/floor/" + id,
    method: "get",
  });
};

/**
 * 新增楼层
 * @param data
 */
export const addFloor = (data: FloorForm) => {
  return request({
    url: "/ibms/floor",
    method: "post",
    data: data,
  });
};

/**
 * 修改楼层
 * @param data
 */
export const updateFloor = (data: FloorForm) => {
  return request({
    url: "/ibms/floor",
    method: "put",
    data: data,
  });
};

/**
 * 删除楼层
 * @param id
 */
export const delFloor = (id: string | number | Array<string | number>) => {
  return request({
    url: "/ibms/floor/" + id,
    method: "delete",
  });
};
