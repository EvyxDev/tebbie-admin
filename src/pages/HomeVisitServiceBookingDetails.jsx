/* eslint-disable react/prop-types */
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";
import Pagination from "../components/Pagination";
import { getHomeVisitServiceBookingDetails } from "../utlis/https";
import { utils, writeFile } from "xlsx";
import { FaHome } from "react-icons/fa";

const HomeVisitServiceBookingDetails = () => {
  const token = localStorage.getItem("authToken");
  const { hospitalId } = useParams();
  const { t, i18n } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const statesPerPage = 10;

  const {
    data: bookings = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["home-visit-service-booking-details", token, hospitalId],
    queryFn: () =>
      getHomeVisitServiceBookingDetails({
        token,
        hospital_id: hospitalId,
      }),
    enabled: !!token && !!hospitalId,
    keepPreviousData: true,
  });

  const bookingsList = useMemo(
    () => (Array.isArray(bookings) ? bookings : []),
    [bookings]
  );

  const totalPages = Math.ceil((bookingsList.length || 0) / statesPerPage) || 1;
  const currentStates = useMemo(
    () =>
      bookingsList.slice(
        (currentPage - 1) * statesPerPage,
        currentPage * statesPerPage
      ),
    [bookingsList, currentPage, statesPerPage]
  );

  const serviceName = bookingsList[0]?.service_name || "";
  const hospitalName = bookingsList[0]?.hospital_name || "";

  const exportToExcel = () => {
    if (!bookingsList.length) return;
    try {
      const worksheet = utils.json_to_sheet(
        bookingsList.map((booking) => ({
          [t("booking_id")]: booking?.booking_id || t("Na"),
          [t("date")]: booking?.date || t("Na"),
          [t("time")]: `${booking?.start_from || t("Na")} - ${
            booking?.end_at || t("Na")
          }`,
          [t("patient_name")]: booking?.patient_name || t("Na"),
          [t("patient_phone")]: booking?.patient_phone || t("Na"),
          [t("service_name")]: booking?.service_name || t("Na"),
          [t("hospital_name")]: booking?.hospital_name || t("Na"),
          [t("price")]: booking?.price ?? t("Na"),
          [t("tabi_commission")]: booking?.tabi_commission ?? t("Na"),
          [t("hospital_commission")]: booking?.hospital_commission ?? t("Na"),
          [t("status")]: booking?.status || t("Na"),
          [t("payment_status")]: booking?.payment_status || t("Na"),
          [t("notes")]: booking?.notes || t("Na"),
        }))
      );
      const wb = utils.book_new();
      utils.book_append_sheet(wb, worksheet, "Service Bookings");
      writeFile(
        wb,
        `${serviceName || "Service"}_${
          hospitalName || "Hospital"
        }_Bookings.xlsx`
      );
    } catch (e) {
      // ignore if xlsx not available
    }
  };

  const renderStatus = (status) => {
    const normalized = String(status || "").toLowerCase();
    const commonClasses =
      "px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap";
    if (normalized === "completed" || normalized === "finished") {
      return (
        <span className={`bg-green-100 text-green-700 ${commonClasses}`}>
          {t("finished")}
        </span>
      );
    }
    if (normalized === "pending") {
      return (
        <span className={`bg-yellow-100 text-yellow-800 ${commonClasses}`}>
          {t("pending")}
        </span>
      );
    }
    if (normalized === "in_the_way") {
      return (
        <span className={`bg-blue-100 text-blue-700 ${commonClasses}`}>
          {t("in_the_way") || "In The Way"}
        </span>
      );
    }
    if (normalized === "cancelled" || normalized === "canceled") {
      return (
        <span className={`bg-red-100 text-red-700 ${commonClasses}`}>
          {t("cancelled")}
        </span>
      );
    }
    return (
      <span className={`bg-gray-100 text-gray-700 ${commonClasses}`}>
        {status || t("Na")}
      </span>
    );
  };

  const renderPaymentStatus = (paymentStatus) => {
    const normalized = String(paymentStatus || "").toLowerCase();
    const commonClasses =
      "px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap";
    if (normalized === "paid") {
      return (
        <span className={`bg-green-100 text-green-700 ${commonClasses}`}>
          {t("paid") || "Paid"}
        </span>
      );
    }
    if (normalized === "unpaid") {
      return (
        <span className={`bg-orange-100 text-orange-700 ${commonClasses}`}>
          {t("unpaid") || "Unpaid"}
        </span>
      );
    }
    return (
      <span className={`bg-gray-100 text-gray-700 ${commonClasses}`}>
        {paymentStatus || t("Na")}
      </span>
    );
  };

  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="p-4 sm:p-8 w-full mx-auto" dir={i18n.dir()}>
      <div className="bg-white min-h-screen p-4 rounded-2xl w-full overflow-x-auto ">
        <div className="flex flex-col sm:flex-row justify-between items-center my-4 gap-4">
          <h1 className="font-bold md:text-xl text-lg lg:text-2xl flex items-center gap-2 text-gray-800">
            <FaHome size={30} className="text-[#3CAB8B]" />
            {serviceName && hospitalName
              ? `${serviceName} - ${hospitalName}`
              : t("service_booking_details")}
          </h1>
          {bookingsList.length > 0 && (
            <button
              onClick={exportToExcel}
              className="px-6 h-10 flex items-center justify-center gap-2 bg-gradient-to-br from-[#33A9C7] to-[#3CAB8B] text-white rounded-lg hover:from-[#2A8AA7] hover:to-[#2F8B6B] focus:outline-none focus:ring-2 focus:ring-[#3CAB8B] transition-colors text-sm"
              aria-label={t("Excel-Export")}
              type="button"
            >
              {t("Excel-Export")}
            </button>
          )}
        </div>

        <div className="w-full rounded-lg border border-gray-200 bg-white shadow-sm overflow-x-auto">
          <div className="min-w-full">
            <table dir="rtl" className="min-w-[1200px] w-full bg-white text-sm">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="py-3 px-4 text-center transition-colors whitespace-nowrap border-b border-gray-200">
                    {t("patient_name")}
                  </th>
                  <th className="py-3 px-4 text-center transition-colors whitespace-nowrap border-b border-gray-200">
                    {t("patient_phone")}
                  </th>
                  <th className="py-3 px-4 text-center transition-colors whitespace-nowrap border-b border-gray-200">
                    {t("price")}
                  </th>
                  <th className="py-3 px-4 text-center transition-colors whitespace-nowrap border-b border-gray-200">
                    {t("tabi_commission")}
                  </th>
                  <th className="py-3 px-4 text-center transition-colors whitespace-nowrap border-b border-gray-200">
                    {t("hospital_commission")}
                  </th>
                  <th className="py-3 px-4 text-center transition-colors whitespace-nowrap border-b border-gray-200">
                    {t("status")}
                  </th>
                  <th className="py-3 px-4 text-center transition-colors whitespace-nowrap border-b border-gray-200">
                    {t("payment_status")}
                  </th>
                  <th className="py-3 px-4 text-center transition-colors whitespace-nowrap border-b border-gray-200">
                    {t("notes")}
                  </th>
                  <th className="py-3 px-4 text-center transition-colors whitespace-nowrap border-b border-gray-200">
                    {t("date")}
                  </th>
                  <th className="py-3 px-4 text-center transition-colors whitespace-nowrap border-b border-gray-200">
                    {t("time")}
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {isLoading ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center">
                      <Loader />
                    </td>
                  </tr>
                ) : currentStates.length > 0 ? (
                  currentStates.map((booking, index) => (
                    <tr
                      key={booking.booking_id || index}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-center">
                        <div className="max-w-[150px] truncate">
                          {booking.patient_name || t("Na")}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {booking.patient_phone || t("Na")}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {booking.price ?? t("Na")}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {booking.tabi_commission ?? t("Na")}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {booking.hospital_commission ?? t("Na")}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {renderStatus(booking.status)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {renderPaymentStatus(booking.payment_status)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div
                          className="max-w-[200px] truncate"
                          title={booking.notes}
                        >
                          {booking.notes || t("Na")}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {booking.date || t("Na")}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {booking.start_from && booking.end_at
                          ? `${booking.start_from} - ${booking.end_at}`
                          : t("Na")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-gray-500">
                      {t("noData")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {bookingsList.length > 0 && (
          <div className="flex justify-between items-end mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
            <p className="text-2xl text-gray-500 text-end">
              {t("Total")}: {bookingsList.length || 0}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeVisitServiceBookingDetails;
