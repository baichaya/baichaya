export interface AlertRecordVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 设备id
   */
  deciveId: string | number;

  /**
   * 设备分组
   */
  deviceGroup: string;

  /**
   * 报警类型
   */
  alertType: string;

  /**
   * 报警信息
   */
  alertInformation: string;

  /**
   * 报警时间
   */
  alertTime: string;

  /**
   * 处理状态
   */
  status: string;

  /**
   * 处理时间
   */
  handleTime: string;

  /**
   * 处理人（登录人）
   */
  handleBy: string;

  /**
   * 备注
   */
  remark: string;

}

export interface AlertRecordForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 设备id
   */
  deciveId?: string | number;

  /**
   * 设备分组
   */
  deviceGroup?: string;

  /**
   * 报警类型
   */
  alertType?: string;

  /**
   * 报警信息
   */
  alertInformation?: string;

  /**
   * 报警时间
   */
  alertTime?: string;

  /**
   * 处理状态
   */
  status?: string;

  /**
   * 处理时间
   */
  handleTime?: string;

  /**
   * 处理人（登录人）
   */
  handleBy?: string;

  /**
   * 备注
   */
  remark?: string;

}

export interface AlertRecordQuery extends PageQuery {

  /**
   * 设备id
   */
  deciveId?: string | number;

  /**
   * 设备分组
   */
  deviceGroup?: string;

  /**
   * 报警类型
   */
  alertType?: string;

  /**
   * 报警信息
   */
  alertInformation?: string;

  /**
   * 报警时间
   */
  alertTime?: string;

  /**
   * 处理状态
   */
  status?: string;

  /**
   * 处理时间
   */
  handleTime?: string;

  /**
   * 处理人（登录人）
   */
  handleBy?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



