export interface IntrusionCidVO {
  /**
   * CID码
   */
  alarmCode: string;

  /**
   * 等级
   */
  level: number;

  /**
   * 报警类型
   */
  alarmType: string;

  /**
   * 报警内容
   */
  alarmContent: string;

  /**
   * 报警语音
   */
  voice: string;

  /**
   * 消息推送
   */
  messagePush: string;
}

export interface IntrusionCidForm extends BaseEntity {
  /**
   * CID码
   */
  alarmCode?: string;

  /**
   * 等级
   */
  level?: number;

  /**
   * 报警类型
   */
  alarmType?: string;

  /**
   * 报警内容
   */
  alarmContent?: string;

  /**
   * 报警语音
   */
  voice?: string;

  /**
   * 消息推送
   */
  messagePush?: string;
}

export interface IntrusionCidQuery extends PageQuery {
  /**
   * CID码
   */
  alarmCode?: string;

  /**
   * 等级
   */
  level?: number;

  /**
   * 报警类型
   */
  alarmType?: string;

  /**
   * 报警内容
   */
  alarmContent?: string;

  /**
   * 报警语音
   */
  voice?: string;

  /**
   * 消息推送
   */
  messagePush?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
