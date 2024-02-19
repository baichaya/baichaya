import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { EnergyVO, EnergyForm, EnergyQuery } from "./types";

/**
 * 查询能耗设备信息列表
 * @param query
 * @returns {*}
 */

export const listEnergy = (query?: EnergyQuery): AxiosPromise<EnergyVO[]> => {
  return request({
    url: "/ibms/energy/list",
    method: "get",
    params: query,
  });
};

/**
 * 查询能耗设备信息详细
 * @param id
 */
export const getEnergy = (id: string | number): AxiosPromise<EnergyVO> => {
  return request({
    url: "/ibms/energy/" + id,
    method: "get",
  });
};

/**
 * 新增能耗设备信息
 * @param data
 */
export const addEnergy = (data: EnergyForm) => {
  return request({
    url: "/ibms/energy",
    method: "post",
    data: data,
  });
};

/**
 * 修改能耗设备信息
 * @param data
 */
export const updateEnergy = (data: EnergyForm) => {
  return request({
    url: "/ibms/energy",
    method: "put",
    data: data,
  });
};

/**
 * 删除能耗设备信息
 * @param id
 */
export const delEnergy = (id: string | number | Array<string | number>) => {
  return request({
    url: "/ibms/energy/" + id,
    method: "delete",
  });
};
