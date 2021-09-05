declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DB: string;
  }
}
