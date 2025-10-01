export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      agency_transportation_requests: {
        Row: {
          agency_id: string
          assigned_transportation_company_id: string | null
          client_name: string
          created_at: string
          destination_address: string
          estimated_fare: number | null
          id: string
          is_recurring: boolean | null
          notes: string | null
          passenger_count: number | null
          pickup_address: string
          recurring_schedule: Json | null
          requested_pickup_time: string
          special_needs: string | null
          status: string
          updated_at: string
          wheelchair_accessible: boolean | null
        }
        Insert: {
          agency_id: string
          assigned_transportation_company_id?: string | null
          client_name: string
          created_at?: string
          destination_address: string
          estimated_fare?: number | null
          id?: string
          is_recurring?: boolean | null
          notes?: string | null
          passenger_count?: number | null
          pickup_address: string
          recurring_schedule?: Json | null
          requested_pickup_time: string
          special_needs?: string | null
          status?: string
          updated_at?: string
          wheelchair_accessible?: boolean | null
        }
        Update: {
          agency_id?: string
          assigned_transportation_company_id?: string | null
          client_name?: string
          created_at?: string
          destination_address?: string
          estimated_fare?: number | null
          id?: string
          is_recurring?: boolean | null
          notes?: string | null
          passenger_count?: number | null
          pickup_address?: string
          recurring_schedule?: Json | null
          requested_pickup_time?: string
          special_needs?: string | null
          status?: string
          updated_at?: string
          wheelchair_accessible?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "agency_transportation_request_assigned_transportation_comp_fkey"
            columns: ["assigned_transportation_company_id"]
            isOneToOne: false
            referencedRelation: "transportation_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          certificate_number: string
          certificate_type: string
          course_id: string
          created_at: string
          enrollment_id: string
          expiry_date: string | null
          file_url: string | null
          id: string
          is_valid: boolean
          issue_date: string
          student_id: string
          trainer_id: string
          verification_code: string
        }
        Insert: {
          certificate_number: string
          certificate_type: string
          course_id: string
          created_at?: string
          enrollment_id: string
          expiry_date?: string | null
          file_url?: string | null
          id?: string
          is_valid?: boolean
          issue_date?: string
          student_id: string
          trainer_id: string
          verification_code: string
        }
        Update: {
          certificate_number?: string
          certificate_type?: string
          course_id?: string
          created_at?: string
          enrollment_id?: string
          expiry_date?: string | null
          file_url?: string | null
          id?: string
          is_valid?: boolean
          issue_date?: string
          student_id?: string
          trainer_id?: string
          verification_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "course_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string
          care_notes: string | null
          created_at: string
          emergency_contact: string | null
          id: string
          is_active: boolean
          medicaid_id: string
          name: string
          phone: string | null
        }
        Insert: {
          address: string
          care_notes?: string | null
          created_at?: string
          emergency_contact?: string | null
          id?: string
          is_active?: boolean
          medicaid_id: string
          name: string
          phone?: string | null
        }
        Update: {
          address?: string
          care_notes?: string | null
          created_at?: string
          emergency_contact?: string | null
          id?: string
          is_active?: boolean
          medicaid_id?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      course_enrollments: {
        Row: {
          amount_paid: number | null
          certificate_issued: boolean
          certificate_issued_at: string | null
          certificate_url: string | null
          course_id: string
          enrolled_at: string
          id: string
          payment_status: string
          stripe_payment_intent_id: string | null
          student_id: string
        }
        Insert: {
          amount_paid?: number | null
          certificate_issued?: boolean
          certificate_issued_at?: string | null
          certificate_url?: string | null
          course_id: string
          enrolled_at?: string
          id?: string
          payment_status?: string
          stripe_payment_intent_id?: string | null
          student_id: string
        }
        Update: {
          amount_paid?: number | null
          certificate_issued?: boolean
          certificate_issued_at?: string | null
          certificate_url?: string | null
          course_id?: string
          enrolled_at?: string
          id?: string
          payment_status?: string
          stripe_payment_intent_id?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_lessons: {
        Row: {
          attachment_urls: string[] | null
          content: string | null
          created_at: string
          duration_minutes: number | null
          id: string
          is_published: boolean
          lesson_type: string
          module_id: string
          order_index: number
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          attachment_urls?: string[] | null
          content?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          is_published?: boolean
          lesson_type?: string
          module_id: string
          order_index?: number
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          attachment_urls?: string[] | null
          content?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          is_published?: boolean
          lesson_type?: string
          module_id?: string
          order_index?: number
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      course_modules: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          is_published: boolean
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          order_index?: number
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          duration_hours: number | null
          id: string
          is_active: boolean
          learning_objectives: string[] | null
          max_students: number | null
          price: number
          requirements: string | null
          title: string
          trainer_id: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          id?: string
          is_active?: boolean
          learning_objectives?: string[] | null
          max_students?: number | null
          price: number
          requirements?: string | null
          title: string
          trainer_id: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          id?: string
          is_active?: boolean
          learning_objectives?: string[] | null
          max_students?: number | null
          price?: number
          requirements?: string | null
          title?: string
          trainer_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      drivers: {
        Row: {
          background_check_date: string | null
          background_check_status: string
          created_at: string
          current_location_lat: number | null
          current_location_lng: number | null
          driver_email: string
          driver_name: string
          driver_phone: string
          id: string
          is_active: boolean
          is_available: boolean
          license_expiry_date: string
          license_number: string
          rating: number | null
          total_rides: number | null
          transportation_company_id: string | null
          updated_at: string
          vehicle_insurance_expiry: string | null
          vehicle_insurance_policy: string | null
          vehicle_license_plate: string | null
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_year: number | null
        }
        Insert: {
          background_check_date?: string | null
          background_check_status?: string
          created_at?: string
          current_location_lat?: number | null
          current_location_lng?: number | null
          driver_email: string
          driver_name: string
          driver_phone: string
          id?: string
          is_active?: boolean
          is_available?: boolean
          license_expiry_date: string
          license_number: string
          rating?: number | null
          total_rides?: number | null
          transportation_company_id?: string | null
          updated_at?: string
          vehicle_insurance_expiry?: string | null
          vehicle_insurance_policy?: string | null
          vehicle_license_plate?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_year?: number | null
        }
        Update: {
          background_check_date?: string | null
          background_check_status?: string
          created_at?: string
          current_location_lat?: number | null
          current_location_lng?: number | null
          driver_email?: string
          driver_name?: string
          driver_phone?: string
          id?: string
          is_active?: boolean
          is_available?: boolean
          license_expiry_date?: string
          license_number?: string
          rating?: number | null
          total_rides?: number | null
          transportation_company_id?: string | null
          updated_at?: string
          vehicle_insurance_expiry?: string | null
          vehicle_insurance_policy?: string | null
          vehicle_license_plate?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "drivers_transportation_company_id_fkey"
            columns: ["transportation_company_id"]
            isOneToOne: false
            referencedRelation: "transportation_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      evv_logs: {
        Row: {
          created_at: string
          device_info: Json | null
          dsp_id: string
          event_timestamp: string
          event_type: string
          gps_latitude: number
          gps_longitude: number
          id: string
          location_address: string | null
          shift_id: string
          verification_status: string
        }
        Insert: {
          created_at?: string
          device_info?: Json | null
          dsp_id: string
          event_timestamp?: string
          event_type: string
          gps_latitude: number
          gps_longitude: number
          id?: string
          location_address?: string | null
          shift_id: string
          verification_status?: string
        }
        Update: {
          created_at?: string
          device_info?: Json | null
          dsp_id?: string
          event_timestamp?: string
          event_type?: string
          gps_latitude?: number
          gps_longitude?: number
          id?: string
          location_address?: string | null
          shift_id?: string
          verification_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "evv_logs_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "evv_shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      evv_shifts: {
        Row: {
          actual_clock_in_time: string | null
          actual_clock_out_time: string | null
          client_id: string
          clock_in_address: string | null
          clock_in_gps_lat: number | null
          clock_in_gps_lng: number | null
          clock_out_address: string | null
          clock_out_gps_lat: number | null
          clock_out_gps_lng: number | null
          created_at: string
          dsp_id: string
          facility_name: string
          id: string
          medicaid_id: string
          notes: string | null
          scheduled_end_time: string
          scheduled_start_time: string
          service_type: string
          shift_date: string
          status: string
          updated_at: string
        }
        Insert: {
          actual_clock_in_time?: string | null
          actual_clock_out_time?: string | null
          client_id: string
          clock_in_address?: string | null
          clock_in_gps_lat?: number | null
          clock_in_gps_lng?: number | null
          clock_out_address?: string | null
          clock_out_gps_lat?: number | null
          clock_out_gps_lng?: number | null
          created_at?: string
          dsp_id: string
          facility_name: string
          id?: string
          medicaid_id: string
          notes?: string | null
          scheduled_end_time: string
          scheduled_start_time: string
          service_type?: string
          shift_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          actual_clock_in_time?: string | null
          actual_clock_out_time?: string | null
          client_id?: string
          clock_in_address?: string | null
          clock_in_gps_lat?: number | null
          clock_in_gps_lng?: number | null
          clock_out_address?: string | null
          clock_out_gps_lat?: number | null
          clock_out_gps_lng?: number | null
          created_at?: string
          dsp_id?: string
          facility_name?: string
          id?: string
          medicaid_id?: string
          notes?: string | null
          scheduled_end_time?: string
          scheduled_start_time?: string
          service_type?: string
          shift_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          course_id: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message_type: string | null
          parent_message_id: string | null
          recipient_id: string
          sender_id: string
          subject: string | null
          updated_at: string | null
        }
        Insert: {
          content: string
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          parent_message_id?: string | null
          recipient_id: string
          sender_id: string
          subject?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          parent_message_id?: string | null
          recipient_id?: string
          sender_id?: string
          subject?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_parent_message_id_fkey"
            columns: ["parent_message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          organization: string | null
          phone: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          organization?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          organization?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          correct_answer: string
          created_at: string
          explanation: string | null
          id: string
          lesson_id: string
          options: Json | null
          order_index: number
          question_text: string
          question_type: string
        }
        Insert: {
          correct_answer: string
          created_at?: string
          explanation?: string | null
          id?: string
          lesson_id: string
          options?: Json | null
          order_index?: number
          question_text: string
          question_type?: string
        }
        Update: {
          correct_answer?: string
          created_at?: string
          explanation?: string | null
          id?: string
          lesson_id?: string
          options?: Json | null
          order_index?: number
          question_text?: string
          question_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      ride_ratings: {
        Row: {
          created_at: string
          feedback: string | null
          id: string
          rater_id: string
          rater_type: string
          rating: number
          ride_request_id: string | null
        }
        Insert: {
          created_at?: string
          feedback?: string | null
          id?: string
          rater_id: string
          rater_type: string
          rating: number
          ride_request_id?: string | null
        }
        Update: {
          created_at?: string
          feedback?: string | null
          id?: string
          rater_id?: string
          rater_type?: string
          rating?: number
          ride_request_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ride_ratings_ride_request_id_fkey"
            columns: ["ride_request_id"]
            isOneToOne: false
            referencedRelation: "ride_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      ride_requests: {
        Row: {
          accepted_at: string | null
          assigned_driver_id: string | null
          base_fare: number | null
          created_at: string
          destination_address: string
          destination_lat: number | null
          destination_lng: number | null
          dropoff_completed_at: string | null
          estimated_distance_miles: number | null
          estimated_duration_minutes: number | null
          id: string
          passenger_count: number | null
          pickup_address: string
          pickup_completed_at: string | null
          pickup_lat: number | null
          pickup_lng: number | null
          platform_fee: number | null
          requested_pickup_time: string
          requester_id: string
          ride_type: string
          shift_id: string | null
          special_requirements: string | null
          status: string
          total_fare: number | null
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          assigned_driver_id?: string | null
          base_fare?: number | null
          created_at?: string
          destination_address: string
          destination_lat?: number | null
          destination_lng?: number | null
          dropoff_completed_at?: string | null
          estimated_distance_miles?: number | null
          estimated_duration_minutes?: number | null
          id?: string
          passenger_count?: number | null
          pickup_address: string
          pickup_completed_at?: string | null
          pickup_lat?: number | null
          pickup_lng?: number | null
          platform_fee?: number | null
          requested_pickup_time: string
          requester_id: string
          ride_type: string
          shift_id?: string | null
          special_requirements?: string | null
          status?: string
          total_fare?: number | null
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          assigned_driver_id?: string | null
          base_fare?: number | null
          created_at?: string
          destination_address?: string
          destination_lat?: number | null
          destination_lng?: number | null
          dropoff_completed_at?: string | null
          estimated_distance_miles?: number | null
          estimated_duration_minutes?: number | null
          id?: string
          passenger_count?: number | null
          pickup_address?: string
          pickup_completed_at?: string | null
          pickup_lat?: number | null
          pickup_lng?: number | null
          platform_fee?: number | null
          requested_pickup_time?: string
          requester_id?: string
          ride_type?: string
          shift_id?: string | null
          special_requirements?: string | null
          status?: string
          total_fare?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ride_requests_assigned_driver_id_fkey"
            columns: ["assigned_driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      student_feedback: {
        Row: {
          course_id: string
          created_at: string | null
          feedback_text: string | null
          feedback_type: string | null
          id: string
          is_anonymous: boolean | null
          lesson_id: string | null
          rating: number | null
          student_id: string
          trainer_id: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          feedback_text?: string | null
          feedback_type?: string | null
          id?: string
          is_anonymous?: boolean | null
          lesson_id?: string | null
          rating?: number | null
          student_id: string
          trainer_id: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          feedback_text?: string | null
          feedback_type?: string | null
          id?: string
          is_anonymous?: boolean | null
          lesson_id?: string | null
          rating?: number | null
          student_id?: string
          trainer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_feedback_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_feedback_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      student_lesson_progress: {
        Row: {
          best_quiz_score: number | null
          completed_at: string | null
          course_id: string
          created_at: string | null
          id: string
          last_accessed_at: string | null
          lesson_id: string
          notes: string | null
          progress_percentage: number | null
          quiz_attempts: number | null
          started_at: string | null
          student_id: string
          time_spent_minutes: number | null
          updated_at: string | null
        }
        Insert: {
          best_quiz_score?: number | null
          completed_at?: string | null
          course_id: string
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          lesson_id: string
          notes?: string | null
          progress_percentage?: number | null
          quiz_attempts?: number | null
          started_at?: string | null
          student_id: string
          time_spent_minutes?: number | null
          updated_at?: string | null
        }
        Update: {
          best_quiz_score?: number | null
          completed_at?: string | null
          course_id?: string
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          lesson_id?: string
          notes?: string | null
          progress_percentage?: number | null
          quiz_attempts?: number | null
          started_at?: string | null
          student_id?: string
          time_spent_minutes?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_lesson_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      student_notifications: {
        Row: {
          action_url: string | null
          content: string
          course_id: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          notification_type: string
          priority: string | null
          scheduled_for: string | null
          sent_at: string | null
          student_id: string
          title: string
        }
        Insert: {
          action_url?: string | null
          content: string
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          notification_type: string
          priority?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          student_id: string
          title: string
        }
        Update: {
          action_url?: string | null
          content?: string
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          notification_type?: string
          priority?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          student_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_notifications_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      student_progress: {
        Row: {
          completed_at: string | null
          course_id: string
          created_at: string
          id: string
          lesson_id: string
          quiz_score: number | null
          student_id: string
          time_spent_minutes: number | null
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          created_at?: string
          id?: string
          lesson_id: string
          quiz_score?: number | null
          student_id: string
          time_spent_minutes?: number | null
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          created_at?: string
          id?: string
          lesson_id?: string
          quiz_score?: number | null
          student_id?: string
          time_spent_minutes?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      transportation_companies: {
        Row: {
          address: string | null
          city: string
          commission_rate: number
          company_name: string
          contact_email: string
          contact_phone: string | null
          created_at: string
          id: string
          insurance_expiry_date: string | null
          insurance_policy_number: string | null
          insurance_provider: string | null
          is_active: boolean
          license_number: string | null
          rating: number | null
          state: string
          total_rides: number | null
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string
          commission_rate?: number
          company_name: string
          contact_email: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          insurance_expiry_date?: string | null
          insurance_policy_number?: string | null
          insurance_provider?: string | null
          is_active?: boolean
          license_number?: string | null
          rating?: number | null
          state?: string
          total_rides?: number | null
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string
          commission_rate?: number
          company_name?: string
          contact_email?: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          insurance_expiry_date?: string | null
          insurance_policy_number?: string | null
          insurance_provider?: string | null
          is_active?: boolean
          license_number?: string | null
          rating?: number | null
          state?: string
          total_rides?: number | null
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      transportation_quotes: {
        Row: {
          agency_request_id: string | null
          availability_notes: string | null
          created_at: string
          estimated_duration: string | null
          id: string
          quote_valid_until: string | null
          quoted_price: number
          service_details: string | null
          status: string
          transportation_company_id: string | null
          updated_at: string
        }
        Insert: {
          agency_request_id?: string | null
          availability_notes?: string | null
          created_at?: string
          estimated_duration?: string | null
          id?: string
          quote_valid_until?: string | null
          quoted_price: number
          service_details?: string | null
          status?: string
          transportation_company_id?: string | null
          updated_at?: string
        }
        Update: {
          agency_request_id?: string | null
          availability_notes?: string | null
          created_at?: string
          estimated_duration?: string | null
          id?: string
          quote_valid_until?: string | null
          quoted_price?: number
          service_details?: string | null
          status?: string
          transportation_company_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transportation_quotes_agency_request_id_fkey"
            columns: ["agency_request_id"]
            isOneToOne: false
            referencedRelation: "agency_transportation_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transportation_quotes_transportation_company_id_fkey"
            columns: ["transportation_company_id"]
            isOneToOne: false
            referencedRelation: "transportation_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      uploaded_certificates: {
        Row: {
          certificate_name: string
          certificate_type: string
          created_at: string
          expiry_date: string | null
          file_url: string
          id: string
          rejection_reason: string | null
          status: string
          student_id: string
          updated_at: string
          upload_date: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          certificate_name: string
          certificate_type: string
          created_at?: string
          expiry_date?: string | null
          file_url: string
          id?: string
          rejection_reason?: string | null
          status?: string
          student_id: string
          updated_at?: string
          upload_date?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          certificate_name?: string
          certificate_type?: string
          created_at?: string
          expiry_date?: string | null
          file_url?: string
          id?: string
          rejection_reason?: string | null
          status?: string
          student_id?: string
          updated_at?: string
          upload_date?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_certificate_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_verification_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
