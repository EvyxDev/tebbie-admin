/* eslint-disable react/prop-types */
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import ErrorMessage from "../../pages/ErrorMessage";
import { getHospitalsReport } from "../../utlis/https";
import { useTranslation } from "react-i18next";
import Pagination from "../Pagination";
import OneSelectDropdown from "../OneSelectDropdown";
import { CiHospital1 } from "react-icons/ci";
import DocotrReportTable from "./DocotrReportTable";
import { utils, writeFile } from "xlsx";
import { FaFileExcel } from "react-icons/fa";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeoutRef = useRef(null);

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeoutRef.current);
  }, [value, delay]);

  return debouncedValue;
};

const HospitalsReport = ({ hospitalsData }) => {
  const token = localStorage.getItem("authToken");
  const { t } = useTranslation();

  const [filters, setFilters] = useState({
    searchTerm: "",
    selectedHospital: null,
    fromDate: "",
    toDate: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const statesPerPage = 10;

  const [rawSearchTerm, setRawSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(rawSearchTerm, 300);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, searchTerm: debouncedSearchTerm }));
  }, [debouncedSearchTerm]);

  const {
    data: doctorData = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "doctors-Report",
      token,
      filters.selectedHospital,
      filters.fromDate,
      filters.toDate,
    ],
    queryFn: () =>
      getHospitalsReport({
        token,
        hospital_id: filters.selectedHospital,
        from_date: filters.fromDate,
        to_date: filters.toDate,
      }),
    enabled: !!token,
  });

  const hospitalOptions = useMemo(
    () =>
      hospitalsData?.map((hospital) => ({
        value: hospital.id,
        label: hospital.name,
      })),
    [hospitalsData],
  );

  const filteredData = useMemo(() => {
    if (!Array.isArray(doctorData)) return [];

    return doctorData.filter((review) => {
      const matchesSearch =
        !filters.searchTerm ||
        review.hospital_name
          ?.toLowerCase()
          .includes(filters.searchTerm.toLowerCase());
      const matchesUser =
        !filters.selectedUser || review.user_id === filters.selectedUser;
      return matchesSearch && matchesUser;
    });
  }, [doctorData, filters.searchTerm, filters.selectedUser]);

  const totalPages = Math.ceil(filteredData.length / statesPerPage) || 1;
  const currentStates = useMemo(
    () =>
      filteredData.slice(
        (currentPage - 1) * statesPerPage,
        currentPage * statesPerPage,
      ),
    [filteredData, currentPage],
  );

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      searchTerm: "",
      selectedHospital: null,
      selectedUser: null,
      fromDate: "",
      toDate: "",
    });
    setRawSearchTerm("");
    setCurrentPage(1);
  }, []);

  const exportToExcel = () => {
    if (!filteredData.length) return;
    const worksheet = utils.json_to_sheet(
      filteredData.map((data) => ({
        [t("hospital")]: data?.hospital_name || t("Na"),
        [t("total_bookings")]: data?.total_count ?? t("Na"),
        [t("avg_rating")]: data?.avg_rating ?? undefined,
      })),
    );
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Hospital Report");
    writeFile(
      workbook,
      `Hospital_Report_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="p-4 flex flex-col gap-4 font-sans">
      <div className="flex items-center justify-between gap-2 mb-1">
        <p className="font-bold text-xl md:text-2xl flex gap-2 items-center">
          <CiHospital1 size={30} className="text-[#3CAB8B]" />
          {t("hospitalReport")}
        </p>
        {filteredData.length > 0 && (
          <button
            onClick={exportToExcel}
            className="px-6 h-10 flex items-center gap-2 bg-gradient-to-br from-[#33A9C7] to-[#3CAB8B] text-white rounded-lg hover:from-[#2A8AA7] hover:to-[#2F8B6B] focus:outline-none focus:ring-2 focus:ring-[#3CAB8B] transition-colors text-sm"
            aria-label={t("Excel-Export")}
            type="button"
          >
            {t("Excel-Export")} <FaFileExcel aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="flex xl:flex-row flex-col gap-4">
        <input
          type="text"
          placeholder={t("search")}
          value={rawSearchTerm}
          onChange={(e) => setRawSearchTerm(e.target.value)}
          className="md:w-1/2 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="md:w-1/2 w-full">
          <OneSelectDropdown
            options={hospitalOptions}
            onChange={(value) => handleFilterChange("selectedHospital", value)}
            selectedValues={
              filters.selectedHospital ? [filters.selectedHospital] : []
            }
            placeholder={t("selectHospital")}
            searchPlaceholder={t("search")}
            fallbackMessage={t("noUsersFound")}
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3">
          <label className="block mb-1 text-sm font-medium">
            {t("fromDate")}
          </label>
          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) => handleFilterChange("fromDate", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="w-full md:w-1/3">
          <label className="block mb-1 text-sm font-medium">
            {t("toDate")}
          </label>
          <input
            type="date"
            value={filters.toDate}
            onChange={(e) => handleFilterChange("toDate", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="md:w-1/3 flex justify-end items-end">
          <button
            onClick={clearFilters}
            className="text-xl bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] p-2 text-white rounded-xl font-semibold w-full max-w-48"
          >
            {t("clearFilter")}
          </button>
        </div>
      </div>
      <DocotrReportTable
        translation="hospital"
        currentStates={currentStates}
        isLoading={isLoading}
      />
      {filteredData.length > 10 && (
        <div className="flex justify-between items-end mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          <p className="text-2xl text-gray-500 text-end">
            {t("Total")}: {filteredData.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default HospitalsReport;
