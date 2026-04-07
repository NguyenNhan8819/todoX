import React from "react";
import TaskCard from "./TaskCard";
import TaskEmptyState from "./TaskEmptyState";
const TaskList = ({ filteredTasks, handleTaskChange, filter }) => {
  //let filter = "all"; // tạm thời hardcode, sẽ thay bằng state sau
  // const filteredTasks = [
  //   {
  //     _id: "1",
  //     title: "Task 1",
  //     status: "active",
  //     completedAt: null,
  //     createdAt: new Date(),
  //   },
  //   {
  //     _id: "2",
  //     title: "Task 2",
  //     status: "completed",
  //     completedAt: new Date(),
  //     createdAt: new Date(),
  //   },
  // ]; // tạm thời hardcode, sẽ thay bằng state sau
  if (!filteredTasks || filteredTasks.length === 0) {
    return <TaskEmptyState filter={filter} />;
  }

  return (
    <div className="space-y-3">
      {filteredTasks.map((task, index) => (
        <TaskCard
          key={task._id ?? index}
          task={task}
          index={index}
          handleTaskChange={handleTaskChange}
        />
      ))}
    </div>
  );
};

export default TaskList;
