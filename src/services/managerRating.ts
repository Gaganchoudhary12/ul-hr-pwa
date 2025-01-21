import {API_ROUTES} from '../constants/ApiRouts.ts';

import {ApiHelper} from '../utils/ApiHelper.ts';

const {MANAGER} = API_ROUTES;
export const useManagerRating = () => {
  const ManagerRating = async (email, date, title, question, rating, managerEmail) => {

    const {data, isError, code} = await new ApiHelper().FetchFromServer(
      MANAGER.endpoint,
      MANAGER.method,
      false,
      {},
      {email, date, title, question, rating,managerEmail},
    );
    return {
      data,
      isError,
    };
  };
  return {
    ManagerRating,
  };
};
