import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const Button = ({ children, variant = 'primary', ...props }: ButtonProps) => {
  const baseClasses = 'px-6 py-3 font-semibold rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ctp-base';
  
  const variantClasses = {
    primary: 'bg-ctp-mauve text-ctp-crust hover:bg-ctp-pink focus:ring-ctp-pink',
    secondary: 'bg-ctp-surface1 text-ctp-lavender hover:bg-ctp-surface2 focus:ring-ctp-lavender',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseClasses} ${variantClasses[variant]}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
