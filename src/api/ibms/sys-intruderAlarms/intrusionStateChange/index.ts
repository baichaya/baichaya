import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { IntrusionStateChangeVO, IntrusionStateChangeForm, IntrusionStateChangeQuery } from "./types";

/**
 * 查询入侵报警-状态变化日志列表
 * @param query
 * @returns {*}
 */

export const listIntrusionStateChange = (query?: IntrusionStateChangeQuery): AxiosPromise<IntrusionStateChangeVO[]> => {
  return request({
    url: "/intrusionAlarm/intrusionStateChange/list",
    method: "get",
    params: query,
  });
};

/**
 * 查询入侵报警-状态变化日志详细
 * @param id
 */
export const getIntrusionStateChange = (id: string | number): AxiosPromise<IntrusionStateChangeVO> => {
  return request({
    url: "/intrusionAlarm/intrusionStateChange/" + id,
    method: "get",
  });
};

/**
 * 新增入侵报警-状态变化日志
 * @param data
 */
export const addIntrusionStateChange = (data: IntrusionStateChangeForm) => {
  return request({
    url: "/intrusionAlarm/intrusionStateChange",
    method: "post",
    data: data,
  });
};

/**
 * 修改入侵报警-状态变化日志
 * @param data
 */
export const updateIntrusionStateChange = (data: IntrusionStateChangeForm) => {
  return request({
    url: "/intrusionAlarm/intrusionStateChange",
    method: "put",
    data: data,
  });
};

/**
 * 删除入侵报警-状态变化日志
 * @param id
 */
export const delIntrusionStateChange = (id: string | number | Array<string | number>) => {
  return request({
    url: "/intrusionAlarm/intrusionStateChange/" + id,
    method: "delete",
  });
};
