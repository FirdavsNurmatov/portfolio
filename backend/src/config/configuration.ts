export default () => ({
  port: +(process.env.PORT || 3000),
  environment: process.env.NODE_ENV,
  database: {
    host: process.env.DATABASE_HOST,
    port: +(process.env.DATABASE_PORT || 5432),
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  },
  jwt: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    accessTokenExpireTime: process.env.ACCESS_TOKEN_EXPIRE_TIME,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshTokenExpireTime: process.env.REFRESH_TOKEN_EXPIRE_TIME,
  },
});
