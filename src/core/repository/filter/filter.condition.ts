export interface FilterCondition {
  where: object;
  skip?: number;
  take?: number;
  orderBy?: Array<object> | object;
}
