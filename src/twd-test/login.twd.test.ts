import { describe, it } from 'twd-js/runner';
import { twd, screenDom } from 'twd-js';

describe('Login Tests', () => {
  it('should load the login page', async () => {
    await twd.visit('/login');
    const titleTest = await screenDom.findByText('TWD Auth0 Playground');
    twd.should(titleTest, 'be.visible');
    const loginButton = await screenDom.findByRole('button', { name: 'Log In' });
    twd.should(loginButton, 'be.visible');
  });
});
