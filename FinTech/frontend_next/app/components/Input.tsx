import React from "react";

interface InputProps {
  label: string;
  name: string;
  type: string;
  required: boolean;
  //   value: string;
  //   onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ label, name, type, required }) => {
  return (
    <div className={`input-container relative w-full`}>
      <input
        className="block w-full text-sm"
        name={name}
        type={type}
        required={required}
      />
      <label>{label}</label>
    </div>
  );
};

export default Input;
