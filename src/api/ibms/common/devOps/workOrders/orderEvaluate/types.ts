export interface OrderEvaluateVO {
  /**
   * 工单评价id
   */
  id: string | number;

  /**
   * 评价人姓名
   */
  evaluateUserName: string;

  /**
   * 评价人id
   */
  evaluateUserId: string | number;

  /**
   * 评价等级
   */
  evaluateLv: number;

  /**
   * 评价描述
   */
  evaluateDes: string;

  /**
   * 改进建议
   */
  evaluateRecommendation: string;

  /**
   * 图片
   */
  annexUrl: string;

  /**
   * 评价时间
   */
  createTime: string;
}

export interface OrderEvaluateForm extends BaseEntity {
  /**
   * 评价等级
   */
  evaluateLv?: number;

  /**
   * 评价描述
   */
  evaluateDes?: string;

  /**
   * 改进建议
   */
  evaluateRecommendation?: string;

  /**
   * 图片
   */
  annexUrl?: string;
}

export interface OrderEvaluateQuery extends PageQuery {
  /**
   * 评价人姓名
   */
  evaluateUserName?: string;

  /**
   * 评价人id
   */
  evaluateUserId?: string | number;

  /**
   * 评价等级
   */
  evaluateLv?: number;

  /**
   * 评价描述
   */
  evaluateDes?: string;

  /**
   * 改进建议
   */
  evaluateRecommendation?: string;

  /**
   * 图片
   */
  annexUrl?: string;

  workOrderSn?: string;

  /**
   * 日期范围参数
   */
  params?: any;

  pageNumE?: number;
  pageSizeE: number;
}
