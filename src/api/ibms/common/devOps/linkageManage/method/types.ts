export interface MethodVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 方法名
   */
  methodName: string;
}

export interface MethodForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 方法名
   */
  methodName?: string;
}

export interface MethodQuery extends PageQuery {
  /**
   * 方法名
   */
  methodName?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
