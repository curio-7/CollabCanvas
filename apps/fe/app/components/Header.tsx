import Logo from "./Logo";

interface HeaderProps {
  children?: React.ReactNode;
}

const Header = ({ children }: HeaderProps) => {
  return (
    <header className="w-full border-b app-header py-3 px-4 flex items-center justify-between">
      <Logo />
      <div className="flex items-center gap-2">
        {children}
      </div>
    </header>
  );
};

export default Header;