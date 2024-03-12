import { FetchError } from './fetchError';

const get = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, options);
  if (response.ok) {
    return response;
  }
  const error = new FetchError({
    message: `Network response to fetch request was not ok! Target URL: ${url}.`,
    status: response.status,
  });

  throw error;
};

export default get;
