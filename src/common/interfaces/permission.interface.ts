export interface IPermission {
  _id: string;
  name: string;
  can: boolean;
  action: string;
  fields?: string;
  subject: string | string[];
  conditions?: object;
}
