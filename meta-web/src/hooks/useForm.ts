import { useState, ChangeEvent, FocusEvent } from "react";
import toast from "react-hot-toast";

interface FormState {
  [key: string]: any;
}

interface ValidationRules {
  [key: string]: (value: any) => string | null;
}

export function useFormHandler<T extends FormState>(
  initialState: T,
  validationRules: ValidationRules
) {
  const [formData, setFormData] = useState<T>(initialState);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  const validateField = (name: string, value: any) => {
    if (validationRules[name]) {
      const errorMessage = validationRules[name](value);
      setErrors((prev) => ({
        ...prev,
        [name]: errorMessage,
      }));
      return errorMessage;
    }
    return null;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked, files } = e.target as HTMLInputElement;
    const fieldValue = type === "checkbox" ? checked : files ? files[0] : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    validateField(name, fieldValue); // Live validation
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const validateForm = (): boolean => {
    let isValid = true;
    Object.entries(formData).forEach(([key, value]) => {
      if (validationRules[key]) {
        const errorMessage = validateField(key, value);
        if (errorMessage) {
          isValid = false;
        }
      }
    });

    if (!isValid) {
      toast.error("Please fix the form errors.");
    }
    return isValid;
  };

  const resetForm = () => {
    setFormData(initialState);
    setErrors({});
  };

  return { formData, errors, handleChange, handleBlur, validateForm, resetForm };
}