import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../Firebase/firebase";
import { useClerkContext } from "../useClerkContext";
import { useState } from "react";

export  function AllSubmissions() {
  const { sessionClaims, isLoaded, isSignedIn } = useClerkContext();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Get user role from sessionClaims.o.rol
  const userRole = sessionClaims?.o?.rol;
  const isAdmin = userRole === "admin";

  const { data: submissions, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["userDetails"],
    queryFn: async () => {
      const snap = await getDocs(collection(db, "userDetails"));
      return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
  });

  // Delete handler for admin
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, "userDetails", id));
      await refetch();
    } catch (err) {
      alert("Failed to delete submission.");
    } finally {
      setDeletingId(null);
    }
  };

  if (!isLoaded || !isSignedIn) return null;

  return (
    <div className="max-w-4xl mx-auto mt-14 p-10 bg-gradient-to-br from-white via-blue-50 to-teal-50 rounded-3xl shadow-2xl border-2 border-blue-100">
      <h3 className="text-2xl font-extrabold mb-4 text-teal-700 flex items-center gap-2">
        <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h4m0 0V7a4 4 0 00-4-4H7a4 4 0 00-4 4v10a4 4 0 004 4h4" />
        </svg>
        All Submissions
      </h3>
      {isLoading && <div>Loading...</div>}
      {isError && (
        <div className="text-red-500">{(error as Error)?.message || "Failed to load submissions."}</div>
      )}
      {submissions && (
        <ul className="divide-y divide-slate-200">
          {submissions.map((item: any) => (
            <li key={item.id} className="py-2 flex justify-between items-center">
              <div>
                <div className="font-semibold">{item.firstName} {item.lastName}</div>
                <div className="text-sm text-slate-600">Email: {item.email} | Phone: {item.phone} | Age: {item.age}</div>
                <div className="text-sm text-slate-600">Occupation: {item.occupation} | Address: {item.address}</div>
              </div>
              {isAdmin && (
                <button
                  className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                >
                  {deletingId === item.id ? "Deleting..." : "Delete"}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}