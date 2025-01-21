import { getVisitorSource } from './visitorHelper.ts';
import { ErrorHandlerHelper } from './ErrorHandlerHelper.ts';
import { SuccessHandlerHelper } from './SuccessHandlerHelper.ts';

const successCodes = [200, 204];

/**
 * ApiHelper Class - For making Api Requests
 */
export class ApiHelper {
  _portalGateway: string;
  _apiVersion: string | undefined;
  _controller: AbortController | null;

  constructor() {
    // this._portalGateway = 'http://10.6.13.207:8002/v1';
    this._portalGateway = 'https://ul-hr-app.vercel.app/v1';

    this._controller = null;
  }

  setHost = (host: string): void => {
    this._portalGateway = host;
  };

  setApiVersion = (version: string): void => {
    this._apiVersion = version;
  };

  /**
   * Fetches from the Gateway defined by the instantiated object. Accepts <T> as output object.
   * @example <caption>"/Auth/UserAccount", "/GetCurrentUser", "GET", "JWT Content"</caption>
   * @param {endpoint} endpoint - you wish to call ex. "/Login"
   * @param {method} method - method (GET, UPDATE, DELETE, POST)
   * @param {jwt} JWT - JSON Web Token (Optional)
   * @param {queryOptions} Query - query options for "GET" methods (Optional)
   * @param {body} body - JSON body for "UPDATE, DELETE and POST" methods (Optional)
   * @param {headers} headers - Request header (Optional)
   */

  async FetchFromServer(
    endpoint: string,
    method: string = 'GET',
    authenticated: any = false,
    queryOptions: Record<string, any> | undefined = undefined,
    body: Record<string, any> | undefined = undefined,
    headers: Record<string, any> = {}
  ) {
    let url = `${this._portalGateway}${endpoint}`;
    const options: any = {};
    let payload = undefined;
    const excludeVisitorSourceFromBody =
      Array.isArray(body) || typeof body !== 'object'
    if (this._controller) {
      options.signal = this._controller.signal;
    }
    if (queryOptions) {
      const params = new URLSearchParams(queryOptions);
      url = `${url}?${params.toString()}`;
    }
    if (body) {
      payload = excludeVisitorSourceFromBody
        ? body
        : {
            ...body,
            ...getVisitorSource(),
          };
    }
    if (authenticated) {
      headers.mobiletoken = authenticated;
      headers.mobile = 'true';
      headers.origin = 'universityliving.com';
    }

    try {
      const response = await fetch(url, {
        body: JSON.stringify(payload),
        credentials: authenticated ? 'include' : 'same-origin',
        headers: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
          Expires: '0',
          Pragma: 'no-cache',
          ...headers,
        },
        method: method.toUpperCase(),
        ...options,
      });
      const contentType = response.headers.get('Content-Type');

      if (response.ok === false || !successCodes.includes(response.status)) {
        let errorData;
        if (contentType && contentType.includes('application/json')) {
          // TODO: store in a variable
          // Handle JSON data
          errorData = await response.json();
        } else {
          // Handle text or other formats
          errorData = await response.text();
        }
        const errorObject = {
          code: response.status,
          data: errorData,
        };

        throw errorObject;
      }

      let data;
      if (contentType && contentType.includes('application/json')) {
        // Handle JSON data
        data = new SuccessHandlerHelper(await response.json());
      } else {
        // Handle text or other formats
        data = new SuccessHandlerHelper(await response.text());
      }

      return data.data;
    } catch (err) {
      const errorHelper = new ErrorHandlerHelper(err);
      if (this._controller?.signal.aborted) {
        errorHelper.errorObject.isError = false;
      }
      return errorHelper.errorObject;
    }
  }

  cancelRequest = (): void => {
    if (this._controller) {
      this._controller.abort();
    }
  };
}
