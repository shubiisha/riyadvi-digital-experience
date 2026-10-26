import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageTransitionVariants } from '../../lib/animations';

export const PageTransition = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <motion.div
      key={pathname}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransitionVariants}
      className="w-full flex-grow"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
