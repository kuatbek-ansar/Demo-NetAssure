import { Inject } from 'typedi';

import { Vendor } from '../../entity';
import { DocumentUrl } from './models/document-url';
import { CircuitRepository, VendorFilesRepository, VendorRepository } from '../../repositories';
import { AwsService, LogService } from '../../services';
import { Path, GET, POST, DELETE, PathParam, Errors, QueryParam, Context, ServiceContext } from 'typescript-rest';
import { Security, Tags, Response as SwaggerResponse } from 'typescript-rest-swagger';
import { Config } from '../../config';

@Security('bearer')
@SwaggerResponse<string>(401, 'The user is unauthorized')
@Tags('Vendors')
@Path('/vendor')
export class VendorController {
  @Context
  context: ServiceContext;

  @Inject()
  public repository: VendorRepository;

  @Inject()
  private fileRepository: VendorFilesRepository;

  @Inject()
  private circuitRepository: CircuitRepository;

  @Inject()
  public awsService: AwsService;

  @Inject()
  public logService: LogService;

  constructor() {
  }

  @GET
  @Path('/documentUrl')
  public async getDocumentUrl(@QueryParam('documentName') documentName: string): Promise<DocumentUrl> {
    const groupId = this.context.request['user'].HostGroup.Id;

    try {
      const documentUri = `vendor-files/${groupId}/${documentName}`;
      const url = await this.awsService.getDownloadUrl(documentUri);
      return { url: url };
    } catch (e) {
      this.logService.error('Unable to get vendor document download url', { path: documentName }, e);
      throw new Errors.InternalServerError();
    }

  }

  @GET
  @Path('/:groupId')
  public async get(@PathParam('groupId') groupId: number): Promise<Vendor[]> {
    try {
      const orm = await this.repository.getOrm();

      return await orm.createQueryBuilder('vendors')
        .where('group_id = :groupId', { groupId })
        .getMany();
    } catch (e) {
      this.logService.error('Unable to get vendor by group id', { groupId: groupId }, e);
      throw new Errors.InternalServerError(e);
    }
  }

  @POST
  @Path('/:groupId')
  public async createWithGroupId(@PathParam('groupId') groupId: number, vendor: Vendor): Promise<Vendor> {
    if (!vendor) {
      throw new Errors.BadRequestError('Request body empty. Vendor cannot be created.')
    }

    try {
      const orm = await this.repository.getOrm();
      vendor.group_id = groupId;

      return await orm.save(vendor);
    } catch (e) {
      this.logService.error('Unable to create vendor', { groupId: groupId, vendor: vendor }, e);
      throw new Errors.InternalServerError(e);
    }
  }

  @DELETE
  @Path('/:groupId')
  public async deleteVendorAndFiles(@PathParam('groupId') groupId: number, vendorToDelete: Vendor): Promise<any> {
    const [vendorOrm, circuitOrm, fileOrm] = await Promise.all(
      [this.repository.getOrm(), this.circuitRepository.getOrm(), this.fileRepository.getOrm()]);

    try {
      const vendors: Vendor[] = await this.repository.find({ where: { id: vendorToDelete.id }, relations: ['files', 'circuits'] });

      const deletes = [];
      vendors.forEach(vendor => {
        deletes.concat(
          vendor.files.forEach(file => fileOrm.delete({ id: file.id })),
          vendor.files.forEach(file => this.awsService.delete(file.file_location)),
          vendor.circuits.forEach(circuit => circuitOrm.delete({ circuit_id: circuit.circuit_id }))
        );
      });

      await Promise.all(deletes).then(() => {
        const dbResult = vendorOrm.delete(vendorToDelete);
        return dbResult;
      });
    } catch (e) {
      this.logService.error('Unable to delete vendor and files', { groupId: groupId, vendor: vendorToDelete }, e);
      throw new Errors.InternalServerError(e);
    }
  }
}
