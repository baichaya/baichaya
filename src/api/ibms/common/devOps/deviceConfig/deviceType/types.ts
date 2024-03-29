export interface DeviceTypeVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 设备类型
   */
  deviceType: string;

  /**
   * 分组id
   */
  groupId: string | number;

  /**
   * 分组名
   */
  groupName: string;
}

export interface DeviceTypeForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 设备类型
   */
  deviceType?: string;

  /**
   * 分组id
   */
  groupId?: string | number;

  /**
   * 分组名
   */
  groupName?: string;
}

export interface DeviceTypeQuery extends PageQuery {
  /**
   * 设备类型
   */
  deviceType?: string;

  /**
   * 分组id
   */
  groupId?: string | number;

  /**
   * 分组名
   */
  groupName?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
