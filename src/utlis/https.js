/* eslint-disable no-unused-vars */

import { toHHMM } from "./helpers/time-helper";

/* eslint-disable no-useless-catch */
const API_URL = import.meta.env.VITE_APP_API_URL;

// Helper function to get token from localStorage
const getToken = () => {
  return localStorage.getItem("authToken");
};
//admin
export const getUser = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/admin/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const updateUserData = async ({
  token,
  name,
  email,
  phone,
  address,
  media_url,
  password,
}) => {
  const formdata = new FormData();
  formdata.append("name", name);
  formdata.append("email", email);
  formdata.append("phone", phone);
  formdata.append("address", address);
  if (password) {
    formdata.append("password", password);
  }
  if (media_url) {
    formdata.append("image", media_url);
  }

  const response = await fetch(`${API_URL}/dashboard/v1/admin/update`, {
    method: "POST",
    body: formdata,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.msg || "An error occurred while updating the user data",
    );
  }

  return result.data;
};
//doctors
export const getDoctors = async ({
  token,
  page = 1,
  search = "",
  isSpecial = "",
  isVisitor = "",
}) => {
  try {
    const queryParams = new URLSearchParams();
    if (search) queryParams.append("name", search);
    if (isSpecial) queryParams.append("is_special", isSpecial);
    // if (isVisitor) queryParams.append("is_visitor", isVisitor);
    if (page) queryParams.append("page", page);

    const response = await fetch(
      `${API_URL}/dashboard/v1/doctors?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
    throw new Error("Failed to fetch doctors");
  } catch (error) {
    throw error;
  }
};
export const getDoctorSliders = async ({
  token,
  page = 1,
  search = "",
  isSpecial = "",
  // isVisitor = "",
}) => {
  try {
    const queryParams = new URLSearchParams();
    if (page) queryParams.append("page", String(page));
    if (search) queryParams.append("name", search);
    if (isSpecial) queryParams.append("is_special", isSpecial);
    // if (isVisitor) queryParams.append("is_visitor", isVisitor);

    const response = await fetch(
      `${API_URL}/dashboard/v1/doctors?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      return data?.data;
    }
    throw new Error("Failed to fetch doctors");
  } catch (error) {
    console.log("errorerror", error.message);
    throw error;
  }
};

export const getSpecificDoctor = async ({ token, id }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/doctors/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};

