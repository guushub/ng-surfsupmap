import { NewSurfmapDevboxPage } from './app.po';

describe('new-surfmap-devbox App', () => {
  let page: NewSurfmapDevboxPage;

  beforeEach(() => {
    page = new NewSurfmapDevboxPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
