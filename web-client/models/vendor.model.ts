import { VendorFiles } from './vendor-files.model';

export class Vendor {
  id: string;
  name: string;
  files: VendorFiles[];
  known: boolean;
  group_id: number;
  circuits: any;
}
