import { useState } from "react";
import { useProjects } from "../services/queries";

function Projects() {
  const [page, setPage] = useState(1);
  const { data, isFetching, isError, isPending, error, isPlaceholderData } =
    useProjects(page);
  return (
    <div>
      {isPending ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : (
        data.map((project) => <div key={project.id}>{project.name}</div>)
      )}
      <span>Current page : {page}</span>
      <button onClick={() => setPage((old) => Math.max(old - 1, 0))}>
        Previous page
      </button>{" "}
      <button
        onClick={() => {
          if (!isPlaceholderData) {
            setPage((old) => old + 1);
          }
        }}
        disabled={isPlaceholderData}
      >
        Next Page
      </button>
      {isFetching && "Loading more..."}{" "}
    </div>
  );
}

export default Projects;
