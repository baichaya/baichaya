import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { DeviceAllVO, DeviceAllForm, DeviceAllQuery } from "@/api/ibms/common/device/deviceAll/types";

/**
 * 查询设备总表列表
 * @param query
 * @returns {*}
 */

export const listDeviceAll = (query?: DeviceAllQuery): AxiosPromise<DeviceAllVO[]> => {
  return request({
    url: "/ibms/deviceAll/list",
    method: "get",
    params: query,
  });
};

/**
 * 查询设备总表详细
 * @param id
 */
export const getDeviceAll = (id: string | number): AxiosPromise<DeviceAllVO> => {
  return request({
    url: "/ibms/deviceAll/" + id,
    method: "get",
  });
};

/**
 * 新增设备总表
 * @param data
 */
export const addDeviceAll = (data: DeviceAllForm) => {
  return request({
    url: "/ibms/deviceAll",
    method: "post",
    data: data,
  });
};

/**
 * 修改设备总表
 * @param data
 */
export const updateDeviceAll = (data: DeviceAllForm) => {
  return request({
    url: "/ibms/deviceAll",
    method: "put",
    data: data,
  });
};

/**
 * 删除设备总表
 * @param id
 */
export const delDeviceAll = (id: string | number | Array<string | number>) => {
  return request({
    url: "/ibms/deviceAll/" + id,
    method: "delete",
  });
};
