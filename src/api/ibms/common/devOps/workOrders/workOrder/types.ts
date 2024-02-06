export interface WorkOrderVO {
  id: number;
  /**
   * 工单编号
   */
  workOrderSn: string;

  /**
   * 创建日期
   */
  createTime: string;

  /**
   * 优先级
   */
  workOrderPriority: number;

  /**
   * 工单名称
   */
  workOrderName: string;

  /**
   * 状态
   */
  workOrderStatus: number;

  /**
   * 工单描述
   */
  workOrderDescription: string;

  /**
   * 工单备注
   */
  workOrderComments: string;

  /**
   * 被分配人名称
   */
  workOrderAssignedTo: string;

  /**
   * 创建人
   */
  workOrderCreateId: string | number;

  /**
   * 工单类型
   */
  workOrderDetailType: number;

  /**
   * 工单详细信息值
   */
  workOrderDetailValue: string;

  /**
   * 处理图片
   */

  pictureUrl: string;

  users: any[];
}

export interface WorkOrderForm extends BaseEntity {
  id?: number;
  /**
   * 优先级
   */
  workOrderPriority?: number;

  /**
   * 工单名称
   */
  workOrderName?: string;

  /**
   * 状态
   */
  workOrderStatus?: number;

  /**
   * 工单描述
   */
  workOrderDescription?: string;

  /**
   * 工单备注
   */
  workOrderComments?: string;

  /**
   * 图片
   */
  pictureUrl?: string;

  /**
   * 被分配人名称
   */
  workOrderAssignedTo?: any[];

  /**
   * 工单类型
   */
  workOrderDetailType?: number;

  /**
   * 工单详细信息值
   */
  //  workOrderDetailValue?: string;

  workOrderEvaluate?: {
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
    /**
     * 处理图片
     */
    pictureUrl?: string;
    /**工单编号 */

    workOrderSn?: string | number;
  };
}

export interface WorkOrderQuery extends PageQuery {
  id?: number;

  /**
   * 优先级
   */
  workOrderPriority?: number;

  /**
   * 工单名称
   */
  workOrderName?: string;

  /**
   * 状态
   */
  workOrderStatus?: number;

  /**
   * 工单描述
   */
  workOrderDescription?: string;

  /**
   * 工单备注
   */
  workOrderComments?: string;

  /**
   * 被分配人名称
   */
  workOrderAssignedTo?: string;

  /**
   * 创建人
   */
  workOrderCreateId?: string | number;

  /**工单编号 */

  workOrderSn?: undefined;
  /**
   * 处理图片
   */
  pictureUrl?: string;
  /**
   * 日期范围参数
   */
  params?: any;
}
