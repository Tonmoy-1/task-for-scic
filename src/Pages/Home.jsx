import axios from "axios";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function HomePage() {
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const categories = ["To-Do", "In Progress", "Done"];

  // Set up the query client
  const queryClient = useQueryClient();

  // Fetch tasks using Tanstack Query's new API
  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:5000/tasks");
      return response.data;
    },
  });

  // Mutation for adding a task
  const mutation = useMutation({
    mutationFn: async (newTaskTitle) => {
      const response = await axios.post("http://localhost:5000/tasks", {
        title: newTaskTitle,
        description: "No description provided",
        category: "To-Do", // Default category
      });
      return response.data;
    },
    // After a new task is added, refetch the tasks to update the list
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      setNewTaskTitle(""); // Clear the input after adding the task
    },
  });

  // Function to handle adding a new task
  const addTask = () => {
    if (!newTaskTitle.trim()) return; // Don't allow adding empty tasks
    mutation.mutate(newTaskTitle);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Task Management</h1>
      </header>

      {/* Add Task */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Enter new task"
          className="px-4 py-2 rounded-lg border border-gray-300 w-1/3"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={addTask}
          disabled={mutation.isLoading} // Disable button while loading
        >
          {mutation.isLoading ? "Adding..." : "Add Task"}
        </button>
      </div>

      {/* Task Categories */}
      <div className="flex gap-6">
        {categories.map((category) => (
          <div
            key={category}
            className="w-1/3 bg-white p-4 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {category}
            </h2>
            <div className="space-y-4">
              {tasks
                ? tasks
                    .filter((task) => task.category === category)
                    .map((task) => (
                      <div
                        key={task._id}
                        className="bg-gray-50 p-4 rounded-lg border border-gray-300"
                      >
                        <h3 className="text-lg font-semibold text-gray-700">
                          {task.title}
                        </h3>
                        <p className="text-gray-600">{task.description}</p>
                      </div>
                    ))
                : isLoading
                ? "Loading..."
                : error
                ? "Error fetching tasks"
                : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
