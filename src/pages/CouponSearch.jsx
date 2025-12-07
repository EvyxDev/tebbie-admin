import { FileSpreadsheet, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const CouponSearch = ({
  exportToExcel,
  handleSearch,
  setSearchTerm,
  searchTerm,
}) => {
  const { t, i18n } = useTranslation();
  return (
    <div className="w-full flex justify-between items-center bg-white rounded-md mb-5 p-10">
      <div className="relative w-1/2">
        <input
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyUp={handleSearch}
          value={searchTerm}
          className="border-2 w-full rounded-md p-2 px-3 outline-none"
          type="text"
          placeholder={t("coupon_search")}
        />
        <div
          className={`absolute ${
            i18n.language === "ar" ? "left-3" : "right-3"
          } top-3 cursor-pointer`}
        >
          <Search onClick={handleSearch} className="text-gray-500" size={20} />
        </div>
      </div>
      <div className=" ms-auto text-end">
        <button
          onClick={exportToExcel}
          className="px-5 py-3 hover:bg-[#048c87] w-auto flex justify-center items-center text-white gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-md rounded-[8px] focus:outline-none text-center"
        >
          {t("coupon_excel_export")}
          <span>
            <FileSpreadsheet />
          </span>
        </button>
      </div>
    </div>
  );
};

CouponSearch.propTypes = {
  exportToExcel: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
};

export default CouponSearch;
