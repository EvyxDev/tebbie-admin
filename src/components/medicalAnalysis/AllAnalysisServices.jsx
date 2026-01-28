import { Link } from "react-router-dom";
import Loader from "../../pages/Loader";
import { useTranslation } from "react-i18next";
import Pagination from "../Pagination";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { AiFillEdit } from "react-icons/ai";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMedicalService } from "../../utlis/https";
import { toast } from "react-toastify";

const AllAnalysisServices = ({ data, isPending, handleEditClick }) => {
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 5;
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = data?.slice(indexOfFirstService, indexOfLastService);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const queryClient = useQueryClient();
  const { mutate: deleteMedicalMutation } = useMutation({
    mutationFn: ({ id }) => deleteMedicalService(id),

    onSuccess: () => {
      toast.success(t("serviceDeletedSuccess"));
      queryClient.invalidateQueries(["medical-services"]);
    },

    onError: () => {
      toast.error(t("serviceDeleteFailed"));
    },
  });

  const totalPages = data?.length
    ? Math.ceil(data.length / servicesPerPage)
    : 0;

  if (isPending) {
    return <Loader />;
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedId) {
      deleteMedicalMutation({ id: selectedId });
    }
    handleCloseDialog();
  };

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white shadow-sm overflow-x-auto">
      <div className="min-w-full">
        <table
          style={{ direction: direction }}
          className="min-w-[1200px] w-full bg-white text-sm"
        >
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              {["name", "type", "actions"].map((key) => (
                <th
                  key={key}
                  className="py-4 px-3 text-center transition-colors whitespace-nowrap"
                >
                  {t(key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`text-gray-600 text-sm`}>
            {currentServices && currentServices.length > 0 ? (
              currentServices.map((service) => (
                <tr key={service.id} className="border-b border-gray-200">
                  <td className="py-4 px-3 text-center">{service.name}</td>
                  <td className="py-4 px-3 text-center">{service.type}</td>
                  <td className="py-4 px-3 text-center">
                    <button
                      onClick={() => handleEditClick(service)}
                      className="text-blue-500 hover:text-blue-700 focus:outline-none"
                    >
                      <AiFillEdit size={28} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <td colSpan={7} className="py-8 text-center text-gray-500">
                {t("noData")}
              </td>
            )}
          </tbody>
        </table>

        {/* Pagination and Total */}
        <div className={`flex justify-between items-center mx-4 mb-4`}>
          <section className="text-lg mt-5 text-gray-500 text-end">
            {t("Total")}: {currentServices?.length || 0}
          </section>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(newPage) => setCurrentPage(newPage)}
          />
        </div>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          PaperProps={{ sx: { borderRadius: "12px", padding: "16px" } }}
        >
          <DialogTitle
            sx={{ fontSize: "1.5rem", fontWeight: "bold", textAlign: "center" }}
          >
            {t("confirmDelete")}
          </DialogTitle>
          <DialogContent>
            <p className="text-gray-600">{t("areYouSureDeleteService")}</p>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", gap: "16px" }}>
            <Button
              onClick={handleCloseDialog}
              sx={{
                backgroundColor: "#3AAB95",
                color: "white",
                padding: "8px 16px",
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#33A9C7" },
              }}
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleConfirmDelete}
              sx={{
                backgroundColor: "#DC3545",
                color: "white",
                padding: "8px 16px",
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#a71d2a" },
              }}
            >
              {t("delete")}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default AllAnalysisServices;
