declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    SERVER_PORT: string;
    SERVER_SECRET: string;
    POSTGRES_DB: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    PGADMIN_DEFAULT_EMAIL: string;
    PGADMIN_DEFAULT_PASSWORD: string;
    PGADMIN_LISTEN_PORT: string;
    DOCKER_IMAGE_URL: string;
    SENTRY_ENVIRONMENT: string;
    SENTRY_RELEASE: string;
    APP_DOMAIN: string;
    ENV: string;
  }
}