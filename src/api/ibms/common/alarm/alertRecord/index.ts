import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { AlertRecordVO, AlertRecordForm, AlertRecordQuery } from "@/api/ibms/common/alarm/alertRecord/types";

/**
 * 查询告警记录列表
 * @param query
 * @returns {*}
 */

export const listAlertRecord = (query?: AlertRecordQuery): AxiosPromise<AlertRecordVO[]> => {
  return request({
    url: "/ibms/alertRecord/list",
    method: "get",
    params: query,
  });
};

/**
 * 查询告警记录详细
 * @param id
 */
export const getAlertRecord = (id: string | number): AxiosPromise<AlertRecordVO> => {
  return request({
    url: "/ibms/alertRecord/" + id,
    method: "get",
  });
};

/**
 * 新增告警记录
 * @param data
 */
export const addAlertRecord = (data: AlertRecordForm) => {
  return request({
    url: "/ibms/alertRecord",
    method: "post",
    data: data,
  });
};

/**
 * 修改告警记录
 * @param data
 */
export const updateAlertRecord = (data: AlertRecordForm) => {
  return request({
    url: "/ibms/alertRecord",
    method: "put",
    data: data,
  });
};

/**
 * 删除告警记录
 * @param id
 */
export const delAlertRecord = (id: string | number | Array<string | number>) => {
  return request({
    url: "/ibms/alertRecord/" + id,
    method: "delete",
  });
};
