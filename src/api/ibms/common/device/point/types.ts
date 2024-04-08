export interface PointVO {
  /**
   * 区域id
   */
  areaId?: number;
  /**
   * 楼栋id
   */
  buildingId?: number;
  /**
   * 创建者
   */
  createBy?: number;
  /**
   * 创建部门
   */
  createDept?: number;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 设备分组
   */
  deviceGroup: string;
  /**
   * 设备id
   */
  deviceId?: string;
  /**
   * 设备类型
   */
  deviceType: string;
  /**
   * 楼层id
   */
  floorId: number;
  /**
   * 主键
   */
  id?: number;
  /**
   * 是否已绑定设备
   */
  isBinding?: string;
  /**
   * 请求参数
   */
  params?: any;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 更新者
   */
  updateBy?: number;
  /**
   * 更新时间
   */
  updateTime?: Date;
  /**
   * X轴
   */
  xaxis: number;
  /**
   * Y轴
   */
  yaxis: number;
  /**
   * z轴
   */
  zaxis?: number;
}

export interface PointForm extends BaseEntity {
  /**
   * 区域id
   */
  areaId?: number;
  /**
   * 楼栋id
   */
  buildingId?: number;
  /**
   * 设备分组
   */
  deviceGroup: string;
  /**
   * 设备id
   */
  deviceId?: string;
  /**
   * 设备类型
   */
  deviceType: string;
  /**
   * 楼层id
   */
  floorId: string | number;
  /**
   * 主键
   */
  id?: number;
  /**
   * 是否已绑定设备
   */
  isBinding?: string;
  /**
   * 请求参数
   */
  params?: any;
  /**
   * 备注
   */
  remark?: string;
  /**
   * X轴
   */
  xaxis: number | undefined;
  /**
   * Y轴
   */
  yaxis: number | undefined;
  /**
   * z轴
   */
  zaxis?: number;
}

export interface PointQuery extends PageQuery {
  /**
   * 区域id
   */
  areaId?: number;
  /**
   * 楼栋id
   */
  buildingId?: number;
  /**
   * 创建者
   */
  createBy?: number;
  /**
   * 创建部门
   */
  createDept?: number;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 设备分组
   */
  deviceGroup: string;
  /**
   * 设备id
   */
  deviceId?: string;
  /**
   * 设备类型
   */
  deviceType: string;
  /**
   * 楼层id
   */
  floorId: string | number;
  /**
   * 主键
   */
  id?: number;
  /**
   * 排序的方向desc或者asc
   */
  isAsc?: string;
  /**
   * 是否已绑定设备
   */
  isBinding?: string;
  /**
   * 排序列
   */
  orderByColumn?: string;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 更新者
   */
  updateBy?: number;
  /**
   * 更新时间
   */
  updateTime?: string;
  /**
   * X轴
   */
  xaxis: number | undefined;
  /**
   * Y轴
   */
  yaxis: number | undefined;
  /**
   * z轴
   */
  zaxis?: number;
}
