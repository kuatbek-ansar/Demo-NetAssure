export interface ITypeORMOptions {
  type: string;

  host: string;

  port: number;

  username: string;

  password: string;

  database: string;

  entities: any[];

  synchronize: boolean;
  logging: false;
}
