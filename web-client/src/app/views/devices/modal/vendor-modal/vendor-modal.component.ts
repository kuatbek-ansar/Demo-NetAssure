import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {VendorService, StateService} from '../../../../services';
import {Vendor} from '../../../../../../models/vendor.model';

@Component({
  selector: 'app-vendor-ngmodal',
  templateUrl: './vendor-modal.component.html',
  styleUrls: ['./vendor-modal.component.scss']
})
export class VendorNgModalComponent implements OnInit {
  vendors: Vendor[] = [];
  selectedVendor: any;
  circuitName: string;

  constructor(public activeModal: NgbActiveModal,
              private vendorService: VendorService,
              private stateService: StateService ) { }

  public ngOnInit() {
    this.vendorService.get().subscribe((v: Vendor[]) => this.vendors = v);
  }

  public onClick() {
    const result = {
      vendor: this.selectedVendor,
      circuitName: this.circuitName
    };

    this.activeModal.close(result);
  }
}

