export interface DeviceAllVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 设备分组id
   */
  deviceGroupId: string | number;
  /**
   * 设备名称
   */
  deviceName: string | number;

  /**
   * 设备类型id
   */
  deviceTypeId: string | number;

  /**
   * 设备唯一id
   */
  deviceId: string | number;

  /**
   * 设备绑定状态
   */
  isBindingStatus: number;
}

export interface DeviceAllForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 设备分组id
   */
  deviceGroupId?: string | number;
  /**
   * 设备名称
   */
  deviceName?: string | number;

  /**
   * 设备类型id
   */
  deviceTypeId?: string | number;

  /**
   * 设备唯一id
   */
  deviceId?: string | number;

  /**
   * 设备绑定状态
   */
  isBindingStatus?: number;
}

export interface DeviceAllQuery extends PageQuery {
  /**
   * 设备分组id
   */
  deviceGroupId?: string | number;
  /**
   * 设备名称
   */
  deviceName?: string | number;

  /**
   * 设备类型id
   */
  deviceTypeId?: string | number;

  /**
   * 设备唯一id
   */
  deviceId?: string | number;

  /**
   * 设备绑定状态
   */
  isBindingStatus?: number;

  /**
   * 日期范围参数
   */
  params?: any;
}
