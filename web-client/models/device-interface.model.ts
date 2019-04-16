import { Circuit } from './circuit.model';

export class DeviceInterface {
  public interface_id: number;

  public host_id: string;

  public item_id: string;

  public displayName: string;

  public circuit_id: number;

  public vendor_id: number;

  public circuit: Circuit;
}

