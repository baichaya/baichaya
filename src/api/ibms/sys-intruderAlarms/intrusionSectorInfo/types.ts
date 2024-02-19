export interface IntrusionSectorInfoVO {
  /**
   * 序号
   */
  id: string | number;

  /**
   * 设备id(DevId)
   */
  deviceId: string | number;

  /**
   * 防区号(Sector)
   */
  sector: string;

  /**
   * 位置(Position)
   */
  position: string;

  /**
   * 设备名称(DevName)
   */
  deviceName: string;

  /**
   * (SubSect)
   */
  subSector: string;
}

export interface IntrusionSectorInfoForm extends BaseEntity {
  /**
   * 序号
   */
  id?: string | number;

  /**
   * 设备id(DevId)
   */
  deviceId?: string | number;

  /**
   * 防区号(Sector)
   */
  sector?: string;

  /**
   * 位置(Position)
   */
  position?: string;

  /**
   * 设备名称(DevName)
   */
  deviceName?: string;

  /**
   * (SubSect)
   */
  subSector?: string;
}

export interface IntrusionSectorInfoQuery extends PageQuery {
  /**
   * 设备id(DevId)
   */
  deviceId?: string | number;

  /**
   * 防区号(Sector)
   */
  sector?: string;

  /**
   * 位置(Position)
   */
  position?: string;

  /**
   * 设备名称(DevName)
   */
  deviceName?: string;

  /**
   * (SubSect)
   */
  subSector?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
