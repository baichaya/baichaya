import request from "@/utils/request";
import { AxiosPromise } from "axios";
import {
  TargetDeviceVO,
  TargetDeviceForm,
  TargetDeviceQuery,
} from "@/api/ibms/common/devOps/linkageManage/targetDevice/types";

/**
 * 查询执行设备列表
 * @param query
 * @returns {*}
 */

export const listTargetDevice = (query?: TargetDeviceQuery): AxiosPromise<TargetDeviceVO[]> => {
  return request({
    url: "/linkageManage/targetDevice/list",
    method: "get",
    params: query,
  });
};

/**
 * 查询执行设备详细
 * @param id
 */
export const getTargetDevice = (id: string | number): AxiosPromise<TargetDeviceVO> => {
  return request({
    url: "/linkageManage/targetDevice/" + id,
    method: "get",
  });
};

/**
 * 新增执行设备
 * @param data
 */
export const addTargetDevice = (data: TargetDeviceForm) => {
  return request({
    url: "/linkageManage/targetDevice",
    method: "post",
    data: data,
  });
};

/**
 * 修改执行设备
 * @param data
 */
export const updateTargetDevice = (data: TargetDeviceForm) => {
  return request({
    url: "/linkageManage/targetDevice",
    method: "put",
    data: data,
  });
};

/**
 * 删除执行设备
 * @param id
 */
export const delTargetDevice = (id: string | number | Array<string | number>) => {
  return request({
    url: "/linkageManage/targetDevice/" + id,
    method: "delete",
  });
};
