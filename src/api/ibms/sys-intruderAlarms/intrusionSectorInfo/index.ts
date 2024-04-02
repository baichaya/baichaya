import request from "@/utils/request";
import { AxiosPromise } from "axios";
import {
  IntrusionSectorInfoVO,
  IntrusionSectorInfoForm,
  IntrusionSectorInfoQuery,
} from "./types";

/**
 * 查询入侵报警_防区资料列表
 * @param query
 * @returns {*}
 */

export const listIntrusionSectorInfo = (
  query?: IntrusionSectorInfoQuery
): AxiosPromise<IntrusionSectorInfoVO[]> => {
  return request({
    url: "/intrusionAlarm/intrusionSectorInfo/list",
    method: "get",
    params: query,
  });
};

/**
 * 查询入侵报警_防区资料详细
 * @param id
 */
export const getIntrusionSectorInfo = (
  id: string | number
): AxiosPromise<IntrusionSectorInfoVO> => {
  return request({
    url: "/intrusionAlarm/intrusionSectorInfo/" + id,
    method: "get",
  });
};

/**
 * 新增入侵报警_防区资料
 * @param data
 */
export const addIntrusionSectorInfo = (data: IntrusionSectorInfoForm) => {
  return request({
    url: "/intrusionAlarm/intrusionSectorInfo",
    method: "post",
    data: data,
  });
};

/**
 * 修改入侵报警_防区资料
 * @param data
 */
export const updateIntrusionSectorInfo = (data: IntrusionSectorInfoForm) => {
  return request({
    url: "/intrusionAlarm/intrusionSectorInfo",
    method: "put",
    data: data,
  });
};

/**
 * 删除入侵报警_防区资料
 * @param id
 */
export const delIntrusionSectorInfo = (
  id: string | number | Array<string | number>
) => {
  return request({
    url: "/intrusionAlarm/intrusionSectorInfo/" + id,
    method: "delete",
  });
};
