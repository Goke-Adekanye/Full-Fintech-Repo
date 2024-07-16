import { FC } from "react";
import { useLogout } from "../hooks/useLogout";
import { Link } from "react-router-dom";

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
    <header className="flex items-center justify-between h-14 max-[400px]:px-2 px-6 mb-5 bg-auth-bg max-w-screen-lg mx-auto">
      <Link to="/">
        <img src="icon.png" alt="" className="h-[50px]" />
      </Link>
      <div className="logout">{getLogoutButton()}</div>
    </header>
  );
};

const Footer = () => {
  return (
    <div className="max-w-screen-lg mx-auto bg-auth-bg flex flex-wrap item-center justify-between min-h-[50px] rounded-md max-[230px]:py-3 py-5 max-[400px]:px-2 px-6 mt-5 max-[350px]:text-[12px] text-sm font-medium">
      <p>Ape Banking</p>
      <p>
        crafted by <span className="text-orange-500">Goke A.</span>
      </p>
    </div>
  );
};

export default MainLayout;
