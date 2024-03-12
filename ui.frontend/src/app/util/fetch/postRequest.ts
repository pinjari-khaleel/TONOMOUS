import { FetchError } from './fetchError';

const post = async (url = '', data: any, options?: RequestInit) => {
  const OPTIONS: RequestInit = {
    method: 'POST',
    cache: 'no-cache',
    body: data,
    ...options,
  };

  const response = await fetch(url, OPTIONS);

  if (response.ok) {
    return response;
  }

  const error = new FetchError({
    message: `Network response to fetch request was not ok! Target URL: ${url}.`,
    status: response.status,
  });

  throw error;
};

export { post };
