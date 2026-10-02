import { createBookingSchema } from './booking.schema';

describe('createBookingSchema', () => {
  const valid = {
    guests: 4,
    date: '2026-10-12',
    time: '20:30',
    phone: '+7 900 123 45 67',
    comment: 'У окна',
  };

  it('нормализует телефон и принимает комментарий', () => {
    expect(createBookingSchema.parse(valid).phone).toBe('+79001234567');
  });

  it('отклоняет короткий номер', () => {
    expect(
      createBookingSchema.safeParse({ ...valid, phone: '+7 900' }).success,
    ).toBe(false);
  });
});
