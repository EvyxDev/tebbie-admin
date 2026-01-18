import { Tabs, Tab } from "@mui/material";

const MedicalTabs = ({ tabs, value, setValue }) => {
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      variant="scrollable"
      scrollButtons="auto"
      textColor="primary"
      indicatorColor="primary"
    >
      {tabs.map((tab, index) => (
        <Tab
          key={index}
          label={tab.content}
          className="font-semibold"
          value={tab.label}
        />
      ))}
    </Tabs>
  );
};

export default MedicalTabs;
