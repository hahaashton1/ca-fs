import Navbar from "./navbar";
import Footer from "./footer";

const Layout = ({children}) => {
  return (
    <div className="flex flex-col h-screen justify-between" data-theme="pastel">
        <Navbar />
            <main>{children}</main>
        <Footer />
    </div>  
  );
};
export default Layout;