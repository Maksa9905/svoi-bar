import { collectMediaIds } from './media-ids';

describe('collectMediaIds', () => {
  it('собирает id картинок из payload секции', () => {
    const ids = collectMediaIds({
      mediaId: 'photo',
      mascotMediaId: 'mascot',
      cards: [{ iconMediaId: 'icon' }, { title: 'без фото' }],
    });

    expect([...ids].sort()).toEqual(['icon', 'mascot', 'photo']);
  });
});
