import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { AccessDeviceVO, AccessDeviceForm, AccessDeviceQuery } from "./types";

/**
 * 查询门禁设备信息列表
 * @param query
 * @returns {*}
 */

export const listAccessDevice = (query?: AccessDeviceQuery): AxiosPromise<AccessDeviceVO[]> => {
  return request({
    url: "/ibms/accessDevice/list",
    method: "get",
    params: query,
  });
};

/**
 * 查询门禁设备信息详细
 * @param id
 */
export const getAccessDevice = (id: string | number): AxiosPromise<AccessDeviceVO> => {
  return request({
    url: "/ibms/accessDevice/" + id,
    method: "get",
  });
};

/**
 * 新增门禁设备信息
 * @param data
 */
export const addAccessDevice = (data: AccessDeviceForm) => {
  return request({
    url: "/ibms/accessDevice",
    method: "post",
    data: data,
  });
};

/**
 * 修改门禁设备信息
 * @param data
 */
export const updateAccessDevice = (data: AccessDeviceForm) => {
  return request({
    url: "/ibms/accessDevice",
    method: "put",
    data: data,
  });
};

/**
 * 删除门禁设备信息
 * @param id
 */
export const delAccessDevice = (id: string | number | Array<string | number>) => {
  return request({
    url: "/ibms/accessDevice/" + id,
    method: "delete",
  });
};
