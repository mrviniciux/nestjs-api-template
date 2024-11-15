declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_HOST: string;
    DATABASE_PORT: number;
    DATABASE_USER: string;
    DATABASE_PASSWORD: string;
    DATABASE_NAME: string;
    JWT_SECRET_KEY: string;
    JWT_TOKEN_TIME: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
}
