import {API_ROUTES} from '../constants/ApiRouts.ts';

import {ApiHelper} from '../utils/ApiHelper.ts';

const {ONBOARDINQUESTIONS} = API_ROUTES;
export const useOnboardingQuestions = () => {
  const onboardingQuestions = async (days, forRole) => {
    const date = new Date();

    const {data, isError, code} = await new ApiHelper().FetchFromServer(
      ONBOARDINQUESTIONS.endpoint,
      ONBOARDINQUESTIONS.method,
      false,
      {},
      {days, forRole},
    );
    return {
      data,
      isError,
    };
  };
  return {
    onboardingQuestions,
  };
};
