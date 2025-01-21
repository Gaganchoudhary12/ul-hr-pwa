import {API_ROUTES} from '../constants/ApiRouts.ts';

import {ApiHelper} from '../utils/ApiHelper.ts';

const {QUESTIONS} = API_ROUTES;
export const useQuestions = () => {
  const questions = async () => {
    const {data, isError} = await new ApiHelper().FetchFromServer(
      QUESTIONS.endpoint,
      QUESTIONS.method,
      false,
      {},
    );
    return {
      data,
      isError,
    };
  };
  return {
    questions,
  };
};
