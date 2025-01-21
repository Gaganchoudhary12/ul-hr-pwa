import {API_ROUTES} from '../constants/ApiRouts.ts';

import {ApiHelper} from '../utils/ApiHelper.ts';

const {ONBOARDINGMANAGERRATING} = API_ROUTES;
export const useManagerRatingOnboarding = () => {
  const ManagerRatingOnboarding = async (
    email,
    days,
    title,
    question,
    rating,
    managerEmail,
  ) => {
    const {data, isError, code} = await new ApiHelper().FetchFromServer(
      ONBOARDINGMANAGERRATING.endpoint,
      ONBOARDINGMANAGERRATING.method,
      false,
      {},
      {email, days, title, question, rating, managerEmail},
    );
    return {
      data,
      isError,
    };
  };
  return {
    ManagerRatingOnboarding,
  };
};
