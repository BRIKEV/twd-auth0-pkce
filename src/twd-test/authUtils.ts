import { twd } from "twd-js";

export const defaultMocks = async () => {
  await twd.mockRequest('me', {
    url: '/api/me',
    method: 'GET',
    status: 200,
    response: {
      id: 'google-oauth2|105933711246534696582',
      name: 'test test',
      email: 'test@test.com',
      picture: 'https://picsum.photos/id/237/200/300'
    }
  });
  await twd.mockRequest('getNotes', {
    url: '/api/notes',
    method: 'GET',
    status: 200,
    response: {
      notes: []
    }
  });
};