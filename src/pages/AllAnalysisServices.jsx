import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addAnalysisService,
  editAnalysisService,
  editMedicalService,
  getAllAnalysisRadiologyServices,
} from "../utlis/https";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import AllAnalysisServices from "../components/medicalAnalysis/AllAnalysisServices";
import MedicalAnalysisFormDialog from "../components/medicalAnalysis/MedicalAnalysisFormDialog";

const AllAnalysisPageServices = () => {
  const { t, i18n } = useTranslation();
  const [openDialog, setOpenDialog] = useState(false);
  const queryClient = useQueryClient();
  const [serviceEdit, setServiceEdit] = useState(null);

  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  let { data, isPending } = useQuery({
    queryKey: ["analysis-radiology-services"],
    queryFn: getAllAnalysisRadiologyServices,
  });

  let { mutate: addMedicalAnalysisMutate, isPending: isAddingMedicalService } =
    useMutation({
      mutationFn: async (formData) => addAnalysisService(formData),
      onSuccess: () => {
        setOpenDialog(false);
        queryClient.invalidateQueries({
          queryKey: ["analysis-radiology-services"],
        });
        toast.success(
          i18n.language == "en"
            ? "Service updated successfully"
            : "تم تحديث الخدمة بنجاح",
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  let {
    mutate: updateMedicalServiceMutate,
    isPending: isEditinMedicalService,
  } = useMutation({
    mutationFn: async ({ id, formData }) => editAnalysisService(id, formData),
    onSuccess: () => {
      setOpenDialog(false);
      queryClient.invalidateQueries({
        queryKey: ["analysis-radiology-services"],
      });
      toast.success(
        i18n.language == "en"
          ? "Service updated successfully"
          : "تم تحديث الخدمة بنجاح",
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleAddMedical = () => {
    setOpenDialog(true);
  };

  const onSubmit = (formData) => {
    if (serviceEdit) {
      updateMedicalServiceMutate({ id: serviceEdit.id, formData });
      setServiceEdit(null);
    } else {
      addMedicalAnalysisMutate(formData);
    }
  };

  const handleEditClick = (service) => {
    setServiceEdit(service);
    setOpenDialog(true);
  };

  return (
    <>
      <div
        className={`${direction} max-w-7xl mx-auto my-10 bg-white p-10 rounded-lg ${
          i18n.language === "ar" ? "text-right" : "text-left"
        }`}
      >
        {/* tabs */}
        <div className="text-center mx-auto flex items-start justify-between">
          <button
            onClick={handleAddMedical}
            className="px-4 py-2 shrik-0 hover:bg-[#048c87] w-auto flex justify-center items-center text-white gap-1 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg rounded-[8px] focus:outline-none text-center"
          >
            <Plus /> {t("add_analysis_service")}
          </button>
        </div>

        {/* content based on selected tab */}
        <div className="mt-10">
          <AllAnalysisServices
            data={data}
            handleEditClick={handleEditClick}
            isPending={isPending}
          />
        </div>
      </div>

      <MedicalAnalysisFormDialog
        onSubmit={onSubmit}
        openDialog={openDialog}
        handleClose={() => setOpenDialog(false)}
        isAddingMedicalService={isAddingMedicalService}
        serviceEdit={serviceEdit}
        isEditinMedicalService={isEditinMedicalService}
      />
    </>
  );
};

export default AllAnalysisPageServices;
