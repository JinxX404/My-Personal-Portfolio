import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from "components/ui/Header";
import Footer from "components/Footer";

const Layout = ({ children }) => {
  const location = useLocation();
  
  // List of routes where Header and Footer should be hidden
  const hideLayoutRoutes = [
    '/admin-dashboard',
    '/blog-editor',
    '/project-manager',
    '/skills-manager',
    '/projects-manager',
    '/blogs-manager',
    '/settings-manager'
  ];

  const shouldHide = hideLayoutRoutes.some(route => location.pathname.startsWith(route));

  return (
    <>
      {!shouldHide && <Header />}
      {children}
      {!shouldHide && <Footer />}
    </>
  );
};

export default Layout;
