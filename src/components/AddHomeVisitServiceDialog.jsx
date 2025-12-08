/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  addHomeVisitService,
  updateHomeVisitService,
  getHospitals,
} from "../utlis/https";

const AddHomeVisitServiceDialog = ({ isOpen, onClose, editData }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const token = localStorage.getItem("authToken");
  const [formData, setFormData] = useState({
    hospital_id: "",
    name: "",
    type: "",
    price: "",
    hospital_price: "",
    tabi_price: "",
    status: "active", // Only for edit mode
  });

  // Fetch hospitals
  const { data: hospitalsData } = useQuery({
    queryKey: ["hospitals"],
    queryFn: () => getHospitals({ token }),
  });

  // Add mutation
  const addMutation = useMutation({
    mutationFn: (data) => addHomeVisitService({ token, ...data }),
    onSuccess: () => {
      toast.success(t("service_added_successfully"));
      queryClient.invalidateQueries(["home-visit-services"]);
      onClose();
    },
    onError: (error) => {
      toast.error(t("failed_to_add_service"));
      console.error("Add service error:", error);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data) =>
      updateHomeVisitService({ token, serviceId: editData?.id, ...data }),
    onSuccess: () => {
      toast.success(t("service_updated_successfully"));
      queryClient.invalidateQueries(["home-visit-services"]);
      onClose();
    },
    onError: (error) => {
      toast.error(t("failed_to_update_service"));
      console.error("Update service error:", error);
    },
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setFormData({
          hospital_id: editData.hospital_id || "",
          name: editData.name || "",
          type: editData.type || "",
          price: editData.price || "",
          hospital_price: editData.hospital_price || "",
          tabi_price: editData.tabi_price || "",
          status: editData.status || "active",
        });
      } else {
        setFormData({
          hospital_id: "",
          name: "",
          type: "",
          price: "",
          status: "active",
          hospital_price: "",
          tabi_price: "",
        });
      }
    }
  }, [isOpen, editData]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.hospital_id ||
      !formData.name ||
      !formData.type ||
      !formData.price
    ) {
      toast.error(t("please_fill_all_fields"));
      return;
    }

    if (editData) {
      updateMutation.mutate(formData);
    } else {
      addMutation.mutate(formData);
    }
  };

  if (!isOpen) return null;

  const isLoading = addMutation.isPending || updateMutation.isPending;
  const isEdit = !!editData;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4" dir="rtl">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {isEdit ? t("edit_home_visit_service") : t("add_home_visit_service")}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Hospital Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("select_hospital")}
            </label>
            <select
              name="hospital_id"
              value={formData.hospital_id}
              onChange={handleInputChange}
              // Hospital can be changed in edit mode
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              required
            >
              <option value="">{t("select_hospital")}</option>
              {hospitalsData?.map((hospital) => (
                <option key={hospital.id} value={hospital.id}>
                  {hospital.name}
                </option>
              ))}
            </select>
          </div>

          {/* Service Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("service_name")}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("service_name")}
              required
            />
          </div>

          {/* Service Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("service_type")}
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">{t("service_type")}</option>
              <option value="1">{t("doctor")}</option>
              <option value="2">{t("nursing")}</option>
              <option value="3">{t("physical_therapy")}</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("price")}
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("price")}
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Hospital Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("hospital_price")}
            </label>
            <input
              type="number"
              name="hospital_price"
              value={formData.hospital_price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("hospital_price")}
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Tebi Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("tabi_price")}
            </label>
            <input
              type="number"
              name="tabi_price"
              value={formData.tabi_price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("tabi_price")}
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Status - Only show in edit mode */}
          {isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("status")}
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">{t("active")}</option>
                <option value="inactive">{t("inactive")}</option>
              </select>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isLoading
                ? isEdit
                  ? t("updating")
                  : t("adding")
                : isEdit
                ? t("update_service")
                : t("add_service")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHomeVisitServiceDialog;
