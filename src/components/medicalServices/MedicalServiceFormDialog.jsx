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

const MedicalServiceFormDialog = ({
  openDialog,
  handleClose,
  onSubmit,
  isAddingMedicalService,
  allHospitals,
  serviceEdit,
  isEditinMedicalService,
}) => {
  const { t, i18n } = useTranslation();
  const [imagePreview, setImagePreview] = useState(null);
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const [formData, setFormData] = useState({
    name: serviceEdit ? serviceEdit.name : "",
    desc: serviceEdit ? serviceEdit.desc : "",
    type: serviceEdit ? serviceEdit.type : "analysis",
    lat: serviceEdit ? serviceEdit.lat : "",
    long: serviceEdit ? serviceEdit.long : "",
    location: serviceEdit ? serviceEdit.location : "",
    hospital_id: serviceEdit ? serviceEdit.hospital_id : null,
    image: serviceEdit ? serviceEdit.image : null,
    time_from: serviceEdit ? serviceEdit.time_from : "",
    time_to: serviceEdit ? serviceEdit.time_to : "",
    status: serviceEdit ? serviceEdit.status : false,
    is_featured: serviceEdit ? serviceEdit.is_featured : false,
    sort_order: serviceEdit ? serviceEdit.sort_order : 0,
  });
  const isEditMode = !!serviceEdit;
  const isLoading =
    isAddingMedicalService || (isEditMode && isEditinMedicalService);
  const buttonText = isEditMode ? t("edit") : t("add");

  useEffect(() => {
    if (serviceEdit) {
      setFormData({
        name: serviceEdit.name || "",
        desc: serviceEdit.desc || "",
        type: serviceEdit.type || "analysis",
        lat: serviceEdit.lat || "",
        long: serviceEdit.long || "",
        location: serviceEdit.location || "",
        hospital_id: serviceEdit.hospital_id || null,
        image: serviceEdit.image || null,
        time_from: serviceEdit.time_from || "",
        time_to: serviceEdit.time_to || "",
        status: serviceEdit.status || false,
        is_featured: serviceEdit.is_featured || false,
        sort_order: serviceEdit.sort_order || 0,
      });

      setImagePreview(serviceEdit.image || null);
    }
  }, [serviceEdit]);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      console.log("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setFormData((prev) => ({
          ...prev,
          lat: latitude,
          long: longitude,
        }));
      },
      (error) => {
        console.log("Location error:", error.message);
      }
    );
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    if (openDialog) {
      getUserLocation();
    }
  }, [openDialog]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    setImagePreview(null);
    onSubmit(formData);
    setFormData({
      name: "",
      desc: "",
      type: "analysis",
      lat: "",
      long: "",
      location: "",
      image: null,
      time_from: "",
      time_to: "",
      status: false,
      is_featured: false,
      sort_order: 0,
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
        {isEditMode ? t("edit_medical_service") : t("add_medical_service")}
      </DialogTitle>

      <DialogContent>
        <Box>
          <Button
            variant="outlined"
            component="label"
            sx={{
              margin: "auto",
              width: "100%",
              height: 120,
              borderStyle: "dashed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="preview"
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            ) : (
              t("upload_image")
            )}

            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
        </Box>

        <Box
          className={`${direction == "rtl" ? "text-right" : "text-left"}`}
          dir={direction}
          display="grid"
          gap={2}
          mt={1}
        >
          <TextField
            label={t("service_name")}
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            label={t("service_description")}
            name="desc"
            value={formData.desc}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
          />

          <TextField
            select
            label={t("service_type")}
            name="type"
            value={formData.type}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="analysis">Analysis</MenuItem>
            <MenuItem value="radiology">Radiology</MenuItem>
          </TextField>

          {/* hospitals */}
          <TextField
            select
            label={t("all_hospitals")}
            name="hospital_id"
            value={formData.hospital_id}
            onChange={handleChange}
            fullWidth
          >
            {allHospitals?.map((hospital) => (
              <MenuItem key={hospital.id} value={hospital.id}>
                {hospital.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label={t("medical_tab_location")}
            name="location"
            value={formData.location}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            type="number"
            label={t("medical_order")}
            name="sort_order"
            value={formData.sort_order}
            onChange={handleChange}
            fullWidth
          />

          <Box display="flex" gap={2}>
            <TextField
              type="time"
              label={t("time_from")}
              name="time_from"
              value={formData.time_from}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <TextField
              type="time"
              label={t("time_to")}
              name="time_to"
              value={formData.time_to}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>

          <div className="flex justify-center">
            <FormControlLabel
              control={
                <Switch
                  name="status"
                  checked={formData.status}
                  onChange={handleChange}
                />
              }
              label={t("medical_status")}
            />

            <FormControlLabel
              control={
                <Switch
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                />
              }
              label={t("medical_featured")}
            />
          </div>
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

export default MedicalServiceFormDialog;

MedicalServiceFormDialog.propTypes = {
  openDialog: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isAddingMedicalService: PropTypes.bool,
  allHospitals: PropTypes.array,
  serviceEdit: PropTypes.object,
  isEditinMedicalService: PropTypes.bool,
};
