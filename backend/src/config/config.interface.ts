export interface AppConfig {
  nodeEnv: 'development' | 'production';
  db: {
    host: string;
    port: number;
    password: string;
    sync: boolean;
    entities: string[];
  };
  site: {
    commonDomain: string;
    host: string;
    authSecret: string;
    authCookieName: string;
  };
  storage: {
    dir: string;
  };
}
