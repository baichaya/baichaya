import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { OrderHistoryVO, OrderHistoryForm, OrderHistoryQuery } from '@/api/ibms/common/devOps/workOrders/orderHistory/types';

/**
 * 查询处理历史列表
 * @param query
 * @returns {*}
 */

export const listOrderHistory = (query?: OrderHistoryQuery): AxiosPromise<OrderHistoryVO[]> => {
  return request({
    url: '/workOrders/orderHistory/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询处理历史详细
 * @param id
 */
export const getOrderHistory = (id: string | number): AxiosPromise<OrderHistoryVO> => {
  return request({
    url: '/workOrders/orderHistory/' + id,
    method: 'get'
  });
};

/**
 * 新增处理历史
 * @param data
 */
export const addOrderHistory = (data: OrderHistoryForm) => {
  return request({
    url: '/workOrders/orderHistory',
    method: 'post',
    data: data
  });
};

/**
 * 修改处理历史
 * @param data
 */
export const updateOrderHistory = (data: OrderHistoryForm) => {
  return request({
    url: '/workOrders/orderHistory',
    method: 'put',
    data: data
  });
};

/**
 * 删除处理历史
 * @param id
 */
export const delOrderHistory = (id: string | number | Array<string | number>) => {
  return request({
    url: '/workOrders/orderHistory/' + id,
    method: 'delete'
  });
};
