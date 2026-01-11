import { beforeEach, describe, it, afterEach } from 'twd-js/runner';
import { twd, screenDom } from 'twd-js';
import { defaultMocks } from './authUtils';

describe('Login Tests', () => {
  beforeEach(() => {
    twd.clearRequestMockRules();
  });

  afterEach(() => {
    twd.clearRequestMockRules();
  });

  it('should load the login page', async () => {
    await twd.mockRequest('me', {
      url: '/api/me',
      method: 'GET',
      status: 401,
      response: { message: 'Unauthorized' },
    });
    await twd.visit('/login');
    await twd.waitForRequest('me');
    const titleTest = await screenDom.findByText('TWD Auth0 Playground');
    twd.should(titleTest, 'be.visible');
    const loginButton = await screenDom.findByRole('link', { name: 'Log In' });
    twd.should(loginButton, 'have.attr', 'href', '/auth/login');
  });

  it('should redirect to home if already authenticated', async () => {
    await defaultMocks();
    await twd.visit('/login');
    await twd.waitForRequests(['me']);
    const welcomeText = await screenDom.findByRole('heading', { name: 'Authenticated area', level: 1 });
    twd.should(welcomeText, 'be.visible');
  });
});
