import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-ctp-mantle p-4 sticky top-0 z-50 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-ctp-mauve hover:text-ctp-pink transition-colors">
          $ /home/sanket
        </Link>
        <div className="flex space-x-4">
          <Link href="#about" className="text-ctp-lavender hover:text-ctp-sapphire transition-colors">About</Link>
          <Link href="#skills" className="text-ctp-lavender hover:text-ctp-sapphire transition-colors">Skills</Link>
          <Link href="#projects" className="text-ctp-lavender hover:text-ctp-sapphire transition-colors">Projects</Link>
          <Link href="#contact" className="text-ctp-lavender hover:text-ctp-sapphire transition-colors">Contact</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
