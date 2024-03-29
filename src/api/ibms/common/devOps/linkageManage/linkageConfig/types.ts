export interface LinkageConfigVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 联动配置名称
   */
  linkageName: string;

  /**
   * 联动状态
   */
  linkageStatus: string;

  /**
   * 星期
   */
  weeks: string;

  /**
   * 开始时间
   */
  startTime: string;

  /**
   * 结束时间
   */
  endTime: string;

  /**
   * 执行对象数组id
   */
  targetIds: string | number;

  /**
   * 触发器id
   */
  triggerId: string | number;

  /**
   * 执行类型
   */
  actionType: string;

  /**
   * 备注
   */
  notes: string;
}

export interface LinkageConfigForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 联动配置名称
   */
  linkageName?: string;

  /**
   * 联动状态
   */
  linkageStatus?: string;

  /**
   * 星期
   */
  weeks?: any;

  /**
   * 开始时间
   */
  startTime?: string;

  /**
   * 结束时间
   */
  endTime?: string;

  /**
   * 执行对象数组id
   */
  targetIds?: string | number;

  /**
   * 触发器id
   */
  triggerId?: string | number;

  /**
   * 执行类型
   */
  actionType?: string;

  /**
   * 备注
   */
  notes?: string;
  triggerData?: {};
}

export interface LinkageConfigQuery extends PageQuery {
  /**
   * 联动配置名称
   */
  linkageName?: string;

  /**
   * 联动状态
   */
  linkageStatus?: string;

  /**
   * 星期
   */
  weeks?: string;

  /**
   * 开始时间
   */
  startTime?: string;

  /**
   * 结束时间
   */
  endTime?: string;

  /**
   * 执行对象数组id
   */
  targetIds?: string | number;

  /**
   * 触发器id
   */
  triggerId?: string | number;

  /**
   * 执行类型
   */
  actionType?: string;

  /**
   * 备注
   */
  notes?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
