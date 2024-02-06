export interface AreaVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 区域名称
   */
  areaName: string;

  /**
   * 上级区域id
   */
  parentAreaId: string | number;

  /**
   * 区域地址
   */
  areaAddress: string;

  /**
   * 备注
   */
  remark: string;

}

export interface AreaForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 区域名称
   */
  areaName?: string;

  /**
   * 上级区域id
   */
  parentAreaId?: string | number;

  /**
   * 区域地址
   */
  areaAddress?: string;

  /**
   * 备注
   */
  remark?: string;

}

export interface AreaQuery extends PageQuery {

  /**
   * 区域名称
   */
  areaName?: string;

  /**
   * 上级区域id
   */
  parentAreaId?: string | number;

  /**
   * 区域地址
   */
  areaAddress?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



