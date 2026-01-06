import { AsyncPaginate } from "react-select-async-paginate";
import { getDoctorSliders } from "../../utlis/https";

const customStyles = {
  control: (base) => ({
    ...base,
    borderRadius: "8px",
    minHeight: "42px",
  }),
  menu: (base) => ({
    ...base,
  }),
};

const DoctorsSelect = ({ selectedDoctor, token, value, onChange }) => {
  const loadDoctors = async (search, loadedOptions, { page }) => {
    const res = await getDoctorSliders({
      token,
      page,
      search,
    });

    const options = (res.data || []).map((d) => ({
      value: d.id,
      label: d.name,
    }));

    return {
      options,
      hasMore: res.current_page < res.last_page,
      additional: {
        page: page + 1,
      },
    };
  };

  return (
    <AsyncPaginate
      styles={customStyles}
      value={selectedDoctor}
      loadOptions={loadDoctors}
      additional={{ page: 1 }}
      onChange={onChange}
      placeholder="اختر الطبيب"
      debounceTimeout={300}
    />
  );
};

export default DoctorsSelect;
