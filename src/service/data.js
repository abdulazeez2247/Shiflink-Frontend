// const API_BASE_URL = "https://shiflink.onrender.com/api";
const API_BASE_URL = "http://localhost:5000/api";

// ==================== AUTHENTICATION ENDPOINTS (All Roles) ====================
export const registerUser = async (userData) => {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    throw new Error((await res.json()).message || "Failed to register");
  }
  return res.json();
};

export const loginUser = async (credentials) => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    throw new Error((await res.json()).message || "Failed to login");
  }
  return res.json();
};

export const forgotPassword = async (email) => {
  const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    throw new Error((await res.json()).message || "Failed to send reset email");
  }
  return res.json();
};

export const getCurrentUser = async (token) => {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error((await res.json()).message || "Failed to fetch user");
  }
  return res.json();
};

// ==================== DSP ENDPOINTS (Direct Support Professional) ====================


export const getAvailableShifts = async (token, page = 1, limit = 10) => {
  const res = await fetch(`${API_BASE_URL}/dsp/available-shifts?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error((await res.json()).message || "Failed to fetch shifts");
  }
  return res.json();
};


export const getDSPBookings = async (token) => {
  const res = await fetch(`${API_BASE_URL}/dsp/my-bookings`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error((await res.json()).message || "Failed to fetch bookings");
  }
  return res.json();
};


export const updateDSPAvailability = async (token, availability) => {
  const res = await fetch(`${API_BASE_URL}/dsp/availability`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ availability }),
  });
  if (!res.ok) {
    throw new Error((await res.json()).message || "Failed to update availability");
  }
  return res.json();
};


// Fix this incomplete function in data.js
export const bookShift = async (token, shiftId) => {
  const res = await fetch(`${API_BASE_URL}/shifts/${shiftId}/book`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  // Add the missing error handling
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to book shift");
  }
  
  return res.json(); // Add this return statement
};



export const cancelBooking = async (token, bookingId) => {
  const res = await fetch(`${API_BASE_URL}/dsp/cancel-booking/${bookingId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error((await res.json()).message || "Failed to cancel booking");
  }
  return res.json();
};

// ==================== AGENCY ENDPOINTS (Agency Users) ====================
export const createShift = async (token, shiftData) => {
  const res = await fetch(`${API_BASE_URL}/agency/shifts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(shiftData),
  });
  if (!res.ok) {
    throw new Error((await res.json()).message || "Failed to create shift");
  }
  return res.json();
};

export const getAgencyShifts = async (token, page = 1, limit = 10, status = null) => {
  let url = `${API_BASE_URL}/agency/shifts?page=${page}&limit=${limit}`;
  if (status) url += `&status=${status}`;
  
  const res = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error((await res.json()).message || "Failed to fetch shifts");
  }
  return res.json();
};

export const getAgencyBookings = async (token) => {
  const res = await fetch(`${API_BASE_URL}/agency/bookings`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error((await res.json()).message || "Failed to fetch bookings");
  }
  return res.json();
};

export const updateShift = async (token, shiftId, shiftData) => {
  const res = await fetch(`${API_BASE_URL}/agency/shifts/${shiftId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(shiftData),
  });
  if (!res.ok) {
    throw new Error((await res.json()).message || "Failed to update shift");
  }
  return res.json();
};

export const deleteShift = async (token, shiftId) => {
  const res = await fetch(`${API_BASE_URL}/agency/shifts/${shiftId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error((await res.json()).message || "Failed to delete shift");
  }
  return res.json();
};

export const getAgencyStats = async (token) => {
  const res = await fetch(`${API_BASE_URL}/agency/stats`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error((await res.json()).message || "Failed to fetch stats");
  }
  return res.json();
};

export const getDSPApplications = async (token, status = null) => {
  let url = `${API_BASE_URL}/agency/dsp-applications`;
  if (status) url += `?status=${status}`;
  
  const res = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error((await res.json()).message || "Failed to fetch DSP applications");
  }
  return res.json();
};

// Add this function to your service/data.js file
export const getActiveDSPs = async (token) => {
  const res = await fetch(`${API_BASE_URL}/messaging/active-dsps`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error((await res.json()).message || "Failed to fetch active DSPs");
  }
  return res.json();
};

export const updateDSPApplication = async (token, applicationId, status, notes = '') => {
  const res = await fetch(`${API_BASE_URL}/agency/dsp-applications/${applicationId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ 
      status, 
      notes 
    }),
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'Failed to update DSP application' }));
    throw new Error(errorData.message || `Failed to update DSP application: ${res.status}`);
  }
  
  return res.json();
};
export const getShiftAnalytics = async (token, timeframe = 'month') => {
  const res = await fetch(`${API_BASE_URL}/agency/analytics/shifts?timeframe=${timeframe}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error((await res.json()).message || "Failed to fetch shift analytics");
  }
  return res.json();
};

export const getComplianceReports = async (token) => {
  const res = await fetch(`${API_BASE_URL}/agency/analytics/compliance`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error((await res.json()).message || "Failed to fetch compliance reports");
  }
  return res.json();
};

// ==================== COUNTY ENDPOINTS (County Admin) ====================
export const getCountyDSPs = async (token) => {
  const res = await fetch(`${API_BASE_URL}/county/dsps`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to fetch county DSPs");
  return res.json();
};

export const verifyDSPCompliance = async (token, dspId) => {
  const res = await fetch(`${API_BASE_URL}/county/verify-dsp/${dspId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to verify DSP compliance");
  return res.json();
};

export const getCountyStats = async (token) => {
  const res = await fetch(`${API_BASE_URL}/county/stats`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to fetch county stats");
  return res.json();
};

export const getCountyFacilities = async (token) => {
  const res = await fetch(`${API_BASE_URL}/county/facilities`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to fetch facilities");
  return res.json();
};

export const getCountyRecentActivity = async (token) => {
  const res = await fetch(`${API_BASE_URL}/county/recent-activity`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to fetch recent activity");
  return res.json();
};

// ==================== ADMIN ENDPOINTS (System Admin) ====================
export const getAdminStats = async (token) => {
  const res = await fetch(`${API_BASE_URL}/admin/dashboard-stats`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to fetch admin stats");
  return res.json();
};

export const getAuditLogs = async (token, filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  
  const res = await fetch(`${API_BASE_URL}/admin/audit-logs?${params}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to fetch audit logs");
  return res.json();
};

export const suspendUser = async (token, userId, reason) => {
  const res = await fetch(`${API_BASE_URL}/admin/suspend-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId, reason }),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to suspend user");
  return res.json();
};

export const reinstateUser = async (token, userId) => {
  const res = await fetch(`${API_BASE_URL}/admin/reinstate-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to reinstate user");
  return res.json();
};

// ==================== TRAINER ENDPOINTS (Trainer Users) ====================
export const createCourse = async (token, courseData) => {
  const res = await fetch(`${API_BASE_URL}/trainer/courses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(courseData),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to create course");
  return res.json();
};

export const getTrainerCourses = async (token) => {
  const res = await fetch(`${API_BASE_URL}/trainer/courses`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'Failed to fetch courses' }));
    throw new Error(errorData.message || `Failed to fetch courses: ${res.status}`);
  }
  
  const data = await res.json();
  // Ensure we always return an array
  return Array.isArray(data) ? data : [];
};

export const addParticipant = async (token, courseId, userId) => {
  const res = await fetch(`${API_BASE_URL}/trainer/courses/add-participant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ courseId, userId }),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to add participant");
  return res.json();
};

export const getTrainerStats = async (token) => {
  const res = await fetch(`${API_BASE_URL}/trainer/stats`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'Failed to fetch trainer stats' }));
    throw new Error(errorData.message || `Failed to fetch trainer stats: ${res.status}`);
  }
  return res.json();
};

export const updateCourse = async (token, courseId, courseData) => {
  const res = await fetch(`${API_BASE_URL}/trainer/courses/${courseId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(courseData),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to update course");
  return res.json();
};

export const deleteCourse = async (token, courseId) => {
  const res = await fetch(`${API_BASE_URL}/trainer/courses/${courseId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to delete course");
  return res.json();
};

// ==================== MESSAGING ENDPOINTS (All Roles) ====================
export const getConversations = async (token) => {
  const res = await fetch(`${API_BASE_URL}/messaging/conversations`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error((await res.json()).message || "Failed to fetch conversations");
  }
  return res.json();
};

export const sendMessage = async (token, conversationId, text) => {
  const res = await fetch(`${API_BASE_URL}/messaging/send-message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ conversationId, text }),
  });
  if (!res.ok) {
    throw new Error((await res.json()).message || "Failed to send message");
  }
  return res.json();
};

export const startConversation = async (token, participantId) => {
  const res = await fetch(`${API_BASE_URL}/messaging/start-conversation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ participantId }),
  });
  if (!res.ok) {
    throw new Error((await res.json()).message || "Failed to start conversation");
  }
  return res.json();
};

export const markMessagesAsRead = async (token, messageIds) => {
  const res = await fetch(`${API_BASE_URL}/messaging/mark-read`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ messageIds }),
  });
  if (!res.ok) {
    throw new Error((await res.json()).message || "Failed to mark messages as read");
  }
  return res.json();
};
// Add these to your frontend data.js file:
export const startShiftConversation = async (token, shiftId, participantId) => {
  const res = await fetch(`${API_BASE_URL}/messaging/shift-conversation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ shiftId, participantId }),
  });
  if (!res.ok) {
    throw new Error((await res.json()).message || "Failed to start shift conversation");
  }
  return res.json();
};

