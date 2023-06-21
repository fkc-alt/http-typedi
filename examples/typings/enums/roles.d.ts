export namespace Enums {
  /**
   * @description
   * @SUPERADMIN 超级管理员
   * @ADMIN 管理员
   * @OWNER 店长
   * @OP    运营
   */
  export enum Roles {
    SUPERADMIN = 102,
    ADMIN = 101,
    OWNER = 100,
    OP = 99
  }

  /**
   * @description
   * @VALID 有效
   * @UNVALID 无效
   */
  export enum ArticleStatus {
    VALID = 1,
    UNVALID = 0
  }
}
