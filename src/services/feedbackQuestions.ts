import {API_ROUTES} from '../constants/ApiRouts.ts';

import {ApiHelper} from '../utils/ApiHelper.ts';

const {FEEDBACKQUESTIONS} = API_ROUTES;
export const useFeedbackQuestions = () => {
  const feedBackQuestions = async () => {
    const {data, isError} = await new ApiHelper().FetchFromServer(
        FEEDBACKQUESTIONS.endpoint,
        FEEDBACKQUESTIONS.method,
      false,
      {},
    );
    return {
      data,
      isError,
    };
  };
  return {
    feedBackQuestions,
  };
};
