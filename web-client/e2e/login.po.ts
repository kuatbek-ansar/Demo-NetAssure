import { browser, element, by } from 'protractor';

export class LoginPage {
  navigateTo() {
    return browser.get('/#/login');
  }

  public get userNameElement() {
    return element(by.name('username'));
  }

  public get passwordElement() {
    return element(by.name('password'));
  }

  private setUserName(userName: string) {
    return this.userNameElement.sendKeys(userName);
  }

  private setPassword(password: string) {
    return this.passwordElement.sendKeys(password);
  }

  attemptLogin(userName: string, password: string) {
    browser.wait(this.setUserName(userName));
    browser.wait(this.setPassword(password))
    element(by.id('login-button')).click();
  }
}
