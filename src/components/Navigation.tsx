import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { catppuccinTheme } from '../styles/theme';

const Nav = styled(motion.nav)`
  position: fixed;
  top: 0;
  width: 100%;
  padding: 1.5rem;
  background: ${catppuccinTheme.colors.mantle}aa;
  backdrop-filter: blur(10px);
  z-index: 100;
  display: flex;
  justify-content: center;
  gap: 2rem;
`;

const NavItem = styled(motion.div)`
  position: relative;
`;

const NavLink = styled(Link)`
  color: ${catppuccinTheme.colors.text};
  text-decoration: none;
  font-size: 1.1rem;
  padding: 0.5rem 1rem;
  
  &:hover {
    color: ${catppuccinTheme.colors.mauve};
  }
`;

const NavIndicator = styled(motion.div)`
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 3px;
  background: ${catppuccinTheme.colors.mauve};
  border-radius: 1px;
`;

export const Navigation = () => {
  const location = useLocation();

  return (
    <Nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      {['Home', 'Projects', 'Skills', 'Contact'].map((item) => (
        <NavItem key={item}>
          <NavLink to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}>
            {item}
          </NavLink>
          {location.pathname === (item === 'Home' ? '/' : `/${item.toLowerCase()}`) && (
            <NavIndicator layoutId="indicator" />
          )}
        </NavItem>
      ))}
    </Nav>
  );
};
