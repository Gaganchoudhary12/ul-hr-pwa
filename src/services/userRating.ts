import {API_ROUTES} from '../constants/ApiRouts.ts';

import {ApiHelper} from '../utils/ApiHelper.ts';

const {USERRATING} = API_ROUTES;
export const useUserRating = () => {
  const userRating = async (email, date, title, question, rating) => {

    const {data, isError, code} = await new ApiHelper().FetchFromServer(
      USERRATING.endpoint,
      USERRATING.method,
      false,
      {},
      {email, date, title, question, rating},
    );
    return {
      data,
      isError,
    };
  };
  return {
    userRating,
  };
};
