export class ErrorHandlerHelper {
  rawError: any;
  errorObject: {
    code: number;
    data: any;
    error: string;
    isError: boolean;
    timestamp: number;
  };

  constructor(err: any) {
    this.rawError = err;
    this.errorObject = {
      code: 500,
      data: undefined,
      error: 'Unknown error',
      isError: true,
      timestamp: Date.now(),
    };
    this.setError();
  }

  setError = () => {
    this.errorObject.code = this.rawError && this.rawError.code ? this.rawError.code : this.errorObject.code;
    this.errorObject.timestamp = Date.now();
    this.errorObject.data = '';

    if (this.rawError && this.rawError.data && typeof this.rawError.data === 'object') {
      this.errorObject.data = this.rawError.data?.body || this.rawError.data?.details;
    }

    this.errorObject.error = `${this.errorObject.error} -  ${this.rawError?.code} (${this.rawError.data?.status})`;
  };
}
