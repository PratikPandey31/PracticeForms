import { useForm, FormProvider, useFormContext } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../Firebase/firebase";
import { useClerkContext } from "../useClerkContext";
import  { useState, useEffect, useReducer } from "react";
import Toast from "./Toast";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveFormState, loadFormState, clearFormState } from "./formPersistence";

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
    .when('age', {
      is: (age: number) => age > 18,
      then: (schema) => schema.required('Address is required for age above 18').max(500, 'Address must be less than 500 characters'),
      otherwise: (schema) => schema.max(500, 'Address must be less than 500 characters').notRequired(),
    })
    .default("")
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
  const errorId = errors.firstName ? 'firstName-error' : undefined;
  return (
    <div>
      <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">
        First Name <span className="text-red-500">*</span>
      </label>
      <input
        id="firstName"
        type="text"
        {...register("firstName")}
        aria-invalid={!!errors.firstName}
        aria-describedby={errorId}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        placeholder="Enter your first name"
      />
      {typeof errors.firstName?.message === "string" && (
        <span id="firstName-error" className="text-red-500 text-sm" role="alert" aria-live="assertive">{errors.firstName.message}</span>
      )}
    </div>
  );
}

function LastNameField() {
  const { register, formState: { errors } } = useFormContext();
  const errorId = errors.lastName ? 'lastName-error' : undefined;
  return (
    <div>
      <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
      <input
        id="lastName"
        type="text"
        {...register("lastName")}
        aria-invalid={!!errors.lastName}
        aria-describedby={errorId}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        placeholder="Enter your last name"
      />
      {typeof errors.lastName?.message === "string" && <span id="lastName-error" role="alert" aria-live="assertive">{errors.lastName.message}</span>}
    </div>
  );
}

function EmailField() {
  const { register, formState: { errors } } = useFormContext();
  const errorId = errors.email ? 'email-error' : undefined;
  return (
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
        Email <span className="text-red-500">*</span>
      </label>
      <input
        id="email"
        type="email"
        {...register("email")}
        aria-invalid={!!errors.email}
        aria-describedby={errorId}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        placeholder="Enter your email"
      />
      {typeof errors.email?.message === "string" && <span id="email-error" role="alert" aria-live="assertive">{errors.email.message}</span>}
    </div>
  );
}

function PhoneField() {
  const { register, formState: { errors } } = useFormContext();
  const errorId = errors.phone ? 'phone-error' : undefined;
  return (
    <div>
      <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
        Phone Number <span className="text-red-500">*</span>
      </label>
      <input
        id="phone"
        type="tel"
        {...register("phone")}
        aria-invalid={!!errors.phone}
        aria-describedby={errorId}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        placeholder="Enter your phone number"
      />
      {typeof errors.phone?.message === "string" && <span id="phone-error" role="alert" aria-live="assertive">{errors.phone.message}</span>}
    </div>
  );
}

function AgeField() {
  const { register, formState: { errors } } = useFormContext();
  const errorId = errors.age ? 'age-error' : undefined;
  return (
    <div>
      <label htmlFor="age" className="block text-sm font-medium text-slate-700 mb-1">
        Age <span className="text-red-500">*</span>
      </label>
      <input
        id="age"
        type="number"
        {...register("age", { valueAsNumber: true })}
        aria-invalid={!!errors.age}
        aria-describedby={errorId}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        placeholder="Enter your age"
      />
      {typeof errors.age?.message === "string" && <span id="age-error" role="alert" aria-live="assertive">{errors.age.message}</span>}
    </div>
  );
}

function OccupationField() {
  const { register, formState: { errors } } = useFormContext();
  const errorId = errors.occupation ? 'occupation-error' : undefined;
  return (
    <div>
      <label htmlFor="occupation" className="block text-sm font-medium text-slate-700 mb-1">
        Occupation <span className="text-red-500">*</span>
      </label>
      <input
        id="occupation"
        type="text"
        {...register("occupation")}
        aria-invalid={!!errors.occupation}
        aria-describedby={errorId}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        placeholder="Enter your occupation"
      />
      {typeof errors.occupation?.message === "string" && <span id="occupation-error" role="alert" aria-live="assertive">{errors.occupation.message}</span>}
    </div>
  );
}

function AddressField() {
  const { register, formState: { errors }, watch } = useFormContext();
  const age = watch('age');
  const errorId = errors.address ? 'address-error' : undefined;
  if(age < 18) return null;
  return (
    <div>
      <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1">Address <span className="text-red-500">*</span></label>
      <textarea
        id="address"
        {...register("address")}
        aria-invalid={!!errors.address}
        aria-describedby={errorId}
        rows={2}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        placeholder="Enter your address"
      />
      {typeof errors.address?.message === "string" && <span id="address-error" role="alert" aria-live="assertive">{errors.address.message}</span>}
    </div>
  );
}

const FORM_KEY = "basicDetailsFormState";

export default function BasicDetailsForm({ isOpen, onClose }: BasicDetailsFormProps) {
  const { sessionClaims, isSignedIn } = useClerkContext();
  const userId = sessionClaims?.sub;
  const queryClient = useQueryClient();
  const [isClosing, setIsClosing] = useState(false);
  const [toast, dispatch] = useReducer(toastReducer, {
    message: '',
    type: 'success',
    isVisible: false
  });

  // Load persisted state
  const persisted = loadFormState<FormInputs>(FORM_KEY, {
    firstName: "",
    lastName: null,
    email: "",
    phone: "",
    age: 0,
    occupation: "",
    address: "",
  });

  const methods = useForm<FormInputs>({
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: persisted,
  });

  const { watch } = methods;

  useEffect(() => {
    const subscription = watch((value) => saveFormState(FORM_KEY, value));
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    clearFormState(FORM_KEY);
  }, []);

  const {
    handleSubmit,
  } = methods;

  const submitMutation = useMutation({
    mutationFn: async (data: FormInputs) => {
      if (!isSignedIn || !userId) throw new Error("User not authenticated");
      return await addDoc(collection(db, "userDetails"), {
        ...data,
        userId,
        createdAt: new Date(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userDetails'] });
      dispatch({ type: 'SHOW_SUCCESS', payload: 'Form submitted successfully!' });
      methods.reset();
      clearFormState(FORM_KEY);
      setTimeout(() => handleClose(), 1000);
    },
    onError: (error: any) => {
      dispatch({ type: 'SHOW_ERROR', payload: error.message || 'Error submitting form.' });
    },
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data: FormInputs) => {
    if (!isSignedIn || !userId) {
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
      role="dialog"
      aria-modal="true"
      aria-labelledby="basic-details-form-title"
    >
      <div 
        className={`bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[70vh] overflow-y-auto transition-all duration-300 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 id="basic-details-form-title" className="text-2xl font-bold text-slate-800">Basic Details Form</h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close form"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" aria-describedby="form-errors">
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
                  aria-busy={submitMutation.isPending}
                >
                  {submitMutation.isPending ? "Submitting..." : "Submit Form"}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-semibold"
                  aria-label="Cancel and close form"
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


