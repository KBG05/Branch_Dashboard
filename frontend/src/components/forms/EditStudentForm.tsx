import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateStudent } from "@/hooks/useStudents";
import { StudentFullRead } from "@/config/api";

const formSchema = z.object({
  usn: z.string().min(1, "USN is required"),
  name: z.string().min(1, "Name is required"),
  gender: z.string().min(1, "Gender is required"),
  branch: z.string().min(1, "Branch is required"),
  batch: z.string().min(1, "Batch is required"),
  seat_type: z.string().min(1, "Seat type is required"),
  state: z.string().min(1, "State is required"),
  ranking: z.string().optional(),
});

interface EditStudentFormProps {
  student: StudentFullRead;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EditStudentForm({ student, onSuccess, onCancel }: EditStudentFormProps) {
  const updateStudentMutation = useUpdateStudent();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usn: student.usn || "",
      name: student.name || "",
      gender: student.gender || "",
      branch: student.branch || "",
      batch: student.batch?.toString() || "",
      seat_type: student.seat_type || "",
      state: student.state || "",
      ranking: student.ranking || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateStudentMutation.mutate({
      usn: values.usn,
      name: values.name,
      gender: values.gender,
      branch: values.branch,
      batch: parseInt(values.batch),
      seat_type: values.seat_type,
      state: values.state,
      ranking: values.ranking || null,
    }, {
      onSuccess: () => {
        onSuccess?.();
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="usn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>USN</FormLabel>
                <FormControl>
                  <Input {...field} disabled className="bg-gray-100 text-gray-500" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="branch"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="batch"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Batch</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="seat_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seat Type</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ranking"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ranking (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <DialogClose asChild>
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
          </DialogClose>
          <Button 
            type="submit" 
            disabled={updateStudentMutation.isPending}
          >
            {updateStudentMutation.isPending ? "Updating..." : "Update Student"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
