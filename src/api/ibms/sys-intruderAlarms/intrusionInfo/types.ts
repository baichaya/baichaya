export interface IntrusionInfoVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 报警主机的Id号
   */
  deviceId: string | number;

  /**
   * 报警发生时间
   */
  alarmTime: string;

  /**
   * 报警发生通道
   */
  channel: string;

  /**
   * 报警发生的子通道，如果子通道为0，这个空缺
   */
  subChannel: string;

  /**
   * 发生报警事件的CID代码
   */
  CID: string;

  /**
   * 添加时间
   */
  addTime: string;
}

export interface IntrusionInfoForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 报警主机的Id号
   */
  deviceId?: string | number;

  /**
   * 报警发生时间
   */
  alarmTime?: string;

  /**
   * 报警发生通道
   */
  channel?: string;

  /**
   * 报警发生的子通道，如果子通道为0，这个空缺
   */
  subChannel?: string;

  /**
   * 发生报警事件的CID代码
   */
  CID?: string;

  /**
   * 添加时间
   */
  addTime?: string;
}

export interface IntrusionInfoQuery extends PageQuery {
  /**
   * 报警主机的Id号
   */
  deviceId?: string | number;

  /**
   * 报警发生时间
   */
  alarmTime?: string;

  /**
   * 报警发生通道
   */
  channel?: string;

  /**
   * 报警发生的子通道，如果子通道为0，这个空缺
   */
  subChannel?: string;

  /**
   * 发生报警事件的CID代码
   */
  CID?: string;

  /**
   * 添加时间
   */
  addTime?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
