export interface BuildingVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 楼栋名称
   */
  buildingName: string;

  /**
   * 楼栋所在区域id
   */
  areaId: string | number;

  /**
   * 楼层总数
   */
  floorCount: number;

  /**
   * 备注
   */
  remark: string;
}

export interface BuildingForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 楼栋名称
   */
  buildingName?: string;

  /**
   * 楼栋所在区域id
   */
  areaId?: string | number;

  /**
   * 楼层总数
   */
  floorCount?: number;

  /**
   * 备注
   */
  remark?: string;
}

export interface BuildingQuery extends PageQuery {
  /**
   * 楼栋名称
   */
  buildingName?: string;

  /**
   * 楼栋所在区域id
   */
  areaId?: string | number;

  /**
   * 楼层总数
   */
  floorCount?: number;

  /**
   * 日期范围参数
   */
  params?: any;
}
