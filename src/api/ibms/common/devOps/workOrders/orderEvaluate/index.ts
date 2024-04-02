import request from "@/utils/request";
import { AxiosPromise } from "axios";
import {
  OrderEvaluateVO,
  OrderEvaluateForm,
  OrderEvaluateQuery,
} from "@/api/ibms/common/devOps/workOrders/orderEvaluate/types";

/**
 * 查询评价列表
 * @param query
 * @returns {*}
 */

export const listOrderEvaluate = (
  query?: OrderEvaluateQuery
): AxiosPromise<OrderEvaluateVO[]> => {
  return request({
    url: "/workOrders/orderEvaluate/list",
    method: "get",
    params: query,
  });
};

/**
 * 查询评价详细
 * @param id
 */
export const getOrderEvaluate = (
  id: string | number
): AxiosPromise<OrderEvaluateVO> => {
  return request({
    url: "/workOrders/orderEvaluate/" + id,
    method: "get",
  });
};

/**
 * 新增评价
 * @param data
 */
export const addOrderEvaluate = (data: OrderEvaluateForm) => {
  return request({
    url: "/workOrders/orderEvaluate",
    method: "post",
    data: data,
  });
};

/**
 * 修改评价
 * @param data
 */
export const updateOrderEvaluate = (data: OrderEvaluateForm) => {
  return request({
    url: "/workOrders/orderEvaluate",
    method: "put",
    data: data,
  });
};

/**
 * 删除评价
 * @param id
 */
export const delOrderEvaluate = (
  id: string | number | Array<string | number>
) => {
  return request({
    url: "/workOrders/orderEvaluate/" + id,
    method: "delete",
  });
};
