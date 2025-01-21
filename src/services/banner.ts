import {API_ROUTES} from '../constants/ApiRouts.ts';

import {ApiHelper} from '../utils/ApiHelper.ts';

const {GETBANNER} = API_ROUTES;
export const useGetBanner = () => {
  const getBanner = async () => {

    const {data, isError, code} = await new ApiHelper().FetchFromServer(
        GETBANNER.endpoint,
        GETBANNER.method,
      false,
      {},
    );
    
    return {
      data,
      isError,
    };
  };
  return {
    getBanner,
  };
};
