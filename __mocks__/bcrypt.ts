export const compare = jest.fn().mockResolvedValue(true);
export const hash = jest.fn().mockResolvedValue('hashed');

export default {
  compare,
  hash,
};
