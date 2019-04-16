import { CoreUIPage } from './app.po';

describe('App', function() {
  let page: CoreUIPage;

  beforeEach(() => {
    page = new CoreUIPage();
  });

  it('should display footer containing Affiniti Network Assure LLC', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toContain('Affiniti Network Assure LLC');
  });
});
