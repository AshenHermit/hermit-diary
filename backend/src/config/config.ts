import { AppConfig } from './config.interface';

const config: () => AppConfig = () => ({
  nodeEnv: 'development',
  db: {
    host: process.env.DB_HOST ?? 'db',
    port: parseInt(process.env.DB_PORT ?? '5432'),
    password: process.env.DB_PASSWORD ?? 'postgres',
    entities: [process.env.DB_ENTITIES ?? 'dist/**/*.entity.{ts,js}'],
    sync: process.env.DB_SYNC == '1',
  },
  site: {
    commonDomain: process.env.COMMON_DOMAIN ?? 'localhost',
    host: process.env.SITE_HOST ?? 'http://localhost:3000',
    authSecret: process.env.AUTH_SECRET ?? 'secret',
    authCookieName: process.env.AUTH_COOKIE_NAME ?? 'access_token',
  },
  storage: {
    dir: process.env.STORAGE_DIR ?? './uploads',
  },
});
export default config;
