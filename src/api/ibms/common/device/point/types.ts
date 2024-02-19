export interface PointVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 设备id
   */
  deviceId: string | number;

  /**
   * 设备分组
   */
  deviceGroup: string;

  /**
   * 设备类型
   */
  deviceType: string;

  /**
   * 安装位置（楼层）
   */
  floorId: number;
  floorIds: number[];

  areaBuildingFloorId: string;

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
  zaxis: number;

  /**
   * 备注
   */
  remark: string;

  /**
   * 是否已绑定设备
   */
  isBinding: string;
}

export interface PointForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 设备id
   */
  deviceId?: string | number;

  /**
   * 设备分组
   */
  deviceGroup?: string;

  /**
   * 设备类型
   */
  deviceType?: string;

  /**
   * 安装位置（楼层）
   */
  floorId?: string | number;
  floorIds: number[];

  areaBuildingFloorId: string;

  /**
   * X轴
   */
  xaxis?: number;

  /**
   * Y轴
   */
  yaxis?: number;

  /**
   * z轴
   */
  zaxis?: number;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 是否已绑定设备
   */
  isBinding?: string;
}

export interface PointQuery extends PageQuery {
  /**
   * 设备id
   */
  deviceId?: string | number;

  /**
   * 设备分组
   */
  deviceGroup?: string;

  /**
   * 设备类型
   */
  deviceType?: string;

  /**
   * 安装位置（楼层）
   */
  floorId?: string | number;
  floorIds: number[];

  areaBuildingFloorId: string;

  /**
   * X轴
   */
  xaxis?: number;

  /**
   * Y轴
   */
  yaxis?: number;

  /**
   * z轴
   */
  zaxis?: number;

  /**
   * 是否已绑定设备
   */
  isBinding?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
