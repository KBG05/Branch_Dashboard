
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { achievementService } from '@/services/achievementService';
import { AchievementInDB, AchievementUpdate } from '@/config/api';
import { useToast } from '@/hooks/use-toast';

export const useAchievements = () => {
  return useQuery({
    queryKey: ['achievements'],
    queryFn: () => achievementService.getAllAchievements(),
  });
};

export const useAchievementsByUSN = (usn: string) => {
  return useQuery({
    queryKey: ['achievements', usn],
    queryFn: () => achievementService.getAchievementsByUSN(usn),
    enabled: !!usn,
  });
};

export const useAddAchievement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (achievement: AchievementInDB) => achievementService.addAchievement(achievement),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      toast({
        title: "Success",
        description: data.msg,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add achievement: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateAchievement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (achievement: AchievementUpdate) => achievementService.updateAchievement(achievement),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      toast({
        title: "Success",
        description: data.msg,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update achievement: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteAchievement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => achievementService.deleteAchievement(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      toast({
        title: "Success",
        description: data.msg,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete achievement: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useUploadAchievementExcel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (file: File) => achievementService.uploadExcel(file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
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
