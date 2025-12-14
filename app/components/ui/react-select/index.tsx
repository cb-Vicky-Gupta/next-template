import React, { forwardRef } from "react";
import Select, {
  Props as SelectProps,
  GroupBase,
  StylesConfig,
} from "react-select";

export interface SelectOption {
  label: string;
  value: string;
}

interface MySelectProps
  extends SelectProps<SelectOption, boolean, GroupBase<SelectOption>> {
  allowSelectAll?: boolean;
  isDark?: boolean;
  handleKeyDown?: React.KeyboardEventHandler;
  handleKeyUp?: React.KeyboardEventHandler;
}


const customStyles: StylesConfig<SelectOption, boolean> = {
  control: (base) => ({
    ...base,
    maxHeight: "65px",
    overflow: "auto",
  }),
  placeholder: (base) => ({
    ...base,
    color: "black",
    fontWeight: "600",
    fontSize: "14px",
  }),
  option: (base) => ({
    ...base,
    color: "black",
    fontWeight: "600",
    fontSize: "14px",
  }),
  multiValue: (base) => ({
    ...base,
    color: "black",
    fontWeight: "600",
    fontSize: "14px",
  }),
};

const customStylesDark: StylesConfig<SelectOption, boolean> = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#1e1e1e",
    borderColor: state.isFocused ? "#777" : "#333",
    color: "#fff",
    boxShadow: state.isFocused
      ? "0 0 5px rgba(255, 255, 255, 0.2)"
      : "none",
    "&:hover": { borderColor: "#777" },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#222",
  }),
  option: (provided, { isFocused, isSelected }) => ({
    ...provided,
    backgroundColor: isSelected ? "#555" : isFocused ? "#444" : "#222",
    color: isSelected ? "#fff" : "#ccc",
    cursor: "pointer",
    "&:hover": { backgroundColor: "#444", color: "#fff" },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#fff",
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#000",
    borderRadius: "4px",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#fff",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "#aaa",
    "&:hover": {
      backgroundColor: "#333",
      color: "#fff",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#ccc",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "#aaa",
    "&:hover": { color: "#fff" },
  }),
  indicatorSeparator: () => ({ display: "none" }),
};


const MySelect = forwardRef<any, MySelectProps>((props, ref) => {
  const {
    allowSelectAll,
    isDark,
    handleKeyDown,
    handleKeyUp,
    ...rest
  } = props;

  return (
    <Select
      ref={ref}
      {...rest}
      isMulti={allowSelectAll ?? rest.isMulti}
      styles={isDark ? customStylesDark : customStyles}
      onKeyDown={handleKeyDown}
      menuPlacement="auto"
    />
  );
});

MySelect.displayName = "MySelect";

export default MySelect;
