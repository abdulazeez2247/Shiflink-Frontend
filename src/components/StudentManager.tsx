
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Mail, Phone, Calendar, Search, UserPlus, Edit } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Student {
  id: string;
  courseId: string;
  name: string;
  email: string;
  phone: string;
  enrolledDate: string;
  status: 'enrolled' | 'completed' | 'dropped';
  progress: number;
}

interface StudentManagerProps {
  courseId: string;
  courseName: string;
  students: Student[];
  onStudentsChange: (students: Student[]) => void;
}

const StudentManager = ({ courseId, courseName, students, onStudentsChange }: StudentManagerProps) => {
  const courseStudents = students.filter(student => student.courseId === courseId);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const filteredStudents = courseStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.email) {
      toast({
        title: "Error",
        description: "Please fill in name and email",
        variant: "destructive"
      });
      return;
    }

    const student: Student = {
      id: Date.now().toString(),
      courseId,
      ...newStudent,
      enrolledDate: new Date().toISOString().split('T')[0],
      status: 'enrolled',
      progress: 0
    };

    onStudentsChange([...students, student]);
    setNewStudent({ name: '', email: '', phone: '' });
    setShowAddDialog(false);
    toast({
      title: "Success",
      description: "Student added successfully"
    });
  };

  const handleUpdateStudent = (studentId: string, updates: Partial<Student>) => {
    const updatedStudents = students.map(student =>
      student.id === studentId ? { ...student, ...updates } : student
    );
    onStudentsChange(updatedStudents);
    toast({
      title: "Success",
      description: "Student updated successfully"
    });
  };

  const handleRemoveStudent = (studentId: string) => {
    if (window.confirm('Are you sure you want to remove this student from the course?')) {
      const updatedStudents = students.filter(student => student.id !== studentId);
      onStudentsChange(updatedStudents);
      toast({
        title: "Success",
        description: "Student removed successfully"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'enrolled':
        return <Badge className="bg-blue-100 text-blue-800">Enrolled</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'dropped':
        return <Badge className="bg-red-100 text-red-800">Dropped</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Students - {courseName}</span>
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {courseStudents.length} total students • {courseStudents.filter(s => s.status === 'enrolled').length} active
            </p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-medical-blue hover:bg-blue-800">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="studentName">Name *</Label>
                  <Input
                    id="studentName"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter student name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentEmail">Email *</Label>
                  <Input
                    id="studentEmail"
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentPhone">Phone</Label>
                  <Input
                    id="studentPhone"
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddStudent} className="bg-medical-blue hover:bg-blue-800">
                    Add Student
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Enrolled</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-sm">
                        <Mail className="w-3 h-3" />
                        <span>{student.email}</span>
                      </div>
                      {student.phone && (
                        <div className="flex items-center space-x-1 text-sm">
                          <Phone className="w-3 h-3" />
                          <span>{student.phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm">
                      <Calendar className="w-3 h-3" />
                      <span>{student.enrolledDate}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={student.status} 
                      onValueChange={(value: 'enrolled' | 'completed' | 'dropped') => 
                        handleUpdateStudent(student.id, { status: value })
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enrolled">Enrolled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="dropped">Dropped</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-gray-200 rounded-full h-2 max-w-[80px]">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={student.progress}
                        onChange={(e) => handleUpdateStudent(student.id, { progress: parseInt(e.target.value) || 0 })}
                        className="w-16 h-8 text-xs"
                      />
                      <span className="text-xs">%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveStudent(student.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No students found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentManager;
