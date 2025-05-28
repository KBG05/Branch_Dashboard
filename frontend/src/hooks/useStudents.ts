
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentService } from '@/services/studentService';
import { StudentInDB, StudentUpdate } from '@/config/api';
import { useToast } from '@/hooks/use-toast';

export const useStudents = () => {
  return useQuery({
    queryKey: ['students'],
    queryFn: () => studentService.getAllStudents(),
  });
};

export const useStudent = (usn: string) => {
  return useQuery({
    queryKey: ['student', usn],
    queryFn: () => studentService.getStudentByUSN(usn),
    enabled: !!usn,
  });
};

export const useAddStudent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (student: StudentInDB) => studentService.addStudent(student),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Success",
        description: data.msg,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add student: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (student: StudentUpdate) => studentService.updateStudent(student),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['student'] });
      toast({
        title: "Success",
        description: data.msg,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update student: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useUploadExcel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (file: File) => studentService.uploadExcel(file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Success",
        description: data.msg,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to upload file: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
