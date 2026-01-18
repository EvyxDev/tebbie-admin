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
import { useQuery } from "@tanstack/react-query";
import { getServiceById } from "../utlis/https";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Map } from "lucide-react";
import { useTranslation } from "react-i18next";

const MedicalServiceDetails = () => {
  const { id } = useParams();
  const [tab, setTab] = useState(0);
  const { t, i18n } = useTranslation();
  const { data: serviceData } = useQuery({
    queryKey: ["medical-service", id],
    queryFn: () => getServiceById(id),
  });
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  if (!serviceData) return null;

  const {
    name,
    type,
    desc,
    location,
    time_from,
    time_to,
    status,
    is_featured,
    items,
  } = serviceData;

  return (
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
            <Box display="grid" gap={3}>
              {items.length === 0 && (
                <Typography sx={{ color: "#718096", fontSize: "1rem" }}>
                  No items found
                </Typography>
              )}

              {items.map((item) => (
                <Card
                  key={item.id}
                  sx={{
                    background: "#ffffff",
                    border: "1px solid #e5e9f0",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      borderColor: "#d1d5db",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: "#1a202c",
                        mb: 2,
                      }}
                    >
                      {item.name}
                    </Typography>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 2,
                        mb: 2,
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
                          {t("medical_service_price")}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "1.125rem",
                            fontWeight: 600,
                            color: "#0066cc",
                          }}
                        >
                          {item.service_price} EGP
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
                          {t("tabi_price")}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "1.125rem",
                            fontWeight: 600,
                            color: "#0066cc",
                          }}
                        >
                          {item.tabi_price} EGP
                        </Typography>
                      </Box>
                    </Box>

                    {item.notes && item.notes.length > 0 && (
                      <Box sx={{ mb: 2 }}>
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
                          {t("medical_notes")}
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                          {item.notes.map((note, i) => (
                            <Chip
                              key={i}
                              label={note}
                              size="small"
                              sx={{
                                background: "#f3f4f6",
                                color: "#374151",
                                fontWeight: 500,
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}

                    <Chip
                      label={item.status ? "Active" : "Inactive"}
                      sx={{
                        background: item.status ? "#f0fdf4" : "#fef2f2",
                        color: item.status ? "#166534" : "#991b1b",
                        fontWeight: 500,
                        border: item.status
                          ? "1px solid #bbf7d0"
                          : "1px solid #fecaca",
                      }}
                    />
                  </CardContent>
                </Card>
              ))}
            </Box>
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
  );
};

export default MedicalServiceDetails;
