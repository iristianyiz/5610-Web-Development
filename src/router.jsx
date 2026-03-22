import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from './ui/AppLayout.jsx'
import { HomePage } from './views/HomePage.jsx'
import { GameSelectionPage } from './views/GameSelectionPage.jsx'
import { GamePage } from './views/GamePage.jsx'
import { RulesPage } from './views/RulesPage.jsx'
import { ScoresPage } from './views/ScoresPage.jsx'
import { LoginPage } from './views/LoginPage.jsx'
import { RegisterPage } from './views/RegisterPage.jsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'games', element: <GameSelectionPage /> },
      { path: 'games/easy', element: <GamePage mode="easy" /> },
      { path: 'games/normal', element: <GamePage mode="normal" /> },
      { path: 'rules', element: <RulesPage /> },
      { path: 'scores', element: <ScoresPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