export const getShiftConversations = async (token, shiftId) => {
  const res = await fetch(`${API_BASE_URL}/messaging/shift/${shiftId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error((await res.json()).message || "Failed to fetch shift conversations");
  }
  return res.json();
};
// Compliance API functions

// Add this function to your data.js
// export const getShiftComplianceStatus = async (token) => {
//   const res = await fetch(`${API_BASE_URL}/shifts/compliance-status`, {
//     method: "GET",
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   if (!res.ok) {
//     throw new Error("Failed to check shift compliance status");
//   }
//   return res.json();
// };

// export const getRequiredDocuments = async (token) => {
//   const res = await fetch(`${API_BASE_URL}/compliance/required-documents`, {
//     method: "GET",
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   if (!res.ok) {
//     throw new Error("Failed to fetch required documents");
//   }
//   return res.json();
// };

// export const uploadCredential = async (token, formData) => {
//   const res = await fetch(`${API_BASE_URL}/compliance/upload-credential`, {
//     method: "POST",
//     headers: { 
//       Authorization: `Bearer ${token}`,
//       // Note: Don't set Content-Type for FormData
//     },
//     body: formData,
//   });
//   if (!res.ok) {
//     const errorData = await res.json();
//     throw new Error(errorData.message || "Failed to upload credential");
//   }
//   return res.json();
// };

// export const getUserCredentials = async (token) => {
//   const res = await fetch(`${API_BASE_URL}/compliance/credentials`, {
//     method: "GET",
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   if (!res.ok) {
//     throw new Error("Failed to fetch user credentials");
//   }
//   return res.json();
// };