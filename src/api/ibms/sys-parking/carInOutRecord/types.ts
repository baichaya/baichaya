export interface CarInOutRecordVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 车场id
   */
  parkId: string | number;

  /**
   * 通道编号
   */
  channelId: string | number;

  /**
   * 通道名称
   */
  channelName: string;

  /**
   * 车牌号码
   */
  carCode: string;

  /**
   * 车辆本次进场出场标识
   */
  GUID: string;

  /**
   * 进出标志（0：进场，1：出场）
   */
  inOrOut: number;

  /**
   * 进场时间
   */
  inTime: string;

  /**
   * 出场时间
   */
  outTime: string;

  /**
   * 图片路径地址
   */
  imagePath: string;
}

export interface CarInOutRecordForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 车场id
   */
  parkId?: string | number;

  /**
   * 通道编号
   */
  channelId?: string | number;

  /**
   * 通道名称
   */
  channelName?: string;

  /**
   * 车牌号码
   */
  carCode?: string;

  /**
   * 车辆本次进场出场标识
   */
  GUID?: string;

  /**
   * 进出标志（0：进场，1：出场）
   */
  inOrOut?: number;

  /**
   * 进场时间
   */
  inTime?: string;

  /**
   * 出场时间
   */
  outTime?: string;

  /**
   * 图片路径地址
   */
  imagePath?: string;
}

export interface CarInOutRecordQuery extends PageQuery {
  /**
   * 车场id
   */
  parkId?: string | number;

  /**
   * 通道编号
   */
  channelId?: string | number;

  /**
   * 通道名称
   */
  channelName?: string;

  /**
   * 车牌号码
   */
  carCode?: string;

  /**
   * 车辆本次进场出场标识
   */
  GUID?: string;

  /**
   * 进出标志（0：进场，1：出场）
   */
  inOrOut?: number;

  /**
   * 进场时间
   */
  inTime?: string;

  /**
   * 出场时间
   */
  outTime?: string;

  /**
   * 图片路径地址
   */
  imagePath?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
