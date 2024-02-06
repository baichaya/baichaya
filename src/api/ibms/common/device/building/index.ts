import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { BuildingVO, BuildingForm, BuildingQuery } from '@/api/ibms/common/device/building/types';

/**
 * 查询楼栋
列表
 * @param query
 * @returns {*}
 */

export const listBuilding = (query?: BuildingQuery): AxiosPromise<BuildingVO[]> => {
  return request({
    url: '/ibms/building/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询楼栋
详细
 * @param id
 */
export const getBuilding = (id: string | number): AxiosPromise<BuildingVO> => {
  return request({
    url: '/ibms/building/' + id,
    method: 'get'
  });
};

/**
 * 新增楼栋

 * @param data
 */
export const addBuilding = (data: BuildingForm) => {
  return request({
    url: '/ibms/building',
    method: 'post',
    data: data
  });
};

/**
 * 修改楼栋

 * @param data
 */
export const updateBuilding = (data: BuildingForm) => {
  return request({
    url: '/ibms/building',
    method: 'put',
    data: data
  });
};

/**
 * 删除楼栋

 * @param id
 */
export const delBuilding = (id: string | number | Array<string | number>) => {
  return request({
    url: '/ibms/building/' + id,
    method: 'delete'
  });
};
