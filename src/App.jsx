import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./global.css";
import Login from "./_auth/Login";
import RootLayout from "./pages/RootLayout";
import Financial from "./pages/Financial";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Hospitals from "./pages/Hospitals";
import HospitalDetails from "./pages/HospitalDetails";
import AddHospital from "./pages/AddHospital";
import Doctors from "./pages/Doctors";
import UpdateHospital from "./pages/UpdateHospital";
import DoctorDetails from "./pages/DoctorDetails";
import UpdateDoctor from "./pages/UpdateDoctor";
import AddDoctor from "./pages/AddDoctor";
import Sliders from "./pages/Sliders";
import UpdateSlider from "./pages/UpdateSlider";
import AddSlider from "./pages/AddSlider";
import CommonQuestions from "./pages/CommonQuestions";
import UpdateCommonQuestions from "./pages/UpdateCommonQuestions";
import AddQuestion from "./pages/AddQuestion";
import Cities from "./pages/Cities";
import Regions from "./pages/Regions";
import AddRegion from "./pages/AddRegion";
import UpdateRegion from "./pages/UpdateRegion";
import UpdateCity from "./pages/UpdateCity";
import AddCity from "./pages/AddCity";
import States from "./pages/States";
import TrashedHospital from "./pages/TrashedHospital";
import TrashedDoctor from "./pages/TrashedDoctor";
import TrashedState from "./pages/TrashedState";
import TrashedCity from "./pages/TrashedCity";
import RechargeCards from "./pages/RechargeCards";
import AddCard from "./pages/AddCard";
import Settings from "./pages/Settings";
import EditSetting from "./pages/EditSetting";
import AddSetting from "./pages/AddSetting";
import { AuthMiddleware, GuestMiddleware } from "./middlewares/authMiddleware";
import ChatPage from "./pages/ChatPage";
import Specializations from "./pages/Specializations";
import UpdateSpecial from "./pages/UpdateSpecial";
import AddSpecial from "./pages/AddSpecial";
import Coupons from "./pages/Coupons";
import Employees from "./pages/Employees";
import UpdateEmployee from "./pages/UpdateEmployee";
import RequestForm from "./pages/RequestForm";
import HospitalServices from "./pages/HospitalServices";
import AddHospitalService from "./pages/AddHospitalService";
import UpdateHospitalService from "./pages/UpdateHospitalService";
import AddHospitalMainService from "./pages/AddHospitalMainService";
import UpdateHospitalMainService from "./pages/UpdateHospitalMainService";
import HospitalSubServices from "./pages/HospitalSubServices";

