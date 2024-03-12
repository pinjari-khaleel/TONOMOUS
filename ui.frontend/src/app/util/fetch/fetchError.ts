class FetchError extends Error {
  readonly id: number | undefined;
  readonly status: number;
  constructor({ id, status, message }: { id?: number; status: number; message: string }) {
    super(message);
    this.status = status;
    this.id = id ?? undefined;
  }
}

export { FetchError };
