/* eslint-disable react/prop-types */
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelBooking, getHospitalReport } from "../utlis/https";
import { useTranslation } from "react-i18next";
import { CiHospital1 } from "react-icons/ci";
import { FaFileExcel } from "react-icons/fa";
import { utils, writeFile } from "xlsx";
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";
import { useParams } from "react-router-dom";
import Pagination from "../components/Pagination";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const HospitalReportDetails = () => {
  const token = localStorage.getItem("authToken");
  const { t, i18n } = useTranslation();
  const { hosId } = useParams();
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const statesPerPage = 10;

  const {
    data: hospitalData = { hospital_name: "", bookings: [] },
    isLoading,
    error,
  } = useQuery({
    queryKey: ["hospital-Report", token, hosId, fromDate, toDate, activeTab],
    queryFn: () =>
      getHospitalReport({
        token,
        hospital_id: hosId,
        from_date: fromDate,
        to_date: toDate,
        status: activeTab,
      }),
    enabled: !!token,
    select: (data) => data,
  });

  console.log(hospitalData);

  // Pagination logic
  const indexOfLastState = currentPage * statesPerPage;
  const indexOfFirstState = indexOfLastState - statesPerPage;
  const currentStates = hospitalData.bookings.slice(
    indexOfFirstState,
    indexOfLastState,
  );
  const totalPages =
    hospitalData.bookings.length > 0
      ? Math.ceil(hospitalData.bookings.length / statesPerPage)
      : 0;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Reset to first page when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const { mutate: CancelBooking } = useMutation({
    mutationFn: async (id) => {
      return cancelBooking({ bookingId: id, token });
    },
    onSuccess: () => {
      toast.success(t("booking_deleted"));
      queryClient.invalidateQueries(["hospital-Report"]);
    },
    onError: () => {
      toast.error("حدث خطأ ما");
    },
  });

  const handleCancelBooking = (id) => {
    CancelBooking(id);
  };

  const handleCancelBookingConfirm = (bookingId) => {
    Swal.fire({
      title: t("are_you_sure"),
      text: t("cannotRestoreBookingAfterCancel"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3CAB8B",
      cancelButtonColor: "#d33",
      confirmButtonText: t("cancel_booking"),
      cancelButtonText: t("close"),
    }).then((result) => {
      if (result.isConfirmed) {
        handleCancelBooking(bookingId);
        Swal.fire({
          title: t("canceled"),
          text: t("bookingCanceledSuccessfully"),
          icon: "success",
          confirmButtonColor: "#3CAB8B",
        });
      }
    });
  };

  // Excel export function
  const exportToExcel = () => {
    const worksheet = utils.json_to_sheet(
      hospitalData.bookings.map((data) => ({
        [t("user_nameReport")]: data.user_name || t("Na"),
        [t("patientName")]: data.patient_name || t("Na"),
        [t("phone")]: data.patient_phone || t("Na"),
        [t("doctorName")]: data.doctor_name || t("Na"),
        [t("payment_method")]: data.payment_method || t("Na"),
        [t("payment_status")]: data.booking_status || t("Na"),
        [t("status")]: data.payment_status || t("Na"),
        [t("cancellation_reason")]: data.cancellation_reason || t("Na"),
        [t("tabi_commission")]: data.tabi_commission || t("Na"),
        [t("hospital_commission")]: data.hospital_commission || t("Na"),
        [t("original_price")]: data.original_price || t("Na"),
        [t("discount_amount")]: data.discount_amount || t("Na"),
        [t("final_price")]: data.final_price || t("Na"),
        [t("booking_date")]: data.booking_date || t("Na"),
      })),
    );
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Hospital Report");
    writeFile(
      workbook,
      `${hospitalData.hospital_name}_Report_${activeTab}.xlsx`,
    );
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <ErrorMessage message={error.message} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 w-full mx-auto" dir={i18n.dir()}>
      <div className="bg-white min-h-screen p-4 rounded-2xl w-full overflow-x-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center my-4 gap-4">
          <h1 className="font-bold md:text-xl text-lg lg:text-2xl flex items-center gap-2 text-gray-800">
            <CiHospital1
              size={35}
              className="text-[#3CAB8B]"
              aria-hidden="true"
            />
            {t("hospitalReport")}
            {hospitalData.hospital_name
              ? `- ${hospitalData.hospital_name}`
              : ""}
          </h1>
          <div className="flex flex-col justify-end items-end md:flex-row gap-4">
            <div className="w-full">
              <label className="block mb-1 text-sm font-medium">
                {t("fromDate")}
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full">
              <label className="block mb-1 text-sm font-medium">
                {t("toDate")}
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {currentStates.length > 0 && (
              <button
                onClick={exportToExcel}
                className="px-6 h-12 shrink-0 flex items-center gap-2 bg-gradient-to-br from-[#33A9C7] to-[#3CAB8B] text-white rounded-lg hover:from-[#2A8AA7] hover:to-[#2F8B6B] focus:outline-none focus:ring-2 focus:ring-[#3CAB8B] transition-colors text-base sm:text-lg"
                aria-label={t("Excel-Export")}
              >
                {t("Excel-Export")}
                <FaFileExcel aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => handleTabChange("active")}
            className={`px-4 py-2 rounded-md transition ${
              activeTab === "active"
                ? "bg-[#3CAB8B] text-white shadow"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            الحجوزات النشطة
          </button>
          <button
            onClick={() => handleTabChange("cancelled")}
            className={`px-4 py-2 rounded-md transition ${
              activeTab === "cancelled"
                ? "bg-[#3CAB8B] text-white shadow"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            الحجوزات الملغية
          </button>
        </div>

        <div className="overflow-x-auto lg:w-full md:w-[100vw] w-[90vw] rounded-lg">
          <table
            className="w-full border border-gray-200 bg-white text-sm"
            aria-label={t("hospitalReportTable")}
          >
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                {[
                  "user_nameReport",
                  "patientName",
                  "phone",
                  "doctorName",
                  "payment_method",
                  "status",
                  "payment_status",
                  "cancellation_reason",
                  "tabi_commission",
                  "hospital_commission",
                  "original_price",
                  "discount_amount",
                  "final_price",
                  "booking_date",
                  "",
                ].map((key) => (
                  <th
                    key={key}
                    className="py-3 px-3 text-center transition-colors"
                    scope="col"
                  >
                    {t(key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center">
                    <Loader />
                  </td>
                </tr>
              ) : currentStates.length > 0 ? (
                currentStates.map((data, index) => (
                  <tr
                    key={data.booking_id || index}
                    className={`border-b border-gray-200 transition-colors ${
                      data.booking_status === "cancelled" ? "bg-red-50" : ""
                    }`}
                  >
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {data.user_name || t("Na")}
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {data.patient_name || t("Na")}
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {data.patient_phone || t("Na")}
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {data.doctor_name || t("Na")}
                    </td>
                    <td>{data.payment_method || t("Na")}</td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <p
                        className={`p-2 ${
                          data.booking_status === "cancelled"
                            ? "bg-red-400 text-white rounded-full"
                            : data.booking_status === "finished"
                              ? "bg-green-400 text-white rounded-full"
                              : "bg-blue-400 text-white rounded-full"
                        }`}
                      >
                        {t(data.booking_status)}
                      </p>
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <p
                        className={`p-2 ${
                          data.payment_status === "unpaid"
                            ? "bg-red-400 text-white rounded-full"
                            : data.payment_status === "paid"
                              ? "bg-green-400 text-white rounded-full"
                              : "bg-gray-400 text-white rounded-full"
                        }`}
                      >
                        {t(data.payment_status) || t("Na")}
                      </p>
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {data.cancellation_reason || t("Na")}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {data.tabi_commission || t("Na")}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {data.hospital_commission || t("Na")}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {data.original_price || t("Na")}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {data.discount_amount || t("Na")}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {data.final_price || t("Na")}
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {data.booking_date || t("Na")}
                    </td>
                    {activeTab !== "cancelled" && (
                      <td className="whitespace-nowrap py-3 px-3">
                        {data.booking_status !== "cancelled" && (
                          <button
                            onClick={() =>
                              handleCancelBookingConfirm(data.booking_id)
                            }
                            className="px-4 py-2 flex items-center gap-2 bg-gradient-to-br from-[#33A9C7] to-[#3CAB8B] text-white rounded-lg hover:from-[#2A8AA7] hover:to-[#2F8B6B] focus:outline-none focus:ring-2 focus:ring-[#3CAB8B] transition-colors text-sm"
                          >
                            {t("cancel_booking")}
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-gray-500">
                    {t("noData")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {hospitalData.bookings.length > 1 && (
          <div className="flex justify-between items-end mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
            <p className="text-2xl text-gray-500 text-end">
              {t("Total")}: {hospitalData.bookings.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalReportDetails;
