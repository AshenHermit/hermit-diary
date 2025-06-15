import { Injectable } from '@nestjs/common';
import { AppConfigService } from 'src/config/config.service';
import Typesense, { Client } from 'typesense';

@Injectable()
export class TypesenseService {
  private _client: Client;
  constructor(private readonly config: AppConfigService) {
    this._client = new Typesense.Client({
      nodes: [
        {
          host: this.config.search.host, // For Typesense Cloud use xxx.a1.typesense.net
          port: this.config.search.port, // For Typesense Cloud use 443
          protocol: 'http', // For Typesense Cloud use https
        },
      ],
      apiKey: this.config.search.apiKey,
      connectionTimeoutSeconds: 2,
    });
  }
  getClient() {
    return this._client;
  }
}
