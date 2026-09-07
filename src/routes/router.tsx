import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from './RootLayout';

import MouseOverviewPage from './mouse/MouseOverviewPage';
import ButtonsInspectorPage from './mouse/ButtonsInspectorPage';
import ClickTimingPage from './mouse/ClickTimingPage';
import ChatterDetectorPage from './mouse/ChatterDetectorPage';
import ScrollTestPage from './mouse/ScrollTestPage';
import CpsBenchmarkPage from './mouse/CpsBenchmarkPage';
import MotionTrackerPage from './mouse/MotionTrackerPage';

import KeyboardOverviewPage from './keyboard/KeyboardOverviewPage';
import MatrixInspectorPage from './keyboard/MatrixInspectorPage';
import RolloverPage from './keyboard/RolloverPage';
import AntiGhostingPage from './keyboard/AntiGhostingPage';
import KeyChatterPage from './keyboard/KeyChatterPage';
import GamingWasdPage from './keyboard/GamingWasdPage';
import SpacebarTestPage from './keyboard/SpacebarTestPage';
import ModifiersPage from './keyboard/ModifiersPage';

import LearnPage from './learn/LearnPage';
import AboutPage from './about/AboutPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/mouse" replace />,
      },
      // Mouse Suite
      {
        path: 'mouse',
        children: [
          { index: true, element: <MouseOverviewPage /> },
          { path: 'buttons', element: <ButtonsInspectorPage /> },
          { path: 'click', element: <ClickTimingPage /> },
          { path: 'chatter', element: <ChatterDetectorPage /> },
          { path: 'scroll', element: <ScrollTestPage /> },
          { path: 'cps', element: <CpsBenchmarkPage /> },
          { path: 'motion', element: <MotionTrackerPage /> },
        ],
      },
      // Keyboard Suite
      {
        path: 'keyboard',
        children: [
          { index: true, element: <KeyboardOverviewPage /> },
          { path: 'matrix', element: <MatrixInspectorPage /> },
          { path: 'rollover', element: <RolloverPage /> },
          { path: 'anti-ghosting', element: <AntiGhostingPage /> },
          { path: 'chatter', element: <KeyChatterPage /> },
          { path: 'gaming-wasd', element: <GamingWasdPage /> },
          { path: 'spacebar', element: <SpacebarTestPage /> },
          { path: 'modifiers', element: <ModifiersPage /> },
        ],
      },
      // Learn & About
      { path: 'learn', element: <LearnPage /> },
      { path: 'learn/*', element: <LearnPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: '*', element: <Navigate to="/mouse" replace /> },
    ],
  },
]);
