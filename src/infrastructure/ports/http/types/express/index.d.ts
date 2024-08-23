declare namespace Express {
  export interface Request {
    authorization: {
     userId: string;
    }
  }
}
