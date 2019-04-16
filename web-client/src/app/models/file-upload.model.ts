import { EventEmitter } from '@angular/core';
import { FileItem, FileUploader } from 'ng2-file-upload';

import { FileUploadHeader } from './file-upload-header.model';

export class FileUpload {
  public Name: string;

  public Exists: boolean;

  public ConfirmDelete: boolean;

  public Uploader: FileUploader;

  public Visibility: string;

  public onUploadComplete: EventEmitter<string>;

  public Progress(): number {
    return this.Uploader.progress;
  }

  public Upload(): void {
    this.Uploader.uploadAll();
  }

  public Cancel(): void {
    this.Uploader.cancelAll();
  }

  public Queue(): FileItem {
    return this.Uploader.queue[0];
  }

  public Complete(): void {
    this.Visibility = this.Visibility === 'shown' ? 'hidden' : 'shown';
  }

  public IsComplete(): boolean {
    return this.Visibility === 'shown' && this.Uploader.isUploading;
  }

  public IsUploading(): boolean {
    return this.Uploader.isUploading && this.Visibility === 'hidden';
  }

  public Reset(): void {
    this.Exists = false;
    this.Name = '';
    this.ConfirmDelete = false;
  }

  public SetHeaders(headers: FileUploadHeader[]): void {
    this.Uploader.options.headers = [];

    headers.forEach(x => {
      this.Uploader.options.headers.push(x);
    });

    this.Uploader.setOptions(this.Uploader);
  }

  public SetOptions(url: string, authToken: string): void {
    this.Uploader.options.url = url;
    this.Uploader.options.authToken = `Bearer ${authToken}`;
    this.Uploader.setOptions(this.Uploader);
  }

  constructor() {
    this.Exists = false;
    this.Visibility = 'hidden';
    this.Uploader = new FileUploader({
      url: 'http://localhost:5050/network-map/upload',
      authToken: `Bearer ${localStorage.getItem('Token')}`
    });
    this.onUploadComplete = new EventEmitter<string>();

    this.Uploader.onCompleteAll = () => {
      this.Exists = true;
      const file = this.Uploader.queue[0].file.name;
      const fileName = file.replace(/(.*)\.\w+$/, '$1');
      const extension = file.replace(/.*?\.(\w+)$/, '$1');

      this.Name = `${fileName.substring(0, 10)}..${extension}`;
      this.Complete();

      setTimeout(() => {
          this.Complete();
          this.onUploadComplete.emit(this.Name);
          this.Uploader.clearQueue();
        },
        2000
      );
    };
  }
}
