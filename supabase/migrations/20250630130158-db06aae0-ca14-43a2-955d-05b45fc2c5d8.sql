
-- Create student progress tracking with detailed metrics
CREATE TABLE public.student_lesson_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent_minutes INTEGER DEFAULT 0,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  quiz_attempts INTEGER DEFAULT 0,
  best_quiz_score INTEGER,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create messaging system for trainer-student communication
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  subject TEXT,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'direct' CHECK (message_type IN ('direct', 'announcement', 'reminder', 'feedback')),
  is_read BOOLEAN DEFAULT false,
  parent_message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create student feedback and ratings system
CREATE TABLE public.student_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  trainer_id UUID NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  feedback_type TEXT DEFAULT 'course' CHECK (feedback_type IN ('course', 'lesson', 'trainer', 'overall')),
  is_anonymous BOOLEAN DEFAULT false,
  lesson_id UUID REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create automated notifications/reminders system
CREATE TABLE public.student_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('reminder', 'progress_update', 'deadline', 'achievement', 'message')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  action_url TEXT,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for student progress
ALTER TABLE public.student_lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own progress" 
  ON public.student_lesson_progress 
  FOR SELECT 
  USING (student_id = auth.uid());

CREATE POLICY "Students can update their own progress" 
  ON public.student_lesson_progress 
  FOR ALL 
  USING (student_id = auth.uid());

CREATE POLICY "Trainers can view progress for their courses" 
  ON public.student_lesson_progress 
  FOR SELECT 
  USING (
    course_id IN (
      SELECT id FROM public.courses WHERE trainer_id = auth.uid()
    )
  );

-- Add RLS policies for messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages they sent or received" 
  ON public.messages 
  FOR SELECT 
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send messages" 
  ON public.messages 
  FOR INSERT 
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update messages they sent" 
  ON public.messages 
  FOR UPDATE 
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

-- Add RLS policies for feedback
ALTER TABLE public.student_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can create their own feedback" 
  ON public.student_feedback 
  FOR INSERT 
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can view their own feedback" 
  ON public.student_feedback 
  FOR SELECT 
  USING (student_id = auth.uid());

CREATE POLICY "Trainers can view feedback for their courses" 
  ON public.student_feedback 
  FOR SELECT 
  USING (trainer_id = auth.uid());

-- Add RLS policies for notifications
ALTER TABLE public.student_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own notifications" 
  ON public.student_notifications 
  FOR SELECT 
  USING (student_id = auth.uid());

CREATE POLICY "Students can update their own notifications" 
  ON public.student_notifications 
  FOR UPDATE 
  USING (student_id = auth.uid());

-- Add indexes for performance
CREATE INDEX idx_student_lesson_progress_student_course ON public.student_lesson_progress(student_id, course_id);
CREATE INDEX idx_student_lesson_progress_lesson ON public.student_lesson_progress(lesson_id);
CREATE INDEX idx_messages_recipient ON public.messages(recipient_id);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_course ON public.messages(course_id);
CREATE INDEX idx_student_feedback_course ON public.student_feedback(course_id);
CREATE INDEX idx_student_notifications_student ON public.student_notifications(student_id);
CREATE INDEX idx_student_notifications_unread ON public.student_notifications(student_id, is_read);
