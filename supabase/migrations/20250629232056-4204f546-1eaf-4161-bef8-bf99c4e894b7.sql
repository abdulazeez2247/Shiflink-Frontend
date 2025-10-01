
-- Create table for course modules/sections
CREATE TABLE public.course_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for lessons within modules
CREATE TABLE public.course_lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  lesson_type TEXT NOT NULL DEFAULT 'text', -- 'text', 'video', 'quiz', 'assignment'
  duration_minutes INTEGER DEFAULT 0,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  video_url TEXT,
  attachment_urls TEXT[], -- Array of file URLs
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for quiz questions
CREATE TABLE public.quiz_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'multiple_choice', -- 'multiple_choice', 'true_false', 'short_answer'
  options JSONB, -- For multiple choice options
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for student progress tracking
CREATE TABLE public.student_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE,
  quiz_score INTEGER, -- Percentage score for quiz lessons
  time_spent_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, lesson_id)
);

-- Enable Row Level Security
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for course_modules
CREATE POLICY "Trainers can manage their course modules" 
  ON public.course_modules 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE courses.id = course_modules.course_id 
      AND courses.trainer_id = auth.uid()
    )
  );

CREATE POLICY "Students can view published modules of enrolled courses" 
  ON public.course_modules 
  FOR SELECT 
  USING (
    is_published = true AND
    EXISTS (
      SELECT 1 FROM public.course_enrollments 
      WHERE course_enrollments.course_id = course_modules.course_id 
      AND course_enrollments.student_id = auth.uid()
      AND course_enrollments.payment_status = 'paid'
    )
  );

-- RLS Policies for course_lessons
CREATE POLICY "Trainers can manage their course lessons" 
  ON public.course_lessons 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.course_modules 
      JOIN public.courses ON courses.id = course_modules.course_id
      WHERE course_modules.id = course_lessons.module_id 
      AND courses.trainer_id = auth.uid()
    )
  );

CREATE POLICY "Students can view published lessons of enrolled courses" 
  ON public.course_lessons 
  FOR SELECT 
  USING (
    is_published = true AND
    EXISTS (
      SELECT 1 FROM public.course_modules 
      JOIN public.course_enrollments ON course_enrollments.course_id = course_modules.course_id
      WHERE course_modules.id = course_lessons.module_id 
      AND course_enrollments.student_id = auth.uid()
      AND course_enrollments.payment_status = 'paid'
    )
  );

-- RLS Policies for quiz_questions
CREATE POLICY "Trainers can manage quiz questions" 
  ON public.quiz_questions 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.course_lessons 
      JOIN public.course_modules ON course_modules.id = course_lessons.module_id
      JOIN public.courses ON courses.id = course_modules.course_id
      WHERE course_lessons.id = quiz_questions.lesson_id 
      AND courses.trainer_id = auth.uid()
    )
  );

CREATE POLICY "Students can view quiz questions of enrolled courses" 
  ON public.quiz_questions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.course_lessons 
      JOIN public.course_modules ON course_modules.id = course_lessons.module_id
      JOIN public.course_enrollments ON course_enrollments.course_id = course_modules.course_id
      WHERE course_lessons.id = quiz_questions.lesson_id 
      AND course_enrollments.student_id = auth.uid()
      AND course_enrollments.payment_status = 'paid'
      AND course_lessons.is_published = true
    )
  );

-- RLS Policies for student_progress
CREATE POLICY "Students can manage their own progress" 
  ON public.student_progress 
  FOR ALL 
  USING (student_id = auth.uid());

CREATE POLICY "Trainers can view progress of their course students" 
  ON public.student_progress 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE courses.id = student_progress.course_id 
      AND courses.trainer_id = auth.uid()
    )
  );

-- Add indexes for better performance
CREATE INDEX idx_course_modules_course_id ON public.course_modules(course_id);
CREATE INDEX idx_course_modules_order ON public.course_modules(course_id, order_index);
CREATE INDEX idx_course_lessons_module_id ON public.course_lessons(module_id);
CREATE INDEX idx_course_lessons_order ON public.course_lessons(module_id, order_index);
CREATE INDEX idx_quiz_questions_lesson_id ON public.quiz_questions(lesson_id);
CREATE INDEX idx_student_progress_student_course ON public.student_progress(student_id, course_id);
CREATE INDEX idx_student_progress_lesson ON public.student_progress(lesson_id);
