import session from 'express-session';

declare module 'express-session' {
  export interface Session {
    user: { [key: string]: any };
    idToken: string | undefined;
  }
}

export default session;
