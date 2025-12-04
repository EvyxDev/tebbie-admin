/* eslint-disable react/prop-types */
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getSpecificHospital, deleteHospital } from "../utlis/https";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Loader from "./Loader";
import { toast } from "react-toastify";
import { placeholder } from "../assets";
import HospitalMap from "../components/HospitalMap";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Fade,
  TextField,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaFileAlt,
  FaUserMd,
  FaEnvelope,
  FaCheckCircle,
  FaPhone,
} from "react-icons/fa";

const token = localStorage.getItem("authToken");

const HospitalDetails = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { HospitalId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 20;

  const {
    data: hospital,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["Hospital-details", HospitalId],
    queryFn: () => getSpecificHospital({ id: HospitalId, token }),
  });

  console.log(hospital);

  const { mutate: handleDelete, isLoading: isDeleting } = useMutation({
    mutationFn: () => deleteHospital({ id: HospitalId, token }),
    onSuccess: () => {
      toast.success(` ${t("hospitalDeleted")}`);
      navigate("/hospitals");
    },
    onError: (error) => {
      toast.error(`${t("deleteFailed")} ${error}`);
    },
  });

  const [open, setOpen] = useState(false);

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);
  const handleDeleteClick = () => {
    handleDelete();
    handleCloseModal();
  };

  // Remove duplicates based on doctor ID first
  const uniqueDoctors =
    hospital?.doctors.data?.filter(
      (doc, index, self) => index === self.findIndex((d) => d.id === doc.id)
    ) || [];

  const filteredDoctors = uniqueDoctors.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil((filteredDoctors?.length || 0) / doctorsPerPage);
  const startIndex = (currentPage - 1) * doctorsPerPage;
  const endIndex = startIndex + doctorsPerPage;
  const paginatedDoctors = filteredDoctors?.slice(startIndex, endIndex) || [];

  // Reset to first page when search term changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  if (isLoading || isDeleting) return <Loader />;
  if (error) return <div className="text-red-500">{t("errorLoadingData")}</div>;

  return (
    <section className="container mx-auto  py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        dir={isArabic ? "rtl" : "ltr"}
        className="bg-white rounded-2xl  overflow-hidden border border-gray-100"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-[#33A9C7] to-[#3AAB95] lg:p-8 md:p-6 p-4">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:text-4xl text-3xl font-bold text-white tracking-tight"
          >
            {hospital.name}
          </motion.h2>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-white/20 to-transparent" />
        </div>

        {/* Main Content */}
        <div className="lg:p-8 md:p-6 p-4 lg:gap-8 md:gap-6 gap-4">
          {/* Left Column - Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100 ">
              <InfoItem
                label="address"
                displayLabel={t("address")}
                value={hospital.address}
              />
              <InfoItem
                label="description"
                displayLabel={t("description")}
                value={hospital.description}
              />
              <InfoItem
                label="bio"
                displayLabel={t("bio")}
                value={hospital.bio}
              />
              <InfoItem
                label="email"
                displayLabel={t("email")}
                value={hospital.email}
              />
              <InfoItem
                label="phone"
                displayLabel={t("phone")}
                value={hospital.phone}
              />
              <InfoItem
                label="status"
                displayLabel={t("status")}
                value={
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      hospital.active === "1"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full me-2 ${
                        hospital.active === "1" ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    {hospital.active === "1" ? t("active") : t("inactive")}
                  </span>
                }
              />
            </div>

            {/* Doctors */}
            <div className="min-h-[50vh]">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <FaUserMd className="text-[#33A9C7] me-2" />
                {t("AvilableDoctors")}
              </h3>
              <TextField
                label={t("doctorNameSearch")}
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{ mb: 4 }}
              />

              {/* Pagination info and controls */}
              <div className="flex justify-between items-center mb-4">
                {totalPages > 1 && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      السابق
                    </Button>
                    <span className="text-sm text-gray-600 pr-2">
                      صفحة {currentPage} من {totalPages}
                    </span>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                    >
                      التالي
                    </Button>
                  </div>
                )}
                <p className="text-gray-600">
                  عرض {startIndex + 1}-
                  {Math.min(endIndex, filteredDoctors?.length || 0)} من{" "}
                  {filteredDoctors?.length || 0} طبيب
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {paginatedDoctors?.length > 0 ? (
                  paginatedDoctors.map((doc) => (
                    <motion.span
                      key={doc.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gradient-to-br from-[#33A9C7] to-[#3AAB95] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <Link to={`/doctors/${doc.id}`}>{doc.name}</Link>
                    </motion.span>
                  ))
                ) : (
                  <p className="text-gray-500">{t("noDoctorsFound")}</p>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-2xl font-semibold text-gray-900 my-4">
              {t("images")}
            </h3>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-4">
              {Array.isArray(hospital.media_url) &&
              hospital.media_url.length > 0 ? (
                hospital.media_url.map((url, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="relative overflow-hidden rounded-lg shadow-md"
                  >
                    <img
                      src={url}
                      alt={`Hospital Image ${index + 1}`}
                      className="w-full h-48 object-cover transition-transform duration-300"
                      onError={(e) => (e.target.src = placeholder)}
                    />
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4 col-span-4">
                  No media available
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Full Width Map */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full h-[500px] border-t border-gray-100"
        >
          <HospitalMap hospital={hospital} />
        </motion.div>

        {/* Footer Actions */}
        <div className="p-6 bg-gray-50/50 flex justify-end gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenModal}
            className="px-6 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-all duration-200"
          >
            {t("delete")}
          </motion.button>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to={`/hospitals/update-hospital/${hospital.id}`}
              className="px-6 py-2 bg-gradient-to-br from-[#33A9C7] to-[#3AAB95] text-white rounded-lg shadow-md hover:from-[#2d95b0] hover:to-[#339684] transition-all duration-200 inline-block"
            >
              {t("edit")}
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Dialog */}
      <Dialog
        open={open}
        onClose={handleCloseModal}
        TransitionComponent={Fade}
        PaperProps={{
          style: {
            borderRadius: "16px",
            padding: "16px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogTitle className="text-2xl font-semibold text-gray-900 text-center">
          {t("confirmDelete")}
        </DialogTitle>
        <DialogContent>
          <p className="text-gray-600 text-center max-w-sm">
            {t("areYouSureDeleteHospital")}
          </p>
        </DialogContent>
        <DialogActions className="justify-center gap-6 pb-4">
          <Button
            onClick={handleCloseModal}
            variant="outlined"
            sx={{
              borderRadius: "8px",
              padding: "8px 24px",
              borderColor: "#6B7280",
              color: "#6B7280",
              textTransform: "none",
              "&:hover": { borderColor: "#374151", color: "#374151" },
            }}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleDeleteClick}
            variant="contained"
            sx={{
              borderRadius: "8px",
              padding: "8px 24px",
              backgroundColor: "#DC3545",
              textTransform: "none",
              "&:hover": { backgroundColor: "#B91C1C" },
            }}
          >
            {t("delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
};

const InfoItem = ({ label, displayLabel, value }) => {
  const getIcon = (label) => {
    switch (label.toLowerCase()) {
      case "address":
        return <FaMapMarkerAlt className="text-[#33A9C7] me-2 shrink-0" />;
      case "description":
        return <FaFileAlt className="text-[#33A9C7] me-2 shrink-0" />;
      case "bio":
        return <FaUserMd className="text-[#33A9C7] me-2 shrink-0" />;
      case "email":
        return <FaEnvelope className="text-[#33A9C7] me-2 shrink-0" />;
      case "phone":
        return <FaPhone className="text-[#33A9C7] me-2 shrink-0" />;
      case "status":
        return <FaCheckCircle className="text-[#33A9C7] me-2 shrink-0" />;
      default:
        return null;
    }
  };

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="text-gray-600 py-4 border-b border-gray-100 last:border-0 text-xl  items-start block"
    >
      <span className="flex items-center shrink-0 my-4">
        {getIcon(label)}
        <strong className="text-gray-800 font-semibold">
          {" "}
          {displayLabel} :{" "}
        </strong>
      </span>
      <span className="break-words ml-2"> {value} </span>
    </motion.p>
  );
};

export default HospitalDetails;
