export class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email *');
    this.passwordInput = page.getByLabel('Password *');
    this.loginButton = page.getByRole('button', { name: 'Sign in' });
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot password' });
  }

  async login(email, password) {
    await this.emailInput.fill(email.toLowerCase());
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForURL(/.*dashboard/);
  }

  async goToForgotPassword() {
    await this.forgotPasswordLink.click();
  }
}
