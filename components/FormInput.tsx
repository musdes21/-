
import React from 'react';

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  icon?: React.ReactNode;
  as?: 'input' | 'textarea' | 'select';
  children?: React.ReactNode;
}

const FormInput: React.FC<FormInputProps> = ({ 
  label, name, type = 'text', placeholder, required, value, onChange, icon, as = 'input', children 
}) => {
  const baseClasses = "w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-0 transition-all outline-none bg-white font-medium";
  
  return (
    <div className="mb-6">
      <label className={`flex items-center gap-2 mb-2 font-bold text-slate-700 ${required ? "after:content-['*'] after:text-red-500 after:mr-1" : ""}`}>
        {icon}
        {label}
      </label>
      {as === 'input' && (
        <input 
          type={type} 
          name={name} 
          value={value} 
          onChange={onChange} 
          required={required} 
          placeholder={placeholder} 
          className={baseClasses}
        />
      )}
      {as === 'textarea' && (
        <textarea 
          name={name} 
          value={value} 
          onChange={onChange} 
          required={required} 
          placeholder={placeholder} 
          rows={4}
          className={`${baseClasses} resize-none`}
        />
      )}
      {as === 'select' && (
        <select 
          name={name} 
          value={value} 
          onChange={onChange} 
          required={required} 
          className={baseClasses}
        >
          {children}
        </select>
      )}
    </div>
  );
};

export default FormInput;
