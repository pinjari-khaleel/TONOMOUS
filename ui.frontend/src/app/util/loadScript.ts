type LoadScriptElement = HTMLScriptElement & { promise: Promise<HTMLScriptElement> };

export const loadScript = ({
  id,
  source,
}: {
  id: string;
  source: string;
}): Promise<HTMLScriptElement> => {
  const element = document.getElementById(id) as LoadScriptElement;

  if (element) {
    return element.promise || Promise.resolve();
  }

  const scriptTag = document.createElement('script') as LoadScriptElement;
  const promise = new Promise<HTMLScriptElement>((resolve, reject) => {
    scriptTag.addEventListener('load', () => resolve(scriptTag));
    scriptTag.addEventListener('error', reject);
    scriptTag.addEventListener('abort', reject);
  });

  scriptTag.id = id;
  scriptTag.type = 'text/javascript';
  scriptTag.promise = promise;
  scriptTag.src = source;
  document.body.appendChild(scriptTag);

  return promise;
};
