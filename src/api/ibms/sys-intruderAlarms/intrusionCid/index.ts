import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { IntrusionCidVO, IntrusionCidForm, IntrusionCidQuery } from "./types";

/**
 * 查询入侵报警_CID码列表
 * @param query
 * @returns {*}
 */

export const listIntrusionCid = (query?: IntrusionCidQuery): AxiosPromise<IntrusionCidVO[]> => {
  return request({
    url: "/intrusionAlarm/intrusionCid/list",
    method: "get",
    params: query,
  });
};

/**
 * 查询入侵报警_CID码详细
 * @param alarmCode
 */
export const getIntrusionCid = (alarmCode: string | number): AxiosPromise<IntrusionCidVO> => {
  return request({
    url: "/intrusionAlarm/intrusionCid/" + alarmCode,
    method: "get",
  });
};

/**
 * 新增入侵报警_CID码
 * @param data
 */
export const addIntrusionCid = (data: IntrusionCidForm) => {
  return request({
    url: "/intrusionAlarm/intrusionCid",
    method: "post",
    data: data,
  });
};

/**
 * 修改入侵报警_CID码
 * @param data
 */
export const updateIntrusionCid = (data: IntrusionCidForm) => {
  return request({
    url: "/intrusionAlarm/intrusionCid",
    method: "put",
    data: data,
  });
};

/**
 * 删除入侵报警_CID码
 * @param alarmCode
 */
export const delIntrusionCid = (alarmCode: string | number | Array<string | number>) => {
  return request({
    url: "/intrusionAlarm/intrusionCid/" + alarmCode,
    method: "delete",
  });
};
