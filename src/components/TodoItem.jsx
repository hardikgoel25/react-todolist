import React, { useState, useEffect, useRef } from "react"
import { useTodo } from "../contexts/TodoContext"

function TodoItem({ todo, dragHandleProps }) {
    const [isTodoEditable, setIsTodoEditable] = useState(false)
    const [todoMsg, setTodoMsg] = useState(todo.todo)
    const { updateTodo, deleteTodo, toggle } = useTodo()
    const inputRef = useRef(null)

    useEffect(() => {
        if (isTodoEditable && inputRef.current) {
            inputRef.current.focus()
            inputRef.current.select()
        }
    }, [isTodoEditable])

    // Save edit helper
    const editTodo = () => {
        const trimmed = todoMsg.trim()
        if (trimmed === "") {
            setTodoMsg(todo.todo)
            setIsTodoEditable(false)
            return
        }
        updateTodo(todo.id, { ...todo, todo: trimmed })
        setIsTodoEditable(false)
    }

    const toggleCompleted = () => {
        toggle(todo.id)
    }

    return (
        <div
            className={`flex border border-black/10 rounded-lg px-3 py-1.5 gap-x-3 shadow-sm shadow-white/50 duration-300 text-black ${todo.completed ? "bg-[#c6e9a7]" : "bg-[#ccbed7]"
                }`}
        >
            <input
                type="checkbox"
                className="cursor-pointer"
                checked={todo.completed}
                onChange={toggleCompleted}
            />

            <input
                type="text"
                className={`border outline-none w-full bg-transparent rounded-lg ${isTodoEditable ? "border-black/10 px-2" : "border-transparent"
                    } ${todo.completed ? "line-through" : ""}`}
                value={todoMsg}
                onChange={(e) => setTodoMsg(e.target.value)}
                readOnly={!isTodoEditable}
                onDoubleClick={() => {
                    if (!todo.completed) setIsTodoEditable(true)
                }}
                onBlur={editTodo}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        editTodo()
                    } else if (e.key === "Escape") {
                        setTodoMsg(todo.todo)
                        setIsTodoEditable(false)
                    }
                }}
                ref={inputRef}
            />

            {/* Drag handle */}
            <div
                {...dragHandleProps}
                className="cursor-move inline-flex w-8 h-8 justify-center items-center text-lg select-none bg-gray-200 rounded-lg hover:bg-gray-300 shrink-0"
                title="Drag handle"
            >
                ⠿
            </div>

            {/* Edit/Save button */}
            <button
                className="inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0 disabled:opacity-50"
                onClick={() => {
                    if (todo.completed) return
                    if (isTodoEditable) editTodo()
                    else setIsTodoEditable(true)
                }}
                disabled={todo.completed}
                title={isTodoEditable ? "Save todo" : "Edit todo"}
            >
                {isTodoEditable ? "💾" : "✏️"}
            </button>

            {/* Delete button */}
            <button
                className="inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0"
                onClick={() => deleteTodo(todo.id)}
                title="Delete todo"
            >
                ❌
            </button>
        </div>
    )
}

export default TodoItem
