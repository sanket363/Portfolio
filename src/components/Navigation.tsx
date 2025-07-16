import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { catppuccinTheme } from '../styles/theme';

const Nav = styled(motion.nav)`
  position: fixed;
  top: 0;
  width: 100%;
  padding: 1rem;
  background: ${catppuccinTheme.colors.mantle};
  z-index: 100;
`;

const NavLink = styled(Link)`
  color: ${catppuccinTheme.colors.text};
  text-decoration: none;
  margin: 0 1rem;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -4px;
    left: 0;
    background: ${catppuccinTheme.colors.mauve};
    transition: width 0.3s ease;
  }
  
  &:hover:after {
    width: 100%;
  }
`;

export const Navigation = () => {
  return (
    <Nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <NavLink to="/">Home</NavLink>
      <NavLink to="/projects">Projects</NavLink>
      <NavLink to="/skills">Skills</NavLink>
      <NavLink to="/contact">Contact</NavLink>
    </Nav>
  );
};
