import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { BuildingFloorVO, BuildingFloorForm, BuildingFloorQuery } from "@/api/ibms/common/device/buildingFloor/types";

/**
 * 查询区域楼栋楼层列表
 * @param query
 * @returns {*}
 */

export const listBuildingFloor = (query?: BuildingFloorQuery): AxiosPromise<BuildingFloorVO[]> => {
  return request({
    url: "/ibms/buildingFloor/list",
    method: "get",
    params: query,
  });
};

/**
 * 查询区域楼栋楼层详细
 * @param id
 */
export const getBuildingFloor = (id: string | number): AxiosPromise<BuildingFloorVO> => {
  return request({
    url: "/ibms/buildingFloor/" + id,
    method: "get",
  });
};

/**
 * 新增区域楼栋楼层
 * @param data
 */
export const addBuildingFloor = (data: BuildingFloorForm) => {
  return request({
    url: "/ibms/buildingFloor",
    method: "post",
    data: data,
  });
};

/**
 * 修改区域楼栋楼层
 * @param data
 */
export const updateBuildingFloor = (data: BuildingFloorForm) => {
  return request({
    url: "/ibms/buildingFloor",
    method: "put",
    data: data,
  });
};

/**
 * 删除区域楼栋楼层
 * @param id
 */
export const delBuildingFloor = (id: string | number | Array<string | number>) => {
  return request({
    url: "/ibms/buildingFloor/" + id,
    method: "delete",
  });
};

/**
 * 获取节点列表
 */
export const listParentIdList = (query?: BuildingFloorQuery): AxiosPromise<BuildingFloorVO[]> => {
  return request({
    url: "/ibms/buildingFloor/getInfiniteTree",
    method: "get",
    params: query,
  });
};
