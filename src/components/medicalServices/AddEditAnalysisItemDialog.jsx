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
  Chip,
  Stack,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Loader, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { getAllAnalysisRadiologyServices } from "../../utlis/https";
import { useQuery } from "@tanstack/react-query";

const AddEditAnalysisItemDialog = ({
  openDialog,
  id,
  handleClose,
  onSubmit,
  isAddingMedicalService,
  serviceEdit,
  isEditinMedicalService,
}) => {
  const { t, i18n } = useTranslation();

  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  let { data } = useQuery({
    queryKey: ["analysis-radiology-services"],
    queryFn: getAllAnalysisRadiologyServices,
  });

  const initialState = {
    type: "analysis",
    analysis_id: "",
    medical_service_id: id,
    service_price: "",
    tabi_price: "",
    notes: [],
    tags: [],
    status: true,
  };

  const [formData, setFormData] = useState(initialState);
  const [noteInput, setNoteInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const isEditMode = !!serviceEdit;
  const isLoading =
    isAddingMedicalService || (isEditMode && isEditinMedicalService);
  const buttonText = isEditMode ? t("edit") : t("add");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "name") {
      setFormData((prev) => ({
        ...prev,
        medical_service_id: id,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  useEffect(() => {
    if (serviceEdit && openDialog) {
      setFormData({
        type: serviceEdit.type,
        analysis_id: serviceEdit.analysis_id,
        medical_service_id: serviceEdit.medical_service_id,
        service_price: serviceEdit.service_price?.toString() || "",
        tabi_price: serviceEdit.tabi_price?.toString() || "",
        notes: serviceEdit.notes || [],
        tags: serviceEdit.tags || [],
        status: serviceEdit.status,
        id: serviceEdit.id,
      });
    }
  }, [serviceEdit, openDialog]);

  useEffect(() => {
    if (openDialog && !serviceEdit) {
      resetForm();
    }
  }, [openDialog, serviceEdit]);

  const handleSubmit = () => {
    const finalData = {
      ...formData,
      notes: formData.notes,
      tags: formData.tags,
      service_price: Number(formData.service_price),
      tabi_price: Number(formData.tabi_price),
    };
    onSubmit(finalData);
  };

  const handleAddItem = (fieldName, inputValue, setInputFn) => {
    if (inputValue.trim()) {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: [...prev[fieldName], inputValue.trim()],
      }));
      setInputFn("");
    }
  };

  const handleDeleteItem = (fieldName, indexToDelete) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].filter(
        (_, index) => index !== indexToDelete,
      ),
    }));
  };

  const resetForm = () => {
    setFormData(initialState);
    setNoteInput("");
    setTagInput("");
  };

  const handleDialogClose = () => {
    resetForm();
    handleClose();
  };

  return (
    <Dialog
      open={openDialog}
      onClose={handleDialogClose}
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
          className={`${direction === "rtl" ? "text-right" : "text-left"}`}
          dir={direction}
          display="grid"
          gridTemplateColumns="repeat(2, 1fr)"
          gap={2}
          mt={1}
        >
          <TextField
            select
            label={t("analysis_name")}
            name="analysis_id"
            value={formData.analysis_id}
            onChange={handleChange}
            fullWidth
            required
          >
            {data?.map((item) => (
              <MenuItem
                key={item.id}
                value={item.id}
                inputprops={{ "data-id": item.id }}
              >
                {item.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label={t("analysis_type")}
            name="analysis_type"
            value={formData.analysis_type}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="2">Analysis</MenuItem>
            <MenuItem value="1">Radiology</MenuItem>
          </TextField>

          <TextField
            label="Service Price"
            name="service_price"
            type="number"
            value={formData.service_price}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Tabi Price"
            name="tabi_price"
            type="number"
            value={formData.tabi_price}
            onChange={handleChange}
            fullWidth
          />

          <Box sx={{ gridColumn: "span 2" }}>
            <TextField
              label="Notes"
              fullWidth
              variant="outlined"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                (e.preventDefault(),
                handleAddItem("notes", noteInput, setNoteInput))
              }
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        handleAddItem("notes", noteInput, setNoteInput)
                      }
                      color="primary"
                    >
                      <Plus size={20} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              useFlexGap
              mt={1}
            >
              {formData.notes.map((note, index) => (
                <Chip
                  key={index}
                  label={note}
                  onDelete={() => handleDeleteItem("notes", index)}
                  variant="outlined"
                  color="info"
                  style={{ paddingLeft: "10px", borderRadius: "5px" }}
                />
              ))}
            </Stack>
          </Box>

          <Box sx={{ gridColumn: "span 2" }}>
            <TextField
              label="Tags"
              variant="outlined"
              fullWidth
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                (e.preventDefault(),
                handleAddItem("tags", tagInput, setTagInput))
              }
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        handleAddItem("tags", tagInput, setTagInput)
                      }
                      color="primary"
                    >
                      <Plus size={20} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              useFlexGap
              mt={1}
            >
              {formData.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleDeleteItem("tags", index)}
                  color="primary"
                  variant="outlined"
                  style={{ paddingLeft: "10px", borderRadius: "5px" }}
                />
              ))}
            </Stack>
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={formData.status}
                onChange={handleChange}
                name="status"
                color="primary"
              />
            }
            label="Active Status"
            sx={{ gridColumn: "span 2" }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", gap: 2, mt: 2 }}>
        <Button
          className="px-8 py-2 hover:bg-[#048c87] text-white bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg rounded-[8px]"
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? <Loader className="animate-spin" /> : buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditAnalysisItemDialog;

AddEditAnalysisItemDialog.propTypes = {
  openDialog: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isAddingMedicalService: PropTypes.bool,
  serviceEdit: PropTypes.object,
  isEditinMedicalService: PropTypes.bool,
};
