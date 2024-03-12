/**
 * Simple util that if the site is in AEM edit mode.
 */
export const isEditor = (): boolean => {
  const editorAttribute = document && document.body.getAttribute('data-editor');
  return editorAttribute === 'true';
};
