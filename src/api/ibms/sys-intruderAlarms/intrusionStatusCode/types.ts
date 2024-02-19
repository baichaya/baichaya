export interface IntrusionStatusCodeVO {
  /**
   * 状态码
   */
  statusCode: string;

  /**
   * 描述
   */
  des: string;
}

export interface IntrusionStatusCodeForm extends BaseEntity {
  /**
   * 状态码
   */
  statusCode?: string;

  /**
   * 描述
   */
  des?: string;
}

export interface IntrusionStatusCodeQuery extends PageQuery {
  /**
   * 描述
   */
  des?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
