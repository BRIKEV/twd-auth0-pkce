import { twd } from "twd-js";

export const defaultMocks = async () => {
  await twd.mockRequest('getNotes', {
    url: '/api/notes',
    method: 'GET',
    status: 200,
    response: {
      notes: []
    }
  });
};
