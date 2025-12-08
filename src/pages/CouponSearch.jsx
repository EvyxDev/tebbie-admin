import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const CouponSearch = ({ handleSearch, setSearchTerm, searchTerm }) => {
  const { t, i18n } = useTranslation();
  return (
    <div className="w-full md:w-[83%] bg-white rounded-md mb-5 md:mb-10">
      <div className="relative">
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
