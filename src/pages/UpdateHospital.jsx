import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getSpecializations,
  getSpecificHospital,
  getstates,
  updateHospital,
  getStatByCities,
  getAllDoctors,
} from "../utlis/https";
import { useState, useCallback, useEffect } from "react";
import { hasPermission } from "../utlis/permissionUtils";
import Loader from "./Loader";
import HospitalMap from "./HospitalMap";
import { ErrorMessage } from "formik";
import { IoMdAdd, IoIosCloseCircle } from "react-icons/io";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaHome } from "react-icons/fa";
import { TextField } from "@mui/material";
import MultiSelectDropdown from "../components/MultiSearchSelectorHospital";

const token = localStorage.getItem("authToken");

const UpdateHospital = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { HospitalId } = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Check if user has permission to view doctors
  const canViewDoctors = hasPermission("doctors-index");
  const togglePassword = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };
  const {
    data: hospital,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["Hospital-details", HospitalId],
    queryFn: () => getSpecificHospital({ id: HospitalId, token }),
    enabled: !!HospitalId,
  });
  const { data: states, isLoading: stateIsLoading } = useQuery({
    queryKey: ["states"],
    queryFn: () => getstates({ token }),
  });

  const { data: doctors, isLoading: doctorsIsLoading } = useQuery({
    queryKey: ["doctors"],
    queryFn: () => getAllDoctors({ token }),
    enabled: canViewDoctors, // Only fetch if user has permission
  });
  const { data: specializationsData, isLoading: sppecializationsIsLoading } =
    useQuery({
      queryKey: ["specializations"],
      queryFn: () => getSpecializations({ token }),
    });

  const [hospitalData, setHospitalData] = useState({
    name: "",
    bio: "",
    email: "",
    address: "",
    description: "",
    open_visits: false,
    state: "",
    city: "",
    doctor_ids: [],
    specialization_id: [],
    media: [],
    old_media: [],
    active: false,
    lat: "",
    long: "",
    start_visit_from: "",
    end_visit_at: "",
    visit_time: "",
    Password: "",
    phone: "",
  });
  const { data: cities, isLoading: citiesIsLoading } = useQuery({
    queryKey: ["cities", hospitalData.state_id],
    queryFn: () => getStatByCities({ token, id: hospitalData.state_id }),
    enabled: !!hospitalData.state_id, // Only fetch when state_id is set
  });
  useEffect(() => {
    if (hospital) {
      const doctorIds = hospital.doctors.data.map((doctor) => doctor.id);
      const specializationIds = hospital.specializations.data.map(
        (spec) => spec.id
      );

      setHospitalData({
        name: hospital.name || "",
        bio: hospital.bio || "",
        email: hospital.email || "",
        address: hospital.address || "",
        description: hospital.description || "",
        state_id: hospital.state_id || "",
        city_id: hospital.city_id || "",
        doctor_ids: [...new Set(doctorIds)].sort((a, b) => a - b),
        media: hospital.media_url || [],
        specialization_id: specializationIds || [],
        active: hospital.active,
        lat: hospital.lat || "",
        long: hospital.long || "",
        open_visits: hospital.open_visits,
        end_visit_at: hospital.end_visit_at || "00:00",
        start_visit_from: hospital.start_visit_from || "00:00",
        visit_time: hospital.visit_time || "",
        phone: hospital.phone || "",
      });
    }
  }, [hospital]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHospitalData((prev) => {
      const updatedData = { ...prev, [name]: value };
      if (name === "state_id") {
        updatedData.city_id = "";
      }
      return updatedData;
    });
  };

  const handleSpecializationChange = (SpecializationIds) => {
    console.log(SpecializationIds);
    setHospitalData((prev) => ({
      ...prev,
      specialization_id: SpecializationIds,
    }));
  };

  const handleDoctorChange = (selectedDoctorIds) => {
    // Remove duplicates from selected doctor IDs and sort them
    const uniqueDoctorIds = [...new Set(selectedDoctorIds)].sort(
      (a, b) => a - b
    );

    setHospitalData((prev) => ({
      ...prev,
      doctor_ids: uniqueDoctorIds,
    }));
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setHospitalData((prev) => ({
      ...prev,
      media: [...prev.media, ...files],
    }));
  };
  const handleDeleteImage = (index) => {
    setHospitalData((prev) => {
      const updatedMedia = [...prev.media];
      updatedMedia.splice(index, 1);
      return { ...prev, media: updatedMedia };
    });
  };

  const mutation = useMutation({
    mutationFn: (userData) => {
      const { email, doctor_ids, ...otherData } = userData;

      // Remove duplicate doctor IDs and sort them
      const uniqueDoctorIds = [...new Set(doctor_ids)].sort((a, b) => a - b);

      const payload = {
        ...otherData,
        doctor_ids: uniqueDoctorIds,
        ...(email !== hospital?.email && { email }),
      };
      return updateHospital({ token, ...payload });
    },
    onSuccess: () => {
      toast.success("تم تعديل بيانات المستشفى بنجاح");
      setErrorMessage("");
    },
    onError: (error) => {
      toast.error("حدث خطأ أثناء تعديل بيانات المستشفى");

      const message = error?.errors
        ? error.errors.map((err, index) => `${index + 1}. ${err}`).join("\n")
        : "حدث خطأ غير معروف";

      console.error("Validation Errors:", error.errors);

      setErrorMessage(message);
      toast.error(message);
    },
  });

  const [marker, setMarker] = useState(null);

  const onMapClick = useCallback(
    (event) => {
      const newMarker = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setMarker(newMarker);
      setHospitalData({
        ...hospitalData,
        lat: newMarker.lat,
        long: newMarker.lng,
      });
    },
    [hospitalData]
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const existingMedia = hospitalData.media.filter(
      (item) => typeof item === "string"
    );
    const newMediaFiles = hospitalData.media.filter(
      (item) => item instanceof File
    );

    const allMedia = [...existingMedia, ...newMediaFiles];
    const formattedStartTime = hospitalData.start_visit_from
      ? `${hospitalData.start_visit_from}:00`
      : "";
    const formattedEndTime = hospitalData.end_visit_at
      ? `${hospitalData.end_visit_at}:00`
      : "";

    const start = new Date(`1970-01-01T${formattedStartTime}`);
    const end = new Date(`1970-01-01T${formattedEndTime}`);
    if (end <= start) {
      toast.error("وقت نهاية الزيارة يجب أن يكون بعد وقت البداية");
      return;
    }

    console.log("hospitalData ", hospitalData);

    mutation.mutate({
      id: HospitalId,
      ...hospitalData,
      media: allMedia,
      start_visit_from: formattedStartTime,
      end_visit_at: formattedEndTime,
    });
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div>
        <ErrorMessage />
      </div>
    );
  }
  const doctorsOptions =
    doctors
      ?.filter(
        (doctor, index, self) =>
          index === self.findIndex((d) => d.id === doctor.id)
      )
      ?.map((data) => ({
        value: data.id,
        label: data.name,
      })) || [];

  const specializationOptions =
    specializationsData?.map((data) => ({
      value: data.id,
      label: data.name,
    })) || [];

  return (
    <section className="container mx-auto p-4 w-full ">
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="w-full rounded-md bg-white p-6 shadow-lg max-w-7xl mx-auto"
      >
        <form onSubmit={handleSubmit}>
          <div className="pt-8 lg:pt-12 pb-8 mb-4 lg:flex flex-col  items-start">
            <div className="lg:flex w-full">
              <div className="px-3 my-6 md:mb-0 w-full">
                <label
                  className="block text-md almarai-semibold mb-4"
                  htmlFor="name"
                >
                  <span className="text-red-500">*</span> {t("name")}
                </label>
                <input
                  type="text"
                  name="name"
                  value={hospitalData.name}
                  onChange={handleChange}
                  id="name"
                  placeholder={t("firstName")}
                  className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full "
                />
              </div>

              <div className="px-3 my-6 md:mb-0 w-full">
                <label
                  className="block text-md almarai-semibold mb-4"
                  htmlFor="email"
                >
                  <span className="text-red-500">*</span> {t("email")}
                </label>
                <input
                  type="text"
                  value={hospitalData.email}
                  onChange={handleChange}
                  id="email"
                  name="email"
                  placeholder={t("email")}
                  className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full "
                />
              </div>
            </div>
            <div className="lg:flex mb-6 w-full ">
              <div className="px-3 my-6 md:mb-0 w-full">
                <label
                  className="block text-md almarai-semibold mb-4"
                  htmlFor="address"
                >
                  {t("address")}
                </label>
                <input
                  type="text"
                  value={hospitalData.address}
                  onChange={handleChange}
                  id="address"
                  name="address"
                  placeholder={t("address")}
                  className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full "
                />
              </div>
              <div className="px-3 my-6 md:mb-0 w-full">
                <label
                  className="block text-md almarai-semibold mb-4"
                  htmlFor="bio"
                >
                  {t("bio")}
                </label>
                <input
                  type="text"
                  id="bio"
                  value={hospitalData.bio}
                  onChange={handleChange}
                  name="bio"
                  placeholder={t("bio")}
                  className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full "
                />
              </div>
            </div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 px-4 w-full">
              <div className="mb-4 relative w-full flex flex-col justify-end items-start  col-span-1">
                <label
                  htmlFor="imgs"
                  className="block text-md almarai-semibold mb-4"
                >
                  <span className="text-red-500">*</span> {t("password")}
                </label>
                <input
                  placeholder="********"
                  onChange={handleChange}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="border border-gray-300 rounded-lg py-4 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full "
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute  top-1/2 end-4 transform translate-y-1/2 text-gray-500 text-xl"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* phone failed */}

              <div className="mb-4 relative w-full flex flex-col justify-end items-start  col-span-1">
                <label
                  htmlFor="phone"
                  className="block text-md almarai-semibold mb-4"
                >
                  <span className="text-red-500">*</span> {t("phone")}
                </label>
                <input
                  placeholder={t("phone")}
                  id="phone"
                  name="phone"
                  required
                  onChange={handleChange}
                  value={hospitalData.phone}
                  type="number"
                  className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full "
                />
              </div>
            </div>
            <div className="lg:flex mb-6 w-full">
              <div className="px-3 my-6 md:mb-0 w-full lg:w-1/2">
                <label
                  className="block text-md almarai-semibold mb-4"
                  htmlFor="specializations"
                >
                  {t("specializations")}
                </label>
                {sppecializationsIsLoading ? (
                  <div className="text-gray-500">Loading...</div>
                ) : (
                  <MultiSelectDropdown
                    options={specializationOptions || []}
                    selectedValues={hospitalData.specialization_id}
                    onChange={handleSpecializationChange}
                    placeholder={t("select_specialization")}
                    searchPlaceholder={t("search")}
                    fallbackMessage="لا توجد تخصصات"
                  />
                )}
              </div>
              <div className="px-3 my-6 md:mb-0 w-full lg:w-1/2">
                <label
                  className="block text-md almarai-semibold mb-4"
                  htmlFor="doctor_ids"
                >
                  {t("doctors")}
                </label>
                {doctorsIsLoading ? (
                  <div className="text-gray-500">Loading...</div>
                ) : (
                  <MultiSelectDropdown
                    options={doctorsOptions || []}
                    selectedValues={hospitalData.doctor_ids}
                    onChange={handleDoctorChange}
                    placeholder={t("select_hospital")}
                    searchPlaceholder={t("search")}
                    fallbackMessage={t("no_hospitals_found")}
                  />
                )}
              </div>
            </div>
            <div className="lg:flex mb-6 w-full">
              <div className="px-3 my-6 md:mb-0 w-full">
                <label
                  className="block text-md almarai-semibold mb-4"
                  htmlFor="state_id"
                >
                  <span className="text-red-500">*</span> {t("state")}
                </label>
                {stateIsLoading ? (
                  <div className="text-gray-500">Loading...</div>
                ) : (
                  <select
                    name="state_id"
                    id="state_id"
                    value={hospitalData.state_id}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
                  >
                    <option value="">{t("select_state")}</option>
                    {states?.map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="px-3 my-6 md:mb-0 w-full">
                <label
                  className="block text-md almarai-semibold mb-4"
                  htmlFor="city_id"
                >
                  <span className="text-red-500">*</span> {t("cities")}
                </label>
                {citiesIsLoading ? (
                  <div className="text-gray-500">Loading...</div>
                ) : (
                  <select
                    name="city_id"
                    id="city_id"
                    value={hospitalData.city_id}
                    onChange={handleChange}
                    disabled={!hospitalData.state_id}
                    className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
                  >
                    <option value="">{t("select_city")}</option>
                    {cities?.length > 0 ? (
                      cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        {t("no_cities_available")}
                      </option>
                    )}
                  </select>
                )}
              </div>
            </div>
            <div className="text-xl font-semibold  w-full flex items-center gap-3 my-4">
              <label>{t("active")}</label>
              <input
                className="InputPrimary"
                type="checkbox"
                checked={hospitalData.active === "1"}
                onChange={(e) =>
                  setHospitalData({
                    ...hospitalData,
                    active: e.target.checked ? "1" : "0",
                  })
                }
              />
            </div>
            <div className="w-full bg-gray-200 h-[1px] my-4"></div>
            <div className="flex gap-2 justify-center items-center py-6 w-full">
              <div className="size-12 rounded-full bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] flex justify-center items-center shrink-0 ">
                <FaHome className="text-white" size={25} />
              </div>
              <h2 className="text-2xl font-semibold">{t("homevisit")}</h2>
            </div>
            <div className="flex justify-center my-3  items-center  w-full">
              <div className="text-xl font-semibold  w-full  flex items-center gap-3">
                <label> {t("homevisit")}</label>
                <input
                  className="InputPrimary"
                  type="checkbox"
                  checked={hospitalData.open_visits === 1}
                  onChange={(e) =>
                    setHospitalData({
                      ...hospitalData,
                      open_visits: e.target.checked ? 1 : 0,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-4 mb-6 w-full">
              <TextField
                label="Start Visit From"
                type="time"
                value={hospitalData.start_visit_from}
                onChange={handleChange}
                name="start_visit_from"
                InputLabelProps={{ shrink: true }}
                fullWidth
                className="bg-[#F7F8FA] rounded-lg"
                // inputProps={{ min: hospitalData.end_visit_at }}
              />
              <TextField
                label="End Visit At"
                type="time"
                value={hospitalData.end_visit_at}
                onChange={handleChange}
                name="end_visit_at"
                InputLabelProps={{ shrink: true }}
                fullWidth
                className="bg-[#F7F8FA] rounded-lg"
                // inputProps={{ max: hospitalData.start_visit_from }}
              />
            </div>

            <div className="lg:flex justify-end gap-4 px-4 items-end mb-6 w-full ">
              <div className="  w-full">
                <label
                  className="block text-md almarai-semibold mb-4"
                  htmlFor="doctor_ids"
                >
                  {t("visit_time")}
                </label>
                <input
                  type="text"
                  value={hospitalData.visit_time}
                  onChange={handleChange}
                  id="visit_time"
                  name="visit_time"
                  className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full "
                />
              </div>
            </div>
            <div className="w-full bg-gray-200 h-[1px] my-4"></div>

            <div className="px-3 my-6 md:mb-0 w-full">
              <label
                className=" text-md almarai-semibold mb-4 flex gap-2"
                htmlFor="description"
              >
                <span className="text-red-500">*</span>
                {t("description")}
              </label>

              <textarea
                type="text"
                name="description"
                value={hospitalData.description}
                onChange={handleChange}
                id="description"
                placeholder={t("description")}
                className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full min-h-44 "
              />
            </div>
            <div className="w-full">
              <div className="my-6 relative max-w-full ">
                <label htmlFor="imgs" className="text-end md:text-3xl text-2xl">
                  {t("hospitalimages")}
                </label>
                <div className="flex flex-wrap justify-start items-center gap-4 my-4">
                  {hospitalData.media.map((img, index) => (
                    <div
                      key={index}
                      className="relative w-64 h-44 border border-[#9BA2A6] rounded"
                    >
                      <img
                        src={
                          img instanceof File ? URL.createObjectURL(img) : img
                        }
                        alt={`Image ${index + 1}`}
                        className="rounded object-contain w-full h-44"
                      />
                      <button
                        onClick={() => handleDeleteImage(index)}
                        type="button"
                        className="absolute top-1 right-1 text-red-500"
                      >
                        <IoIosCloseCircle size={30} />
                      </button>
                    </div>
                  ))}
                  <span className="relative w-64 h-44 border border-[#9BA2A6] rounded flex justify-center items-center text-[#9BA2A6] hover:text-[#bec7cc] cursor-pointer">
                    <IoMdAdd size={40} />
                    <input
                      type="file"
                      id="imgs"
                      name="imgs"
                      multiple
                      accept="image/*"
                      className="absolute top-0 left-0 right-0 bottom-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleMediaChange}
                    />
                  </span>
                </div>
              </div>
            </div>
            <div className="w-full my-10">
              <HospitalMap
                hospitalData={hospitalData}
                marker={marker}
                onMapClick={onMapClick}
              />
            </div>
          </div>
          {errorMessage && (
            <ul className=" text-red-700 px-4 py-3 rounded mb-4">
              {errorMessage.split(", ").map((error, index) => (
                <li key={index} className="list-disc ml-4">
                  {error}
                </li>
              ))}
            </ul>
          )}

          <div className="text-end justify-end py-10 flex w-full">
            <button
              type="submit"
              className="px-6 py-2 hover:bg-[#048c87] w-36 text-white  bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg  rounded-[8px] focus:outline-none  text-center"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? t("saving") : t("save")}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default UpdateHospital;
