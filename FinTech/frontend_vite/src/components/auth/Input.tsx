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
    <div className={`relative w-full`}>
      <input
        className="peer block w-full text-sm pt-5 px-2.5 pb-2.5 border-0 focus:outline-none rounded-t-lg"
        name={name}
        type={type}
        required={required}
      />
      <label className="absolute text-base text-gray-500 duration-300 transform scale-75 top-4 z-10 origin-[0] start-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-sm">
        {label}
      </label>
    </div>
  );
};

export default Input;
