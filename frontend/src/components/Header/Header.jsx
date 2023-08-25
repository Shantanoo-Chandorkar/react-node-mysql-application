import { useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";
import { useLogoutMutation } from "../../store/userApiSlice";
import { apiSlice } from "../../store/apiSlice";
import { BiMenu } from "react-icons/bi";
import { IoPersonCircleOutline } from "react-icons/io5";

const navLinks = [
  {
    path: "/",
    display: "Home",
  },
  {
    path: "/explore",
    display: "Explore",
  },
  {
    path: "/about",
    display: "About",
  },
];

const Header = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      dispatch(apiSlice.util.resetApiState());
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const menuRef = useRef(null);

  const toggleMenuHandler = () =>
    menuRef.current.classList.toggle("show__menu");

  return (
    <header className="header flex items-center">
      <div className="container">
        <div className="flex items-center justify-between">
          {/* {========= LOGO =========} */}
          <div>
            <img src="" alt="" />
            <Link to="/">
              <h4 className="text-hoverColor text-[900] text-[32px]">
                S/Hopper
              </h4>
            </Link>
          </div>

          {/* {========== MENU ==========} */}
          <div className="navigation" ref={menuRef} onClick={toggleMenuHandler}>
            <ul className="menu flex items-center gap-[2.7rem]">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <NavLink
                    to={link.path}
                    className={(navClass) =>
                      navClass.isActive
                        ? "text-hoverColor text-[16px] leading-7 font-[600]"
                        : "text-paraColor text-[16px] leading-7 font-[600] hover:text-paraColor"
                    }
                  >
                    {link.display}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* {========= NAV RIGHT =========} */}
          <div className="flex items-center gap-4">
            {!userInfo ? (
              <>
                <Link to="/register">
                  <button className="bg-hoverColor py-2 px-6 text-white border-transparent border-[1px] font-[600] h-[36px] flex items-center justify-center rounded-[50px] hover:text-hoverColor hover:bg-white hover:border-solid hover:border-hoverColor hover:border-[1px]">
                    Register
                  </button>
                </Link>
                <Link to="/login">
                  <button className="bg-hoverColor py-2 px-6 text-white border-hoverColor border-[1px] font-[600] h-[36px] flex items-center justify-center rounded-[50px] hover:text-hoverColor hover:bg-white hover:border-solid hover:border-hoverColor hover:border-[1px]">
                    Login
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link to={`/profile/${userInfo.other.userId}`}>
                  {/* <button className="bg-hoverColor py-2 px-6 text-white border-transparent border-[1px] font-[600] h-[36px] flex items-center justify-center rounded-[50px] hover:text-hoverColor hover:bg-white hover:border-solid hover:border-hoverColor hover:border-[1px]">
                    My Cart
                  </button> */}
                  <IoPersonCircleOutline
                    size={50}
                    style={{
                      color: "rgb(51 217 178)",
                      borderRadius: "50%",
                      border: "none",
                    }}
                  />
                </Link>

                <button
                  className="bg-hoverColor py-2 px-6 text-white border-hoverColor border-[1px] font-[600] h-[36px] flex items-center justify-center rounded-[50px] hover:text-hoverColor hover:bg-white hover:border-solid hover:border-hoverColor hover:border-[1px]"
                  onClick={logoutHandler}
                >
                  Logout
                </button>
              </>
            )}

            <span className="md:hidden" onClick={toggleMenuHandler}>
              <BiMenu className="w-6 h-6 cursor-pointer text-white" />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
