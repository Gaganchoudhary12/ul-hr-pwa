import {API_ROUTES} from '../constants/ApiRouts.ts';

import {ApiHelper} from '../utils/ApiHelper.ts';

const {FEEDBACKSUBMIT} = API_ROUTES;
export const useFeedbackSubmit = () => {
  const feedbackSubmit = async (type, comment, rating) => {
    const date = new Date();

    const {data, isError, code} = await new ApiHelper().FetchFromServer(
      FEEDBACKSUBMIT.endpoint,
      FEEDBACKSUBMIT.method,
      false,
      {},
      {type, comment, rating, date},
    );
    return {
      data,
      isError,
    };
  };
  return {
    feedbackSubmit,
  };
};
