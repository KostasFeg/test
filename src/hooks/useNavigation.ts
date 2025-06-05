import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateToRoute = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  const isCurrentRoute = useCallback((path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  }, [location.pathname]);

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const goToHome = useCallback(() => {
    navigate('/maintenance-operations');
  }, [navigate]);

  return {
    navigateToRoute,
    isCurrentRoute,
    goBack,
    goToHome,
    currentPath: location.pathname
  };
}; 