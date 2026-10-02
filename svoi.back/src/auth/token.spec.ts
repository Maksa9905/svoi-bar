import { hashToken } from './token';

describe('hashToken', () => {
  it('даёт стабильный sha256 и не возвращает сам токен', () => {
    const token = 'refresh-token';
    expect(hashToken(token)).toBe(hashToken(token));
    expect(hashToken(token)).not.toBe(token);
    expect(hashToken(token)).toHaveLength(64);
  });
});
