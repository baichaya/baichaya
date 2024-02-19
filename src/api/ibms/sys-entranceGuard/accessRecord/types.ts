export interface AccessRecordVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 门区名称
   */
  areaName: string;

  /**
   * 刷卡类型
   */
  cardType: number;

  /**
   * 房门名称
   */
  doorName: string;

  /**
   * 门状态
   */
  doorStatus: number;

  /**
   * 刷卡人员证件号
   */
  employeeId: string | number;

  /**
   * 刷卡人员姓名
   */
  employeeName: string;

  /**
   * 刷卡人员编号
   */
  employeeSysNo: string;

  /**
   * 刷卡时间
   */
  eventDate: string;

  /**
   * 刷卡人员部门名称
   */
  name: string;

  /**
   * 刷卡卡号
   */
  serial: string;

  /**
   * 设备名称
   */
  stationName: string;

  /**
   * 卡类型
   */
  typedescribe: string;

  /**
   *
   */
  typename: string;

  /**
   * 体温
   */
  temperature: string;

  /**
   * 1带口罩，2未戴，0未知
   */
  mask: number;

  /**
   * 人员图片
   */
  employeePhoto: string;
}

export interface AccessRecordForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 门区名称
   */
  areaName?: string;

  /**
   * 刷卡类型
   */
  cardType?: number;

  /**
   * 设备id
   */
  deviceId?: string | number;

  /**
   * 门id
   */
  doorId?: string | number;

  /**
   * 房门名称
   */
  doorName?: string;

  /**
   * 门状态
   */
  doorStatus?: number;

  /**
   * 刷卡人员证件号
   */
  employeeId?: string | number;

  /**
   * 刷卡人员姓名
   */
  employeeName?: string;

  /**
   * 刷卡人员编号
   */
  employeeSysNo?: string;

  /**
   * 刷卡时间
   */
  eventDate?: string;

  /**
   * 刷卡人员部门名称
   */
  name?: string;

  /**
   * 刷卡卡号
   */
  serial?: string;

  /**
   * 设备名称
   */
  stationName?: string;

  /**
   * 卡类型
   */
  typedescribe?: string;

  /**
   *
   */
  typename?: string;

  /**
   * 体温
   */
  temperature?: string;

  /**
   * 1带口罩，2未戴，0未知
   */
  mask?: number;

  /**
   * 人员图片
   */
  employeePhoto?: string;
}

export interface AccessRecordQuery extends PageQuery {
  /**
   * 门区名称
   */
  areaName?: string;

  /**
   * 房门名称
   */
  doorName?: string;

  /**
   * 刷卡人员姓名
   */
  employeeName?: string;

  /**
   * 设备名称
   */
  stationName?: string;

  /**
   * 卡类型
   */
  typedescribe?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
