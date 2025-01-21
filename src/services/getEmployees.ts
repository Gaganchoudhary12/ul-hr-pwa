import {API_ROUTES} from '../constants/ApiRouts.ts';

import {ApiHelper} from '../utils/ApiHelper.ts';

const {GETEMPLOYEES} = API_ROUTES;
export const useGetEmployees = () => {
  const getEmployees = async (email) => {

    const {data, isError, code} = await new ApiHelper().FetchFromServer(
      GETEMPLOYEES.endpoint,
      GETEMPLOYEES.method,
      false,
      {},
      {email}
    );
    
    return {
      data,
      isError,
    };
  };
  return {
    getEmployees,
  };
};
