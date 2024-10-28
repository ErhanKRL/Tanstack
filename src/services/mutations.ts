import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTodo, deleteTodo, updateTodo } from "./api";
import { Todo } from "../types/todo";

export function useCreateTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Todo) => createTodo(data),
    onMutate: () => {
      console.log("onMutate");
    },
    onError: () => {
      console.log("onError");
    },
    onSuccess: () => {
      console.log("onSuccess");
    },
    onSettled: (_, error) => {
      if (error) {
        console.log("error occured");
      } else {
        queryClient.invalidateQueries({ queryKey: ["todos"] });
      }
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Todo) => updateTodo(data),
    onSettled: (_, error, variables) => {
      if (error) {
        console.log("error occured");
      } else {
        queryClient.invalidateQueries({ queryKey: ["todos"] });
        queryClient.invalidateQueries({
          queryKey: ["todo", { id: variables.id }],
        });
      }
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTodo(id),
    onSettled: (_, error) => {
      if (error) {
        console.log("error occured");
      } else {
        queryClient.invalidateQueries({ queryKey: ["todos"] });
      }
    },
  });
}
