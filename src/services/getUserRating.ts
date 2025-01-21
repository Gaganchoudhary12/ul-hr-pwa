import {API_ROUTES} from '../constants/ApiRouts.ts';

import {ApiHelper} from '../utils/ApiHelper.ts';

const {GETUSERRATING} = API_ROUTES;
export const useGetUserRating = () => {
  const getUserRating = async (email,date) => {

    const {data, isError, code} = await new ApiHelper().FetchFromServer(
      GETUSERRATING.endpoint,
      GETUSERRATING.method,
      false,
      {},
      {email, date}
    );
    
    return {
      data,
      isError,
    };
  };
  return {
    getUserRating,
  };
};
