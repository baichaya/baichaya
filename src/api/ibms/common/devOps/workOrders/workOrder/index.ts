import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { WorkOrderVO, WorkOrderForm, WorkOrderQuery } from "@/api/ibms/common/devOps/workOrders/workOrder/types";

/**
 * 查询工单列表
 * @param query
 * @returns {*}
 */

export const listWorkOrder = (query?: WorkOrderQuery): AxiosPromise<WorkOrderVO[]> => {
  return request({
    url: "/workOrders/workOrder/list",
    method: "get",
    params: query,
  });
};

/**
 * 查询工单详细
 * @param id
 */
export const getWorkOrder = (id: string | number): AxiosPromise<WorkOrderVO> => {
  return request({
    url: "/workOrders/workOrder/" + id,
    method: "get",
  });
};

/**
 * 新增工单
 * @param data
 */
export const addWorkOrder = (data: WorkOrderForm) => {
  return request({
    url: "/workOrders/workOrder",
    method: "post",
    data: data,
  });
};

/**
 * 修改工单
 * @param data
 */
export const updateWorkOrder = (data: WorkOrderForm) => {
  return request({
    url: "/workOrders/workOrder",
    method: "put",
    data: data,
  });
};

/**
 * 删除工单
 * @param id
 */
export const delWorkOrder = (id: string | number | Array<string | number>) => {
  return request({
    url: "/workOrders/workOrder/" + id,
    method: "delete",
  });
};
