import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './screens/Login/Login.tsx'
import  Home  from './screens/Home/Home.tsx';
import  FeedBack  from './screens/FeedBack/FeedBack.tsx';
import  ProfileSetup  from './screens/ProfileSetup/ProfileSetup.tsx';
import Values from './screens/Values/Values.tsx';
import { UserProvider } from './state/UserProvider.js';
import { SelectedDateProvider } from './state/SelectedDateContext.js';
import Toast from 'react-toastify';
import LeaderBoard from './screens/LeaderBoard/LeaderBoard.tsx';
import Events from './screens/Events/Events.tsx';
import Splash from './screens/Splash/Splash.tsx';
import Idea from './screens/Idea/Idea.tsx';
import EmployeesQuestion from './screens/Values/EmployeesQuestion/EmployeesQuestion.tsx';
import RateEmployees from './screens/Values/RateEmployees/RateEmployees.tsx';
import { EmployeesProvider } from './state/Employees.js';
import ReportCard from './screens/ReportCard/ReportCard.tsx';
import Onboarding from './screens/Onboarding/Onboarding.tsx';
import OnboardingQuestions from './screens/Onboarding/OnboardingQuestions.tsx';
import EmployeesQuestionOnboarding from './screens/Onboarding/EmployeesQuestionOnboarding.tsx';
import OnboardingReportCard from './screens/Onboarding/OnboardingReportCard.tsx';
import EventsDescription from './screens/Events/EventsDecription.tsx';
import { ToastContainer } from 'react-toastify';
import { CardsDataProvider } from './state/ValuesCardsdata.js';
import {EmployeesCardsDataProvider} from './state/EmployeesValueCardsData.js';
import {OnboardingCardsDataProvider} from './state/OnboardingCardData.js'
import {EmployeesQuestionOnboardingCardsDataProvider} from './state/EmployeesQuestionOnboarding.js'

// Ensure you have installed react-toastify
// npm install react-toastify

function App() {
  return (
    <EmployeesProvider>
      <EmployeesQuestionOnboardingCardsDataProvider>
      <OnboardingCardsDataProvider>
      <EmployeesCardsDataProvider>
      <CardsDataProvider>
      <SelectedDateProvider>
        <UserProvider>
          {/* <SafeAreaView style={{ backgroundColor: '#333333' }}> */}
            <Router>
              <Routes>
                <Route path="/" element={<Splash />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile-setup" element={<ProfileSetup />} />
                <Route path="/home" element={<Home />} />
                <Route path="/leaderboard" element={<LeaderBoard />} />
                <Route path="/values" element={<Values />} />
                <Route path="/events" element={<Events />} />
                <Route path="/feedback" element={<FeedBack />} />
                <Route path="/rate-employees" element={<RateEmployees />} />
                <Route path="/employees-question" element={<EmployeesQuestion />} />
                <Route path="/report-card" element={<ReportCard />} />
                <Route path="/idea" element={<Idea />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/onboarding-questions" element={<OnboardingQuestions />} />
                <Route path="/employees-question-onboarding" element={<EmployeesQuestionOnboarding />} />
                <Route path="/onboarding-report-card" element={<OnboardingReportCard />} />
                <Route path="/events-description" element={<EventsDescription />} />
              </Routes>
            </Router>
          {/* </SafeAreaView> */}
          <ToastContainer />
        </UserProvider>
      </SelectedDateProvider>
      </CardsDataProvider>
      </EmployeesCardsDataProvider>
      </OnboardingCardsDataProvider>
      </EmployeesQuestionOnboardingCardsDataProvider>
    </EmployeesProvider>
  );
}

export default App;

