export interface LinkageTriggerVO {
  /**
   * id
   */
  id: string | number;

  /**
   * json对象数组
   */
  actionData: string;

  /**
   * 触发类型
   */
  triggerType: string;

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
   * 是否连续触发
   */
  isContinuousTrigger: string;

  /**
   * 连续触发时间间隔
   */
  continuousTriggerTimeInterval: string;

  /**
   * 上次触发时间
   */
  lastTriggeredTime: string;

  /**
   * 触发器状态
   */
  trggerStatus: string;

  /**
   * 触发条件
   */
  triggerConditions: string;
  groupId: string | number;
  deviceTypeId: string | number;
  deviceId: string | number;
}

export interface LinkageTriggerForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * json对象数组
   */
  actionData?: string;

  /**
   * 触发类型
   */
  triggerType?: string;

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
   * 是否连续触发
   */
  isContinuousTrigger?: string;

  /**
   * 连续触发时间间隔
   */
  continuousTriggerTimeInterval?: string;

  /**
   * 上次触发时间
   */
  lastTriggeredTime?: string;

  /**
   * 触发器状态
   */
  trggerStatus?: string;

  /**
   * 触发条件
   */
  triggerConditions?: string;

  groupId?: string | number;
  deviceTypeId?: string | number;
  deviceId?: string | number;
}

export interface LinkageTriggerQuery extends PageQuery {
  /**
   * json对象数组
   */
  actionData?: string;

  /**
   * 触发类型
   */
  triggerType?: string;

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
   * 是否连续触发
   */
  isContinuousTrigger?: string;

  /**
   * 连续触发时间间隔
   */
  continuousTriggerTimeInterval?: string;

  /**
   * 上次触发时间
   */
  lastTriggeredTime?: string;

  /**
   * 触发器状态
   */
  trggerStatus?: string;

  /**
   * 触发条件
   */
  triggerConditions?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
