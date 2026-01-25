/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { IoMdPeople } from "react-icons/io";
import { mainLogo } from "../assets";
import { FaRegClock } from "react-icons/fa6";
import { FaUserDoctor } from "react-icons/fa6";
// eslint-disable-next-line no-unused-vars
import { IoIosChatbubbles } from "react-icons/io";
import {
  FaArrowCircleLeft,
  FaArrowCircleRight,
  FaClinicMedical,
  FaMapMarkerAlt,
  FaRegMoneyBillAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { AiFillCustomerService } from "react-icons/ai";
import { MdNotificationAdd, MdHomeWork } from "react-icons/md";

import { useTranslation } from "react-i18next";
import { pageTranslations } from "../utlis/translations";
import { CiHospital1 } from "react-icons/ci";
import { PiImagesSquareBold } from "react-icons/pi";
import { FaQuestion } from "react-icons/fa";
import { MdLocationCity } from "react-icons/md";
import { FaCreditCard } from "react-icons/fa6";
import { IoSettingsSharp } from "react-icons/io5";
import { RiCoupon2Fill, RiServiceLine } from "react-icons/ri";
import { BsCardText } from "react-icons/bs";
import { FaStethoscope } from "react-icons/fa";
import LogoutDialog from "./LogoutDialog";
import { RiShieldCheckLine } from "react-icons/ri";
import { MdChat, MdAccountBalanceWallet } from "react-icons/md";
import { FaUserCog, FaUserShield } from "react-icons/fa";

export const sidebarLinks = [
  { path: "/", label: "dashboard", icon: <FaRegClock size={22} /> },
  { path: "/hospitals", label: "hospitals", icon: <CiHospital1 size={22} /> },
  {
    path: "/specializations",
    label: "specializations",
    icon: <FaClinicMedical size={22} />,
  },
  { path: "/doctors", label: "doctors", icon: <FaUserDoctor size={22} /> },
  { path: "/clinics", label: "clinic", icon: <IoMdPeople size={22} /> },
  {
    path: "/employee-roles",
    label: "employee roles",
    icon: <FaUserCog size={22} />,
  },
  {
    path: "/admins",
    label: "admins",
    icon: <FaUserShield size={22} />,
  },
  // { path: "/services", label: "services", icon: <FaStethoscope size={22} /> },
  {
    path: "/hospital-services",
    label: "hospital services",
    icon: <FaStethoscope size={22} />,
  },
  // {
  //   path: "/medical-service",
  //   label: "medical-service",
  //   icon: <RiServiceLine size={22} />,
  // },
  { path: "/request-Form", label: "requests", icon: <BsCardText size={22} /> },
];
export const therestofSidebarLinks = [
  { path: "/refunds", label: "refunds", icon: <FaRegMoneyBillAlt size={22} /> },
  {
    path: "/recharge-card",
    label: "rechard card",
    icon: <FaCreditCard size={22} />,
  },
  { path: "/coupons", label: "Coupons", icon: <RiCoupon2Fill size={22} /> },
  {
    path: "/admin-chat",
    label: "Admin-chat",
    icon: <IoIosChatbubbles size={22} />,
  },
  {
    path: "/whatsapp",
    label: "whatsapp",
    icon: <FaWhatsapp size={22} />,
  },
  {
    path: "/terms",
    label: "Terms & Conditions",
    icon: <RiShieldCheckLine size={22} />,
  },
  {
    path: "/settings",
    label: "settings",
    icon: <IoSettingsSharp size={22} />,
  },
  {
    path: "/customer-service",
    label: "customer service",
    icon: <AiFillCustomerService size={22} />,
  },

  {
    path: "/common-questions",
    label: "common questions",
    icon: <FaQuestion size={22} />,
  },
  {
    path: "/sliders",
    label: "sliders",
    icon: <PiImagesSquareBold size={22} />,
  },
  {
    path: "/send-notification",
    label: "send notification",
    icon: <MdNotificationAdd size={22} />,
  },
  {
    path: "/tebbie-communication",
    label: "tebbie communication",
    icon: <MdChat size={22} />,
  },
  {
    path: "/tebbie-wallet",
    label: "tebbie wallet",
    icon: <MdAccountBalanceWallet size={22} />,
  },
  {
    path: "/hospital-wallet",
    label: "hospital wallets",
    icon: <MdAccountBalanceWallet size={22} />,
  },
  {
    path: "/home-visit-services",
    label: "home visit services",
    icon: <MdHomeWork size={22} />,
  },
  {
    path: "/states",
    label: "states",
    icon: <FaMapMarkerAlt size={22} />,
  },
  { path: "/cities", label: "cities", icon: <MdLocationCity size={22} /> },
  { path: "/regions", label: "regions", icon: <MdLocationCity size={22} /> },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const isActiveclass = `
  block px-4 py-4 text-white bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] relative text-lg rounded-[8px] transition-all duration-300 ${
    isCollapsed ? "w-18 " : "w-56 "
  }
  ${
    direction === "rtl"
      ? "text-center after:-right-4 after:rounded-l-[8px]"
      : "text-start before:-left-4 before:rounded-r-[8px]"
  } 
  ${
    direction === "rtl"
      ? "after:content-[''] after:absolute after:top-0 after:h-full after:w-[6px] after:bg-primary"
      : "before:content-[''] before:absolute before:top-0 before:h-full before:w-[6px] before:bg-primary"
  }
`;
  const isNotActiveclass = `block px-4 py-4 text-lg rounded-[8px] text-start text-black  ${
    isCollapsed ? "w-18 " : "w-56 "
  }`;
  const translatePageName = (path) =>
    pageTranslations[currentLanguage][path] ||
    pageTranslations[currentLanguage].default;

  return (
    <aside
      dir={direction}
      className={`font-almarai almarai-medium bg-[#FFFFFF] text-black p-4  lg:flex hidden flex-col transition-all duration-300 top-0 
  ${direction === "rtl" ? "start-0" : "end-0"} 
  ${isCollapsed ? "w-24" : "w-64"}
`}
    >
      {/* الجزء العلوي */}
      <div className="flex flex-col  ">
        <div className="space-y-2">
          <div className="flex items-center justify-center m-4 py-2 gap-2 w-full">
            <Link to="/">
              <img
                src={mainLogo}
                alt="Logo"
                className={`object-contain transition-all duration-300 ${
                  isCollapsed ? "w-0 " : "w-34 h-34"
                }`}
              />
              {isCollapsed && (
                <img
                  className="w-32 me-14"
                  alt="joystick logo"
                  src={mainLogo}
                />
              )}
            </Link>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="m-auto text-2xl z-20"
            >
              {isCollapsed ? (
                <FaArrowCircleLeft color={"#02A09B"} size={28} />
              ) : (
                <FaArrowCircleRight color={"#02A09B"} size={28} />
              )}
            </button>
          </div>

          {/* الروابط */}
          <div>
            {sidebarLinks.map((link, index) => (
              <NavLink
                key={index}
                to={link.path}
                className={({ isActive }) =>
                  isActive ? isActiveclass : isNotActiveclass
                }
              >
                <div className="flex items-center">
                  {link.icon && (
                    <span
                      className={`inline-block  ${isCollapsed ? "" : "mx-2"}`}
                    >
                      {link.icon}
                    </span>
                  )}
                  {!isCollapsed && <span>{translatePageName(link.path)}</span>}
                </div>
              </NavLink>
            ))}
          </div>

          {/* روابط إضافية */}
          <div className="border-full border-t-2 mt-4">
            {therestofSidebarLinks.map((link, index) => (
              <NavLink
                key={index}
                to={link.path}
                className={({ isActive }) =>
                  isActive ? isActiveclass : isNotActiveclass
                }
              >
                <div className="flex items-center">
                  {link.icon && (
                    <span
                      className={`inline-block  ${isCollapsed ? "" : "mx-2"}`}
                    >
                      {link.icon}
                    </span>
                  )}
                  {!isCollapsed && <span>{translatePageName(link.path)}</span>}
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      <LogoutDialog isCollapsed={isCollapsed} />
    </aside>
  );
};

export default Sidebar;
