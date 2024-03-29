export interface LinkageLogVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 联动配置名
   */
  linkageName: string;

  /**
   * 执行状态
   */
  actionStatus: string;

  /**
   * 执行时间
   */
  actionTime: string;

  /**
   * 执行详情
   */
  adtionDetails: string;

  /**
   * 备注
   */
  note: string;
}

export interface LinkageLogForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 联动配置名
   */
  linkageName?: string;

  /**
   * 执行状态
   */
  actionStatus?: string;

  /**
   * 执行时间
   */
  actionTime?: string;

  /**
   * 执行详情
   */
  adtionDetails?: string;

  /**
   * 备注
   */
  note?: string;
}

export interface LinkageLogQuery extends PageQuery {
  /**
   * 联动配置名
   */
  linkageName?: string;

  /**
   * 执行状态
   */
  actionStatus?: string;

  /**
   * 执行时间
   */
  actionTime?: string;

  /**
   * 执行详情
   */
  adtionDetails?: string;

  /**
   * 备注
   */
  note?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
