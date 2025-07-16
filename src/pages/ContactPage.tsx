import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { cyberpunkTheme } from '../styles/theme';

const ContactContainer = styled(motion.div)`
  padding: 100px 2rem;
  background: ${cyberpunkTheme.colors.background};
  color: ${cyberpunkTheme.colors.textPrimary};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ContactLink = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  margin: 0.5rem;
  background: ${cyberpunkTheme.colors.surface0};
  border-radius: 1rem;
  color: ${cyberpunkTheme.colors.text};
  text-decoration: none;
  cursor: pointer;
`;

export const ContactPage: React.FC = () => {
  const contacts = [
    {
      platform: "LinkedIn",
      url: "https://www.linkedin.com/in/sanket-bhalke-devops/",
      icon: "🔗"
    },
    {
      platform: "GitHub",
      url: "https://github.com/sanket363",
      icon: "💻"
    }
  ];

  return (
    <ContactContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.h1 
        style={{ color: cyberpunkTheme.colors.mauve, marginBottom: '2rem' }}
        initial={{ y: -20 }}
        animate={{ y: 0 }}
      >
        Let's Connect
      </motion.h1>
      {contacts.map((contact, index) => (
        <ContactLink
          key={contact.platform}
          href={contact.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>{contact.icon}</span>
          {contact.platform}
        </ContactLink>
      ))}
    </ContactContainer>
  );
};
