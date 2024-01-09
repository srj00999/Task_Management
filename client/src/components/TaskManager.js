import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import "./TaskManager.css";

const BASE_API = "http://localhost:3001/tasks/";

export const TaskManager = () => {
  const [activity, setActivity] = useState("");
  const [listData, setListData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [newPriority, setNewPriority] = useState("Low");
  const [newCategory, setNewCategory] = useState("Pending");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");

  const fetchData = async () => {
    try {
      const res = await fetch(BASE_API);
      const jsonData = await res.json();
      const { allTasks } = jsonData;
      setListData(allTasks);
    } catch (err) {
      console.error(`an error occurred: ${err}`);
    }
  };

  const addActivity = async () => {
    try {
      if (isEdit) {
        const res = await fetch(`${BASE_API}${editIndex}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: activity,
            priority: newPriority,
            category: newCategory,
          }),
        });

        if (res.ok) {
          setIsEdit(false);
          setEditIndex(null);
          setActivity("");
          setNewPriority("Low");
          setNewCategory("Pending");
        }
      } else {
        const res = await fetch(BASE_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: activity,
            priority: newPriority,
            category: newCategory,
          }),
        });

        if (res.ok) {
          setActivity("");
          setNewPriority("Low");
          setNewCategory("Pending");
        }
      }

      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const editTask = (id) => {
    const taskToEdit = listData.find((task) => task._id === id);
    setEditIndex(id);
    setIsEdit(true);
    setActivity(taskToEdit.name);
  };

  const removeActivity = async (id) => {
    try {
      const res = await fetch(`${BASE_API}${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filterTasks = () => {
    let filteredTasks = listData;

    if (filterPriority !== "All") {
      filteredTasks = filteredTasks.filter(
        (task) => task.priority === filterPriority
      );
    }

    if (filterCategory !== "All") {
      filteredTasks = filteredTasks.filter(
        (task) => task.category === filterCategory
      );
    }
    return filteredTasks;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const sortedTasks = filterTasks().sort((a, b) => {
    if (a.priority === b.priority) {
      return a.category.localeCompare(b.category);
    }
    return b.priority.localeCompare(a.priority);
  });
  return (
    <>
      <div className="container">
        <div className="header">Tasks Management System</div>
        <input
          type="text"
          placeholder={isEdit ? "Update Task" : "Add Task"}
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
        />
        <select
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value)}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="Working">Working</option>
          <option value="Completed">Completed</option>
        </select>

        <button
          className="add-button"
          onClick={addActivity}
          disabled={activity === ""}
        >
          {isEdit ? "Update Task" : "Add Task"}
        </button>

        {sortedTasks.length >= 1 && (
          <>
            <p className="task-heading">Here are your tasks</p>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="priority-filter"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="category-filter"
            >
              <option value="All">All Categories</option>
              <option value="Pending">Pending</option>
              <option value="Working">Working</option>
              <option value="Completed">Completed</option>
            </select>
          </>
        )}
        {sortedTasks.length >= 1 &&
          sortedTasks.map((data) => (
            <div className="task" key={data._id}>
              <div
                className={`priority-box priority-${data.priority.toLowerCase()}`}
              >
                {data.priority.toUpperCase()}
              </div>
              <div
                className={`category-box category-${data.category.toLowerCase()}`}
              >
                {data.category.toUpperCase()}
              </div>
              <div className="task-text">{data.name}</div>

              <div className="action-buttons">
                <button
                  className="remove-task"
                  onClick={() => removeActivity(data._id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <button
                  className="edit-task"
                  onClick={() => editTask(data._id)}
                >
                  <FontAwesomeIcon icon={faPen} />
                </button>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};
