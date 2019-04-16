import { StateService } from './state.service';
import { environment } from '../../environments/environment';

export function JwtOptionsFactory(stateService: StateService) {
  return {
    tokenGetter: () => {
      return stateService.GetToken();
    },
    whitelistedDomains: [environment.apiDomain]
  }
}
