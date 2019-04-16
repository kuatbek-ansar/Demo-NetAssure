import { Container } from 'typedi/Container';
import { expect } from 'chai';

import { ItemController } from './item.controller';

describe('ItemController Integration Tests', () => {
  let sut: ItemController;

  beforeEach(() => {
    sut = Container.get(ItemController);
  });

  it('Should Get Host for Item', () => {
    const result = sut.getHostForItem(93120);

    expect(result).to.not.be.null;
  });
});
