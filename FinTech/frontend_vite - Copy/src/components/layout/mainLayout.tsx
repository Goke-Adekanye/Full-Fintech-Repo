import { FC } from "react";
import { useLogout } from "../hooks/useLogout";
import { Link } from "react-router-dom";
import { Logo } from "../common/logo";

const MainLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <main className="p-1">
      <Header />
      <div className="max-w-screen-lg mx-auto">{children}</div>
      <Footer />
    </main>
  );
};

const Header = () => {
  const { getLogoutButton } = useLogout();

  return (
    <header className="flex items-center justify-between h-16 max-[275px]:px-2 px-6">
      <Link className="brand" to="/">
        <Logo />
      </Link>
      <div className="logout">{getLogoutButton()}</div>
    </header>
  );
};

const Footer = () => {
  return (
    <div className="max-w-screen-lg mx-auto bg-auth-bg flex flex-wrap item-center justify-between min-h-[50px] rounded-md py-5 max-[275px]:px-2 px-6 mt-5 text-sm font-bold">
      <p>Ape Banking</p>
      <p>
        developed by <span className="text-orange-500"> Jvstblvck</span>
      </p>
    </div>
  );
};

export default MainLayout;
