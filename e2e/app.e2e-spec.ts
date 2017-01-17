import { BulbConverterPage } from './app.po';

describe('bulb-converter App', function() {
  let page: BulbConverterPage;

  beforeEach(() => {
    page = new BulbConverterPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
