import { useLocation } from "react-router-dom";
import Notifcation from "./Notifcation";
import MenuBar from "./MenuBar";
import LanguageDropdown from "./LanguageDropdown";
import { useTranslation } from "react-i18next";
import { pageTranslations } from "../utlis/translations";
import Profile from "./navBarComponents/Profile";

const Navbar = () => {
  const location = useLocation();
  const { i18n } = useTranslation();
  const language = i18n.language;

  const translatePageName = (pathname) => {
    if (pathname.startsWith("/orders/")) {
      return pageTranslations[language]["/orders/:OrderId"];
    }
    if (pathname.startsWith("/refunds/")) {
      return pageTranslations[language]["/refunds/:refundsId"];
    }
    if (pathname.startsWith("/common-questions/")) {
      return pageTranslations[language]["/common-questions/:questionId"];
    }
    if (pathname.startsWith("/hospitals/")) {
      return pageTranslations[language]["/hospitals/:HospitalId"];
    }
    if (pathname.startsWith("/coupons/")) {
      return pageTranslations[language]["/coupons/:couponId"];
    }
    if (pathname.startsWith("/recharge-card/add-card")) {
      return pageTranslations[language]["/recharge-card/add-card"];
    }
    if (pathname.startsWith("/doctors/add-doctor")) {
      return pageTranslations[language]["/doctors/add-doctor"];
    }
    if (pathname.startsWith("/doctors/")) {
      return pageTranslations[language]["/doctors/:doctorId"];
    }
    if (pathname.startsWith("/cities/")) {
      return pageTranslations[language]["/cities/:cityId"];
    }
    if (pathname.startsWith("/sliders/")) {
      return pageTranslations[language]["/sliders/:sliderId"];
    }
    if (pathname.startsWith("/employees/")) {
      return pageTranslations[language]["/employees/:empId"];
    }
    if (pathname.startsWith("/settings/")) {
      return pageTranslations[language]["/settings/:settingId"];
    }
    if (pathname.startsWith("/customer-service/add-customer-service")) {
      return pageTranslations[language][
        "/customer-service/add-customer-service"
      ];
    }
    if (pathname.startsWith("/customer-service/")) {
      return pageTranslations[language]["/customer-service/:customerId"];
    }
    if (pathname.startsWith("/specializations/add")) {
      return pageTranslations[language]["/specializations/add"];
    }
    if (pathname.startsWith("/specializations/")) {
      return pageTranslations[language]["/specializations/:spId"];
    }
    if (pathname.startsWith("/hospital-report/")) {
      return pageTranslations[language]["/hospital-report/:hosId"];
    }
    if (pathname.startsWith("/terms/")) {
      return pageTranslations[language]["/terms/"];
    }
    if (pathname.startsWith("/home-visit-report/")) {
      return pageTranslations[language]["/home-visit-report/:serviceId"];
    }
    if (pathname.startsWith("/home-visit-service-booking-details/")) {
      return pageTranslations[language][
        "/home-visit-service-booking-details/:hospitalId"
      ];
    }
    if (pathname.startsWith("/home-visit-bookings-details/")) {
      return pageTranslations[language][
        "/home-visit-bookings-details/:hospitalId"
      ];
    }
    if (pathname.startsWith("/hospital-services/main-services/add")) {
      return pageTranslations[language]["/hospital-services/main-services/add"];
    }
    if (
      pathname.startsWith("/hospital-services/main-services/") &&
      pathname.includes("/sub-services")
    ) {
      return pageTranslations[language][
        "/hospital-services/main-services/:mainServiceId/sub-services"
      ];
    }
    if (pathname.startsWith("/hospital-services/")) {
      return pageTranslations[language]["/hospital-services/main-services/:id"];
    }
    if (pathname.startsWith("/hospital-services-report/")) {
      return pageTranslations[language]["/hospital-services-report/:id"];
    }

    return (
      pageTranslations[language][pathname] || pageTranslations[language].default
    );
  };

  const pageName = translatePageName(location.pathname);
  const direction = language === "ar" ? "rtl" : "ltr";
  console.log(pageName);

  return (
    <nav
      dir={direction}
      className="bg-[#FFFFFF] font-almarai md:h-[90px] h-auto my-5 lg:flex w-full px-4"
    >
      <div className="container py-4 mx-auto justify-between items-center hidden lg:flex">
        <div
          className={`xl:text-4xl text-2xl almarai-bold text-black whitespace-nowrap ${
            direction === "rtl" ? "text-right" : "text-left"
          }`}
        >
          {pageName.charAt(0).toUpperCase() + pageName.slice(1)}
        </div>
        <div className="flex items-center gap-3  shrink-0 ">
          <LanguageDropdown />
          <Notifcation />
          <Profile />
        </div>
      </div>
      <MenuBar pageName={pageName} />
    </nav>
  );
};

export default Navbar;
