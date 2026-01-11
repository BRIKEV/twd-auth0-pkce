import { beforeEach, describe, it, afterEach } from 'twd-js/runner';
import { twd, screenDom, userEvent, expect } from 'twd-js';
import { defaultMocks } from './authUtils';

describe('App tests', () => {
  beforeEach(() => {
    twd.clearRequestMockRules();
  });

  afterEach(() => {
    twd.clearRequestMockRules();
  });

  it('should render home page without notes', async () => {
    await defaultMocks();
    await twd.visit('/');
    await twd.waitForRequests(['getNotes']);
    const welcomeText = await screenDom.findByRole('heading', { name: 'Authenticated area', level: 1 });
    twd.should(welcomeText, 'be.visible');
    const infoText = await screenDom.findByText('You are signed in with Auth0. Manage your profile and jot down quick notes below.');
    twd.should(infoText, 'be.visible');
    const signedInText = await screenDom.findByText('Signed in successfully. Your session is handled by Auth0 PKCE.');
    twd.should(signedInText, 'be.visible');
    // const avatar = await screenDom.findByRole('img');
    // twd.should(avatar, 'have.attr', 'src', 'https://picsum.photos/id/237/200/300');
    const noNotesText = await screenDom.findByText('No notes yet. Add your first one.');
    twd.should(noNotesText, 'be.visible');
  });

  it('should add a new note', async () => {
    await defaultMocks();
    await twd.mockRequest('createNote', {
      url: '/api/notes',
      method: 'POST',
      status: 201,
      response: {
        id: 2,
        createdAt: 16825152,
        userId: "google-oauth2|105933711246534696582",
        title: "New Note",
        content: "This is a new note."
      }
    });
    await twd.visit('/');
    await twd.waitForRequests(['getNotes']);
    const titleInput = await screenDom.findByPlaceholderText('Note title');
    await userEvent.type(titleInput, 'New Note');
    const contentTextarea = await screenDom.findByPlaceholderText('Optional content');
    await userEvent.type(contentTextarea, 'This is a new note.');
    const addButton = await screenDom.findByRole('button', { name: 'Add note' });
    await userEvent.click(addButton);
    const rule = await twd.waitForRequest('createNote');
    expect(rule.request).to.deep.equal({
      title: 'New Note',
      content: 'This is a new note.'
    });
  });
});