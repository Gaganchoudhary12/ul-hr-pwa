import {API_ROUTES} from '../constants/ApiRouts.ts';

import {ApiHelper} from '../utils/ApiHelper.ts';

const {GETMANAGERSRATING} = API_ROUTES;
export const useGetManagerRating = () => {
  const getManagerRating = async (email,date) => {
    const {data, isError} = await new ApiHelper().FetchFromServer(
      GETMANAGERSRATING.endpoint,
      GETMANAGERSRATING.method,
      false,
      {},
      {email,date},
    );
    return {
      data,
      isError,
    };
  };
  return {
    getManagerRating,
  };
};
