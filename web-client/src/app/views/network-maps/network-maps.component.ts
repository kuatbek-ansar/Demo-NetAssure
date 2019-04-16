import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { ToasterConfig, ToasterService } from 'angular2-toaster/angular2-toaster';

import { BaseComponent } from '../../containers';
import { NetworkMapService } from '../../services';
import { NetworkMapViewModel } from '../../view-models';

@Component({
  templateUrl: 'network-maps.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class NetworkMapsComponent extends BaseComponent implements OnInit {
  @ViewChild('uploadMapModal') uploadMapModal;

  @ViewChild('mapName') mapName;

  public mapIsUploading: boolean;

  public isImageLoading = true;

  public networkMaps: NetworkMapViewModel[];

  public model: NetworkMapViewModel;

  public networkMap: NetworkMapViewModel;

  constructor(
    private injector: Injector,
    private service: NetworkMapService,
    private toasterService: ToasterService
  ) {
    super(injector);

    this.networkMaps = [];
    this.model = new NetworkMapViewModel();
  }

  public ngOnInit(): void {
    this.getData();
  }

  public getData(): void {
    this.Working();

    this.service.get().subscribe((data: NetworkMapViewModel[]) => {
      this.networkMaps = data;
      if (this.networkMaps.length > 0) {
        this.setNetworkMap(this.networkMaps[0]);
      }

      this.Ready();
    });
  }

  private setNetworkMap(entity: NetworkMapViewModel) {
    this.isImageLoading = true;
    this.service.getSignedImage(entity.fileName)
      .subscribe((result) => {
        entity.fileLocation = result.url;
        this.networkMap = entity;
        this.isImageLoading = false;
      });
  }

  public onCreateForm() {
    this.uploadMapModal.show();

    setTimeout(() => {
      this.mapName.nativeElement.focus();
    }, 500);
  }

  public onClick(item: NetworkMapViewModel) {
    this.setNetworkMap(item);
  }


  public onUpload() {
    this.mapIsUploading = true;
    this.service.upload(this.model);
  }

  public onDelete(confirmed: boolean, item: NetworkMapViewModel) {
    if (!confirmed) {
      setTimeout(() => {
        item.confirmDelete = !item.confirmDelete;
      }, 2000);

      return;
    }

    this.service.deleteMap(item.id).subscribe(() => {
      this.networkMaps.splice(this.networkMaps.indexOf(item), 1);

      if (item === this.networkMap) {
        this.setNetworkMap(null);
      }

      this.showSuccess('Network Map Deleted', `${item.name}`);
    });
  }

  public onUploadComplete(fileName: string): void {
    if (this.model.fileUpload.Queue().isError) {
      this.showError('Network Map Upload Failed', `There was an error uploading ${fileName}`);
    } else if (this.model.fileUpload.Queue().isSuccess) {
      this.showSuccess('Network Map Uploaded', fileName);
    }

    this.model.fileUpload.Reset();
    this.model.name = null;
    this.mapIsUploading = false;
    this.uploadMapModal.hide();

    this.getData();
  }

  public isFileAnImage(file: string): boolean {
    return new RegExp(/\.(png|jpg|gif)$/).test(file);
  }

  private showSuccess(heading: string, message: string) {
    this.toasterService.pop('success', heading, message);
  }

  private showError(heading: string, message: string) {
    this.toasterService.pop('error', heading, message);
  }
}
