import request from "@/utils/request";
import { AxiosPromise } from "axios";
import {
  InstrusionDeviceStatusVO,
  InstrusionDeviceStatusForm,
  InstrusionDeviceStatusQuery,
} from "./types";

/**
 * 查询设备或通道的状态变化日志列表
 * @param query
 * @returns {*}
 */

export const listInstrusionDeviceStatus = (
  query?: InstrusionDeviceStatusQuery
): AxiosPromise<InstrusionDeviceStatusVO[]> => {
  return request({
    url: "/intrusionAlarm/instrusionDeviceStatus/list",
    method: "get",
    params: query,
  });
};

/**
 * 查询设备或通道的状态变化日志详细
 * @param id
 */
export const getInstrusionDeviceStatus = (
  id: string | number
): AxiosPromise<InstrusionDeviceStatusVO> => {
  return request({
    url: "/intrusionAlarm/instrusionDeviceStatus/" + id,
    method: "get",
  });
};

/**
 * 新增设备或通道的状态变化日志
 * @param data
 */
export const addInstrusionDeviceStatus = (data: InstrusionDeviceStatusForm) => {
  return request({
    url: "/intrusionAlarm/instrusionDeviceStatus",
    method: "post",
    data: data,
  });
};

/**
 * 修改设备或通道的状态变化日志
 * @param data
 */
export const updateInstrusionDeviceStatus = (
  data: InstrusionDeviceStatusForm
) => {
  return request({
    url: "/intrusionAlarm/instrusionDeviceStatus",
    method: "put",
    data: data,
  });
};

/**
 * 删除设备或通道的状态变化日志
 * @param id
 */
export const delInstrusionDeviceStatus = (
  id: string | number | Array<string | number>
) => {
  return request({
    url: "/intrusionAlarm/instrusionDeviceStatus/" + id,
    method: "delete",
  });
};
