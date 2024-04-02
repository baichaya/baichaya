import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { IntrusionStatusCodeVO, IntrusionStatusCodeForm, IntrusionStatusCodeQuery } from "./types";

/**
 * 查询设备或通道的状态变化码列表
 * @param query
 * @returns {*}
 */

export const listIntrusionStatusCode = (query?: IntrusionStatusCodeQuery): AxiosPromise<IntrusionStatusCodeVO[]> => {
  return request({
    url: "/intrusionAlarm/intrusionStatusCode/list",
    method: "get",
    params: query,
  });
};

/**
 * 查询设备或通道的状态变化码详细
 * @param statusCode
 */
export const getIntrusionStatusCode = (statusCode: string | number): AxiosPromise<IntrusionStatusCodeVO> => {
  return request({
    url: "/intrusionAlarm/intrusionStatusCode/" + statusCode,
    method: "get",
  });
};

/**
 * 新增设备或通道的状态变化码
 * @param data
 */
export const addIntrusionStatusCode = (data: IntrusionStatusCodeForm) => {
  return request({
    url: "/intrusionAlarm/intrusionStatusCode",
    method: "post",
    data: data,
  });
};

/**
 * 修改设备或通道的状态变化码
 * @param data
 */
export const updateIntrusionStatusCode = (data: IntrusionStatusCodeForm) => {
  return request({
    url: "/intrusionAlarm/intrusionStatusCode",
    method: "put",
    data: data,
  });
};

/**
 * 删除设备或通道的状态变化码
 * @param statusCode
 */
export const delIntrusionStatusCode = (statusCode: string | number | Array<string | number>) => {
  return request({
    url: "/intrusionAlarm/intrusionStatusCode/" + statusCode,
    method: "delete",
  });
};
