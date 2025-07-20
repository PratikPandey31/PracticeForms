import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase/firebase";
import { useUser } from "@clerk/clerk-react";

export default function AllSubmissions() {
  const { isSignedIn } = useUser();

 


  const { data: submissions, isLoading, isError, error } = useQuery({
    queryKey: ["userDetails"],
    queryFn: async () => {
      const snap = await getDocs(collection(db, "userDetails"));
      return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
  });

  if (isSignedIn) {
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-bold mb-2">All Submissions</h3>
      {isLoading && <div>Loading...</div>}
      {isError && (
        <div className="text-red-500">{(error as Error)?.message || "Failed to load submissions."}</div>
      )}
      {submissions && (
        <ul className="divide-y divide-slate-200">
          {submissions.map((item: any) => (
            <li key={item.id} className="py-2">
              <div className="font-semibold">{item.firstName} {item.lastName}</div>
              <div className="text-sm text-slate-600">Email: {item.email} | Phone: {item.phone} | Age: {item.age}</div>
              <div className="text-sm text-slate-600">Occupation: {item.occupation} | Address: {item.address}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 
}