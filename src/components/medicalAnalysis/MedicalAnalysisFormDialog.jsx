import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  MenuItem,
  Box,
} from "@mui/material";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const MedicalAnalysisFormDialog = ({
  openDialog,
  handleClose,
  onSubmit,
  isAddingMedicalService,
  serviceEdit,
  isEditinMedicalService,
}) => {
  const { t, i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const [formData, setFormData] = useState({
    name: serviceEdit ? serviceEdit.name : "",
    type: serviceEdit ? serviceEdit.type : "analysis",
  });
  const isEditMode = !!serviceEdit;
  const isLoading =
    isAddingMedicalService || (isEditMode && isEditinMedicalService);
  const buttonText = isEditMode ? t("edit") : t("add");

  useEffect(() => {
    if (serviceEdit) {
      setFormData({
        name: serviceEdit.name || "",
        type: serviceEdit.type || "analysis",
      });
    }
  }, [serviceEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({
      name: "",
      type: "analysis",
    });
  };

  return (
    <Dialog
      open={openDialog}
      onClose={handleClose}
      PaperProps={{
        sx: { borderRadius: "12px", padding: "16px", minWidth: 700 },
      }}
    >
      <DialogTitle
        sx={{ fontSize: "1.5rem", fontWeight: "bold", textAlign: "center" }}
      >
        {isEditMode ? t("edit_medical_analysis") : t("add_medical_analysis")}
      </DialogTitle>

      <DialogContent>
        <Box
          className={`${direction == "rtl" ? "text-right" : "text-left"}`}
          dir={direction}
          display="grid"
          gap={2}
          mt={1}
        >
          <TextField
            label={t("analysis_name")}
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            select
            label={t("analysis_type")}
            name="type"
            value={formData.type}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="analysis">Analysis</MenuItem>
            <MenuItem value="radiology">Radiology</MenuItem>
          </TextField>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", gap: 2, mt: 2 }}>
        <Button
          className="px-4 py-2 shrik-0 hover:bg-[#048c87] w-auto flex justify-center items-center text-white gap-1 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg rounded-[8px] focus:outline-none text-center"
          onClick={handleSubmit}
          variant="contained"
          sx={{ borderRadius: "8px" }}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="animate-spin">
              <Loader />
            </span>
          ) : (
            buttonText
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MedicalAnalysisFormDialog;

MedicalAnalysisFormDialog.propTypes = {
  openDialog: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isAddingMedicalService: PropTypes.bool,
  allHospitals: PropTypes.array,
  serviceEdit: PropTypes.object,
  isEditinMedicalService: PropTypes.bool,
};
