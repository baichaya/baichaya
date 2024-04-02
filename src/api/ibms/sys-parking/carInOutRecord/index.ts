import request from "@/utils/request";
import { AxiosPromise } from "axios";
import {
  CarInOutRecordVO,
  CarInOutRecordForm,
  CarInOutRecordQuery,
} from "./types";

/**
 * 查询停车进出记录列表
 * @param query
 * @returns {*}
 */

export const listCarInOutRecord = (
  query?: CarInOutRecordQuery
): AxiosPromise<CarInOutRecordVO[]> => {
  return request({
    url: "/ibms/carInOutRecord/list",
    method: "get",
    params: query,
  });
};

/**
 * 查询停车进出记录详细
 * @param id
 */
export const getCarInOutRecord = (
  id: string | number
): AxiosPromise<CarInOutRecordVO> => {
  return request({
    url: "/ibms/carInOutRecord/" + id,
    method: "get",
  });
};

/**
 * 新增停车进出记录
 * @param data
 */
export const addCarInOutRecord = (data: CarInOutRecordForm) => {
  return request({
    url: "/ibms/carInOutRecord",
    method: "post",
    data: data,
  });
};

/**
 * 修改停车进出记录
 * @param data
 */
export const updateCarInOutRecord = (data: CarInOutRecordForm) => {
  return request({
    url: "/ibms/carInOutRecord",
    method: "put",
    data: data,
  });
};

/**
 * 删除停车进出记录
 * @param id
 */
export const delCarInOutRecord = (
  id: string | number | Array<string | number>
) => {
  return request({
    url: "/ibms/carInOutRecord/" + id,
    method: "delete",
  });
};
