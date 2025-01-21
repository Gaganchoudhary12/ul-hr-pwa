import {API_ROUTES} from '../constants/ApiRouts.ts';

import {ApiHelper} from '../utils/ApiHelper.ts';

const {LOGIN} = API_ROUTES;
export const useLogin = () => {
  const userLogin = async (email:object ) => {
    
    const {data, isError, code} = await new ApiHelper().FetchFromServer(
      LOGIN.endpoint,
      LOGIN.method,
      false,
      {},
      {email}
    );
    return {
      data,
      isError,
    };
  };
  return {
    userLogin,
  };
};
