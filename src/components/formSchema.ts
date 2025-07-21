import * as yup from "yup";

export const formSchema = yup.object({
  firstName: yup.string().required("First name is required").min(2).max(15),
  lastName: yup.string().required("Last name is required").min(2).max(15),
  email: yup.string().required("Email is required").email(),
  phone: yup.string().required("Phone is required").matches(/^[0-9]{10}$/, "Phone must be 10 digits"),
  occupation: yup.string().required("Occupation is required").max(100),
  address: yup.string().required().max(500),
});

export type FormData = yup.InferType<typeof formSchema>;

export const defaultValues: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  occupation: "",
  address: "",
}; 