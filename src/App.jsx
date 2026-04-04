import React from "react";
import { HelmetProvider } from 'react-helmet-async';
import Routes from "./Routes";
import { SkillsProvider } from "./context/SkillsContext";
import { ProjectsProvider } from "./context/ProjectsContext";
import { PortfolioSettingsProvider } from "./context/PortfolioSettingsContext";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import Toast from "./components/Toast";

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ToastProvider>
          <PortfolioSettingsProvider>
            <SkillsProvider>
              <ProjectsProvider>
                  <Routes />
                  <Toast />
              </ProjectsProvider>
            </SkillsProvider>
          </PortfolioSettingsProvider>
        </ToastProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
