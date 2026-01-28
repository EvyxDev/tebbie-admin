import { useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Tabs,
  Tab,
  Container,
  Paper,
} from "@mui/material";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addItemAnalysis,
  deleteAnalysisItem,
  getAllItemsServiceById,
  getServiceById,
  updateAnalysisItem,
} from "../utlis/https";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Map, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { toast } from "react-toastify";
import AddEditAnalysisItemDialog from "../components/medicalServices/AddEditAnalysisItemDialog";

const MedicalServiceDetails = () => {
  const { id } = useParams();
  const [tab, setTab] = useState(0);
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  let { mutate } = useMutation({
    mutationFn: async (formData) => {
      const isEdit = !!formData.id;

      if (isEdit) {
        return await updateAnalysisItem(formData.id, formData);
      } else {
        return await addItemAnalysis(formData);
      }
    },
    onSuccess: () => {
      setIsSubmitting(false);
      setIsDialogOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["all-items-service"],
      });
      toast.success(
        i18n.language == "en"
          ? "Service updated successfully"
          : "تم تحديث الخدمة بنجاح",
      );
    },
    onError: (error) => {
      toast.error(error.message);
      setIsSubmitting(false);
      setIsDialogOpen(false);
    },
  });

  const handleOpenAdd = () => {
    setSelectedService(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (service) => {
    setSelectedService(service);
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const onFormSubmit = (data) => {
    setIsSubmitting(true);
    mutate(data);
  };

  const { data: serviceData } = useQuery({
    queryKey: ["medical-service", id],
    queryFn: () => getServiceById(id),
  });
  const { data: serviceItemsData } = useQuery({
    queryKey: ["all-items-service", id],
    queryFn: () => getAllItemsServiceById(id),
  });
  const { mutate: itemDeleteMutate } = useMutation({
    mutationFn: ({ id }) => deleteAnalysisItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-items-service", id]);
    },
    onError: () => {
      toast.error(t("serviceDeleteFailed"));
    },
  });
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  if (!serviceData) return null;

  const { name, type, desc, location, time_from, time_to, status } =
    serviceData;

  const handleDeleteClick = async (id) => {
    if (id) {
      itemDeleteMutate({ id });
      toast.success(t("serviceDeletedSuccess"));
    }
  };

  // const onSubmit = (formData) => {
  //   if (serviceEdit) {
  //     updateMedicalServiceMutate({ id: serviceEdit.id, formData });
  //     setServiceEdit(null);
  //   } else {
  //     addMedicalAnalysisMutate(formData);
  //   }
  // };

  // const handleEditClick = (service) => {
  //   setServiceEdit(service);
  //   setOpenDialog(true);
  // };

  // const handleAddMedical = () => {
  //   setOpenDialog(true);
  // };

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }} dir={direction}>
        <Card
          sx={{
            mb: 4,
            background: "linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)",
            border: "1px solid #e5e9f0",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              gap={2}
              flexWrap="wrap"
            >
              <Box flex={1} minWidth="250px">
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                    color: "#1a202c",
                    mb: 1,
                    letterSpacing: "-0.5px",
                  }}
                >
                  {name}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "#0066cc",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    mb: 2,
                  }}
                >
                  {type} Service
                </Typography>

                <Typography
                  sx={{
                    fontSize: "1rem",
                    color: "#4a5568",
                    lineHeight: 1.6,
                    mb: 2,
                  }}
                >
                  {desc}
                </Typography>

                <Box display="flex" flexDirection="column" gap={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <LocationOnIcon
                      sx={{ fontSize: "1.25rem", color: "#718096" }}
                    />
                    <Typography sx={{ color: "#4a5568", fontSize: "0.95rem" }}>
                      {location}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <AccessTimeIcon
                      sx={{ fontSize: "1.25rem", color: "#718096" }}
                    />
                    <Typography sx={{ color: "#4a5568", fontSize: "0.95rem" }}>
                      {time_from} → {time_to}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box
                display="flex"
                gap={1.5}
                flexWrap="wrap"
                justifyContent="flex-end"
              >
                <Chip
                  label={status ? "Active" : "Inactive"}
                  sx={{
                    background: status ? "#f0fdf4" : "#fef2f2",
                    color: status ? "#166534" : "#991b1b",
                    fontWeight: 500,
                    border: status ? "1px solid #bbf7d0" : "1px solid #fecaca",
                  }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Paper
          sx={{
            background: "#ffffff",
            border: "1px solid #e5e9f0",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
            mb: 3,
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              borderBottom: "1px solid #e5e9f0",
              "& .MuiTab-root": {
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 500,
                color: "#718096",
                py: 2,
                px: 3,
                transition: "all 0.2s ease",
                "&:hover": {
                  color: "#0066cc",
                  background: "rgba(0, 102, 204, 0.02)",
                },
                "&.Mui-selected": {
                  color: "#0066cc",
                  fontWeight: 600,
                },
              },
              "& .MuiTabs-indicator": {
                background: "#0066cc",
                height: "3px",
              },
            }}
          >
            <Tab label={t("medical_tab_overview")} />
            <Tab label={t("medical_tab_items")} />
            <Tab label={t("medical_tab_location")} />
          </Tabs>

          <Box sx={{ p: 4 }}>
            {tab === 0 && (
              <Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 3,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#718096",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        mb: 0.5,
                      }}
                    >
                      {t("medical_type")}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "1.125rem",
                        fontWeight: 500,
                        color: "#1a202c",
                      }}
                    >
                      {type}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#718096",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        mb: 0.5,
                      }}
                    >
                      {t("medical_status")}
                    </Typography>
                    <Box display="flex items-center" gap={1}>
                      <Box
                        sx={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          background: status ? "#10b981" : "#ef4444",
                          marginTop: "8px",
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: "1.125rem",
                          fontWeight: 500,
                          color: "#1a202c",
                        }}
                      >
                        {status ? "Active" : "Inactive"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}

            {tab === 1 && (
              <div className="w-full rounded-lg border border-gray-200 bg-white shadow-sm overflow-x-auto">
                <div className="my-5 mx-5 flex justify-end items-center">
                  <button
                    onClick={handleOpenAdd}
                    className="px-4 py-2 shrik-0 hover:bg-[#048c87] w-auto flex justify-center items-center text-white gap-1 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg rounded-[8px] focus:outline-none text-center"
                  >
                    <Plus /> {t("add_analysis_item")}
                  </button>
                </div>

                <div className="min-w-full">
                  <table
                    style={{
                      direction: i18n.language === "ar" ? "rtl" : "ltr",
                    }}
                    className="min-w-[1000px] w-full bg-white text-sm"
                  >
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                      <tr>
                        <th className="py-4 px-4 text-center border-b">
                          {t("name")}
                        </th>
                        <th className="py-4 px-4 text-center border-b">
                          {t("medical_service_price")}
                        </th>
                        <th className="py-4 px-4 text-center border-b">
                          {t("tabi_price")}
                        </th>
                        <th className="py-4 px-4 text-center border-b">
                          {t("medical_notes")}
                        </th>
                        <th className="py-4 px-4 text-center border-b">
                          {t("medical_tags")}
                        </th>
                        <th className="py-4 px-4 text-center border-b">
                          {t("status")}
                        </th>
                        <th className="py-4 px-4 text-center border-b">
                          {t("actions")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600">
                      {serviceItemsData && serviceItemsData.length > 0 ? (
                        serviceItemsData.map((item) => (
                          <tr
                            key={item.id}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-4 px-4 text-center font-medium text-gray-900">
                              {item.name}
                            </td>

                            <td className="py-4 px-4 text-center">
                              {item.service_price} EGP
                            </td>

                            <td className="py-4 px-4 text-center">
                              {item.tabi_price} EGP
                            </td>

                            <td className="py-4 px-4 text-center">
                              <div className="flex flex-wrap justify-center gap-1">
                                {item.notes && item.notes.length > 0 ? (
                                  item.notes.map((note, i) => (
                                    <span
                                      key={i}
                                      className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-medium border border-gray-200"
                                    >
                                      {note}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-gray-400 text-xs">
                                    -
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <div className="flex flex-wrap justify-center gap-1">
                                {item.tags && item.tags.length > 0 ? (
                                  item.tags.map((note, i) => (
                                    <span
                                      key={i}
                                      className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-medium border border-gray-200"
                                    >
                                      {note}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-gray-400 text-xs">
                                    -
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="py-4 px-4 text-center">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  item.status
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : "bg-red-50 text-red-700 border border-red-200"
                                }`}
                              >
                                {item.status ? t("Active") : t("Inactive")}
                              </span>
                            </td>

                            <td className="py-4 px-4 text-center">
                              <button
                                onClick={() => handleOpenEdit(item)}
                                className="text-blue-500 hover:text-blue-700 transition-transform hover:scale-110"
                              >
                                <AiFillEdit size={24} />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(item.id)}
                                className="text-red-500 hover:text-red-700 focus:outline-none"
                              >
                                <AiFillDelete size={28} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="py-10 text-center text-gray-500"
                          >
                            {t("noData")}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === 2 && (
              <Box>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#718096",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    mb: 1,
                  }}
                >
                  {t("medical_tab_location")}
                </Typography>
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontSize: "1.125rem",
                    fontWeight: 500,
                    color: "#1a202c",
                    mb: 2,
                  }}
                >
                  <Map />
                  {location}
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>

      <AddEditAnalysisItemDialog
        id={id}
        openDialog={isDialogOpen}
        handleClose={handleClose}
        onSubmit={onFormSubmit}
        serviceEdit={selectedService}
        isAddingMedicalService={!selectedService && isSubmitting}
        isEditinMedicalService={!!selectedService && isSubmitting}
      />
    </>
  );
};

export default MedicalServiceDetails;
