import React, { useEffect, useState } from "react"
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd"
import { Todoprovider } from "./contexts"
import TodoForm from "./components/TodoForm"
import TodoItem from "./components/TodoItem"

function App() {
  const [todos, setTodos] = useState([])

  const addTodo = (todo) => {
    setTodos((prev) => [{ id: Date.now().toString(), ...todo }, ...prev])
  }

  const updateTodo = (id, todo) => {
    setTodos((prev) => prev.map((prevTodo) => (prevTodo.id === id ? todo : prevTodo)))
  }

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  const toggle = (id) => {
    setTodos((prev) =>
      prev.map((prevTodo) =>
        prevTodo.id === id ? { ...prevTodo, completed: !prevTodo.completed } : prevTodo
      )
    )
  }

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("todos"))
    if (saved && saved.length > 0) setTodos(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const newTodos = Array.from(todos)
    const [moved] = newTodos.splice(result.source.index, 1)
    newTodos.splice(result.destination.index, 0, moved)
    setTodos(newTodos)
  }

  // New: toggle all completed/uncompleted
  const toggleAllCompleted = () => {
    const allCompleted = todos.length > 0 && todos.every((t) => t.completed)
    setTodos(todos.map((t) => ({ ...t, completed: !allCompleted })))
  }

  // New: clear all completed
  const clearCompleted = () => {
    setTodos(todos.filter((t) => !t.completed))
  }

  // Stats
  const total = todos.length
  const completedCount = todos.filter((t) => t.completed).length
  const pendingCount = total - completedCount

  return (
    <Todoprovider value={{ todos, addTodo, updateTodo, deleteTodo, toggle }}>
      <div className="bg-[#172842] min-h-screen py-8">
        <div className="bg-[#263d5f] w-full max-w-2xl mx-auto shadow-md rounded-lg px-4 py-3 text-white">
          <h1 className="text-2xl font-bold text-center mb-8 mt-2">Manage Your Todos</h1>

          <div className="mb-4">
            <TodoForm />
          </div>

          <div className="flex justify-between mb-4 items-center gap-3 text-sm">
            <button
              onClick={toggleAllCompleted}
              className="bg-green-600 px-3 py-1 rounded hover:bg-green-700 transition"
              title="Mark all completed / Unmark all"
            >
              {completedCount === total && total !== 0 ? "Unmark All" : "Mark All Completed"}
            </button>

            <div className="flex gap-4 whitespace-nowrap">
              <div>Total: {total}</div>
              <div>Completed: {completedCount}</div>
              <div>Pending: {pendingCount}</div>
            </div>

            <button
              onClick={clearCompleted}
              disabled={completedCount === 0}
              className={`px-3 py-1 rounded ${completedCount === 0 ? "bg-gray-600 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                } transition`}
              title="Clear all completed todos"
            >
              Clear Completed
            </button>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="todos">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex flex-col gap-y-3"
                >
                  {todos.map((todo, index) => (
                    <Draggable
                      key={todo.id}
                      draggableId={todo.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="w-full"
                        >
                          <TodoItem todo={todo} dragHandleProps={provided.dragHandleProps} updateTodo={updateTodo} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </Todoprovider>
  )
}

export default App
