/* eslint-disable react/prop-types */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import Loader from "../pages/Loader";
import { utils, writeFile } from "xlsx";
import { FaFileExcel } from "react-icons/fa6";
import { FaPlus, FaEdit } from "react-icons/fa";
import AddHomeVisitServiceDialog from "./AddHomeVisitServiceDialog";
import { getHospitals } from "../utlis/https";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Button,
} from "@mui/material";

const HomeVisitServicesTable = ({
  currentStates,
  isLoading,
  servicesData,
  onFilterChange,
}) => {
  const { t } = useTranslation();
  const token = localStorage.getItem("authToken");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [hospitalFilter, setHospitalFilter] = useState("");

  // Fetch hospitals for filter
  const { data: hospitalsData } = useQuery({
    queryKey: ["hospitals"],
    queryFn: () => getHospitals({ token }),
  });

  // Handle hospital filter change
  const handleHospitalFilterChange = (value) => {
    setHospitalFilter(value);
    onFilterChange(value);
  };

  // Get type display text
  const getTypeText = (type) => {
    const typeNum = parseInt(type);
    switch (typeNum) {
      case 1:
        return t("doctor");
      case 2:
        return t("nursing");
      case 3:
        return t("physical_therapy");
      default:
        return type;
    }
  };

  // Get status display text
  const getStatusText = (status) => {
    return status === "active" ? t("active") : t("inactive");
  };

  // Get status color
  const getStatusColor = (status) => {
    return status === "active" ? "text-green-600" : "text-red-600";
  };

  const exportToExcel = () => {
    if (!servicesData?.data?.length) return;

    const worksheet = utils.json_to_sheet(
      servicesData.data.map((data) => ({
        [t("hospital_name")]: data?.hospital?.name || t("Na"),
        [t("service_name")]: data?.name || t("Na"),
        [t("service_type")]: getTypeText(data?.type),
        [t("price")]: data?.price
          ? `$${parseFloat(data.price).toFixed(2)}`
          : t("Na"),
        [t("status")]: getStatusText(data?.status),
      }))
    );

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Home Visit Services");
    writeFile(workbook, "Home_Visit_Services_Report.xlsx");
  };

  return (
    <div className="w-full">
      {!isLoading && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-10 mb-5">
          <div className="flex gap-3">
            <button
              onClick={() => setIsDialogOpen(true)}
              className="px-6 h-10 flex items-center justify-center gap-2 bg-gradient-to-br from-[#10B981] to-[#059669] text-white rounded-lg hover:from-[#0D9B6B] hover:to-[#047857] focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-colors text-sm whitespace-nowrap"
              aria-label={t("add_service")}
              type="button"
            >
              <FaPlus aria-hidden="true" />
              {t("add_service")}
            </button>
            {servicesData?.data?.length > 0 && (
              <button
                onClick={exportToExcel}
                className="px-6 h-10 flex items-center justify-center gap-2 bg-gradient-to-br from-[#33A9C7] to-[#3CAB8B] text-white rounded-lg hover:from-[#2A8AA7] hover:to-[#2F8B6B] focus:outline-none focus:ring-2 focus:ring-[#3CAB8B] transition-colors text-sm whitespace-nowrap"
                aria-label={t("Excel-Export")}
                type="button"
              >
                <FaFileExcel aria-hidden="true" />
                {t("Excel-Export")}
              </button>
            )}
          </div>
          <p className="font-bold text-xl md:text-2xl flex gap-2 items-center">
            {t("home_visit_services")}
          </p>
        </div>
      )}

      {/* Hospital Filter */}
      {!isLoading && (
        <Box
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 2,
          }}
        >
          {hospitalFilter && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleHospitalFilterChange("")}
              sx={{ minWidth: "auto" }}
            >
              {t("clear_filters")}
            </Button>
          )}
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel id="hospital-filter-label">
              {t("filter_by_hospital")}
            </InputLabel>
            <Select
              labelId="hospital-filter-label"
              value={hospitalFilter}
              label={t("filter_by_hospital")}
              onChange={(e) => handleHospitalFilterChange(e.target.value)}
              sx={{ direction: "rtl" }}
            >
              <MenuItem value="">
                <em>{t("all_hospitals")}</em>
              </MenuItem>
              {hospitalsData?.map((hospital) => (
                <MenuItem key={hospital.id} value={hospital.id.toString()}>
                  {hospital.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      {/* Scrollable table container */}
      <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-scroll">
          <table dir="rtl" className="w-full overflow-x-scroll">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-4 text-center whitespace-nowrap border-b border-gray-200">
                  {t("hospital_name")}
                </th>
                <th className="py-3 px-4 text-center whitespace-nowrap border-b border-gray-200">
                  {t("service_name")}
                </th>
                <th className="py-3 px-4 text-center whitespace-nowrap border-b border-gray-200">
                  {t("service_type")}
                </th>
                <th className="py-3 px-4 text-center whitespace-nowrap border-b border-gray-200">
                  {t("hospital_price")}
                </th>
                <th className="py-3 px-4 text-center whitespace-nowrap border-b border-gray-200">
                  {t("tabi_price")}
                </th>
                <th className="py-3 px-4 text-center whitespace-nowrap border-b border-gray-200">
                  {t("status")}
                </th>
                <th className="py-3 px-4 text-center whitespace-nowrap border-b border-gray-200">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 md:text-lg text-md font-light">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-8 px-6 text-center">
                    <Loader />
                  </td>
                </tr>
              ) : currentStates?.length > 0 ? (
                currentStates.map((data, index) => (
                  <tr
                    key={data.id || index}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 flex items-end">
                      <span className="px-2 py-1 rounded-full text-sm font-medium">
                        {data?.hospital_name || t("Na")}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                        {data?.name || t("Na")}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                        {getTypeText(data?.type)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
                        {data?.hospital_price
                          ? `$${parseFloat(data.hospital_price).toFixed(2)}`
                          : t("Na")}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
                        {data?.tabi_price
                          ? `$${parseFloat(data.tabi_price).toFixed(2)}`
                          : t("Na")}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          data?.status
                        )}`}
                      >
                        {getStatusText(data?.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          setEditData(data);
                          setIsDialogOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title={t("edit")}
                      >
                        <FaEdit size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="py-8 px-6 text-center text-gray-500"
                  >
                    {t("noData")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Service Dialog */}
      <AddHomeVisitServiceDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditData(null);
        }}
        editData={editData}
      />
    </div>
  );
};

export default HomeVisitServicesTable;
