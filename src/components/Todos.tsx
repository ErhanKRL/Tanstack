//import { useIsFetching } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  useCreateTodo,
  useDeleteTodo,
  useUpdateTodo,
} from "../services/mutations";
import { useTodosIds, useTodos } from "../services/queries";
import { Todo } from "../types/todo";

export default function Todos() {
  const todosIdsQuery = useTodosIds();
  const todosQueries = useTodos(todosIdsQuery.data);

  const createTodoMutation = useCreateTodo();
  const updateTodoMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();
  const { register, handleSubmit } = useForm<Todo>();
  const handleCreateTodoSubmit: SubmitHandler<Todo> = (data) => {
    createTodoMutation.mutate(data);
  };
  const handleMarkAsDone = (data: Todo | undefined) => {
    if (data) {
      updateTodoMutation.mutate({ ...data, checked: true });
    }
  };

  const handleDeleteTodo = async (id: number) => {
    await deleteTodoMutation.mutateAsync(id);
    console.log("deleted", id);
  };
  if (todosIdsQuery.isPending) {
    return <span>...LOADING</span>;
  }
  if (todosIdsQuery.isError) {
    return <span>ERROR</span>;
  }
  return (
    <>
      <form onSubmit={handleSubmit(handleCreateTodoSubmit)}>
        <h4>Create Todo</h4>
        <input placeholder="Title" {...register("title")} />
        <br />
        <input placeholder="Description" {...register("description")} />
        <br />
        <input
          type="submit"
          value={createTodoMutation.isPending ? "Creating..." : "Create"}
          disabled={createTodoMutation.isPending}
        />
      </form>
      <ul>
        {todosQueries.map(({ data }) => (
          <li key={data?.id}>
            <div>id: {data?.id}</div>
            <span>
              <strong>Title:</strong>
              {data?.title}, <strong>Description:</strong>
              {data?.description}
            </span>
            <div>
              <button
                onClick={() => handleMarkAsDone(data)}
                disabled={data?.checked}
              >
                {data?.checked ? "Done" : "Mark as done"}
              </button>
              {data && data.id && (
                <button onClick={() => handleDeleteTodo(data.id!)}>
                  Delete
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
