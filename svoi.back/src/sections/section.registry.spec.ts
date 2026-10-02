import { parseSectionPayload, sectionRegistry } from './section.registry';

describe('section registry', () => {
  it('принимает payload типа split', () => {
    const result = parseSectionPayload('split', {
      eyebrow: 'НАСТОЛКИ',
      eyebrowColor: '#9b63e8',
      title: 'НЕ ВСЁ ЖЕ ВЕЧЕР КУРИТЬ КАЛЬЯН.',
      body: 'Можно взять настолку.',
      mediaId: 'photo',
      mediaSide: 'right',
    });

    expect(result.success).toBe(true);
  });

  it('отклоняет неизвестный тип и пустой заголовок', () => {
    expect(parseSectionPayload('slider', {}).success).toBe(false);
    expect(
      parseSectionPayload('contacts', sectionRegistry.contacts.defaultPayload)
        .success,
    ).toBe(true);
    expect(
      parseSectionPayload('contacts', { eyebrow: '', title: 'Ок' }).success,
    ).toBe(false);
  });
});
