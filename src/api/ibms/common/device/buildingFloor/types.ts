export interface BuildingFloorVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 区域、楼栋、单元、楼层名称
   */
  positionName: string;

  /**
   * 类型 0区域 1楼栋 2单元 3楼层
   */
  type: number;

  /**
   * 楼栋楼层
   */
  children: BuildingFloorVO[];

  /**
   * 父级id
   */
  parentId: string | number | any;

  /**
   * 楼层数
   */
  floorCount: number;

  /**
   * 电子地图url
   */
  cadUrl: string;

  /**
   * 其他情况
   */
  remark: string;
}

export interface BuildingFloorForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 区域、楼栋、单元、楼层名称
   */
  positionName?: string;

  /**
   * 类型 0区域 1楼栋 2单元 3楼层
   */
  type?: number;

  /**
   * 父级id
   */
  parentId?: string | number | any;

  /**
   * 楼层数
   */
  floorCount?: number;

  /**
   * 电子地图url
   */
  cadUrl?: string;

  /**
   * 其他情况
   */
  remark?: string;
}

export interface BuildingFloorQuery extends PageQuery {
  /**
   * 区域、楼栋、单元、楼层名称
   */
  positionName?: string;

  /**
   * 类型 0区域 1楼栋 2单元 3楼层
   */
  type?: number;

  /**
   * 父级id
   */
  parentId?: string | number;

  /**
   * 楼层数
   */
  floorCount?: number;

  /**
   * 电子地图url
   */
  cadUrl?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
