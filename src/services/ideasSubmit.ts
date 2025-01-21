import {API_ROUTES} from '../constants/ApiRouts.ts';

import {ApiHelper} from '../utils/ApiHelper.ts';

const {IDEAS} = API_ROUTES;
export const useIdeaSubmit = () => {
  const ideaSubmit = async (email, department, idea) => {
    const date = new Date();

    const {data, isError, code} = await new ApiHelper().FetchFromServer(
      IDEAS.endpoint,
      IDEAS.method,
      false,
      {},
      {email, department, idea},
    );
    return {
      data,
      isError,
    };
  };
  return {
    ideaSubmit,
  };
};
