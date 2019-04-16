import { Service } from 'typedi';

import { ConfigService } from './config.service';
import { HttpService } from './http.service';
import { LogService } from './log.service';

@Service()
export class ApiService {
    public authToken: string;

    constructor(private configService: ConfigService,
                private httpService: HttpService,
                private logService: LogService) {
    }

    public CreateAuthHeader(): any {
        return { Authorization: `Bearer ${this.authToken}` };
    }

    public async Authenticate(): Promise<void> {
        const body = {
            Username: this.configService.Config.apiUser,
            Password: this.configService.Config.apiPassword
        };

        if (!this.authToken) {
            try {
                const data = await this.httpService.Post(`${this.configService.Config.apiUrl}/user/login`, body);
                this.authToken = data.Token;
            } catch (error) {
                this.logService.Error('Authenticating', {
                    ApiUrl: this.configService.Config.apiUrl,
                    Username: body.Username
                }, error);

                throw error;
            }
        }
    }

    public async Get(apiSegment: string): Promise<any> {
        await this.Authenticate();

        const header = this.CreateAuthHeader();

        return this.httpService.Get(`${this.configService.Config.apiUrl}/${apiSegment}`, header);
    }

    public async Post(apiSegment: string): Promise<any> {
        await this.Authenticate();

        const header = this.CreateAuthHeader();

        return this.httpService.Post(`${this.configService.Config.apiUrl}/${apiSegment}`, header);
    }
}