import { UserProvider } from "./chatcontext/UserContext";
import HospitalLayout from "./pages/HospitalLayout";
import Refunds from "./pages/Refunds";
import RefundsDetails from "./pages/RefundsDetails";
import NotFound from "./pages/NotFound";
import CustomerService from "./pages/CustomerService/CustomerService";
import UpdateCustomerService from "./pages/CustomerService/UpdateCustomerService";
import AddCustomerService from "./pages/CustomerService/AddCustomerService";
import { ChatOnlyMiddleware } from "./middlewares/ChatOnlyMiddleware";
import ChatLayout from "./pages/ChatLayout";
import useFirebaseNotifications from "./hooks/useFirebaseNotifications";
import SendNotification from "./pages/SendNotification";
import AdminChat from "./pages/AdminChat";
import HospitalReportDetails from "./pages/HospitalReportDetails";
import TermsAndConditions from "./pages/TermsAndConditions";
import HomeVisitReportPage from "./pages/HomeVisitReportPage";
import UserseportPage from "./pages/UserReportPage";
import WhatsappPage from "./pages/WhatsappPage";
import PermissionWrapper from "./utlis/PermissionWrapper";
import TebbieCommunication from "./pages/TebbieCommunication";
import TebbieWallet from "./pages/TebbieWallet";
import HospitalWallet from "./pages/HospitalWallet";
import HomeVisitServices from "./pages/HomeVisitServices";
import EmployeeRoles from "./pages/EmployeeRoles";
import Admins from "./pages/Admins";
import AddAdmin from "./pages/AddAdmin";
import UpdateAdmin from "./pages/UpdateAdmin";
import HospitalServicesDetails from "./pages/HospitalServicesDetails";
import HomeVisitBookingsDetails from "./pages/HomeVisitBookingsDetails";
import HomeVisitServiceBookingDetails from "./pages/HomeVisitServiceBookingDetails";
import CouponDetails from "./pages/CouponDetails";
import MedicalService from "./pages/MedicalService";
import MedicalServiceDetails from "./pages/MedicalServiceDetails";
import AllAnalysisPageServices from "./pages/AllAnalysisServices";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthMiddleware />,
    children: [
      {
        path: "",
        element: <RootLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "hospital-report/:hosId",
            element: (
              <PermissionWrapper
                permissionName="HospitalBookingsReport"
                hideOnNoPermission={true}
              >
                <HospitalReportDetails />
              </PermissionWrapper>
            ),
          },
          {
            path: "/whatsapp",
            element: (
              <PermissionWrapper
                permissionName="viewAnySettingWhatsapp"
                hideOnNoPermission={true}
              >
                <WhatsappPage />
              </PermissionWrapper>
            ),
          },
          {
            path: "/tebbie-communication",
            element: (
              <PermissionWrapper permissionName="homevisit-commissions-index">
                <TebbieCommunication />
              </PermissionWrapper>
            ),
          },
          {
            path: "/tebbie-wallet",
            element: (
              <PermissionWrapper permissionName="get-wallet">
                <TebbieWallet />
              </PermissionWrapper>
            ),
          },
          {
            path: "/hospital-wallet",
            element: (
              <PermissionWrapper permissionName="get-wallet-hospital">
                <HospitalWallet />
              </PermissionWrapper>
            ),
          },
          {
            path: "/home-visit-services",
            element: (
              <PermissionWrapper permissionName="home-visit-services-show">
                <HomeVisitServices />
              </PermissionWrapper>
            ),
          },
          {
            path: "/home-visit-report/:serviceId",
            element: (
              <PermissionWrapper permissionName="HomeVisitReport">
                <HomeVisitReportPage />
              </PermissionWrapper>
            ),
          },
          {
            path: "hospital-services-report/:hospitalId",
            element: (
              <PermissionWrapper
                permissionName="HospitalBookingsReport"
                hideOnNoPermission={true}
              >
                <HospitalServicesDetails />
              </PermissionWrapper>
            ),
          },
          {
            path: "home-visit-bookings-details/:hospitalId",
            element: (
              <PermissionWrapper
                permissionName="HomeVisitReport"
                hideOnNoPermission={true}
              >
                <HomeVisitBookingsDetails />
              </PermissionWrapper>
            ),
          },
          {
            path: "home-visit-service-booking-details/:hospitalId",
            element: (
              <PermissionWrapper
                permissionName="HomeVisitReport"
                hideOnNoPermission={true}
              >
                <HomeVisitServiceBookingDetails />
              </PermissionWrapper>
            ),
          },
          {
            path: "analysis-radiology-services",
            element: <AllAnalysisPageServices />,
          },
          {
            path: "medical-service",
            element: <MedicalService />,
          },
          {
            path: "medical-service/:id",
            element: <MedicalServiceDetails />,
          },
          {
            path: "/users-report/:userid",
            element: (
              <PermissionWrapper permissionName="UserDetails">
                <UserseportPage />
              </PermissionWrapper>
            ),
          },
          {
            path: "doctors",
            children: [
              { index: true, element: <Doctors /> },
              { path: ":doctorId", element: <DoctorDetails /> },
              {
                path: "update-doctor/:doctorId",
                element: (
                  <PermissionWrapper
                    permissionName="restoreDoctors"
                    hideOnNoPermission={true}
                  >
                    <UpdateDoctor />
                  </PermissionWrapper>
                ),
              },
              {
                path: "add-doctor",
                element: (
                  <PermissionWrapper
                    permissionName="restoreDoctors"
                    hideOnNoPermission={true}
                  >
                    <AddDoctor />
                  </PermissionWrapper>
                ),
              },
              {
                path: "trashed-doctors",
                element: (
                  <PermissionWrapper
                    permissionName="trashedDoctors"
                    hideOnNoPermission={true}
                  >
                    <TrashedDoctor />
                  </PermissionWrapper>
                ),
              },
            ],
          },
          {
            path: "hospitals",
            element: <HospitalLayout />,

            children: [
              {
                index: true,
                element: (
                  <PermissionWrapper
                    permissionName="ViewAnyHospitalDoctors"
                    hideOnNoPermission={true}
                  >
                    <Hospitals />
                  </PermissionWrapper>
                ),
              },
              {
                path: "update-hospital/:HospitalId",
                element: <UpdateHospital />,
              },
              {
                path: ":HospitalId",
                element: (
                  <PermissionWrapper
                    permissionName="ViewAnyHospitalDoctors"
                    hideOnNoPermission={true}
                  >
                    <HospitalDetails />
                  </PermissionWrapper>
                ),
              },
              {
                path: "trashed-hospitals",
                element: (
                  <PermissionWrapper
                    permissionName="trashedHospital"
                    hideOnNoPermission={true}
                  >
                    <TrashedHospital />
                  </PermissionWrapper>
                ),
              },
              { path: "add-hospital", element: <AddHospital /> },
            ],
          },
          // {
          //   path: "services",
          //   children: [
          //     { index: true, element: <Services /> },
          //     { path: ":servId", element: <UpdateService /> },
          //     { path: "add-service", element: <AddService /> },
          //   ],
          // },
          {
            path: "hospital-services",
            children: [
              {
                index: true,
                element: <HospitalServices />,
              },
              { path: "add", element: <AddHospitalService /> },
              { path: ":id", element: <UpdateHospitalService /> },
              {
                path: "main-services/add",
                element: <AddHospitalMainService />,
              },
              {
                path: "main-services/:id",
                element: <UpdateHospitalMainService />,
              },
              {
                path: "main-services/:mainServiceId/sub-services",
                element: <HospitalSubServices />,
              },
            ],
          },
          {
            path: "clinics",
            children: [
              {
                index: true,
                element: (
                  <PermissionWrapper permissionName="employees-index">
                    <Employees />
                  </PermissionWrapper>
                ),
              },
              {
                path: ":clinId",
                element: (
                  <PermissionWrapper permissionName="employees-update">
                    <UpdateEmployee />
                  </PermissionWrapper>
                ),
              },
            ],
          },
          {
            path: "employee-roles",
            element: (
              <PermissionWrapper permissionName="employees-store">
                <EmployeeRoles />
              </PermissionWrapper>
            ),
          },
          {
            path: "admins",
            children: [
              {
                index: true,
                element: (
                  <PermissionWrapper permissionName="employees-store">
                    <Admins />
                  </PermissionWrapper>
                ),
              },
              {
                path: "add-admin",
                element: (
                  <PermissionWrapper permissionName="employees-store">
                    <AddAdmin />
                  </PermissionWrapper>
                ),
              },
              {
                path: ":adminId",
                element: (
                  <PermissionWrapper permissionName="employees-store">
                    <UpdateAdmin />
                  </PermissionWrapper>
                ),
              },
            ],
          },
          {
            path: "admin-chat",
            element: (
              <PermissionWrapper
                permissionName="viewAnyChat"
                hideOnNoPermission={true}
              >
                <AdminChat />
              </PermissionWrapper>
            ),
          },
          {
            path: "specializations",
            children: [
              {
                index: true,
                element: (
                  <PermissionWrapper permissionName="viewAnyHospitalSpecialization">
                    <Specializations />
                  </PermissionWrapper>
                ),
              },
              {
                path: ":spId",
                element: (
                  <PermissionWrapper permissionName="restoreSpecialization">
                    <UpdateSpecial />
                  </PermissionWrapper>
                ),
              },
              {
                path: "add",
                element: (
                  <PermissionWrapper permissionName="restoreSpecialization">
                    <AddSpecial />
                  </PermissionWrapper>
                ),
              },
            ],
          },
          {
            path: "/send-notification",
            element: (
              <PermissionWrapper permissionName="sendNotification">
                <SendNotification />
              </PermissionWrapper>
            ),
          },

          {
            path: "coupons",
            element: (
              <PermissionWrapper permissionName="coupons-index">
                <Coupons />
              </PermissionWrapper>
            ),
          },
          {
            path: "coupons/:couponId",
            element: (
              <PermissionWrapper permissionName="coupons-show">
                <CouponDetails />
              </PermissionWrapper>
            ),
          },

          { path: "financial", element: <Financial /> },
          {
            path: "recharge-card",
            children: [
              {
                index: true,
                element: (
                  <PermissionWrapper permissionName="recharges-index">
                    <RechargeCards />
                  </PermissionWrapper>
                ),
              },
              {
                path: "add-card",
                element: (
                  <PermissionWrapper permissionName="recharges-store">
                    <AddCard />
                  </PermissionWrapper>
                ),
              },
            ],
          },
          {
            path: "common-questions",
            children: [
              { index: true, element: <CommonQuestions /> },
              { path: ":questionId", element: <UpdateCommonQuestions /> },
              { path: "add-question", element: <AddQuestion /> },
            ],
          },
          {
            path: "cities",
            children: [
              { index: true, element: <Cities /> },
              { path: ":cityId", element: <UpdateCity /> },
              { path: "add-city", element: <AddCity /> },
              {
                path: "trashed-cities",
                element: (
                  <PermissionWrapper
                    permissionName="trashedCity"
                    hideOnNoPermission={true}
                  >
                    <TrashedCity />
                  </PermissionWrapper>
                ),
              },
            ],
          },
          {
            path: "regions",
            children: [
              { index: true, element: <Regions /> },
              { path: ":regionId", element: <UpdateRegion /> },
              { path: "add-region", element: <AddRegion /> },
            ],
          },
          {
            path: "customer-service",
            children: [
              { index: true, element: <CustomerService /> },
              { path: ":customerId", element: <UpdateCustomerService /> },
              { path: "add-customer-service", element: <AddCustomerService /> },
            ],
          },
          { path: "profile", element: <Profile /> },
          {
            path: "sliders",
            children: [
              {
                index: true,
                element: (
                  <PermissionWrapper permissionName="sliders-index">
                    <Sliders />
                  </PermissionWrapper>
                ),
              },
              {
                path: ":sliderId",
                element: (
                  <PermissionWrapper permissionName="sliders-update">
                    <UpdateSlider />
                  </PermissionWrapper>
                ),
              },
              {
                path: "add-slider",
                element: (
                  <PermissionWrapper permissionName="sliders-store">
                    <AddSlider />
                  </PermissionWrapper>
                ),
              },
            ],
          },
          {
            path: "states",
            children: [
              { index: true, element: <States /> },
              {
                path: "trashed-state",
                element: (
                  <PermissionWrapper
                    permissionName="trashedStates"
                    hideOnNoPermission={true}
                  >
                    <TrashedState />
                  </PermissionWrapper>
                ),
              },
            ],
          },
          {
            path: "settings",
            children: [
              {
                index: true,
                element: (
                  <PermissionWrapper
                    permissionName="viewAnySetting"
                    hideOnNoPermission={true}
                  >
                    <Settings />
                  </PermissionWrapper>
                ),
              },
              { path: ":settingId", element: <EditSetting /> },
              { path: "add", element: <AddSetting /> },
            ],
          },
          {
            path: "request-Form",
            element: (
              <PermissionWrapper permissionName="viewAnyRequestForm">
                <RequestForm />
              </PermissionWrapper>
            ),
          },
          { path: "terms", element: <TermsAndConditions /> },
          {
            path: "refunds",
            children: [
              {
                index: true,
                element: (
                  <PermissionWrapper
                    permissionName="viewAnyRefundBooking"
                    hideOnNoPermission={true}
                  >
                    <Refunds />
                  </PermissionWrapper>
                ),
              },
              {
                path: ":refundsId",
                element: (
                  <PermissionWrapper
                    permissionName="viewRefundBooking"
                    hideOnNoPermission={true}
                  >
                    <RefundsDetails />
                  </PermissionWrapper>
                ),
              },
            ],
          },
          {
            path: "*",
            element: <NotFound />,
          },
        ],
      },
    ],
  },
  {
    path: "auth/login",
    element: <GuestMiddleware />,
    children: [{ index: true, element: <Login /> }],
  },
  {
    path: "/chat",
    element: <ChatOnlyMiddleware />,
    children: [
      {
        path: "",
        element: <ChatLayout />,
        children: [
          {
            index: true,
            element: (
              <PermissionWrapper
                permissionName="viewChat"
                hideOnNoPermission={true}
              >
                <ChatPage />
              </PermissionWrapper>
            ),
          },
          {
            path: "*",
            element: <NotFound />,
          },
        ],
      },
    ],
  },
]);

function App() {
  useFirebaseNotifications();

  return (
    <main>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <RouterProvider router={router} />
        </UserProvider>
      </QueryClientProvider>
    </main>
  );
}

export default App;
