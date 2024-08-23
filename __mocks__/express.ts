import express from 'express';

const use = jest.fn();
const listen = jest.fn((port, cb) => cb());

const appMock = jest.fn(() => ({
  use,
  listen,
}));

(appMock as unknown as typeof express).json = jest.fn();
(appMock as unknown as typeof express).urlencoded = jest.fn();

export const { json } = (appMock as unknown as typeof express);
export const { urlencoded } = (appMock as unknown as typeof express);

export default appMock;
