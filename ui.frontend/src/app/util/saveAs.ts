const saveAs = (blob: Blob, filename: string) => {
  const element = document.createElement('a');
  element.href = URL.createObjectURL(blob);
  element.setAttribute('download', filename);
  element.click();
  element.remove();
};

export { saveAs };
