export class ManagedDevice {
  id: number;
  host_id: number;
  group_id: number;

  // swaggerGen is not smart enough to do the type inference
  // tslint:disable-next-line:no-inferrable-types
  isManaged: boolean = false;
}
