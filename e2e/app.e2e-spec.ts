import { AiedecisiontoolclientPage } from './app.po';

describe('aiedecisiontoolclient App', () => {
  let page: AiedecisiontoolclientPage;

  beforeEach(() => {
    page = new AiedecisiontoolclientPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
