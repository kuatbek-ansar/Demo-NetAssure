import { LoginPage } from './login.po';
import { browser, element, by } from 'protractor';

describe('Login', function() {
  let page: LoginPage;

  beforeAll(() => {
    expect(process.env.NetAssure_Client_Username)
          .toBeTruthy('The NetAssure_Client_Username environment variable must be set to a valid username');
    expect(process.env.NetAssure_Client_Password)
    .toBeTruthy('The NetAssure_Client_Password environment variable must be set to a valid password');
  });

  beforeEach(() => {
    page = new LoginPage();
    browser.wait(page.navigateTo());
  });

  it('invalid login attempt should display error', () => {
    page.attemptLogin('notarealperson@example.com', 'supersecret!');
    expect(page.userNameElement.getAttribute('class')).toContain('is-invalid');
    expect(page.passwordElement.getAttribute('class')).toContain('is-invalid');
  });

  it('valid login attempt should log user in', () => {
    page.attemptLogin(process.env.NetAssure_Client_Username, process.env.NetAssure_Client_Password);
    browser.waitForAngular();
    expect(browser.getCurrentUrl()).toContain('/#/dashboard');
  });

});
