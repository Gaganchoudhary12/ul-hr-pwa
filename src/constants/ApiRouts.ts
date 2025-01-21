export const API_ROUTES = {
  LOGIN: {
    endpoint: '/login',
    method: 'POST',
  },
  QUESTIONS: {
    endpoint: '/questions',
    method: 'GET',
  },
  FEEDBACKQUESTIONS: {
    endpoint: '/feedback/question',
    method: 'GET',
  },
  FEEDBACKSUBMIT: {
    endpoint: '/feedback',
    method: 'POST',
  },
  USERRATING: {
    endpoint: '/user/rating',
    method: 'POST',
  },
  GETUSERRATING: {
    endpoint: '/user',
    method: 'POST',
  },
  GETBANNER: {
    endpoint: '/banner',
    method: 'GET',
  },
  EVENTS: {
    endpoint: '/events',
    method: 'GET',
  },
  GETEMPLOYEES: {
    endpoint: '/reporting',
    method: 'POST',
  },
  GETMANAGERSRATING: {
    endpoint: '/manager',
    method: 'POST',
  },
  MANAGER: {
    endpoint: '/manager/rating',
    method: 'POST',
  },
  IDEAS: {
    endpoint: '/ideas',
    method: 'POST',
  },
  ONBOARDINQUESTIONS: {
    endpoint: '/onboarding-questions',
    method: 'POST',
  },
  ONBOARDINGEMPLOYEERATING: {
    endpoint: '/onboarding-employee/rating',
    method: 'POST',
  },
  GETONBOARDINGEMPLOYEERATING: {
    endpoint: '/onboarding-employee',
    method: 'POST',
  },
  ONBOARDINGMANAGERRATING: {
    endpoint: '/onboarding-manager/rating',
    method: 'POST',
  },
  GETONBOARDINGMANAGERRATING: {
    endpoint: '/onboarding-manager',
    method: 'POST',
  },
  LEADERBOARD : {
    endpoint : '/leader-board',
    method : 'GET'
  }
};
