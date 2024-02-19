export interface IntrusionStateChangeVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 设备id
   */
  deviceId: string | number;

  /**
   * 状态变化时间
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
}

export interface IntrusionStateChangeForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 设备id
   */
  deviceId?: string | number;

  /**
   * 状态变化时间
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
}

export interface IntrusionStateChangeQuery extends PageQuery {
  /**
   * 设备id
   */
  deviceId?: string | number;

  /**
   * 状态变化时间
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
   * 日期范围参数
   */
  params?: any;
}
