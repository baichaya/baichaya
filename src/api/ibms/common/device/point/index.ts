import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { PointVO, PointForm, PointQuery } from '@/api/ibms/common/device/point/types';
import {AreaVO} from "@/api/ibms/common/device/area/types";

/**
 * 查询设备点位列表
 * @param query
 * @returns {*}
 */

export const listPoint = (query?: PointQuery): AxiosPromise<PointVO[]> => {
  return request({
    url: '/ibms/point/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询楼层下拉结构
 */
export const selectTree = (query?: PointQuery): AxiosPromise<AreaVO[]> => {
  return request({
    url: '/ibms/point/selectByAreaBuilding',
    method: 'get',
    params: query
  });
};

/**
 * 查询设备点位详细
 * @param id
 */
export const getPoint = (id: string | number): AxiosPromise<PointVO> => {
  return request({
    url: '/ibms/point/' + id,
    method: 'get'
  });
};

/**
 * 新增设备点位
 * @param data
 */
export const addPoint = (data: PointForm) => {
  return request({
    url: '/ibms/point',
    method: 'post',
    data: data
  });
};

/**
 * 修改设备点位
 * @param data
 */
export const updatePoint = (data: PointForm) => {
  return request({
    url: '/ibms/point',
    method: 'put',
    data: data
  });
};

/**
 * 删除设备点位
 * @param id
 */
export const delPoint = (id: string | number | Array<string | number>) => {
  return request({
    url: '/ibms/point/' + id,
    method: 'delete'
  });
};
