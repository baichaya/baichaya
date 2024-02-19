export interface EnergyVO {
  /**
   * 能耗仪表表ID
   */
  id: string | number;

  /**
   * 能耗仪表编号
   */
  energyCode: string;

  /**
   * 能耗仪表名称
   */
  energyName: string;

  /**
   * 能耗仪表类型 1-电表；2-水表；3-空调表
   */
  energyDeviceType: string;

  /**
   * 能耗仪表状态 4-开启；5-关闭
   */
  energyFlag: string;

  /**
   * 关联建筑ID
   */
  buildingId: string | number;

  /**
   * 创建时间
   */
  timeEnd: string;
}

export interface EnergyForm extends BaseEntity {
  /**
   * 能耗仪表表ID
   */
  id?: string | number;

  /**
   * 能耗仪表编号
   */
  energyCode?: string;

  /**
   * 能耗仪表名称
   */
  energyName?: string;

  /**
   * 能耗仪表类型 1-电表；2-水表；3-空调表
   */
  energyDeviceType?: string;

  /**
   * 能耗仪表状态 4-开启；5-关闭
   */
  energyFlag?: string;

  /**
   * 关联建筑ID
   */
  buildingId?: string | number;

  /**
   * 创建时间
   */
  timeEnd?: string;
}

export interface EnergyQuery extends PageQuery {
  /**
   * 能耗仪表编号
   */
  energyCode?: string;

  /**
   * 能耗仪表名称
   */
  energyName?: string;

  /**
   * 能耗仪表类型 1-电表；2-水表；3-空调表
   */
  energyDeviceType?: string;

  /**
   * 能耗仪表状态 4-开启；5-关闭
   */
  energyFlag?: string;

  /**
   * 关联建筑ID
   */
  buildingId?: string | number;

  /**
   * 创建时间
   */
  timeEnd?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
