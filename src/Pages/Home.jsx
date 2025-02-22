import axios from "axios";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"; // Import drag and drop
import { io } from "socket.io-client"; // WebSocket client

export default function HomePage() {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const categories = ["To-Do", "In Progress", "Done"];

  // Set up the query client
  const queryClient = useQueryClient();

  // WebSocket connection to listen for task updates
  const socket = io("http://localhost:5000");

  // Fetch tasks using Tanstack Query's new API (correct v5 syntax)
  const {
    data: tasks,
    isLoading,
    error,
    refetch, // Include refetch to manually refresh the data
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:5000/tasks");
      return response.data;
    },
  });

  // Listen for task updates from WebSocket
  useEffect(() => {
    socket.on("taskUpdated", (updatedTask) => {
      queryClient.setQueryData(["tasks"], (oldTasks) => {
        return oldTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        );
      });
    });

    return () => {
      socket.off("taskUpdated");
    };
  }, [socket, queryClient]);

  // Mutation for adding a task
  const mutation = useMutation({
    mutationFn: async ({ title, description, category }) => {
      const response = await axios.post("http://localhost:5000/tasks", {
        title,
        description,
        category,
      });
      return response.data;
    },
    onSuccess: (newTask) => {
      // Optimistically add the new task to the local query data
      queryClient.setQueryData(["tasks"], (oldTasks) => [newTask, ...oldTasks]);
      setNewTaskTitle(""); // Clear the title input after adding the task
      setNewTaskDescription(""); // Clear the description input after adding the task
    },
    onError: (error) => {
      console.error("Error adding task:", error);
    },
  });

  // Function to handle adding a new task
  const addTask = () => {
    if (!newTaskTitle.trim()) return; // Don't allow adding empty tasks

    // Call the mutation to add a new task
    mutation.mutate({
      title: newTaskTitle,
      description: newTaskDescription || "No description provided", // Default description if none provided
      category: "To-Do", // Default category
    });
  };

  // Handle the drag-and-drop functionality
  const handleDragEnd = async (result) => {
    const { destination, source } = result;
    if (!destination || destination.index === source.index) return; // If there's no destination or no change in index

    const taskId = result.draggableId;
    const task = tasks.find((task) => task._id === taskId); // Find the dragged task by ID

    // Update task's category based on where it was dropped
    const updatedTask = {
      ...task,
      category: destination.droppableId, // Set the category to the target category
    };

    try {
      await axios.put(`http://localhost:5000/tasks/${task._id}`, updatedTask); // Update on server
      refetch(); // Refetch tasks from the server to ensure the UI is up-to-date
    } catch (error) {
      console.error("Error updating task category on server:", error);
    }
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
          onChange={(e) => setNewTaskTitle(e.target.value)} // Handle title change
        />
        <input
          type="text"
          placeholder="Description"
          className="px-4 ml-4 py-2 rounded-lg border border-gray-300 w-1/3"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)} // Handle description change
        />
        <button
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={addTask}
          disabled={mutation.isLoading} // Disable button while loading
        >
          {mutation.isLoading ? "Adding..." : "Add Task"}
        </button>
      </div>

      {/* Task Categories with Drag-and-Drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6">
          {categories.map((category) => (
            <div
              key={category}
              className="w-1/3 bg-white p-4 rounded-lg shadow-md"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {category}
              </h2>
              <Droppable droppableId={category}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-4"
                  >
                    {tasks
                      ? tasks
                          .filter((task) => task.category === category)
                          .map((task, index) => (
                            <Draggable
                              key={task._id}
                              draggableId={task._id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="bg-gray-50 p-4 rounded-lg border border-gray-300"
                                >
                                  <h3 className="text-lg font-semibold text-gray-700">
                                    {task.title}
                                  </h3>
                                  <p className="text-gray-600">
                                    {task.description}
                                  </p>
                                </div>
                              )}
                            </Draggable>
                          ))
                      : isLoading
                      ? "Loading..."
                      : error
                      ? "Error fetching tasks"
                      : null}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
