import { Inject } from 'typedi';
import { SalesForceUserService, LogService } from '../../services';
import { Path, POST, FormParam, Errors } from 'typescript-rest';
import { Tags } from 'typescript-rest-swagger'
import { UsernamePassword } from '../../../models';

@Tags('Authentication')
@Path('/user')
export class UserController {
  @Inject()
  private sfUserService: SalesForceUserService;

  @Inject()
  private logService: LogService;

  constructor() {
  }

  @POST
  @Path('/login')
  public async login(creds: UsernamePassword): Promise<any> {
    try {
      return await this.sfUserService.authenticate(creds.Username, creds.Password);
    } catch (e) {
      this.logService.error('Unable to login', {username: creds.Username}, e);
      throw new Errors.UnauthorizedError();
    }
  }

  @POST
  @Path('/token')
  public token(@FormParam('Username') username: string, @FormParam('Password') password: string): Promise<string> {
    return this.sfUserService.authenticate(username, password).then(x => `Bearer ${x.Token}`)
  }

  @POST
  @Path('/resetpassword')
  public async reset(creds: UsernamePassword): Promise<void> {
    try {
      this.sfUserService.getAndSendTempPassword(creds.Username);

      return;
    } catch (e) {
      this.logService.error('Unable to reset password', {username: creds.Username}, e);
      throw new Errors.InternalServerError();
    }
  }

  @POST
  @Path('/setPassword')
  public async setPassword(creds: UsernamePassword): Promise<void> {
    try {
      await this.sfUserService.setNewPassword(creds.Username, creds.Password);

      return;
    } catch (e) {
      this.logService.error('Unable to set password', {username: creds.Username}, e);
      throw new Errors.InternalServerError();
    }
  }
}
