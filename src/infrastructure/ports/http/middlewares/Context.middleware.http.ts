import { NextFunction, Request, Response } from 'express';
import { v4 } from 'uuid';

import AsyncStorage from '#composition/AsyncStorage';

function setRequestContext(_: Request, __: Response, next: NextFunction): void {
  AsyncStorage.run({ id: v4() }, next);
}

const ContextMiddlewareHttp = {
  setRequestContext,
};

export default ContextMiddlewareHttp;
