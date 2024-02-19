export interface BaVO {
  /**
   * 楼控表ID
   */
  id: string | number;

  /**
   * 楼控设备参数
   */
  baName: string;

  /**
   * 楼控设备属性名
   */
  baTargetName: string;

  /**
   * 楼控协议名称
   */
  baObjectName: string;

  /**
   * 楼控协议类型
   */
  baObjectType: string;

  /**
   * 楼控设备允许状态
   */
  baInstNum: number;

  /**
   * 关联建筑ID
   */
  buildingId: string | number;

  /**
   * 备注信息
   */
  baRemark: string;

  /**
   * 创建时间
   */
  timeEnd: string;
}

export interface BaForm extends BaseEntity {
  /**
   * 楼控表ID
   */
  id?: string | number;

  /**
   * 楼控设备参数
   */
  baName?: string;

  /**
   * 楼控设备属性名
   */
  baTargetName?: string;

  /**
   * 楼控协议名称
   */
  baObjectName?: string;

  /**
   * 楼控协议类型
   */
  baObjectType?: string;

  /**
   * 楼控设备允许状态
   */
  baInstNum?: number;

  /**
   * 关联建筑ID
   */
  buildingId?: string | number;

  /**
   * 备注信息
   */
  baRemark?: string;

  /**
   * 创建时间
   */
  timeEnd?: string;
}

export interface BaQuery extends PageQuery {
  /**
   * 楼控设备参数
   */
  baName?: string;

  /**
   * 楼控设备属性名
   */
  baTargetName?: string;

  /**
   * 楼控协议名称
   */
  baObjectName?: string;

  /**
   * 楼控协议类型
   */
  baObjectType?: string;

  /**
   * 楼控设备允许状态
   */
  baInstNum?: number;

  /**
   * 关联建筑ID
   */
  buildingId?: string | number;

  /**
   * 备注信息
   */
  baRemark?: string;

  /**
   * 创建时间
   */
  timeEnd?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
