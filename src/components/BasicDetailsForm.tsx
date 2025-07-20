import { useForm, FormProvider, useFormContext } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../Firebase/firebase";
import { useUser } from "@clerk/clerk-react";
import  { useState, useEffect, useReducer } from "react";
import Toast from "./Toast";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from '@tanstack/react-query';

const validationSchema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(15, "First name must be less than 15 characters")
    .matches(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),
  lastName: yup
    .string()
    .transform((value) => (value === '' ? null : value))
    .nullable()
    .max(15, "Last name must be less than 15 characters")
    .matches(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces")
    .default(null),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address")
    .max(30, "Email must be less than 30 characters"),
  phone: yup
    .string()
    .required("Phone is required")
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
  age: yup
    .number()
    .typeError("Age must be a number")
    .required("Age is required")
    .min(5, "Age must be at least 5")
    .max(120, "Age must be less than 120")
    .integer("Age must be a whole number"),
  occupation: yup
    .string()
    .required("Occupation is required")
    .max(100, "Occupation must be less than 100 characters"),
  address: yup
    .string()
    .max(500, "Address must be less than 500 characters")
    .default(""),
});

type FormInputs = yup.InferType<typeof validationSchema>;

interface BasicDetailsFormProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

function toastReducer(state: any, action: any) {
  switch (action.type) {
    case 'SHOW_SUCCESS':
      return { message: action.payload || 'Success!', type: 'success', isVisible: true };
    case 'SHOW_ERROR':
      return { message: action.payload || 'Error!', type: 'error', isVisible: true };
    case 'HIDE':
      return { ...state, isVisible: false };
    default:
      return state;
  }
}

function FirstNameField() {
  const { register, formState: { errors } } = useFormContext();
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        First Name <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        {...register("firstName")}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        placeholder="Enter your first name"
      />
      {typeof errors.firstName?.message === "string" && (
        <span className="text-red-500 text-sm">{errors.firstName.message}</span>
      )}
    </div>
  );
}

function LastNameField() {
  const { register, formState: { errors } } = useFormContext();
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
      <input
        type="text"
        {...register("lastName")}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        placeholder="Enter your last name"
      />
      {typeof errors.lastName?.message === "string" && <span>{errors.lastName.message}</span>}
    </div>
  );
}

function EmailField() {
  const { register, formState: { errors } } = useFormContext();
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        Email <span className="text-red-500">*</span>
      </label>
      <input
        type="email"
        {...register("email")}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        placeholder="Enter your email"
      />
      {typeof errors.email?.message === "string" && <span>{errors.email.message}</span>}
    </div>
  );
}

function PhoneField() {
  const { register, formState: { errors } } = useFormContext();
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        Phone Number <span className="text-red-500">*</span>
      </label>
      <input
        type="tel"
        {...register("phone")}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        placeholder="Enter your phone number"
      />
      {typeof errors.phone?.message === "string" && <span>{errors.phone.message}</span>}
    </div>
  );
}

function AgeField() {
  const { register, formState: { errors } } = useFormContext();
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        Age <span className="text-red-500">*</span>
      </label>
      <input
        type="number"
        {...register("age", { valueAsNumber: true })}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        placeholder="Enter your age"
      />
      {typeof errors.age?.message === "string" && <span>{errors.age.message}</span>}
    </div>
  );
}

function OccupationField() {
  const { register, formState: { errors } } = useFormContext();
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        Occupation <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        {...register("occupation")}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        placeholder="Enter your occupation"
      />
      {typeof errors.occupation?.message === "string" && <span>{errors.occupation.message}</span>}
    </div>
  );
}

function AddressField() {
  const { register, formState: { errors } } = useFormContext();
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
      <textarea
        {...register("address")}
        rows={2}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        placeholder="Enter your address"
      />
      {typeof errors.address?.message === "string" && <span>{errors.address.message}</span>}
    </div>
  );
}

export default function BasicDetailsForm({ isOpen, onClose }: BasicDetailsFormProps) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [isClosing, setIsClosing] = useState(false);
  const [toast, dispatch] = useReducer(toastReducer, {
    message: '',
    type: 'success',
    isVisible: false
  });

  const methods = useForm<FormInputs>({
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: null,
      email: "",
      phone: "",
      age: undefined,
      occupation: "",
      address: "",
    }
  });

  const {
    handleSubmit,
  } = methods;

  const submitMutation = useMutation({
    mutationFn: async (data: FormInputs) => {
      if (!user) throw new Error("User not authenticated");
      return await addDoc(collection(db, "userDetails"), {
        ...data,
        userId: user.id,
        userEmail: user.emailAddresses[0]?.emailAddress,
        createdAt: new Date(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userDetails'] });
      dispatch({ type: 'SHOW_SUCCESS', payload: 'Form submitted successfully!' });
      methods.reset();
      setTimeout(() => handleClose(), 1000);
    },
    onError: (error: any) => {
      dispatch({ type: 'SHOW_ERROR', payload: error.message || 'Error submitting form.' });
    },
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data: FormInputs) => {
    if (!user) {
      dispatch({ type: 'SHOW_ERROR', payload: "Please sign in to submit the form." });
      return;
    }
    submitMutation.mutate(data);
  };

  const handleClose = () => {
    setIsClosing(true);
    dispatch({ type: 'HIDE' });
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  useEffect(() => {
    if (isOpen) {
      dispatch({ type: 'HIDE' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center z-40 p-4 pt-20 pb-20 transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      tabIndex={0}
    >
      <div 
        className={`bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[70vh] overflow-y-auto transition-all duration-300 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">Basic Details Form</h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <FirstNameField />
              <LastNameField />
              <EmailField />
              <PhoneField />
              <AgeField />
              <OccupationField />
              <AddressField />
              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitMutation.isPending ? "Submitting..." : "Submit Form"}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => dispatch({ type: 'HIDE' })}
      />
    </div>
  );
}


