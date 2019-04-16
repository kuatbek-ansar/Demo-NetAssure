import { VendorsComponent } from './vendors.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { when, resetCalls, mock, instance, verify, anyString, anything } from 'ts-mockito/lib/ts-mockito';
import { Observable } from 'rxjs/Observable';
import { VendorService, StateService } from '../../services';
import { GlobalModule } from '../../global.module';
import { VendorsRoutingModule } from './vendors-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal/modal.module';
import { Vendor, VendorFiles, VendorFileTypes } from '../../../../models/index';
import { VendorFilesViewModel } from '../../view-models/index';
import { ToasterService } from 'angular2-toaster';

describe('Vendors Component', () => {
    let component: VendorsComponent;
    let fixture: ComponentFixture<VendorsComponent>;
    let mockVendorService: VendorService;
    let mockToasterService: ToasterService;

    beforeEach(async(() => {
        mockVendorService = mock(VendorService);
        mockToasterService = mock(ToasterService);

        const testVendors = [];
        const testVendor1 = new Vendor();
        testVendor1.name = 'McTester';
        testVendors.push(testVendor1);
        const testVendor2 = new Vendor();
        testVendor2.name = 'Testerson';
        testVendors.push(testVendor2);

        when(mockVendorService.get()).thenReturn(Observable.of([testVendor1, testVendor2]));
        when(mockVendorService.getFiles(anyString())).thenReturn(Observable.from([]));
        when(mockVendorService.downloadDocument(anyString())).thenReturn(Observable.from([]));
        when(mockToasterService.pop(anyString(), anyString(), anyString())).thenReturn();
    }));

    describe('rendering', () => {
      beforeEach(async(() => {
        TestBed.configureTestingModule({
          declarations: [VendorsComponent],
          imports: [GlobalModule, VendorsRoutingModule, ModalModule.forRoot()],
          providers: [
              StateService,
              { provide: VendorService, useValue: instance(mockVendorService) },
              { provide: ToasterService, useValue: instance(mockToasterService) }
          ]
        })
        .compileComponents();
      }));

      beforeEach(() => {
        resetCalls(mockVendorService);
        fixture = TestBed.createComponent(VendorsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

      it('should create', () => {
        expect(component).toBeTruthy();
      });
    });

    describe('behaviour', () => {
      beforeEach(() => {
        resetCalls(mockVendorService);
        component = new VendorsComponent(null, null, instance(mockToasterService), instance(mockVendorService));
      });

      it('should resolve the download URL via the vendor service', () => {
        const fullpath = 'some/path/out/there/this-is-a-fine-file.pdf';
        const fileName = 'there/this-is-a-fine-file.pdf';
        const item = new VendorFilesViewModel();
          item.Location = fullpath;

          component.downloadDocument(item);
          verify(mockVendorService.downloadDocument(encodeURIComponent(fileName))).once();
      });

      it('should have known vendors', () => {
          expect(component.knownVendors).toBeTruthy();
          expect(component.knownVendors.length).toEqual(6);
          expect(component.knownVendors[0]).toEqual('Spectrum');
          expect(component.knownVendors[1]).toEqual('Comcast');
          expect(component.knownVendors[2]).toEqual('Bell');
          expect(component.knownVendors[3]).toEqual('AT&T');
          expect(component.knownVendors[4]).toEqual('Google');
          expect(component.knownVendors[5]).toEqual('Verizon');
      });

      it('should filter known vendors', () => {
          component.filteredKnownVendors = [];
          component.filterKnownVendors({ query: 'goo' });
          expect(component.filteredKnownVendors.length).toEqual(1);
          expect(component.filteredKnownVendors[0]).toEqual('Google');
      });

      it('should call vendor service on init', () => {
        component.ngOnInit();
        verify(mockVendorService.get()).once();
      });

      it('should get files on get data', () => {
        component.getData();
        verify(mockVendorService.getFiles(anyString())).once();
      });

      it('should set the selected vendor on row click', () => {
        component.selectedVendor = null;
        const testVendor = new Vendor();
        testVendor.name = 'McTester';

        component.onVendorRowClicked(testVendor);
        expect(component.selectedVendor).toBeTruthy();
        expect(component.selectedVendor.name).toEqual(testVendor.name);
      });

      it('should get files for vendor on row click', () => {
        component.selectedVendor = null;
        const testVendor = new Vendor();
        testVendor.name = 'Selected Vendor';

        component.onVendorRowClicked(testVendor);
        verify(mockVendorService.getFiles(testVendor.name)).once();
      });

      describe('getting files by type', () => {
        const msaFileName = 'Test MSA File';
        const soFileName = 'Test SO File';
        const loaFileName = 'Test LOA File';
        const invoiceFileName = 'Test Invoice File';

        beforeEach(() => {
            const testMsaFiles = [];
            const testFile1 = new VendorFiles({
                name: msaFileName,
                fileType: new VendorFileTypes({
                    fileType: 'msa'
                })
            });
            const testFile2 = new VendorFiles({
                name: soFileName,
                fileType: new VendorFileTypes({
                    fileType: 'so'
                })
            });
            const testFile3 = new VendorFiles({
                name: loaFileName,
                fileType: new VendorFileTypes({
                    fileType: 'loa'
                })
            });
            const testFile4 = new VendorFiles({
                name: invoiceFileName,
                fileType: new VendorFileTypes({
                    fileType: 'invoice'
                })
            });
            const testFile5 = new VendorFiles({
                name: 'Test OTHER file',
                fileType: new VendorFileTypes({
                    fileType: 'other'
                })
            });
            testMsaFiles.push(testFile1);
            testMsaFiles.push(testFile2);
            testMsaFiles.push(testFile3);
            testMsaFiles.push(testFile4);
            testMsaFiles.push(testFile5);
            when(mockVendorService.getFiles(anyString())).thenReturn(Observable.of(testMsaFiles));
            component.getVendorFiles('McTester');
          });

          it('should set msa files', () => {
              expect(component.msaFiles).toBeTruthy();
              expect(component.msaFiles.length).toEqual(1);
              expect(component.msaFiles[0].FileName).toEqual(msaFileName);
          });

          it('should set so files', () => {
              expect(component.soFiles).toBeTruthy();
              expect(component.soFiles.length).toEqual(1);
              expect(component.soFiles[0].FileName).toEqual(soFileName);
          });

          it('should set loa files', () => {
              expect(component.loaFiles).toBeTruthy();
              expect(component.loaFiles.length).toEqual(1);
              expect(component.loaFiles[0].FileName).toEqual(loaFileName);
          });

          it('should set invoice files', () => {
              expect(component.invoices).toBeTruthy();
              expect(component.invoices.length).toEqual(1);
              expect(component.invoices[0].FileName).toEqual(invoiceFileName);
          });
      });

      /** @todo: How do I mock the "this.vendorModalRef"?!?! */
      // it('should call vendor service save on create', () => {
      //     component.createdVendor = new Vendor();
      //     when(mockVendorService.save(anything())).thenReturn(Observable.from('nothing'));

      //     component.createVendor();
      //     verify(mockVendorService.save(anything())).once();
      // });

      // it('should call vendor service delete on delete', () => {
      //     when(mockVendorService.delete(anything())).thenReturn(Observable.from('nothing'));

      //     component.deleteVendor(new Vendor());
      //     verify(mockVendorService.delete(anything())).once();
      // });

      it('should call vendor service delete file on file delete', () => {
        when(mockVendorService.deleteFile(anything(), anything())).thenReturn(Observable.from('nothing'));
        component.ngOnInit();
        component.deleteFile(true, new VendorFilesViewModel());
        verify(mockVendorService.deleteFile(anything(), anything())).once();
      });

      it('should ask to confirm on file delete', () => {
          when(mockVendorService.deleteFile(anything(), anything())).thenReturn(Observable.from('nothing'));

          component.deleteFile(false, new VendorFilesViewModel());
          verify(mockVendorService.delete(anything())).never();
      });
    });
});
