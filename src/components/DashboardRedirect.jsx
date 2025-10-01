
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const DashboardRedirect = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//       console.log('DashboardRedirect triggered');
//     const userStr = localStorage.getItem("user");
//       console.log('User string from localStorage:', userStr);

//     if (!userStr) {
//        console.log('No user found, redirecting to login');
//       navigate("/login");
//       return;
//     }

//     try {
//       const user = JSON.parse(userStr);
//       console.log('Parsed user object:', user);
//     console.log('User role:', user.role);
//       const role = user.role?.toLowerCase();
//       console.log('Lowercase role:', role);

//       switch (role) {
//         case "admin":
//           navigate("/dashboard/admin");
//           break;
//         case "trainer":
//           navigate("/dashboard/trainer");
//           break;
//         case "dsp":
//           navigate("/dashboard/dsp");
//           break;
//         case "agency":
//           navigate("/dashboard/agency");
//           break;
//         case "county":
//           navigate("/dashboard/county");
//           break;
//         default:
//           console.log('Unknown role, redirecting to home');
//           navigate("/");
//           break;
//       }
//     } catch (err) {
//       navigate("/login");
//     }
//   }, [navigate]);

//   return null; // nothing to render, just redirect
// };

// export default DashboardRedirect;
// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/hooks/useAuth';
// import { Loader2 } from 'lucide-react';

// const DashboardRedirect = () => {
//   const navigate = useNavigate();
//   const { user, isLoading } = useAuth(); // Use the hook to get auth state

//   useEffect(() => {
//     // Only run the navigation logic when the user data is no longer loading
//     if (!isLoading) {
//       if (user?.role) {
//         navigate(`/dashboard/${user.role.toLowerCase()}`, { replace: true });
//       } else {
//         // If user is not logged in after loading, redirect to login
//         navigate('/login', { replace: true });
//       }
//     }
//   }, [user, isLoading, navigate]);

//   // Show a loading state while fetching user data
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Loader2 className="h-8 w-8 animate-spin" />
//         <span className="ml-2">Redirecting to your dashboard...</span>
//       </div>
//     );
//   }

//   return null;
// };

// export default DashboardRedirect;

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DashboardRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🚀 DashboardRedirect: useEffect triggered");

    const userStr = localStorage.getItem("user");
    console.log("📦 Raw localStorage 'user':", userStr);

    // If no user data → send to login
    if (!userStr) {
      console.log("❌ No user found in localStorage → navigating to /login");
      navigate("/login", { replace: true });
      return;
    }

    try {
      const user = JSON.parse(userStr);
      console.log("✅ Parsed user object:", user);

      const role = user.role?.toLowerCase();
      console.log("🎭 Extracted role:", role);

      if (role) {
        const dashboardPath = `/dashboard/${role}`;
        console.log(`➡️ Navigating to dashboard path: ${dashboardPath}`);
        navigate(dashboardPath, { replace: true });
        console.log("✅ Navigation executed successfully");
      } else {
        console.warn("⚠️ Role is missing/invalid → clearing storage & redirecting to /login");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      }
    } catch (err) {
      console.error("💥 Failed to parse user JSON from localStorage:", err);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return null; // no UI, just redirection
};

export default DashboardRedirect;