export const getSpecificCoupon = async ({ token, id }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/coupons/${id}/usage`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};

export const deleteDoctor = async ({ id, token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/doctors/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while deleting the doctor",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const updateDoctor = async ({
  id,
  name,
  bio,
  _method = "PATCH",
  address,
  email,
  phone,
  media,
  job_title,
  specialization_id,
  hospital_ids = [],
  is_visitor,
  isAbleToCancel,
}) => {
  const formdata = new FormData();
  const token = getToken();

  formdata.append("name", name);
  formdata.append("_method", _method);
  formdata.append("bio", bio);
  formdata.append("address", address);
  formdata.append("email", email);
  formdata.append("phone", phone);
  formdata.append("is_visitor", is_visitor);
  formdata.append("is_special", isAbleToCancel);

  hospital_ids.forEach((id) => {
    formdata.append("hospital_ids[]", id);
  });
  if (media && !(typeof media === "string")) {
    formdata.append("media", media);
  }
  formdata.append("job_title", job_title);
  formdata.append("specialization_id", specialization_id);
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/doctors/${id}`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      if (Array.isArray(result.errors)) {
        console.error("Validation Errors:", result.errors);
        throw new Error(result.errors.join(", "));
      } else {
        throw new Error(
          result.message || "An error occurred while updating the doctor",
        );
      }
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const addDoctor = async ({
  name,
  bio,
  address,
  email,
  phone,
  media,
  job_title,
  specialization_id,
  hospital_ids = [],
  is_visitor,
  isAbleToCancel,
}) => {
  const formdata = new FormData();
  const token = getToken();
  formdata.append("name", name);
  formdata.append("bio", bio);
  formdata.append("address", address);
  formdata.append("email", email);
  formdata.append("phone", phone);
  formdata.append("is_visitor", is_visitor);
  formdata.append("is_special", isAbleToCancel);

  hospital_ids.forEach((id) => {
    formdata.append("hospital_ids[]", id);
  });
  if (media && !(typeof media === "string")) {
    formdata.append("media", media);
  }
  formdata.append("job_title", job_title);
  formdata.append("specialization_id", specialization_id);
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/doctors`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      if (Array.isArray(result.errors)) {
        console.error("Validation Errors:", result.errors);
        throw new Error(result.errors.join(", "));
      } else {
        throw new Error(
          result.message || "An error occurred while adding the doctor",
        );
      }
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const restoreDoctor = async ({ id, token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/doctors/${id}/restore`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while restoring the doctors",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const getTrashedDoctor = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/trashed/doctors`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
//hospitals

export const getSpecificHospital = async ({ token, id }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/hospitals/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();

      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const newHospital = async ({
  token,
  name,
  bio,
  description,
  password,
  active,
  lat,
  long,
  city_id,
  email,
  address,
  state_id,
  media = [],
  doctor_ids = [],
  specialization_id = [],
  start_visit_from,
  end_visit_at,
  phone,
}) => {
  const formdata = new FormData();

  formdata.append("name", name);
  formdata.append("address", address);
  if (bio) {
    formdata.append("bio", bio);
  }
  if (end_visit_at) {
    formdata.append("start_visit_from", start_visit_from);
  }
  if (start_visit_from) {
    formdata.append("end_visit_at", end_visit_at);
  }

  formdata.append("description", description);
  formdata.append("password", password);
  formdata.append("email", email);
  formdata.append("active", active ? "1" : "0");
  formdata.append("lat", lat);
  formdata.append("long", long);
  formdata.append("phone", phone);
  if (city_id) {
    formdata.append("city_id", city_id);
  }
  if (state_id) {
    formdata.append("state_id", state_id);
  }

  media.forEach((file) => {
    formdata.append("media[]", file);
  });

  doctor_ids.forEach((id) => {
    formdata.append("doctor_ids[]", id);
  });
  if (specialization_id) {
    specialization_id.forEach((id) => {
      formdata.append("specialization_id[]", id);
    });
  }

  try {
    const response = await fetch(`${API_URL}/dashboard/v1/hospitals`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const getHospitals = async ({ token }) => {
  try {
    let allHospitals = [];
    let currentPage = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      const response = await fetch(
        `${API_URL}/dashboard/v1/hospitals?page=${currentPage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        allHospitals = [...allHospitals, ...data.data.data];

        // Check if there are more pages
        hasMorePages = data.data.meta.has_more_pages;
        currentPage++;
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    return allHospitals;
  } catch (error) {
    throw error;
  }
};
export const updateHospital = async ({
  id,
  _method = "PATCH",
  token,
  name,
  bio,
  description,
  active,
  lat,
  long,
  city_id,
  address,
  email,
  previousEmail,
  state_id,
  start_visit_from,
  end_visit_at,
  visit_time,
  media = [],
  open_visits,
  old_media = [],
  doctor_ids = [],
  specialization_id = [],
  password,
  phone,
}) => {
  const formdata = new FormData();
  formdata.append("address", address);
  formdata.append("name", name);
  formdata.append("_method", _method);
  formdata.append("bio", bio);
  formdata.append("description", description);
  formdata.append("lat", lat);
  formdata.append("long", long);
  formdata.append("city_id", city_id);
  formdata.append("state_id", state_id);
  formdata.append("start_visit_from", start_visit_from);
  formdata.append("end_visit_at", end_visit_at);
  formdata.append("visit_time", visit_time);
  formdata.append("open_visits", open_visits);
  formdata.append("active", active);
  formdata.append("phone", phone);
  if (password) {
    formdata.append("password", password);
  }
  if (email && email !== previousEmail) {
    formdata.append("email", email);
  }
  old_media.forEach((file) => {
    formdata.append("old_media[]", file);
  });

  media.forEach((file) => {
    if (typeof file === "string") {
      formdata.append("old_media[]", file);
    } else {
      formdata.append("media[]", file);
    }
  });

  // Doctor IDs
  if (doctor_ids.length === 0) {
    formdata.append("doctor_ids[]", JSON.stringify([]));
    formdata.append("all_doctors_removed", true);
  } else {
    formdata.append("doctor_ids[]", doctor_ids);
  }

  // Specialization IDs
  if (specialization_id.length === 0) {
    formdata.append("specialization_id[]", JSON.stringify([]));
    formdata.append("all_specializations_removed", true);
  } else {
    formdata.append("specialization_id[]", specialization_id);
  }

  console.log("specialization_id ", specialization_id);
  console.log("doctor_ids ", doctor_ids);

  try {
    const response = await fetch(`${API_URL}/dashboard/v1/hospitals/${id}`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const deleteHospital = async ({ id, token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/hospitals/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while deleting the Hospital",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const restoreHospital = async ({ id, token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/hospitals/${id}/restore`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while restoring the Hospital",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const getTrashedHospitals = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/trashed/hospitals`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
// specializations
export const getSpecializations = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/specializations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getSpecificSpecializations = async ({ token, id }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/specializations/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const newSpecializations = async ({
  token,
  name,
  media,
  hospital_ids = [],
}) => {
  const formdata = new FormData();
  formdata.append("name", name);
  formdata.append("media", media);
  hospital_ids.forEach((id) => {
    formdata.append("hospital_ids[]", id);
  });

  try {
    const response = await fetch(`${API_URL}/dashboard/v1/specializations`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while adding a new Specializations",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const updateSpecializations = async ({
  id,
  token,
  name,
  media,
  _method = "PATCH",
  hospital_ids = [],
}) => {
  const formdata = new FormData();

  formdata.append("name", name);
  formdata.append("media", media);
  formdata.append("_method", _method);

  hospital_ids.forEach((id) => {
    formdata.append(" hospital_ids[]", id);
  });

  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/specializations/${id}`,
      {
        method: "POST",
        body: formdata,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while updating a new Specializations ",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const deleteSpecializations = async ({ id, token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/specializations/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while deleting the specializations",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const restorespecializations = async ({ id, token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/specializations/${id}/restore`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while restoring the specializations",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const getTrashedSpecializations = async ({ token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/trashed/specializations`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};

//states
export const getstates = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/states`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
//states
export const getStatByCities = async ({ token, id }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/cities-by-specialization`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          state_ids: [id],
        }),
      },
    );

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getSpecificState = async ({ token, id }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/states/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const deleteState = async ({ id, token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/states/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while deleting the state",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const updateState = async ({ id, name, _method = "PATCH", token }) => {
  const formdata = new FormData();

  formdata.append("name", name);
  formdata.append("_method", _method);

  try {
    const response = await fetch(`${API_URL}/dashboard/v1/states/${id}`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while updating the state",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const addState = async ({ name, token }) => {
  const formdata = new FormData();

  formdata.append("name", name);

  try {
    const response = await fetch(`${API_URL}/dashboard/v1/states`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while updating the state",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const restoreState = async ({ id, token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/states/${id}/restore`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while restoring the specializations",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const getTrashedState = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/trashed/states`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};

//cities
export const getcities = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/cities`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getCity = async ({ token, id }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/cities/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const deleteCity = async ({ id, token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/cities/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while deleting the city",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const updateCity = async ({
  id,
  name,
  state_id,
  _method = "PATCH",
  token,
}) => {
  const formdata = new FormData();

  formdata.append("name", name);
  formdata.append("state_id", state_id);
  formdata.append("_method", _method);

  try {
    const response = await fetch(`${API_URL}/dashboard/v1/cities/${id}`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while updating the city",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const addCity = async ({ name, token, state_id }) => {
  const formdata = new FormData();

  formdata.append("name", name);
  formdata.append("state_id", state_id);

  try {
    const response = await fetch(`${API_URL}/dashboard/v1/cities`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while updating the city",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const restoreCity = async ({ id, token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/cities/${id}/restore`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while restoring the cities",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const getTrashedCity = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/trashed/cities`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};

// regions (admin)
export const getRegions = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/admin/regions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};

export const getRegion = async ({ token, id }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/regions/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};

export const addRegion = async ({ name, city_id, token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/admin/regions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, city_id }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while creating the region",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const updateRegion = async ({ id, name, city_id, token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/regions-update/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, city_id }),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while updating the region",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const deleteRegion = async ({ id, token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/regions/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while deleting the region",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//sliders
export const getSliders = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/sliders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getSliderById = async ({ token, id }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/sliders/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const deleteSliders = async ({ id, token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/sliders/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const updateSliders = async ({
  realtable_type,
  realtable_id,
  token,
  media,
  id,
  _method = "PATCH",
  external_link,
}) => {
  const formdata = new FormData();

  formdata.append("_method", _method);
  if (realtable_type) {
    formdata.append("realtable_type", realtable_type);
  }
  if (realtable_id) {
    formdata.append("realtable_id", realtable_id);
  }
  if (external_link) {
    formdata.append("external_link", external_link);
  }

  if (media && !(typeof media === "string")) {
    formdata.append("media", media);
  }
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/sliders/${id}`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while updating the doctor",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const getDoctorCommissions = async ({ token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/doctor-commissions`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const addDoctorCommission = async ({
  token,
  hospital_id,
  tabi_commission_percentage,
}) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/doctor-commissions/store`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hospital_id,
          tabi_commission_percentage,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const updateDoctorCommission = async ({
  token,
  commissionId,
  hospital_id,
  tabi_commission_percentage,
}) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/doctor-commissions/${commissionId}/update`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hospital_id,
          tabi_commission_percentage,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Home Visit Commission APIs
export const getHomeVisitCommissions = async ({ token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/homevisit-commissions`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const addHomeVisitCommission = async ({
  token,
  hospital_id,
  tabi_commission_percentage,
}) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/homevisit-commissions/store`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hospital_id,
          tabi_commission_percentage,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const updateHomeVisitCommission = async ({
  token,
  commissionId,
  hospital_id,
  tabi_commission_percentage,
}) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/homevisit-commissions/${commissionId}/update`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hospital_id,
          tabi_commission_percentage,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getWallet = async ({ token, hospital_id, date_from, date_to }) => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    if (hospital_id) params.append("hospital_id", hospital_id);
    if (date_from) params.append("date_from", date_from);
    if (date_to) params.append("date_to", date_to);

    const queryString = params.toString();
    const url = `${API_URL}/dashboard/v1/admin/get-wallet${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getHospitalWallet = async ({
  token,
  hospital_id,
  date_from,
  date_to,
}) => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    if (hospital_id) params.append("hospital_id", hospital_id);
    if (date_from) params.append("date_from", date_from);
    if (date_to) params.append("date_to", date_to);

    const queryString = params.toString();
    const url = `${API_URL}/dashboard/v1/admin/get-wallet-hospital${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const addSlider = async ({
  realtable_type,
  realtable_id,
  token,
  media,
  external_link,
}) => {
  const formdata = new FormData();

  if (realtable_type) {
    formdata.append("realtable_type", realtable_type);
  }
  if (realtable_id) {
    formdata.append("realtable_id", realtable_id);
  }
  if (media && !(typeof media === "string")) {
    formdata.append("media", media);
  }
  if (external_link) {
    formdata.append("external_link", external_link);
  }
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/sliders`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while adding the slider",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//xrays
export const getXrays = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/x-rays`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
//common questions

export const getQuestions = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/common-questions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getQuestion = async ({ token, id }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/common-questions/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const deleteQuestion = async ({ id, token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/common-questions/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const updateQuestions = async ({
  question,
  answer,
  token,
  id,
  _method = "PATCH",
}) => {
  const formdata = new FormData();
  formdata.append("question", question);
  formdata.append("answer", answer);
  formdata.append("_method", _method);

  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/common-questions/${id}`,
      {
        method: "POST",
        body: formdata,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while updating the doctor",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const addQuestion = async ({ question, answer, token }) => {
  const formdata = new FormData();

  formdata.append("question", question);
  formdata.append("answer", answer);
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/common-questions`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while adding the question",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
//recharge card
export const getRechargeCards = async ({
  token,
  is_valid,
  expire_date,
  card_number,
  batch_number,
}) => {
  try {
    const params = new URLSearchParams();

    if (is_valid !== undefined) params.append("is_valid", is_valid);
    if (expire_date) params.append("expire_date", expire_date);
    if (card_number) params.append("card_number", card_number);
    if (batch_number) params.append("batch_number", batch_number);

    const queryString = params.toString();
    const url = queryString
      ? `${API_URL}/dashboard/v1/recharge?${queryString}`
      : `${API_URL}/dashboard/v1/recharge`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    throw error;
  }
};
export const addRechargeCards = async ({
  count,
  expire_date,
  price,
  batch_number,
  token,
}) => {
  const formdata = new FormData();

  formdata.append("count", count);
  formdata.append("expire_date", expire_date);
  formdata.append("price", price);
  formdata.append("batch_number", batch_number);

  try {
    const response = await fetch(`${API_URL}/dashboard/v1/recharge`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "An error occurred while adding the card",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
//Settings
export const getSettings = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/admin/get-settings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const addSettings = async ({
  points_for_register,
  points_for_review,
  points_for_booking,
  points_value,
  token,
}) => {
  const formdata = new FormData();

  formdata.append("points_for_register", points_for_register);
  formdata.append("points_for_review", points_for_review);
  formdata.append("points_for_booking", points_for_booking);

  for (const [points, value] of Object.entries(points_value)) {
    formdata.append(`points_value[${points}]`, value);
  }

  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/store-settings`,
      {
        method: "POST",
        body: formdata,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.msg || "An error occurred while adding settings");
    }
    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getSetting = async ({ token, id }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/get-settings/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const updateSetting = async ({ id, token, ...data }) => {
  const payload = {
    ...data,
    _method: "PATCH",
  };

  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/update-settings/${id}`,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while updating settings",
      );
    }
    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
// Coupons API Calls
export const getCoupons = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/coupons`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const UpdateCoupon = async ({
  token,
  code,
  type,
  amount,
  status,
  max_used,
  expire_date,
  id,
  originalCoupon, // إضافة بيانات الكوبون الأصلية للمقارنة
  _method = "PATCH",
}) => {
  const formdata = new FormData();
  formdata.append("_method", _method);
  formdata.append("status", status);

  // إضافة الحقول التي تغيرت فقط
  if (code && code !== originalCoupon.code) {
    formdata.append("code", code);
  }
  if (type && type !== originalCoupon.type) {
    formdata.append("type", type);
  }
  if (amount && amount !== originalCoupon.amount) {
    formdata.append("amount", amount);
  }

  if (max_used && max_used !== originalCoupon.max_used) {
    formdata.append("max_used", max_used);
  }
  if (expire_date && expire_date !== originalCoupon.expire_date) {
    formdata.append("expire_date", expire_date);
  }

  try {
    const response = await fetch(`${API_URL}/dashboard/v1/coupons/${id}`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "حدث خطأ أثناء تحديث الكوبون");
    }

    return result.data;
  } catch (error) {
    throw error;
  }
};
export const newCoupon = async ({
  token,
  code,
  type,
  amount,
  status,
  add_max_used,
  add_expire_date,
}) => {
  const formdata = new FormData();

  // Required fields
  formdata.append("code", code);
  formdata.append("type", type);
  formdata.append("amount", amount);
  formdata.append("status", status);
  formdata.append("max_used", add_max_used);
  formdata.append("expire_date", add_expire_date);

  try {
    const response = await fetch(`${API_URL}/dashboard/v1/coupons`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "An error occurred while adding the Coupon",
      );
    }

    return result.data;
  } catch (error) {
    throw error;
  }
};
export const deleteCoupon = async ({ id, token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/coupons/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
//labs
export const getLabs = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/labs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getTrashedLabs = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/trashed/labs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getSpecificLab = async ({ token, id }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/labs/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const newLab = async ({
  token,
  name,
  email,
  bio,
  description,
  password,
  active,
  lat,
  long,
  city_id,
  state_id,
  media = [],
  doctor_ids = [],
  specialization_id = [],
}) => {
  const formdata = new FormData();

  formdata.append("name", name);
  formdata.append("email", email);
  formdata.append("bio", bio);
  formdata.append("description", description);
  formdata.append("password", password);
  formdata.append("active", active ? "1" : "0");
  formdata.append("lat", lat);
  formdata.append("long", long);
  formdata.append("city_id", city_id);
  formdata.append("state_id", state_id);

  media.forEach((file) => {
    formdata.append("media[]", file);
  });

  doctor_ids.forEach((id) => {
    formdata.append("doctor_ids[]", id);
  });

  // Append specialization IDs
  specialization_id.forEach((id) => {
    formdata.append("specialization_id[]", id);
  });

  try {
    // Make the request
    const response = await fetch(`${API_URL}/dashboard/v1/labs`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    // Handle errors
    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while adding a new Hospital",
      );
    }

    // Return the response data
    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const updateLab = async ({
  id,
  token,
  name,
  email,
  bio,
  description,
  password,
  active,
  lat,
  long,
  city_id,
  state_id,
  media = [],
  doctor_ids = [],
  specialization_id = [],
}) => {
  const formdata = new FormData();

  formdata.append("name", name);
  formdata.append("email", email);
  formdata.append("bio", bio);
  formdata.append("description", description);
  formdata.append("password", password);
  formdata.append("active", active ? "1" : "0");
  formdata.append("lat", lat);
  formdata.append("long", long);
  formdata.append("city_id", city_id);
  formdata.append("state_id", state_id);

  media.forEach((file) => {
    formdata.append("media[]", file);
  });

  doctor_ids.forEach((id) => {
    formdata.append("doctor_ids[]", id);
  });

  specialization_id.forEach((id) => {
    formdata.append("specialization_id[]", id);
  });

  try {
    const response = await fetch(`${API_URL}/dashboard/v1/labs/${id}`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while updating  the Hospital",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const deleteLab = async ({ id, token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/labs/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while deleting the Hospital",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const restoreLab = async ({ id, token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/labs/${id}/restore`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while restoring the Hospital",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
// Lab Types
export const getLabTypes = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/lab-types`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getSpecificLabType = async ({ token, id }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/lab-types/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const newLabType = async ({
  token,
  name,
  description,
  active,
  media = [],
}) => {
  const formdata = new FormData();

  formdata.append("name", name);
  formdata.append("description", description);
  formdata.append("media", media);
  formdata.append("active", active ? "1" : "0");

  try {
    const response = await fetch(`${API_URL}/dashboard/v1/lab-types`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while adding a new Lab type",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const updateLabType = async ({
  id,
  token,
  name,
  description,
  media,
  _method = "PATCH",
}) => {
  const formdata = new FormData();

  formdata.append("name", name);
  formdata.append("description", description);
  formdata.append("media", media);
  formdata.append("_method", _method);

  try {
    const response = await fetch(`${API_URL}/dashboard/v1/lab-types/${id}`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while updating the Lab type",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const deleteLabType = async ({ id, token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/lab-types/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while deleting the Lab type",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const restoreLabType = async ({ id, token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/lab-types/${id}/restore`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while restoring the Lab type",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
// Employee
export const getEmployees = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/employee`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getSpecificEmployee = async ({ token, id }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/employee/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const newEmployee = async ({
  token,
  name,
  email,
  phone,
  password,
  hospital_id,
  specialization_id,
  active,
  media = "",
}) => {
  const formdata = new FormData();

  // إضافة جميع الحقول المطلوبة إلى FormData
  formdata.append("name", name);
  formdata.append("email", email);
  formdata.append("phone", phone);
  if (password) {
    formdata.append("password", password);
  }
  formdata.append("hospital_id", hospital_id);
  formdata.append("specialization_id", specialization_id);
  formdata.append("active", active ? "1" : "0");

  formdata.append("media", media);

  try {
    const response = await fetch(`${API_URL}/dashboard/v1/employee`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const updateEmployee = async ({
  id,
  token,
  name,
  email,
  phone,
  password,
  hospital_id,
  specialization_id,
  active,
  media,
}) => {
  const formdata = new FormData();
  if (name) {
    formdata.append("name", name);
  }
  if (email) {
    formdata.append("email", email);
  }
  formdata.append("_method", "patch");
  formdata.append("phone", phone);
  if (password) formdata.append("password", password);
  formdata.append("hospital_id", hospital_id);
  formdata.append("specialization_id", specialization_id);
  formdata.append("active", active ? "1" : "0");

  if (media instanceof File) {
    formdata.append("media", media);
  }

  try {
    const response = await fetch(`${API_URL}/dashboard/v1/employee/${id}`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    return result.data;
  } catch (error) {
    throw error;
  }
};
export const deleteEmployee = async ({ id, token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/employee/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while deleting the Employee",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const restoreEmployee = async ({ id, token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/employee/${id}/restore`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while restoring the Employee",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
//services
export const getServices = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/home-visit-service`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getHomeVisitReportById = async ({ token, serviceId }) => {
  try {
    const url = `${API_URL}/dashboard/v1/get-home-visit-report/${serviceId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch home visit report: ${response.status} - ${errorText}`,
      );
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Error in getHomeVisitReport: ${error.message}`);
  }
};
export const getUserReportById = async ({ token, userid }) => {
  try {
    const url = `${API_URL}/dashboard/v1/get-user-report-data/${userid}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch home visit report: ${response.status} - ${errorText}`,
      );
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Error in getHomeVisitReport: ${error.message}`);
  }
};

export const updateService = async ({
  token,
  name,
  _method = "PATCH",
  id,

  type,
}) => {
  const formdata = new FormData();
  formdata.append("name", name);
  formdata.append("type", type);
  formdata.append("_method", _method);

  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/home-visit-service/${id}`,
      {
        method: "POST",
        body: formdata,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const deleteService = async ({ id, token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/home-visit-service/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while deleting the service",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const getService = async ({ token, id }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/home-visit-service/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const postServices = async ({ token, name, type }) => {
  const formdata = new FormData();
  formdata.append("name", name);
  formdata.append("type", type);

  try {
    const response = await fetch(`${API_URL}/dashboard/v1/home-visit-service`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// hospital services (admin)
export const getHospitalServices = async ({ token, main_service_name }) => {
  try {
    let url = `${API_URL}/dashboard/v1/admin/hospital-services/all`;
    const params = [];
    if (main_service_name) {
      params.push(`main_service_name=${encodeURIComponent(main_service_name)}`);
    }
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};

export const addHospitalService = async ({
  token,
  hospital_id,
  name,
  tabi_commission,
  hospital_commission,
  status,
  hospital_main_service_id,
}) => {
  const formdata = new FormData();
  formdata.append("hospital_id", hospital_id);
  formdata.append("name", name);
  formdata.append("tabi_commission", tabi_commission);
  formdata.append("hospital_commission", hospital_commission);
  formdata.append("status", status);
  if (hospital_main_service_id) {
    formdata.append("hospital_main_service_id", hospital_main_service_id);
  }

  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/hospital-services`,
      {
        method: "POST",
        body: formdata,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const updateHospitalService = async ({
  token,
  id,
  hospital_id,
  name,
  tabi_commission,
  hospital_commission,
  status,
  hospital_main_service_id,
}) => {
  const formdata = new FormData();
  if (hospital_id !== undefined) formdata.append("hospital_id", hospital_id);
  if (name !== undefined) formdata.append("name", name);
  if (tabi_commission !== undefined)
    formdata.append("tabi_commission", tabi_commission);
  if (hospital_commission !== undefined)
    formdata.append("hospital_commission", hospital_commission);
  if (status !== undefined) formdata.append("status", status);
  if (hospital_main_service_id !== undefined)
    formdata.append("hospital_main_service_id", hospital_main_service_id);

  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/hospital-services/update/${id}`,
      {
        method: "POST",
        body: formdata,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const deleteHospitalService = async ({ id, token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/hospital-services/delete/${id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while deleting the hospital service",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
//notifcation
export const getNotification = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/notification`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const checkToken = async ({ token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/admin-check-token`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while checking the token",
      );
    }

    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
//refunds
export const getRefundsDetails = async ({
  token,
  doctorname = "",
  hospitalId,
}) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/refund-booking?doctor_name=${doctorname}&hospital_id=${hospitalId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getRefunds = async ({ token, hospitalname }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/refund-one?hospital_name=${hospitalname}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const postRefund = async ({ appointments, token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/cancel-booking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ appointments }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while processing the refund",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const cancelBooking = async ({ bookingId, token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/delete-booking/${bookingId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while processing the refund",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
//dashboard
export const getAllUsers = async () => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/dashboard/v1/get-all-users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getAllHospitals = async () => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/dashboard/v1/get-all-hospitals`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getAllDoctors = async () => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/dashboard/v1/get-all-doctors`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getAllHomeVisit = async () => {
  try {
    const token = getToken();
    const response = await fetch(
      `${API_URL}/dashboard/v1/get-all-home-visit-services`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getStateAndCitiesReport = async ({ token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/get-states-with-user-counts`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getReviewsReport = async ({
  token,
  user_id,
  type,
  reviewable_id,
}) => {
  try {
    let url = `${API_URL}/dashboard/v1/get-reviews-report`;
    const params = [];

    if (user_id) {
      params.push(`user_id=${user_id}`);
    }
    if (type) {
      params.push(`reviewable_type=${type}`);
    }
    if (reviewable_id) {
      params.push(`reviewable_id=${reviewable_id}`);
    }

    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch reviews report: ${response.status} - ${errorText}`,
      );
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    throw new Error(`Error in getReviewsReport: ${error.message}`);
  }
};
export const getCancelledReport = async ({
  token,
  user_id,
  doctor_id,
  hospital_id,
  from_date,
  to_date,
}) => {
  try {
    let url = `${API_URL}/dashboard/v1/get-cancelled-booking-report`;
    const params = [];
    if (user_id) {
      params.push(`user_id=${user_id}`);
    }
    if (doctor_id) {
      params.push(`doctor_id=${doctor_id}`);
    }
    if (hospital_id) {
      params.push(`hospital_id=${hospital_id}`);
    }

    if (from_date) {
      params.push(`from_date=${from_date}`);
    }
    if (to_date) {
      params.push(`to_date=${to_date}`);
    }
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch reviews report: ${response.status} - ${errorText}`,
      );
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    throw new Error(`Error in getReviewsReport: ${error.message}`);
  }
};
export const getDocotrReport = async ({
  token,
  doctor_id,
  hospital_id,
  from_date,
  to_date,
  page,
}) => {
  try {
    let url = `${API_URL}/dashboard/v1/get-doctor-report`;
    const params = [];

    if (doctor_id) {
      params.push(`doctor_id=${doctor_id}`);
    }
    if (hospital_id) {
      params.push(`hospital_id=${hospital_id}`);
    }
    if (from_date) {
      params.push(`from_date=${from_date}`);
    }
    if (to_date) {
      params.push(`to_date=${to_date}`);
    }
    if (page) {
      params.push(`page=${page}`);
    }
    if (page) {
      params.push(`per_page=${10}`);
    }
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch reviews report: ${response.status} - ${errorText}`,
      );
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    throw new Error(`Error in getReviewsReport: ${error.message}`);
  }
};
export const getHospitalsReport = async ({
  token,
  hospital_id,
  from_date,
  to_date,
}) => {
  try {
    let url = `${API_URL}/dashboard/v1/get-hospital-report`;
    const params = [];

    if (hospital_id) {
      params.push(`hospital_id=${hospital_id}`);
    }
    if (from_date) {
      params.push(`from_date=${from_date}`);
    }
    if (to_date) {
      params.push(`to_date=${to_date}`);
    }
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch reviews report: ${response.status} - ${errorText}`,
      );
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    throw new Error(`Error in getReviewsReport: ${error.message}`);
  }
};
export const getGeneralStatistics = async () => {
  try {
    const token = getToken();
    const response = await fetch(
      `${API_URL}/dashboard/v1/get-general-statistics`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getUsersReport = async ({
  token,
  user_id,
  doctor_id,
  hospital_id,
  from_date,
  to_date,
  page,
}) => {
  try {
    let url = `${API_URL}/dashboard/v1/get-user-report`;
    const params = [];
    if (user_id) {
      params.push(`user_id=${user_id}`);
    }
    if (doctor_id) {
      params.push(`doctor_id=${doctor_id}`);
    }
    if (hospital_id) {
      params.push(`hospital_id=${hospital_id}`);
    }

    if (from_date) {
      params.push(`from_date=${from_date}`);
    }
    if (to_date) {
      params.push(`to_date=${to_date}`);
    }
    if (to_date) {
      params.push(`to_date=${to_date}`);
    }
    // if (page) {
    //   params.push(`page=${page}`);
    // }
    // if (page) {
    //   params.push(`per_page=${10}`);
    // }
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch reviews report: ${response.status} - ${errorText}`,
      );
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    throw new Error(`Error in getReviewsReport: ${error.message}`);
  }
};
export const getHomeVisitReport = async ({
  token,
  user_id,
  doctor_id,
  hospital_id,
  from_date,
  to_date,
}) => {
  try {
    let url = `${API_URL}/dashboard/v1/get-home-visit-report`;
    const params = [];
    if (user_id) {
      params.push(`user_id=${user_id}`);
    }
    if (doctor_id) {
      params.push(`doctor_id=${doctor_id}`);
    }
    if (hospital_id) {
      params.push(`hospital_id=${hospital_id}`);
    }

    if (from_date) {
      params.push(`from_date=${from_date}`);
    }
    if (to_date) {
      params.push(`to_date=${to_date}`);
    }
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch reviews report: ${response.status} - ${errorText}`,
      );
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    throw new Error(`Error in getReviewsReport: ${error.message}`);
  }
};
/**
 * Fetches hospitals that have service bookings summary.
 * Returns an array of objects: { hospital_id, hospital_name, total_bookings }
 */
export const getHospitalsServiceBookingsSummary = async ({ token }) => {
  try {
    const url = `${API_URL}/dashboard/v1/hospitals-service-bookings-summary`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch hospitals bookings summary: ${response.status} - ${errorText}`,
      );
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    throw new Error(
      `Error in getHospitalsServiceBookingsSummary: ${error.message}`,
    );
  }
};

// get hospital services report by hospital id
export const getHospitalServiceReportById = async ({
  token,
  hospital_id,
  from_date,
  to_date,
  status,
  deleted,
}) => {
  try {
    let url = `${API_URL}/dashboard/v1/get-hospital-service-report-by-id`;
    const params = [];
    if (hospital_id) params.push(`hospital_id=${hospital_id}`);
    if (from_date) params.push(`from_date=${from_date}`);
    if (to_date) params.push(`to_date=${to_date}`);
    if (status) params.push(`status=${status}`);
    if (typeof deleted === "boolean") params.push(`deleted=${deleted}`);
    if (params.length > 0) url += `?${params.join("&")}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch hospital services report: ${response.status} - ${errorText}`,
      );
    }

    const data = await response.json();
    return data.data || { hospital_name: "", bookings: [] };
  } catch (error) {
    throw new Error(`Error in getHospitalServiceReportById: ${error.message}`);
  }
};

// cancel hospital service booking
export const cancelHospitalServiceBooking = async ({ bookingId, token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/hospital-service-bookings/${bookingId}/cancel`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while canceling the booking",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

/**
 * Fetches hospitals that have home visit bookings summary.
 * Returns an array of objects: { hospital_id, hospital_name, total_bookings }
 */
export const getHomeVisitBookingsSummary = async ({ token }) => {
  try {
    const url = `${API_URL}/dashboard/v1/home-visit-bookings-summary`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch home visit bookings summary: ${response.status} - ${errorText}`,
      );
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    throw new Error(`Error in getHomeVisitBookingsSummary: ${error.message}`);
  }
};

// get home visit bookings by service for a specific hospital
export const getHomeVisitBookingsByService = async ({ token, hospital_id }) => {
  try {
    let url = `${API_URL}/dashboard/v1/home-visit-bookings-by-service`;
    const params = [];
    if (hospital_id) params.push(`hospital_id=${hospital_id}`);
    if (params.length > 0) url += `?${params.join("&")}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch home visit bookings by service: ${response.status} - ${errorText}`,
      );
    }

    const result = await response.json();
    // API returns data as an array of hospitals, get the first one (or filter by hospital_id)
    const hospitalData =
      Array.isArray(result.data) && result.data.length > 0
        ? result.data[0]
        : { hospital_name: "", services: [] };

    return hospitalData;
  } catch (error) {
    throw new Error(`Error in getHomeVisitBookingsByService: ${error.message}`);
  }
};

// get home visit bookings details for a specific service
export const getHomeVisitServiceBookingDetails = async ({
  token,
  hospital_id,
  service_id,
  dateFrom,
  dateTo,
}) => {
  try {
    let url = `${API_URL}/dashboard/v1/home-visit-bookings-by-service-details`;
    const params = [];
    if (hospital_id) params.push(`hospital_id=${hospital_id}`);
    if (service_id) params.push(`service_id=${service_id}`);
    if (dateFrom) params.push(`from_date=${dateFrom}`);
    if (dateTo) params.push(`to_date=${dateTo}`);
    if (params.length > 0) url += `?${params.join("&")}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch home visit service booking details: ${response.status} - ${errorText}`,
      );
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    throw new Error(
      `Error in getHomeVisitServiceBookingDetails: ${error.message}`,
    );
  }
};

export const cancelHomeVisitServiceBooking = async ({ token, booking_id }) => {
  if (!booking_id) {
    throw new Error("booking_id is required");
  }

  const response = await fetch(
    `${API_URL}/dashboard/v1/cancel-home-visit-bookings/${booking_id}`,
    {
      method: "POST",
      headers: {
        // "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cancel failed: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  return result;
};

export const decrementUserWallet = async ({ token, userId, newBalance }) => {
  try {
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("newBalance", newBalance);

    const response = await fetch(
      `${API_URL}/dashboard/v1/decrement-users-wallets`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    const result = await response.json();

    if (!response.ok || result.success === false) {
      throw new Error(result.message || "Failed to update user wallet");
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const getPaymentReport = async ({ token }) => {
  try {
    let url = `${API_URL}/dashboard/v1/admin/payments/without-booking`;
    const params = [];

    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch payment report: ${response.status} - ${errorText}`,
      );
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    throw new Error(`Error in getPaymentReport: ${error.message}`);
  }
};
//customer service
export const getAllCustomerService = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/customer-services`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const updateCustomerService = async ({
  token,
  name,
  phone,
  email,
  is_active,
  password,
  password_confirmation,
  _method = "PATCH",
  id,
}) => {
  const formdata = new FormData();
  formdata.append("name", name);
  formdata.append("email", email);
  formdata.append("phone", phone);
  formdata.append("is_active", is_active);

  if (password) {
    formdata.append("password", password);
  }
  if (password_confirmation) {
    formdata.append("password_confirmation", password_confirmation);
  }
  formdata.append("_method", _method);

  try {
    const response = await fetch(`${API_URL}/customer-services/${id}`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      if (Array.isArray(result.errors)) {
        console.error("Validation Errors:", result.errors);
        throw new Error(result.errors.join(", "));
      } else {
        throw new Error(
          result.message || "An error occurred while adding the doctor",
        );
      }
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const addCustomerService = async ({
  token,
  name,
  phone,
  email,
  is_active,
  password,
  password_confirmation,
}) => {
  const formdata = new FormData();
  formdata.append("name", name);
  formdata.append("email", email);
  formdata.append("phone", phone);
  formdata.append("is_active", is_active);
  formdata.append("password", password);
  formdata.append("password_confirmation", password_confirmation);
  try {
    const response = await fetch(`${API_URL}/customer-services`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      if (Array.isArray(result.errors)) {
        console.error("Validation Errors:", result.errors);
        throw new Error(result.errors.join(", "));
      } else {
        throw new Error(
          result.message || "An error occurred while adding the doctor",
        );
      }
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const getCustomerService = async ({ token, id }) => {
  try {
    const response = await fetch(`${API_URL}/customer-services/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};

//chat
export const getMessages = async ({ token, id }) => {
  try {
    const response = await fetch(`${API_URL}/get-chat-messages/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const postMessage = async ({ user_id, message, token }) => {
  const formdata = new FormData();

  formdata.append("user_id", user_id);
  formdata.append("message", message);

  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/admin-message`,
      {
        method: "POST",
        body: formdata,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.msg || "An error occurred while adding settings");
    }
    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const getUsers = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/customer-get-chats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getRequestForm = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/admin/requestform`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const closeChat = async ({ token, chat_id }) => {
  const formdata = new FormData();
  formdata.append("chat_id", chat_id);

  try {
    const response = await fetch(`${API_URL}/close-chat`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const getHospitalsByspecialization = async ({ token, id = 1 }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/get-hospitals-by-specialization/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      return data?.data;
    }
  } catch (error) {
    throw error;
  }
};
export const fetchUsers = async ({ token }) => {
  const response = await fetch(`${API_URL}/dashboard/v1/all-users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await response.json();
  if (!response.ok) throw new Error("Failed to fetch users");
  return result.data; // Assuming data is an array of { id, name }
};
export const sendNotification = async ({ user_ids, title, body, token }) => {
  const response = await fetch(`${API_URL}/dashboard/v1/send-notification`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_ids, title, body }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error("Failed to send notification");
  return result.data;
};

// Employee Roles API functions
export const getEmployeeRoles = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/admin-roles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to fetch employee roles");
    }
  } catch (error) {
    throw error;
  }
};

export const getEmployeePermissions = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/admin-permissions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to fetch employee permissions");
    }
  } catch (error) {
    throw error;
  }
};

export const createEmployeeRole = async ({
  token,
  hospital_id,
  name,
  display_name,
  permissions,
}) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/admin-roles`, {
      method: "POST",
      body: JSON.stringify({
        name,
        display_name,
        permissions,
        hospital_id,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to create employee role");
    }
  } catch (error) {
    throw error;
  }
};

export const updateRolePermissions = async ({ token, roleId, permissions }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/admin-roles/${roleId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          permissions: permissions,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update role permissions");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "An unexpected error occurred");
  }
};

//admin chat
export const fetchAdminUsersList = async ({ token, search, page }) => {
  try {
    let url = `${API_URL}/dashboard/v1/admin/all-chats`;
    const params = [];
    if (search) {
      params.push(`search=${search}`);
    }
    if (page) {
      params.push(`page=${page}`);
    }
    if (page) {
      params.push(`per_page=${10}`);
    }

    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch reviews report: ${response.status} - ${errorText}`,
      );
    }

    const data = await response.json();
    return data.data.data || [];
  } catch (error) {
    throw new Error(`Error in getReviewsReport: ${error.message}`);
  }
};

//admins
export const getAdmins = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/admins/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch admins: ${response.status} - ${errorText}`,
      );
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    throw new Error(`Error in getAdmins: ${error.message}`);
  }
};

export const createAdmin = async ({
  token,
  name,
  email,
  password,
  password_confirmation,
  address,
  phone,
  media,
  role,
}) => {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("password_confirmation", password_confirmation);
    formData.append("address", address);
    formData.append("phone", phone);
    if (media) {
      formData.append("media", media);
    }
    if (role) {
      formData.append("role", role);
    }

    const response = await fetch(`${API_URL}/dashboard/v1/admins/store`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to create admin: ${response.status} - ${errorText}`,
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error in createAdmin: ${error.message}`);
  }
};

export const updateAdmin = async ({
  token,
  id,
  name,
  email,
  password,
  password_confirmation,
  address,
  phone,
  media,
  role,
}) => {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (password) {
      formData.append("password", password);
      formData.append("password_confirmation", password_confirmation);
    }
    formData.append("address", address);
    formData.append("phone", phone);
    if (media) {
      formData.append("media", media);
    }
    if (role) {
      formData.append("role", role);
    }

    const response = await fetch(
      `${API_URL}/dashboard/v1/admins/update/${id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to update admin: ${response.status} - ${errorText}`,
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error in updateAdmin: ${error.message}`);
  }
};

export const getAdminMessages = async ({ token, id }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/admin/chat/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};

//get hospital report
export const getHospitalReport = async ({
  token,
  hospital_id,
  from_date,
  to_date,
  status,
}) => {
  try {
    let url = `${API_URL}/dashboard/v1/get-hospital-report-by-id`;
    const params = [];

    if (hospital_id) {
      params.push(`hospital_id=${hospital_id}`);
    }
    if (from_date) {
      params.push(`from_date=${from_date}`);
    }
    if (to_date) {
      params.push(`to_date=${to_date}`);
    }
    if (status === "cancelled") {
      params.push(`deleted=${true}`);
    }
    if (status === "active") {
      params.push(`deleted=${false}`);
    }
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch reviews report: ${response.status} - ${errorText}`,
      );
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    throw new Error(`Error in getReviewsReport: ${error.message}`);
  }
};

// terms and conditions
export const getTermsAndConditions = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/terms`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const updatetermsAndConditions = async ({ token, term_condition }) => {
  const formdata = new FormData();
  formdata.append("term_condition", term_condition);

  try {
    const response = await fetch(`${API_URL}/dashboard/v1/terms`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      if (Array.isArray(result.errors)) {
        console.error("Validation Errors:", result.errors);
        throw new Error(result.errors.join(", "));
      } else {
        throw new Error(
          result.message || "An error occurred while adding the doctor",
        );
      }
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const updateWhatsapp = async ({ whatsapp, token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/settings/whatsapp`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ whatsapp }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating WhatsApp:", error);
    throw error;
  }
};
export const getwhatsapp = async ({ token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/settings/whatsapp`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getUserWalletReport = async ({
  token,
  name = "",
  from_date,
  to_date,
}) => {
  try {
    let url = `${API_URL}/dashboard/v1/users-with-wallets`;
    const params = [];

    if (name && name.trim()) {
      params.push(`name=${encodeURIComponent(name.trim())}`);
    }
    if (from_date) {
      params.push(`from_date=${encodeURIComponent(from_date)}`);
    }
    if (to_date) {
      params.push(`to_date=${encodeURIComponent(to_date)}`);
    }

    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch user wallet report: ${response.status} - ${errorText}`,
      );
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    throw new Error(`Error in getUserWalletReport: ${error.message}`);
  }
};

// Home Visit Services APIs
export const getHomeVisitServices = async ({ token, hospital_id }) => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    if (hospital_id) params.append("hospital_id", hospital_id);

    const queryString = params.toString();
    const url = `${API_URL}/dashboard/v1/admin/home-visit-services${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const addHomeVisitService = async ({
  token,
  hospital_id,
  name,
  type,
  price,
  hospital_price,
  tabi_price,
}) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/home-visit-services`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hospital_id,
          name,
          type,
          price,
          hospital_price,
          tabi_price,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const updateHomeVisitService = async ({
  token,
  serviceId,
  hospital_id,
  name,
  type,
  price,
  status,
  hospital_price,
  tabi_price,
}) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/home-visit-services/update/${serviceId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hospital_id,
          name,
          type,
          price,
          status,
          hospital_price,
          tabi_price,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Hospital Main Services APIs
export const getHospitalMainServices = async ({ token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/hospital-main-services/all`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};

export const addHospitalMainService = async ({
  token,
  hospital_id,
  name,
  status,
}) => {
  const formdata = new FormData();

  // Handle array of hospital IDs
  if (Array.isArray(hospital_id)) {
    hospital_id.forEach((id) => {
      formdata.append("hospital_id[]", id);
    });
  } else {
    formdata.append("hospital_id", hospital_id);
  }

  formdata.append("name", name);
  formdata.append("status", status);

  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/hospital-main-services`,
      {
        method: "POST",
        body: formdata,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const updateHospitalMainService = async ({
  token,
  id,
  hospital_id,
  name,
  status,
}) => {
  const formdata = new FormData();
  if (hospital_id !== undefined) formdata.append("hospital_id", hospital_id);
  if (name !== undefined) formdata.append("name", name);
  if (status !== undefined) formdata.append("status", status);

  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/hospital-main-services/update/${id}`,
      {
        method: "POST",
        body: formdata,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const deleteHospitalMainService = async ({ id, token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/hospital-main-services/delete/${id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg ||
          "An error occurred while deleting the hospital main service",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getAllMedicalServices = async () => {
  try {
    const token = getToken();
    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/medical-service/all`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};

export const getAllAnalysisRadiologyServices = async () => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/dashboard/v1/analysis`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};

export const getServiceById = async (id) => {
  try {
    const token = getToken();
    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/medical-service/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("An error occurred while fetching the medical service");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    throw error;
  }
};

export const getAllItemsServiceById = async (id) => {
  try {
    const token = getToken();
    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/medical-service-item?medical_service_id=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("An error occurred while fetching the medical service");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    throw error;
  }
};

export const deleteMedicalService = async (id) => {
  try {
    const token = getToken();
    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/medical-service/delete/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("An error occurred while deleting the medical service");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.log("error  error error ", error);

    throw new Error(
      error.message || "An error occurred while deleting the medical service",
    );
  }
};

export const addMedicalService = async (data) => {
  try {
    const token = getToken();
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === "status" || key === "is_featured") {
          formData.append(key, value ? 1 : 0);
        } else {
          formData.append(key, value);
        }
      }
    });

    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/medical-service`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || "Error while adding medical service");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.log("Add medical service error:", error);
    throw new Error(error.message || "Error while adding medical service");
  }
};

export const editMedicalService = async (id, data) => {
  try {
    const token = getToken();
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      if (key === "time_from") {
        formData.append("time_from", toHHMM(value));
        return;
      }

      if (key === "time_to") {
        formData.append("time_to", toHHMM(value));
        return;
      }

      if (key === "status" || key === "is_featured") {
        formData.append(key, value ? 1 : 0);
        return;
      }

      formData.append(key, value);
    });

    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/medical-service/update/${id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || "Error while adding medical service");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.log("Add medical service error:", error);
    throw new Error(error.message || "Error while adding medical service");
  }
};

export const addAnalysisService = async (data) => {
  try {
    const token = getToken();
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    const response = await fetch(`${API_URL}/dashboard/v1/analysis`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || "Error while adding medical service");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.log("Add medical service error:", error);
    throw new Error(error.message || "Error while adding medical service");
  }
};

export const editAnalysisService = async (id, data) => {
  try {
    const token = getToken();
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      formData.append(key, value);
    });

    const response = await fetch(
      `${API_URL}/dashboard/v1/analysis/update/${id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || "Error while adding medical service");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.log("Add medical service error:", error);
    throw new Error(error.message || "Error while adding medical service");
  }
};

export const deleteAnalysisItem = async (id) => {
  try {
    const token = getToken();
    const formData = new FormData();

    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/medical-service-item/delete/${id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || "Error while adding medical service");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.log("Add medical service error:", error);
    throw new Error(error.message || "Error while adding medical service");
  }
};

export const addItemAnalysis = async (data) => {
  try {
    const token = getToken();

    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/medical-service-item`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || "Error while adding medical service");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.log("Add medical service error:", error);
    throw new Error(error.message || "Error while adding medical service");
  }
};

export const updateAnalysisItem = async (id, data) => {
  try {
    const token = getToken();

    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/medical-service-item/update/${id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || "Error while adding medical service");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.log("Add medical service error:", error);
    throw new Error(error.message || "Error while adding medical service");
  }
};
