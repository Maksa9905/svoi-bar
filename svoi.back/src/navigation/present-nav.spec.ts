import { presentNavLink } from './present-nav';

describe('presentNavLink', () => {
  it('помечает ссылку сломанной, если секция удалена', () => {
    const view = presentNavLink(
      {
        id: 'nav',
        placement: 'header',
        label: 'КАЛЬЯН',
        sortOrder: 0,
        targetType: 'section',
        sectionId: null,
        pagePath: null,
        action: null,
      },
      new Map(),
    );

    expect(view.target).toEqual({ type: 'broken', sectionId: null });
  });

  it('собирает якорь живой секции', () => {
    const view = presentNavLink(
      {
        id: 'nav',
        placement: 'header',
        label: 'КАЛЬЯН',
        sortOrder: 0,
        targetType: 'section',
        sectionId: 'hookah',
        pagePath: null,
        action: null,
      },
      new Map([['hookah', { id: 'hookah', anchor: 'hookah' }]]),
    );

    expect(view.target).toEqual({
      type: 'section',
      sectionId: 'hookah',
      anchor: 'hookah',
      href: '/#hookah',
    });
  });
});
