import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Flame, Target, Award, Calendar, TrendingUp, Users } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  progress?: number;
  maxProgress?: number;
}

interface StudentProgress {
  id: string;
  name: string;
  totalPoints: number;
  level: number;
  streak: number;
  achievements: Achievement[];
  recentActivity: string[];
}

const ProgressGamification = () => {
  const [selectedStudent, setSelectedStudent] = useState<StudentProgress | null>(null);
  
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🎯',
      earned: true,
      earnedDate: '2024-01-10'
    },
    {
      id: '2',
      title: 'Quiz Master',
      description: 'Score 100% on 5 quizzes',
      icon: '🧠',
      earned: true,
      earnedDate: '2024-01-15',
      progress: 5,
      maxProgress: 5
    },
    {
      id: '3',
      title: 'Streak Champion',
      description: 'Maintain a 7-day learning streak',
      icon: '🔥',
      earned: false,
      progress: 5,
      maxProgress: 7
    },
    {
      id: '4',
      title: 'Course Conqueror',
      description: 'Complete an entire course',
      icon: '👑',
      earned: false,
      progress: 8,
      maxProgress: 10
    },
    {
      id: '5',
      title: 'Discussion Leader',
      description: 'Start 3 forum discussions',
      icon: '💬',
      earned: false,
      progress: 1,
      maxProgress: 3
    },
    {
      id: '6',
      title: 'Perfect Attendance',
      description: 'Log in for 30 consecutive days',
      icon: '📅',
      earned: false,
      progress: 18,
      maxProgress: 30
    }
  ];

  const students: StudentProgress[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      totalPoints: 1250,
      level: 8,
      streak: 5,
      achievements: achievements.filter(a => ['1', '2'].includes(a.id)),
      recentActivity: [
        'Completed Quiz: Module 3 Assessment',
        'Earned achievement: Quiz Master',
        'Started new lesson: Advanced Concepts'
      ]
    },
    {
      id: '2',
      name: 'Michael Chen',
      totalPoints: 980,
      level: 6,
      streak: 12,
      achievements: achievements.filter(a => ['1'].includes(a.id)),
      recentActivity: [
        'Extended learning streak to 12 days',
        'Posted in forum: Study Group Formation',
        'Completed lesson: Basic Principles'
      ]
    },
    {
      id: '3',
      name: 'Emma Rodriguez',
      totalPoints: 1450,
      level: 10,
      streak: 3,
      achievements: achievements.filter(a => ['1', '2', '4'].includes(a.id)),
      recentActivity: [
        'Completed entire course: Fundamentals',
        'Earned achievement: Course Conqueror',
        'Started new course: Advanced Training'
      ]
    }
  ];

  const getPointsForNextLevel = (level: number) => {
    return (level + 1) * 200;
  };

  const getProgressToNextLevel = (points: number, level: number) => {
    const currentLevelPoints = level * 200;
    const nextLevelPoints = getPointsForNextLevel(level);
    const progress = points - currentLevelPoints;
    const needed = nextLevelPoints - currentLevelPoints;
    return (progress / needed) * 100;
  };

  const getLevelIcon = (level: number) => {
    if (level >= 10) return '👑';
    if (level >= 7) return '🏆';
    if (level >= 4) return '🥇';
    if (level >= 2) return '🥈';
    return '🥉';
  };

  if (selectedStudent) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{selectedStudent.name}'s Progress</h3>
            <p className="text-gray-600">Detailed gamification and achievement tracking</p>
          </div>
          <Button variant="outline" onClick={() => setSelectedStudent(null)}>
            Back to Overview
          </Button>
        </div>

        {/* Student Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">{getLevelIcon(selectedStudent.level)}</div>
              <div className="text-2xl font-bold text-blue-600">Level {selectedStudent.level}</div>
              <p className="text-sm text-gray-600">Current Level</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">{selectedStudent.totalPoints}</div>
              <p className="text-sm text-gray-600">Total Points</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{selectedStudent.streak}</div>
              <p className="text-sm text-gray-600">Day Streak</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{achievements.filter(a => a.earned).length}</div>
              <p className="text-sm text-gray-600">Achievements</p>
            </CardContent>
          </Card>
        </div>

        {/* Level Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Level Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Level {selectedStudent.level}</span>
                <span>Level {selectedStudent.level + 1}</span>
              </div>
              <Progress value={getProgressToNextLevel(selectedStudent.totalPoints, selectedStudent.level)} className="h-3" />
              <div className="text-sm text-gray-600 text-center">
                {selectedStudent.totalPoints} / {getPointsForNextLevel(selectedStudent.level)} points
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border ${
                    achievement.earned 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">{achievement.title}</h4>
                        {achievement.earned && (
                          <Badge variant="default" className="bg-green-600">
                            Earned
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                      
                      {achievement.earned && achievement.earnedDate && (
                        <p className="text-xs text-green-600">
                          Earned on {new Date(achievement.earnedDate).toLocaleDateString()}
                        </p>
                      )}
                      
                      {!achievement.earned && achievement.progress && achievement.maxProgress && (
                        <div className="space-y-1">
                          <Progress 
                            value={(achievement.progress / achievement.maxProgress) * 100} 
                            className="h-2"
                          />
                          <p className="text-xs text-gray-500">
                            {achievement.progress} / {achievement.maxProgress}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedStudent.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">{activity}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Progress Gamification</h3>
        <p className="text-gray-600">Track student engagement with badges, achievements, and learning streaks</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{students.length}</div>
            <p className="text-sm text-gray-600">Active Students</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">
              {students.reduce((sum, s) => sum + s.totalPoints, 0)}
            </div>
            <p className="text-sm text-gray-600">Total Points Earned</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">
              {students.reduce((sum, s) => sum + s.achievements.length, 0)}
            </div>
            <p className="text-sm text-gray-600">Achievements Unlocked</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">
              {Math.max(...students.map(s => s.streak))}
            </div>
            <p className="text-sm text-gray-600">Longest Streak</p>
          </CardContent>
        </Card>
      </div>

      {/* Student Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5" />
            <span>Student Leaderboard</span>
          </CardTitle>
          <CardDescription>Top performers based on points and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students
              .sort((a, b) => b.totalPoints - a.totalPoints)
              .map((student, index) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedStudent(student)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📍'}
                    </div>
                    <div>
                      <h4 className="font-medium">{student.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Level {student.level}</span>
                        <span>{student.totalPoints} points</span>
                        <div className="flex items-center space-x-1">
                          <Flame className="w-4 h-4 text-orange-500" />
                          <span>{student.streak} day streak</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      {student.achievements.length} achievements
                    </Badge>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievement System Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5" />
            <span>Achievement System</span>
          </CardTitle>
          <CardDescription>Available badges and achievements for student motivation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.slice(0, 6).map((achievement) => (
              <div key={achievement.id} className="p-4 border rounded-lg text-center">
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <h4 className="font-medium mb-1">{achievement.title}</h4>
                <p className="text-sm text-gray-600">{achievement.description}</p>
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs">
                    {achievements.filter(a => a.earned && a.id === achievement.id).length > 0 
                      ? `${students.filter(s => s.achievements.some(a => a.id === achievement.id)).length} earned`
                      : 'Available'
                    }
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressGamification;
