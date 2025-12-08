import { getSpecificCoupon } from "../utlis/https";
import { useQuery } from "@tanstack/react-query";
import { Calendar, FileSpreadsheet, Mail, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import CouponSearch from "./CouponSearch";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Loader from "./Loader";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
// used_at
const CouponDetails = () => {
  const { couponId } = useParams();
  const token = localStorage.getItem("authToken");
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsage, setFilteredUsage] = useState([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const {
    data: coupon,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["coupons-details", couponId],
    queryFn: () => getSpecificCoupon({ id: couponId, token }),
  });

  useEffect(() => {
    if (coupon?.usage) {
      setFilteredUsage(coupon.usage);
    }
  }, [coupon]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(coupon?.usage);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "users.xlsx");
  };

  const filterByDateRange = useCallback(
    (cards) => {
      if (!dateFrom && !dateTo) return cards;

      return cards.filter((card) => {
        if (!card.used_at) return false;

        const cardDate = new Date(card.used_at);
        cardDate.setHours(0, 0, 0, 0);

        if (dateFrom && dateTo) {
          const fromDate = new Date(dateFrom);
          fromDate.setHours(0, 0, 0, 0);
          fromDate.setDate(fromDate.getDate());

          const toDate = new Date(dateTo);
          toDate.setHours(23, 59, 59, 999);
          toDate.setDate(toDate.getDate());

          return cardDate >= fromDate && cardDate <= toDate;
        } else if (dateFrom) {
          const fromDate = new Date(dateFrom);
          fromDate.setHours(0, 0, 0, 0);
          fromDate.setDate(fromDate.getDate());
          const now = new Date();
          now.setHours(23, 59, 59, 999);

          return cardDate >= fromDate && cardDate <= now;
        } else if (dateTo) {
          const toDate = new Date(dateTo);
          toDate.setHours(23, 59, 59, 999);
          toDate.setDate(toDate.getDate());

          return cardDate <= toDate;
        }

        return true;
      });
    },
    [dateFrom, dateTo]
  );

  const handleSearch = () => {
    // if (searchTerm.length === 0) return toast.error(t("coupon_search_alert"));
    const filteredUsers = coupon?.usage.filter((user) =>
      user.user_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsage(filteredUsers);
  };

  // Apply date range filter AFTER search filter
  const filteredByDate = useMemo(() => {
    return filterByDateRange(filteredUsage);
  }, [filteredUsage, dateFrom, dateTo]);

  const handleDateFromChange = (e) => {
    setDateFrom(e.target.value);
  };

  const handleDateToChange = (e) => {
    setDateTo(e.target.value);
  };

  if (isLoading) return <Loader />;
  if (error) return toast.error(error.message);

  return (
    <div className="py-10 w-[83%] mx-auto" dir={isArabic ? "rtl" : "ltr"}>
      {filteredUsage && (
        <div className="bg-white mb-5 p-10 rounded-md">
          <div className="flex flex-col md:flex-row justify-between items-start">
            <CouponSearch
              handleSearch={handleSearch}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />

            <div className="w-[15%]">
              <button
                onClick={exportToExcel}
                className="px-5 w-full md:w-auto py-2.5 hover:bg-[#048c87] flex justify-center items-center text-white gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-md rounded-[8px] focus:outline-none text-center"
              >
                {t("coupon_excel_export")}
                <span>
                  <FileSpreadsheet />
                </span>
              </button>
            </div>
          </div>

          <div className="mt-3 md:-mt-6 flex w-full flex-col gap-4 md:flex-row items-center">
            <div className="flex-1 w-full">
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
            <div className="flex-1 w-full">
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
        </div>
      )}

      <div className="gap-5 space-y-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredByDate && filteredByDate.length > 0
          ? filteredByDate.map((user) => (
              <div
                key={user.id}
                className="px-4 py-5 bg-white text-gray-700 text-sm rounded-lg shadow-md"
              >
                <h3 className="text-center font-bold text-xl mb-3">
                  {t("user_Info")}
                </h3>
                <div className="flex gap-2 mb-3 items-center">
                  <span>
                    <User size={17} />
                  </span>
                  <h2 className="font-bold">{user.user_name}</h2>
                </div>
                <div className="flex gap-2 mb-3 items-center">
                  <span>
                    <Mail size={17} />
                  </span>
                  <h2 className="font-bold">{user.user_email}</h2>
                </div>
                <div className="flex gap-2 items-center">
                  <span>
                    <Calendar size={17} />
                  </span>
                  <h2 className="font-bold">{user.used_at}</h2>
                </div>
              </div>
            ))
          : t("coupon_exist")}
      </div>
    </div>
  );
};

export default CouponDetails;
