export interface PointSetting {
  deviceId?: string | number;
  /**
   * 设备名称
   */
  deviceName: string;
  /**
   * 设备类型
   */
  devicesType: string;
  /**
   * 消防设备类型
   */
  xfType: string;
}

export interface BuildingForm {
  /**
   * 楼栋楼层树结构
   */
  buildingTree: any[];
  /**
   * 楼层列表
   */
  floorList: any[];
  /**
   * 楼层
   */
  floor: string;
}

export interface DeviceForm {
  /**
   * 设备类型列表
   */
  deviceTypeList: any[];
  /**
   * 设备类型
   */
  deviceType: string;
  /**
   * 设备图标
   */
  iconType: string;
}
