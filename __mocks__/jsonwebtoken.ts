export const sign = jest.fn().mockReturnValue('token');

export const verify = jest.fn().mockReturnValue(true);

export default {
  sign,
  verify,
};
