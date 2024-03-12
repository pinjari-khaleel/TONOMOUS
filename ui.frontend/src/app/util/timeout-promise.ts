const timeoutPromise = (thresholdInMs: number, promise: Promise<any>, rejectionReason: string) => {
  const timeout = new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject(rejectionReason);
    }, thresholdInMs);
  });

  return Promise.race([promise, timeout]);
};

export default timeoutPromise;
