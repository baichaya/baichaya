export interface DeviceGroupVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 分组名称
   */
  groupName: string;
}

export interface DeviceGroupForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 分组名称
   */
  groupName?: string;
}

export interface DeviceGroupQuery extends PageQuery {
  /**
   * 分组名称
   */
  groupName?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
