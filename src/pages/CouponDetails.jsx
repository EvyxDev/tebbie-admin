import { getSpecificCoupon } from "../utlis/https";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Mail, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import CouponSearch from "./CouponSearch";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "./Loader";

const CouponDetails = () => {
  const { couponId } = useParams();
  const token = localStorage.getItem("authToken");
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsage, setFilteredUsage] = useState([]);

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

  const handleSearch = () => {
    // if (searchTerm.length === 0) return toast.error(t("coupon_search_alert"));
    const filteredUsers = coupon?.usage.filter((user) =>
      user.user_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsage(filteredUsers);
  };

  if (isLoading) return <Loader />;
  if (error) return toast.error(error.message);

  return (
    <div className=" py-10 w-[83%] mx-auto" dir={isArabic ? "rtl" : "ltr"}>
      {filteredUsage && (
        <CouponSearch
          handleSearch={handleSearch}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      )}

      <div className="gap-5 space-y-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredUsage && filteredUsage.length > 0
          ? filteredUsage.map((user) => (
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
