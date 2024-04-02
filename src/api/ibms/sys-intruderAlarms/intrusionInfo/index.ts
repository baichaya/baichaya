import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { IntrusionInfoVO, IntrusionInfoForm, IntrusionInfoQuery } from "./types";

/**
 * 查询入侵报警-报警日志列表
 * @param query
 * @returns {*}
 */

export const listIntrusionInfo = (query?: IntrusionInfoQuery): AxiosPromise<IntrusionInfoVO[]> => {
  return request({
    url: "/intrusionAlarm/intrusionInfo/list",
    method: "get",
    params: query,
  });
};

/**
 * 查询入侵报警-报警日志详细
 * @param id
 */
export const getIntrusionInfo = (id: string | number): AxiosPromise<IntrusionInfoVO> => {
  return request({
    url: "/intrusionAlarm/intrusionInfo/" + id,
    method: "get",
  });
};

/**
 * 新增入侵报警-报警日志
 * @param data
 */
export const addIntrusionInfo = (data: IntrusionInfoForm) => {
  return request({
    url: "/intrusionAlarm/intrusionInfo",
    method: "post",
    data: data,
  });
};

/**
 * 修改入侵报警-报警日志
 * @param data
 */
export const updateIntrusionInfo = (data: IntrusionInfoForm) => {
  return request({
    url: "/intrusionAlarm/intrusionInfo",
    method: "put",
    data: data,
  });
};

/**
 * 删除入侵报警-报警日志
 * @param id
 */
export const delIntrusionInfo = (id: string | number | Array<string | number>) => {
  return request({
    url: "/intrusionAlarm/intrusionInfo/" + id,
    method: "delete",
  });
};
