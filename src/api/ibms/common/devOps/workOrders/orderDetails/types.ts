export interface OrderDetailsVO {
  /**
   * 工单详细编号
   */
  workOrderDetailSn: string;

  /**
   * 工单编号
   */
  workOrderSn: string;

  /**
   * 工单类型
   */
  workOrderDetailType: number;

  /**
   * 工单详细信息值
   */
  workOrderDetailValue: string;

  /**
   * 创建日期
   */
  createTime: string;
}

export interface OrderDetailsForm extends BaseEntity {
  /**
   * 工单类型
   */
  workOrderDetailType?: number;

  /**
   * 工单详细信息值
   */
  workOrderDetailValue?: string;
}

export interface OrderDetailsQuery extends PageQuery {
  /**
   * 工单编号
   */
  workOrderSn?: string;

  /**
   * 工单类型
   */
  workOrderDetailType?: number;

  /**
   * 工单详细信息值
   */
  workOrderDetailValue?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
