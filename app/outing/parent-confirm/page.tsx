// 'use client';
// import { useSearchParams } from 'next/navigation';
// import { CheckCircle, XCircle } from 'lucide-react';

// export default function ParentConfirmationPage() {
//   const searchParams = useSearchParams();
//   const status = searchParams.get('status'); // 'approved' or 'rejected'

//   const isApproved = status === 'approved';

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

//       <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
//         {isApproved ? (
//           <>
//             <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
//             <h2 className="text-2xl font-semibold mt-4 text-green-700">Request Approved</h2>
//             <p className="mt-2 text-gray-600">
//               You’ve successfully approved the student’s outing request.
//             </p>
//           </>
//         ) : (
//           <>
//             <XCircle className="h-16 w-16 text-red-500 mx-auto" />
//             <h2 className="text-2xl font-semibold mt-4 text-red-700">Request Rejected</h2>
//             <p className="mt-2 text-gray-600">
//               You’ve rejected the outing request. The student will be informed.
//             </p>
//           </>
//         )}

//         <div className="mt-6 flex gap-4 justify-center">
//           <a
//             href="/"
//             className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
//           >
//             Back to Home
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }

"use server";

import ParentOutingApprovalPage from "@/components/outing/OutingPage";
import axios from "axios";
import { redirect } from "next/navigation";


export default async function OutingApprovalPage({ searchParams }: { searchParams: { token?: string } }) {
    const { token } = searchParams;
  
    // Validate token and action
    if (!token ) {
      redirect("/");
    }
  
    const outing = await (async () => {
      try {
        const response = await axios.get(`${process.env.BASE_URL}/api/outing/parent-confirm`, {
          params: { token },
        });
        return response.data;
      } catch (error) {
        console.error("Outing approval failed:", error);
        return null;
      }
    })();
  
    if (!outing) {
      redirect("/");
    }

    console.log(outing)
  
    return <ParentOutingApprovalPage outing={outing.data} />;
}


