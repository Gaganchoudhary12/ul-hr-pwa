export class SuccessHandlerHelper {
  rawData: any;
  data: {
    code: number;
    error: undefined | any;
    isError: boolean;
    messages: string[];
    timestamp: number;
    data?: any;
  };

  constructor(data: any) {
    this.rawData = data;
    this.data = {
      code: 200,
      error: undefined,
      isError: false,
      messages: [],
      timestamp: Date.now(),
    };
    this.setSuccess();
  }

  setSuccess = () => {
    const messages: string[] = [];

    for (const key in this.rawData) {
      if (typeof this.rawData[key] === 'string') {
        messages.push(this.rawData[key]);
      }
    }
    this.data.data = this.rawData;
    this.data.messages = messages;
  };
}
