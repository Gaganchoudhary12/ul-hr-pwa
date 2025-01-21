import {API_ROUTES} from '../constants/ApiRouts.ts';

import {ApiHelper} from '../utils/ApiHelper.ts';

const {GETONBOARDINGEMPLOYEERATING} = API_ROUTES;
export const useGetOnboardingEmployeeRatings = () => {
  const getOnboardingEmployeeRatings = async (email, days) => {
    const {data, isError, code} = await new ApiHelper().FetchFromServer(
      GETONBOARDINGEMPLOYEERATING.endpoint,
      GETONBOARDINGEMPLOYEERATING.method,
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
    getOnboardingEmployeeRatings,
  };
};
