import {API_ROUTES} from '../constants/ApiRouts.ts';

import {ApiHelper} from '../utils/ApiHelper.ts';

const {LEADERBOARD} = API_ROUTES;
export const useLeaderBoard = () => {
  const getLeaderBoard = async () => {
    const {data, isError, code} = await new ApiHelper().FetchFromServer(
      LEADERBOARD.endpoint,
      LEADERBOARD.method,
      false,
      {},
    );
console.log('====================================');
console.log(data);
console.log('====================================');
    return {
      data,
      isError,
    };
  };
  return {
    getLeaderBoard,
  };
};
