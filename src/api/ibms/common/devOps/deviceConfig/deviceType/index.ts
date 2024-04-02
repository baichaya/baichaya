import request from "@/utils/request";
import { AxiosPromise } from "axios";
import {
  DeviceTypeVO,
  DeviceTypeForm,
  DeviceTypeQuery,
} from "@/api/ibms/common/devOps/deviceConfig/deviceType/types";

/**
 * 查询设备分类列表
 * @param query
 * @returns {*}
 */

export const listDeviceType = (
  query?: DeviceTypeQuery
): AxiosPromise<DeviceTypeVO[]> => {
  return request({
    url: "/deviceConfig/deviceType/list",
    method: "get",
    params: query,
  });
};

/**
 * 查询设备分类详细
 * @param id
 */
export const getDeviceType = (
  id: string | number
): AxiosPromise<DeviceTypeVO> => {
  return request({
    url: "/deviceConfig/deviceType/" + id,
    method: "get",
  });
};

/**
 * 新增设备分类
 * @param data
 */
export const addDeviceType = (data: DeviceTypeForm) => {
  return request({
    url: "/deviceConfig/deviceType",
    method: "post",
    data: data,
  });
};

/**
 * 修改设备分类
 * @param data
 */
export const updateDeviceType = (data: DeviceTypeForm) => {
  return request({
    url: "/deviceConfig/deviceType",
    method: "put",
    data: data,
  });
};

/**
 * 删除设备分类
 * @param id
 */
export const delDeviceType = (id: string | number | Array<string | number>) => {
  return request({
    url: "/deviceConfig/deviceType/" + id,
    method: "delete",
  });
};
