export interface TargetDeviceVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 设备分组id
   */
  groupId: string | number;

  /**
   * 设备类型id
   */
  deviceTypeId: string | number;

  /**
   * 设备分组名称
   */
  groupName: string;

  /**
   * 设备分类名称
   */
  deviceTypeName: string;

  /**
   * 设备id
   */
  deviceId: string | number;

  /**
   * 设备名称
   */
  deviceName: string;

  /**
   * 方法id
   */
  methodId: string | number;

  /**
   * 方法名称
   */
  methodName: string;

  /**
   * 参数
   */
  jsonData: string;
}

export interface TargetDeviceForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 设备分组id
   */
  groupId?: string | number;

  /**
   * 设备类型id
   */
  deviceTypeId?: string | number;

  /**
   * 设备分组名称
   */
  groupName?: string;

  /**
   * 设备分类名称
   */
  deviceTypeName?: string;

  /**
   * 设备id
   */
  deviceId?: string | number;

  /**
   * 设备名称
   */
  deviceName?: string;

  /**
   * 方法id
   */
  methodId?: string | number;

  /**
   * 方法名称
   */
  methodName?: string;

  /**
   * 参数
   */
  jsonData?: string;
}

export interface TargetDeviceQuery extends PageQuery {
  /**
   * 设备分组id
   */
  groupId?: string | number;

  /**
   * 设备类型id
   */
  deviceTypeId?: string | number;

  /**
   * 设备分组名称
   */
  groupName?: string;

  /**
   * 设备分类名称
   */
  deviceTypeName?: string;

  /**
   * 设备id
   */
  deviceId?: string | number;

  /**
   * 设备名称
   */
  deviceName?: string;

  /**
   * 方法id
   */
  methodId?: string | number;

  /**
   * 方法名称
   */
  methodName?: string;

  /**
   * 参数
   */
  jsonData?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
