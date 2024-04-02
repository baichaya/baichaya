export interface DeviceGroupVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 分组名称
   */
  groupName: string;

  /**
   * 是否是当前项目的子系统(Y or N)
   */
  isNowProject: string;

  /**
   * 图标(对应图标名称)
   */
  icon: string;

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

  /**
   * 是否是当前项目的子系统(Y or N)
   */
  isNowProject?: string;

  /**
   * 图标(对应图标名称)
   */
  icon?: string;

}

export interface DeviceGroupQuery extends PageQuery {

  /**
   * 分组名称
   */
  groupName?: string;

  /**
   * 是否是当前项目的子系统(Y or N)
   */
  isNowProject?: string;

  /**
   * 图标(对应图标名称)
   */
  icon?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}