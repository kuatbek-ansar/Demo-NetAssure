import { Component, Injector, OnInit, ViewEncapsulation, TemplateRef } from '@angular/core';

import { ToasterConfig, ToasterService } from 'angular2-toaster/angular2-toaster';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { BaseComponent } from '../../containers';
import { Vendor, VendorFiles, VendorFileTypes } from '../../../../models';
import { VendorService } from '../../services';
import { VendorFilesViewModel, AwsVersionedFileViewModel } from '../../view-models';

@Component({
  templateUrl: 'vendors.component.html',
  styleUrls: ['vendors.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class VendorsComponent extends BaseComponent implements OnInit {
  public createVendorModal;

  fileModalRef: BsModalRef = null;
  vendorModalRef: BsModalRef = null;
  vendors: Vendor[] = [];
  selectedVendor: Vendor;
  createdVendor: Vendor;

  knownVendors: Array<string>;
  filteredKnownVendors: Array<string>;

  msaFiles: VendorFilesViewModel[] = [];
  soFiles: VendorFilesViewModel[] = [];
  loaFiles: VendorFilesViewModel[] = [];
  invoices: VendorFilesViewModel[] = [];

  fileName: string;
  fileType: string;
  hasSLA = false;
  myFile: File;

  constructor(
    private injector: Injector,
    private modalService: BsModalService,
    private toasterService: ToasterService,
    private vendorService: VendorService
  ) {
    super(injector);

    this.selectedVendor = null;
    this.createdVendor = new Vendor();
    this.knownVendors = ['Spectrum', 'Comcast', 'Bell', 'AT&T', 'Google', 'Verizon'];
    this.filteredKnownVendors = [];
  }

  public ngOnInit(): void {
    this.getData();
  }

  public getData(): void {
    this.Working();

    this.vendorService.get().subscribe((data: Vendor[]) => {
      this.vendors = data;

      if (!this.selectedVendor && this.vendors.length > 0) {
        this.selectedVendor = this.vendors[0];
        this.getVendorFiles(this.selectedVendor.name);
      }

      this.Ready();
    });
  }

  public filterKnownVendors(event) {
    const query = event.query;
    this.filteredKnownVendors = this.knownVendors.filter(x => x.toUpperCase().indexOf(query.toUpperCase()) >= 0);
  }

  public getVendorFiles(vendorName: string) {
    this.vendorService.getFiles(vendorName).subscribe((files: VendorFilesViewModel[]) => {
      this.msaFiles = files.filter(x => x.FileType.FileType.toLowerCase() === 'msa');
      this.soFiles = files.filter(x => x.FileType.FileType.toLowerCase() === 'so');
      this.loaFiles = files.filter(x => x.FileType.FileType.toLowerCase() === 'loa');
      this.invoices = files.filter(x => x.FileType.FileType.toLowerCase() === 'invoice');
    });
  }

  public downloadDocument(item: VendorFilesViewModel) {
    const path = this.getPath(item.Location);
    this.vendorService.downloadDocument(encodeURIComponent(path)).subscribe(x => {
      window.location.href = x.url;
    })
  }

  private getPath(url: string): string {
    const segements = url.split('/');
    const path = `${segements[segements.length - 2]}/${segements[segements.length - 1]}`;
    return path;
  }

  public closeVendorCreateModal() {
    this.createdVendor = new Vendor();
    this.vendorModalRef.hide();
    this.vendorModalRef = null;
  }

  public closeFileUploadModal() {
    this.fileType = undefined;
    this.fileName = undefined;
    this.hasSLA = false;
    this.fileModalRef.hide();
    this.fileModalRef = null;
  }

  public openVendorCreateModal(modalTemplate: TemplateRef<any>, editedVendor: Vendor = null) {
    if (editedVendor) {
      this.createdVendor = editedVendor;
    }
    this.vendorModalRef = this.modalService.show(modalTemplate);
  }

  openUploadFileModal(fileType: string, modalTemplate: TemplateRef<any>) {
    this.fileType = fileType;
    this.fileModalRef = this.modalService.show(modalTemplate);
  }

  public createVendor(): void {
    this.vendorService.save(this.createdVendor).subscribe(() => {
      this.closeVendorCreateModal();
      this.getData();
    });
  }

  public deleteVendor(vendorToDelete: Vendor) {
    this.vendorService.deleteVendor(vendorToDelete).subscribe(() => {
      this.closeVendorCreateModal();
      this.selectedVendor = null;

      this.getData();
    })
  }

  public fileChange(fileEvent: any) {
    this.myFile = fileEvent.target.files[0];
  }

  public async uploadFile(fileType: string) {
    let fileUploadName = this.fileName ? this.fileName : this.myFile.name;

    // append the file extension if it's not included in the typed field
    if (fileUploadName.lastIndexOf('.') < 0) {
      fileUploadName += this.myFile.name.substr(this.myFile.name.lastIndexOf('.'));
    }

    const filePayload = new FormData();
    filePayload.append('file', this.myFile, fileUploadName);
    filePayload.append('filename', fileUploadName);

    /** @todo: This is a temporary mapping. Need to get the file type info from the server */
    const fileTypeMap = {
      'msa': 1,
      'so': 2,
      'loa': 3,
      'invoice': 4
    };

    const uploadedFile: VendorFiles = new VendorFiles();
    const vendorFileType = new VendorFileTypes();
    vendorFileType.FileType = fileType;
    vendorFileType.Id = fileTypeMap[fileType.toLowerCase()];

    uploadedFile.FileName = fileUploadName;
    uploadedFile.HasSla = this.hasSLA;
    uploadedFile.UploadedDate = new Date();
    uploadedFile.FileType = vendorFileType;
    uploadedFile.GroupId = parseInt(this.state.User.HostGroup.Id, 0);
    uploadedFile['Vendor'] = this.selectedVendor;
    uploadedFile['VendorFileType'] = vendorFileType;

    filePayload.append('info', JSON.stringify(uploadedFile));

    this.vendorService.uploadFile(this.selectedVendor.name, filePayload).subscribe(() => {
      this.closeFileUploadModal();
      this.getVendorFiles(this.selectedVendor.name);
    });
  }

  public deleteFile(confirmed: boolean, fileToDelete: VendorFilesViewModel) {
    if (!confirmed) {
      setTimeout(() => {
        fileToDelete.confirmDelete = !fileToDelete.confirmDelete;
      }, 2000);

      return;
    }

    this.vendorService.deleteFile(this.selectedVendor.name, fileToDelete).subscribe(() => {
      this.toasterService.pop('success', 'Vendor File Deleted', `${fileToDelete.FileName}`);
      this.getVendorFiles(this.selectedVendor.name);
    });
  }

  public onVendorRowClicked(vendor) {
    this.selectedVendor = vendor;
    this.getVendorFiles(vendor.name);
  }
}
