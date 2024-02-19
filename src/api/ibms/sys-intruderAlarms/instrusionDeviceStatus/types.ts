export interface InstrusionDeviceStatusVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 报警主机的Id号
   */
  deviceId: string | number;

  /**
   * 状态改变发生的时间
   */
  statusTime: string;

  /**
   * 状态改变发生的通道，如果是整机的状态改变，这个参数是空
   */
  channel: string;

  /**
   * 状态变化代码
   */
  statusType: string;

  /**
   * 添加时间
   */
  addTime: string;
}

export interface InstrusionDeviceStatusForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 报警主机的Id号
   */
  deviceId?: string | number;

  /**
   * 状态改变发生的时间
   */
  statusTime?: string;

  /**
   * 状态改变发生的通道，如果是整机的状态改变，这个参数是空
   */
  channel?: string;

  /**
   * 状态变化代码
   */
  statusType?: string;

  /**
   * 添加时间
   */
  addTime?: string;
}

export interface InstrusionDeviceStatusQuery extends PageQuery {
  /**
   * 报警主机的Id号
   */
  deviceId?: string | number;

  /**
   * 状态改变发生的时间
   */
  statusTime?: string;

  /**
   * 状态改变发生的通道，如果是整机的状态改变，这个参数是空
   */
  channel?: string;

  /**
   * 状态变化代码
   */
  statusType?: string;

  /**
   * 添加时间
   */
  addTime?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
