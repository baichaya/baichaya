export interface FloorVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 楼栋id
   */
  buildingId: string | number;

  /**
   * 楼层名称
   */
  floorName: string;

  /**
   * 电子地图url
   */
  cadUrl: string;

  /**
   * 其他情况
   */
  remark: string;

}

export interface FloorForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 楼栋id
   */
  buildingId?: string | number;

  /**
   * 楼层名称
   */
  floorName?: string;

  /**
   * 电子地图url
   */
  cadUrl?: string;

  /**
   * 其他情况
   */
  remark?: string;

}

export interface FloorQuery extends PageQuery {

  /**
   * 楼栋id
   */
  buildingId?: string | number;

  /**
   * 楼层名称
   */
  floorName?: string;

  /**
   * 电子地图url
   */
  cadUrl?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



