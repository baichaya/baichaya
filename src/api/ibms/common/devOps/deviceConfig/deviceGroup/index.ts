import request from "@/utils/request";
import { AxiosPromise } from "axios";
import {
  DeviceGroupVO,
  DeviceGroupForm,
  DeviceGroupQuery,
} from "@/api/ibms/common/devOps/deviceConfig/deviceGroup/types";

/**
 * 查询设备分组列表
 * @param query
 * @returns {*}
 */

export const listDeviceGroup = (query?: DeviceGroupQuery): AxiosPromise<DeviceGroupVO[]> => {
  return request({
    url: "/deviceConfig/deviceGroup/list",
    method: "get",
    params: query,
  });
};

/**
 * 查询设备分组详细
 * @param id
 */
export const getDeviceGroup = (id: string | number): AxiosPromise<DeviceGroupVO> => {
  return request({
    url: "/deviceConfig/deviceGroup/" + id,
    method: "get",
  });
};

/**
 * 新增设备分组
 * @param data
 */
export const addDeviceGroup = (data: DeviceGroupForm) => {
  return request({
    url: "/deviceConfig/deviceGroup",
    method: "post",
    data: data,
  });
};

/**
 * 修改设备分组
 * @param data
 */
export const updateDeviceGroup = (data: DeviceGroupForm) => {
  return request({
    url: "/deviceConfig/deviceGroup",
    method: "put",
    data: data,
  });
};

/**
 * 删除设备分组
 * @param id
 */
export const delDeviceGroup = (id: string | number | Array<string | number>) => {
  return request({
    url: "/deviceConfig/deviceGroup/" + id,
    method: "delete",
  });
};
