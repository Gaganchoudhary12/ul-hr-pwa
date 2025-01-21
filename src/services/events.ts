import {API_ROUTES} from '../constants/ApiRouts.ts';

import {ApiHelper} from '../utils/ApiHelper.ts';

const {EVENTS} = API_ROUTES;
export const useEvents = () => {
  const getEvents = async () => {

    const {data, isError, code} = await new ApiHelper().FetchFromServer(
      EVENTS.endpoint,
      EVENTS.method,
      false,
      {},
    );
    console.log(isError);
    
    return {
      data,
      isError,
    };
  };
  return {
    getEvents,
  };
};
