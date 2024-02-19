export interface AccessDeviceVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 设备id
   */
  deviceSysId: string | number;

  /**
   * 端口
   */
  port: number;

  /**
   * ip
   */
  stationIp: string;

  /**
   * 设备名称
   */
  stationName: string;

  /**
   * 设备编号
   */
  stationNo: string;

  /**
   * 设备类型
   */
  stationType: string;
}

export interface AccessDeviceForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 设备id
   */
  deviceSysId?: string | number;

  /**
   * 端口
   */
  port?: number;

  /**
   * ip
   */
  stationIp?: string;

  /**
   * 设备名称
   */
  stationName?: string;

  /**
   * 设备编号
   */
  stationNo?: string;

  /**
   * 设备类型
   */
  stationType?: string;
}

export interface AccessDeviceQuery extends PageQuery {
  /**
   * ip
   */
  stationIp?: string;

  /**
   * 设备名称
   */
  stationName?: string;

  /**
   * 设备编号
   */
  stationNo?: string;

  /**
   * 设备类型
   */
  stationType?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
