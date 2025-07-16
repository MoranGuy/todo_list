import {useEffect, useState} from "react";

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem("tasks");
    return stored ? JSON.parse(stored) as Task[] : [];
  });
  const [input, setInput] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (input.trim()) {
      setTasks([...tasks, { id: Date.now(), text: input.trim(), completed: false }]);
      setInput("");
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");


  const filteredTasks = tasks.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
      <div style={styles.container}>
        <h1>To-Do</h1>
        <div style={styles.inputRow}>
          <input
              style={styles.input}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addTask()}
              placeholder="Add a task..."
          />
          <button onClick={addTask} style={styles.button}>Add</button>
        </div>
        <div style={styles.filters}>
          <button
              onClick={() => setFilter("all")}
              style={filter === "all" ? styles.activeFilter : styles.filter}
          >
            All
          </button>
          <button
              onClick={() => setFilter("active")}
              style={filter === "active" ? styles.activeFilter : styles.filter}
          >
            Active
          </button>
          <button
              onClick={() => setFilter("completed")}
              style={filter === "completed" ? styles.activeFilter : styles.filter}
          >
            Completed
          </button>
        </div>

        <ul style={styles.list}>
          {filteredTasks.map(task => (
              <li key={task.id} style={styles.listItem}>
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                />
                <span
                    style={{
                      ...styles.taskText,
                      textDecoration: task.completed ? "line-through" : "none",
                      color: task.completed ? "#aaa" : "#000"
                    }}
                >
              {task.text}
            </span>
                <button onClick={() => deleteTask(task.id)} style={styles.delete}>✕</button>
              </li>
          ))}
        </ul>
      </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "400px",
    margin: "3rem auto",
    padding: "1rem",
    fontFamily: "sans-serif",
    border: "1px solid #ddd",
    borderRadius: "8px"
  },
  inputRow: {
    display: "flex",
    gap: "0.5rem"
  },
  input: {
    flex: 1,
    padding: "0.5rem"
  },
  button: {
    padding: "0.5rem 1rem"
  },
  list: {
    listStyle: "none",
    padding: 0,
    marginTop: "1rem"
  },
  listItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "0.5rem"
  },
  taskText: {
    flex: 1
  },
  delete: {
    background: "transparent",
    border: "none",
    color: "#d00",
    fontSize: "1.2rem",
    cursor: "pointer"
  },
  filters: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "1rem"
  },
  filter: {
    background: "none",
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "0.3rem 1rem",
    cursor: "pointer"
  },
  activeFilter: {
    background: "#000",
    color: "#fff",
    border: "1px solid #000",
    borderRadius: "4px",
    padding: "0.3rem 1rem",
    cursor: "pointer"
  }
};