import { useQuery } from "@tanstack/react-query";
import { getRechargeCards } from "../utlis/https";
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";
import { IoCardOutline } from "react-icons/io5";
import { useState, useEffect, useCallback } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { Link } from "react-router-dom";
import { FaFileExcel } from "react-icons/fa";
import { utils, writeFile } from "xlsx";
import { useTranslation } from "react-i18next";
import RechargeCardsPagination from "../components/RechargeCardsPagination";
import {
  hasPermission,
  getPermissionDisplayName,
} from "../utlis/permissionUtils";
import { toast } from "react-toastify";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const RechargeCards = () => {
  const token = localStorage.getItem("authToken");
  const [searchTerm, setSearchTerm] = useState("");
  const [isValid, setIsValid] = useState(undefined);
  const [expireDate, setExpireDate] = useState("");
  const [price, setPrice] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const debouncedBatchNumber = useDebounce(batchNumber, 500);
  const itemsPerPage = 100;
  const { t, i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const {
    data: cardData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "recharge-card",
      token,
      debouncedSearchTerm,
      isValid,
      expireDate,
      price,
      debouncedBatchNumber,
    ],
    queryFn: () =>
      getRechargeCards({
        token,
        card_number: debouncedSearchTerm,
        is_valid: isValid,
        expire_date: expireDate,
        price: price,
        batch_number: debouncedBatchNumber,
      }),
  });

  // Client-side date filtering function
  const filterByDateRange = useCallback(
    (cards) => {
      if (!dateFrom && !dateTo) return cards;

      return cards.filter((card) => {
        if (!card.created_at) return false;

        const cardDate = new Date(card.created_at);
        cardDate.setHours(0, 0, 0, 0);

        if (dateFrom && dateTo) {
          const fromDate = new Date(dateFrom);
          fromDate.setHours(0, 0, 0, 0);
          fromDate.setDate(fromDate.getDate() - 1);

          const toDate = new Date(dateTo);
          toDate.setHours(23, 59, 59, 999);
          toDate.setDate(toDate.getDate() + 1);

          return cardDate >= fromDate && cardDate <= toDate;
        } else if (dateFrom) {
          const fromDate = new Date(dateFrom);
          fromDate.setHours(0, 0, 0, 0);
          fromDate.setDate(fromDate.getDate() - 1);

          const now = new Date();
          now.setHours(23, 59, 59, 999);

          return cardDate >= fromDate && cardDate <= now;
        } else if (dateTo) {
          const toDate = new Date(dateTo);
          toDate.setHours(23, 59, 59, 999);
          toDate.setDate(toDate.getDate() + 1);

          return cardDate <= toDate;
        }

        return true;
      });
    },
    [dateFrom, dateTo]
  );

  const handleExport = () => {
    if (!hasPermission("exportRechargeCard")) {
      toast.error(
        `You don't have permission to ${getPermissionDisplayName(
          "exportRechargeCard"
        )}`
      );
      return;
    }

    // Export ALL filtered rows (client-side filtered)
    const allRows = Array.isArray(cardData?.data) ? cardData.data : [];
    const filteredRows = filterByDateRange(allRows);
    if (!filteredRows.length) {
      toast.error(t("noCardsFound"));
      return;
    }

    try {
      const worksheet = utils.json_to_sheet(
        filteredRows.map((row) => ({
          [t("cardNumber")]: row.card_number,
          [t("validatity")]: row.is_valid === 1 ? t("valid") : t("invalid"),
          [t("expireDate")]: row.expire_date || "",
          [t("price")]: row.price ?? "",
          [t("batchNumber")]: row.batch_number ?? "",
          [t("usedAt")]: row.used_at
            ? new Date(row.used_at).toLocaleString()
            : "",
          [t("usedBy")]: row.used_by || "",
        }))
      );
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, "Recharge Cards");
      writeFile(
        workbook,
        `Recharge_Cards_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
    } catch (e) {
      toast.error(t("error") || "Export failed");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleIsValidChange = (e) => {
    const value = e.target.value;
    setIsValid(value === "" ? undefined : Number(value));
    setCurrentPage(1);
  };

  const handleExpireDateChange = (e) => {
    setExpireDate(e.target.value);
    setCurrentPage(1);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
    setCurrentPage(1);
  };

  const handleBatchNumberChange = (e) => {
    setBatchNumber(e.target.value);
    setCurrentPage(1);
  };

  const handleDateFromChange = (e) => {
    setDateFrom(e.target.value);
    setCurrentPage(1);
  };

  const handleDateToChange = (e) => {
    setDateTo(e.target.value);
    setCurrentPage(1);
  };

  if (error) {
    return <ErrorMessage />;
  }

  const allCards = Array.isArray(cardData?.data) ? cardData.data : [];
  const filteredList = filterByDateRange(allCards);
  const totalItems = filteredList.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredList.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  return (
    <section dir={direction} className="container mx-auto lg:p-6 p-4 w-full">
      <div className="flex justify-end md:flex-row flex-col gap-2 items-center">
        {hasPermission("recharges-store") && (
          <Link
            to={"/recharge-card/add-card"}
            className="px-6 py-2 hover:bg-[#048c87] flex justify-center items-center text-white gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg rounded-[8px] focus:outline-none text-center"
          >
            {t("AddCard")}
            <IoMdAddCircle />
          </Link>
        )}
        {hasPermission("exportRechargeCard") && (
          <button
            onClick={handleExport}
            className="px-6 py-2 border-[#048c87] border-2  text-[#048c87] text-lg rounded-[8px]  flex justify-center items-center gap-2"
          >
            {t("Excel-Export")}
            <FaFileExcel />
          </button>
        )}
      </div>
      <div className="my-4 flex flex-col gap-4 md:flex-row md:items-center flex-wrap">
        <div className="flex-1">
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={t("searchByCardNumber")}
            className="w-full p-2 border border-gray-300 rounded-lg py-3 px-4 bg-white h-[50px] focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex-1">
          <select
            id="isValid"
            value={isValid === undefined ? "" : isValid}
            onChange={handleIsValidChange}
            className="w-full p-2 border border-gray-300 rounded-lg py-3 px-4 bg-white h-[50px] focus:outline-none focus:border-primary"
          >
            <option value="">{t("allCards")}</option>
            <option value="1">{t("validCards")}</option>
            <option value="0">{t("invalidCards")}</option>
          </select>
        </div>
        <div className="flex-1">
          <input
            type="date"
            id="expireDate"
            value={expireDate}
            onChange={handleExpireDateChange}
            placeholder={t("selectExpireDate")}
            className="w-full p-2 border border-gray-300 rounded-lg py-3 px-4 bg-white h-[50px] focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex-1">
          <input
            type="number"
            id="price"
            value={price}
            onChange={handlePriceChange}
            placeholder={t("price")}
            className="w-full p-2 border border-gray-300 rounded-lg py-3 px-4 bg-white h-[50px] focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex-1">
          <input
            type="text"
            id="batchNumber"
            value={batchNumber}
            onChange={handleBatchNumberChange}
            placeholder={t("searchByBatchNumber")}
            className="w-full p-2 border border-gray-300 rounded-lg py-3 px-4 bg-white h-[50px] focus:outline-none focus:border-primary"
          />
        </div>
      </div>
      <div className="my-4 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <label
            htmlFor="dateFrom"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("date_from")}
          </label>
          <input
            type="date"
            id="dateFrom"
            value={dateFrom}
            onChange={handleDateFromChange}
            className="w-full p-2 border border-gray-300 rounded-lg py-3 px-4 bg-white h-[50px] focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor="dateTo"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("date_to")}
          </label>
          <input
            type="date"
            id="dateTo"
            value={dateTo}
            onChange={handleDateToChange}
            className="w-full p-2 border border-gray-300 rounded-lg py-3 px-4 bg-white h-[50px] focus:outline-none focus:border-primary"
          />
        </div>
      </div>
      <div className="overflow-x-auto md:w-full w-[90vw] h-[70vh] overflow-auto">
        <table className="bg-white border border-gray-200 rounded-lg w-full border-spacing-0">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-start">#</th>
              <th className="py-3 px-6 text-left">{t("cardNumber")}</th>
              <th className="py-3 px-6 text-left">{t("validatity")}</th>
              <th className="py-3 px-6 text-left  whitespace-nowrap">
                {t("expireDate")}
              </th>
              <th className="py-3 px-6 text-left whitespace-nowrap">
                {t("price")}
              </th>
              <th className="py-3 px-6 text-left whitespace-nowrap">
                {t("batchNumber")}
              </th>
              <th className="py-3 px-6 text-left whitespace-nowrap">
                {t("usedAt")}
              </th>
              <th className="py-3 px-6 text-left whitespace-nowrap">
                {t("usedBy")}
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 md:text-lg text-md font-light">
            {isLoading ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  <Loader />
                </td>
              </tr>
            ) : filteredList.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-4 text-gray-500 text-lg"
                >
                  {t("noCardsFound")}
                </td>
              </tr>
            ) : (
              currentItems.map((card, index) => (
                <tr
                  key={card.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left flex items-center gap-3">
                    {index + 1 + startIndex}
                    <IoCardOutline size={30} className="text-gray-500" />
                  </td>
                  <td className="py-3 px-6 text-left">{card.card_number}</td>
                  <td className="py-3 px-6 text-left shrink-0 whitespace-nowrap">
                    <span
                      className={`font-semibold text-white rounded-full py-1 text-sm px-2  whitespace-nowrap ${
                        card.is_valid === 1
                          ? "bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white"
                          : "bg-red-600"
                      }`}
                    >
                      {card.is_valid === 1 ? t("valid") : t("invalid")}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {card.expire_date}
                  </td>
                  <td className="py-3 px-6 text-left">{card.price}</td>
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {card.batch_number || t("Na")}
                  </td>
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {card.used_at
                      ? new Date(card.used_at).toLocaleString()
                      : t("Na")}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {card.used_by || t("Na")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-end gap-4 flex-wrap p-4">
        <RechargeCardsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        <p className="md:text-2xl text-xl text-gray-500 text-end">
          {t("total")} : {totalItems}
        </p>
      </div>
    </section>
  );
};

export default RechargeCards;
