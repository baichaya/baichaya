import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { OrderDetailsVO, OrderDetailsForm, OrderDetailsQuery } from '@/api/ibms/common/devOps/workOrders/orderDetails/types';

/**
 * 查询工单管理-工单详细列表
 * @param query
 * @returns {*}
 */

export const listOrderDetails = (query?: OrderDetailsQuery): AxiosPromise<OrderDetailsVO[]> => {
  return request({
    url: '/workOrders/orderDetails/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询工单管理-工单详细详细
 * @param workOrderDetailSn
 */
export const getOrderDetails = (workOrderDetailSn: string | number): AxiosPromise<OrderDetailsVO> => {
  return request({
    url: '/workOrders/orderDetails/' + workOrderDetailSn,
    method: 'get'
  });
};

/**
 * 查询工单管理-工单详细详细---根据沟通单编号查询
 * @param getOrderDetailsByOrderSn
 */
export const getOrderDetailsByOrderSn = (workOrderSn: string | number): AxiosPromise<OrderDetailsVO> => {
  return request({
    url: '/workOrders/orderDetails/byOrderSn/' + workOrderSn,
    method: 'get'
  });
};

/**
 * 新增工单管理-工单详细
 * @param data
 */
export const addOrderDetails = (data: OrderDetailsForm) => {
  return request({
    url: '/workOrders/orderDetails',
    method: 'post',
    data: data
  });
};

/**
 * 修改工单管理-工单详细
 * @param data
 */
export const updateOrderDetails = (data: OrderDetailsForm) => {
  return request({
    url: '/workOrders/orderDetails',
    method: 'put',
    data: data
  });
};

/**
 * 删除工单管理-工单详细
 * @param workOrderDetailSn
 */
export const delOrderDetails = (workOrderDetailSn: string | number | Array<string | number>) => {
  return request({
    url: '/workOrders/orderDetails/' + workOrderDetailSn,
    method: 'delete'
  });
};
