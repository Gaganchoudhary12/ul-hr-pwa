import {API_ROUTES} from '../constants/ApiRouts.ts';

import {ApiHelper} from '../utils/ApiHelper.ts';

const {ONBOARDINGEMPLOYEERATING} = API_ROUTES;
export const useOnboardingEmployeeRating = () => {
  const employeeRating = async (email, title, question, rating,days) => {
    const {data, isError, code} = await new ApiHelper().FetchFromServer(
      ONBOARDINGEMPLOYEERATING.endpoint,
      ONBOARDINGEMPLOYEERATING.method,
      false,
      {},
      {email, title, question, rating,days},
    );
    return {
      data,
      isError,
    };
  };
  return {
    employeeRating,
  };
};
