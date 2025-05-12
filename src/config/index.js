import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  password_salt: process.env.PASSWORD_SALT,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  access_token_expires_in: process.env.ACCESS_TOKEN_EXPIRES_IN,
  refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
  reset_password_token_secret: process.env.RESET_PASSWORD_TOKEN_SECRET,
  reset_password_expires_in: process.env.RESET_PASSWORD_EXPIRES_IN,
  database_url: process.env.DATABASE_URL,
  email: process.env.EMAIL,
  app_password: process.env.APP_PASSWORD,
};
