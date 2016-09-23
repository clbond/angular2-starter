import {Injectable} from '@angular/core';

export const baseAddress = 'http://10.10.8.185:3000/api';

@Injectable()
export class ConfigurationService {
  getServiceLocation(partialUrl: string) {
    return `${baseAddress}${partialUrl}`;
  }
}