import {API_ROUTES} from '../constants/ApiRouts.ts';

import {ApiHelper} from '../utils/ApiHelper.ts';

const {GETONBOARDINGMANAGERRATING} = API_ROUTES;
export const useGetOnboardingManagerRating = () => {
  const getManagerOnboardingRating = async (email, days) => {
    const {data, isError} = await new ApiHelper().FetchFromServer(
      GETONBOARDINGMANAGERRATING.endpoint,
      GETONBOARDINGMANAGERRATING.method,
      false,
      {},
      {email, days},
    );
    return {
      data,
      isError,
    };
  };
  return {
    getManagerOnboardingRating,
  };
};
