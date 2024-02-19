export interface OrderHistoryVO {
  /**
   * 工单处理历史id
   */
  id: string | number;

  /**
   * 工单编号
   */
  workOrderId: number;

  /**
   * 操作员id
   */
  userId: string | number;

  /**
   * 操作日期
   */
  createTime: string;

  /**
   * 操作注释
   */
  operationComment: string;

  /**
   * 用户名
   */
  operatorName: string;
  /**
   * 图片
   */
  pictureUrl: string;
}

export interface OrderHistoryForm extends BaseEntity {
  /**
   * 操作注释
   */
  operationComment?: string;

  /**
   * 图片
   */
  pictureUrl?: string;
}

export interface OrderHistoryQuery extends PageQuery {
  /**
   * 工单编号
   */
  workOrderId?: number;

  /**
   * 操作员id
   */
  userId?: string | number;

  /**
   * 操作注释
   */
  operationComment?: string;

  /**
   * 图片
   */
  pictureUrl?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
