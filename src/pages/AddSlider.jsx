import { useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  addSlider,
  getDoctorSliders,
  getHospitals,
  getLabs,
  getSpecializations,
  getXrays,
} from "../utlis/https";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  hasPermission,
  getPermissionDisplayName,
} from "../utlis/permissionUtils";
import DoctorsSelect from "../components/DashboardComponents/DoctorsSelect";

const realtableType = [
  { id: 1, name: "hospital" },
  { id: 2, name: "doctor" },
  { id: 3, name: "xray" },
  { id: 4, name: "lab" },
  { id: 5, name: "specialization" },
];

const AddSlider = () => {
  const token = localStorage.getItem("authToken");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [activeTab, setActiveTab] = useState("external"); // "external" or "type"
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    media: null,
    realtable_type: "",
    realtable_id: "",
    external_link: "",
  });

  const { mutate: handleAddSlider, isPending } = useMutation({
    mutationFn: (newSlider) => {
      if (!hasPermission("sliders-store")) {
        throw new Error(
          `You don't have permission to ${getPermissionDisplayName(
            "sliders-store"
          )}`
        );
      }
      return addSlider({ ...newSlider, token });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["sliderData", token]);
      toast.success("Slider added successfully!");
      navigate("/sliders");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add slider. Please try again.");
    },
  });

  const {
    data: doctorsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["doctorsData"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await getDoctorSliders({
        token,
        page: pageParam,
      });

      const onlyVisitors = (res?.data || []).filter(
        (d) => d?.is_visitor === "yes"
      );

      return {
        data: onlyVisitors,
        current_page: res.current_page,
        last_page: res.last_page,
      };
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.current_page < lastPage.last_page) {
        return lastPage.current_page + 1;
      }
      return undefined;
    },
  });

  const doctors = doctorsData?.pages.flatMap((page) => page.data) || [];

  const { data: hospitalData } = useQuery({
    queryKey: ["hospitalData", token],
    queryFn: () => getHospitals({ token }),
  });
  const { data: labsData } = useQuery({
    queryKey: ["labsData", token],
    queryFn: () => getLabs({ token }),
  });
  const { data: xraysData } = useQuery({
    queryKey: ["XRayData", token],
    queryFn: () => getXrays({ token }),
  });
  const { data: specializationData } = useQuery({
    queryKey: ["specialization", token],
    queryFn: () => getSpecializations({ token }),
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setFormData((prev) => ({ ...prev, media: file }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate based on active tab
    if (activeTab === "external") {
      if (!formData.external_link || !formData.media) {
        toast.error("Please provide both external link and media");
        return;
      }
    } else if (activeTab === "type") {
      if (
        !formData.realtable_type ||
        !formData.realtable_id ||
        !formData.media
      ) {
        toast.error("Please provide type, select an item, and media");
        return;
      }
    }

    handleAddSlider(formData);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("external")}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "external"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            رابط خارجي + وسائط
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("type")}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "type"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            اختيار النوع + وسائط
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Media Upload Section - Common for both tabs */}
          <div className="mb-6">
            <div className="flex justify-center items-center">
              <div className="relative">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Slider Preview"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex justify-center items-center">
                    <FaCamera size={24} className="text-gray-500" />
                  </div>
                )}
                <label
                  htmlFor="imageUpload"
                  className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer"
                >
                  <FaCamera />
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">
              رفع صورة الشريط (مطلوب)
            </p>
          </div>

          {/* Tab Content */}
          {activeTab === "external" && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="external_link"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  الرابط الخارجي
                </label>
                <input
                  type="url"
                  id="external_link"
                  name="external_link"
                  value={formData.external_link}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      external_link: e.target.value,
                    }))
                  }
                  placeholder="https://example.com"
                  className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
                  required
                />
              </div>
            </div>
          )}

          {activeTab === "type" && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="realtable_type"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  اختر النوع
                </label>
                <select
                  name="realtable_type"
                  id="realtable_type"
                  value={formData.realtable_type}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      realtable_type: e.target.value,
                      realtable_id: "",
                    }))
                  }
                  className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
                  required
                >
                  <option value="">اختر النوع</option>
                  {realtableType?.map((data) => (
                    <option key={data.id} value={data.name}>
                      {data.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic content based on selected type */}
              {formData.realtable_type === "doctor" && (
                <div>
                  <label
                    htmlFor="doctor"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    اختر الطبيب
                  </label>

                  <DoctorsSelect
                    selectedDoctor={selectedDoctor}
                    token={token}
                    value={
                      formData.realtable_id
                        ? {
                            value: formData.realtable_id,
                            label: doctors.find(
                              (d) => d.id === formData.realtable_id
                            )?.name,
                          }
                        : null
                    }
                    onChange={(option) => {
                      setSelectedDoctor(option);

                      setFormData((prev) => ({
                        ...prev,
                        realtable_id: option?.value || "",
                      }));
                    }}
                  />
                </div>
              )}

              {formData.realtable_type === "hospital" && (
                <div>
                  <label
                    htmlFor="hospital"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    اختر المستشفى
                  </label>
                  <select
                    name="hospital"
                    id="hospital"
                    value={formData.realtable_id}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        realtable_id: e.target.value,
                      }))
                    }
                    className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
                    required
                  >
                    <option value="">اختر المستشفى</option>
                    {hospitalData?.map((data) => (
                      <option key={data.id} value={data.id}>
                        {data.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formData.realtable_type === "xray" && (
                <div>
                  <label
                    htmlFor="xray"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    اختر الأشعة
                  </label>
                  <select
                    name="xray"
                    id="xray"
                    value={formData.realtable_id}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        realtable_id: e.target.value,
                      }))
                    }
                    className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
                    required
                  >
                    <option value="">اختر الأشعة</option>
                    {xraysData?.map((data) => (
                      <option key={data.id} value={data.id}>
                        {data.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formData.realtable_type === "lab" && (
                <div>
                  <label
                    htmlFor="lab"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    اختر المختبر
                  </label>
                  <select
                    name="lab"
                    id="lab"
                    value={formData.realtable_id}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        realtable_id: e.target.value,
                      }))
                    }
                    className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
                    required
                  >
                    <option value="">اختر المختبر</option>
                    {labsData?.map((data) => (
                      <option key={data.id} value={data.id}>
                        {data.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formData.realtable_type === "specialization" && (
                <div>
                  <label
                    htmlFor="specialization"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    اختر التخصص
                  </label>
                  <select
                    name="specialization"
                    id="specialization"
                    value={formData.realtable_id}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        realtable_id: e.target.value,
                      }))
                    }
                    className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
                    required
                  >
                    <option value="">اختر التخصص</option>
                    {specializationData?.map((data) => (
                      <option key={data.id} value={data.id}>
                        {data.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center items-center mt-8">
            <button
              type="submit"
              disabled={isPending}
              className="flex justify-center items-center text-xl gap-2 bg-primary hover:bg-[#5CB2AF] text-white py-2 px-4 rounded-lg w-44 focus:outline-none disabled:opacity-50"
            >
              {isPending ? "جاري الإضافة..." : "إضافة شريط"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSlider;
