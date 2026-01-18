import { useMemo, useState } from "react";
import MedicalTabs from "../components/Tabs";
import { useTranslation } from "react-i18next";
import AllServices from "../components/medicalServices/AllServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addMedicalService,
  editMedicalService,
  getAllHospitals,
  getAllMedicalServices,
} from "../utlis/https";
import { Plus } from "lucide-react";
import MedicalServiceFormDialog from "../components/medicalServices/MedicalServiceFormDialog";
import { toast } from "react-toastify";

const MedicalService = () => {
  const { t, i18n } = useTranslation();
  const [value, setValue] = useState("all");
  const [openDialog, setOpenDialog] = useState(false);
  const queryClient = useQueryClient();
  const [serviceEdit, setServiceEdit] = useState(null);

  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  let { data, isPending } = useQuery({
    queryKey: ["medical-services"],
    queryFn: getAllMedicalServices,
  });

  let { mutate: addMedicalServiceMutate, isPending: isAddingMedicalService } =
    useMutation({
      mutationFn: async (formData) => addMedicalService(formData),
      onSuccess: () => {
        setOpenDialog(false);
        queryClient.invalidateQueries({ queryKey: ["medical-services"] });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  let {
    mutate: updateMedicalServiceMutate,
    isPending: isEditinMedicalService,
  } = useMutation({
    mutationFn: async ({ id, formData }) => editMedicalService(id, formData),
    onSuccess: () => {
      setOpenDialog(false);
      queryClient.invalidateQueries({ queryKey: ["medical-services"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  let { data: allHospitals, isPending: hospitalLoading } = useQuery({
    queryKey: ["all-hospitals"],
    queryFn: () => getAllHospitals(),
  });

  const tabs = useMemo(() => {
    return [
      { content: t("medical_tab_analysis"), label: "analysis" },
      { content: t("medical_tab_radiology"), label: "radiology" },
      { content: t("medical_tab_all"), label: "all" },
    ];
  }, [t]);

  if (value == "analysis") {
    data = data.filter((service) => service.type === "analysis");
  }
  if (value == "radiology") {
    data = data.filter((service) => service.type === "radiology");
  }

  const handleAddMedical = () => {
    setOpenDialog(true);
  };

  const onSubmit = (formData) => {
    if (serviceEdit) {
      updateMedicalServiceMutate({ id: serviceEdit.id, formData });
      setServiceEdit(null);
    } else {
      addMedicalServiceMutate(formData);
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
            <Plus /> {t("add_medical_service")}
          </button>
          <MedicalTabs setValue={setValue} value={value} tabs={tabs} />
        </div>

        {/* content based on selected tab */}
        <div className="mt-10">
          <AllServices
            data={data}
            handleEditClick={handleEditClick}
            isPending={isPending}
          />
        </div>
      </div>

      <MedicalServiceFormDialog
        onSubmit={onSubmit}
        openDialog={openDialog}
        handleClose={() => setOpenDialog(false)}
        isAddingMedicalService={isAddingMedicalService}
        allHospitals={allHospitals || []}
        serviceEdit={serviceEdit}
        isEditinMedicalService={isEditinMedicalService}
      />
    </>
  );
};

export default MedicalService;
