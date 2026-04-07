import React, { useState, useEffect } from "react";
import AddTask from "@/components/AddTask";
import Header from "@/components/Header";
import StatsAndFilters from "@/components/StatsAndFilters";
import TaskList from "@/components/TaskList";
import TaskListPagination from "@/components/TaskListPagination";
import DateTimeFilter from "@/components/DateTimeFilter";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import axios from "axios";
import apiClient from "@/lib/axios";
import { data } from "react-router";
import { visibleTasksLimit } from "@/lib/data";

const Homepage = () => {
  const [taskBuffer, setTaskBuffer] = useState([]);
  const [activeTaskCount, setActiveTaskCount] = useState(0);
  const [completedTaskCount, setCompletedTaskCount] = useState(0);
  const [filter, setFilter] = useState("ALL");
  const [dateQuery, setDateQuery] = useState("today");
  const [page, setPage] = useState(1);
  useEffect(() => {
    fetchTasks();
  }, [dateQuery]);
  useEffect(() => {
    setPage(1);
  }, [filter, dateQuery]);

  const fetchTasks = async () => {
    try {
      const response = await apiClient.get(`/tasks?filter=${dateQuery}`);
      const data = response.data;
      setTaskBuffer(data.tasks);
      setActiveTaskCount(data.activeCount);
      setCompletedTaskCount(data.completedCount);
      console.log("Fetched tasks:", data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks. Please try again later.");
    }
  };
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };
  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const filteredTasks = taskBuffer.filter((task) => {
    if (filter === "ALL") return true;
    if (filter === "ACTIVE") return task.status === "active";
    if (filter === "COMPLETED") return task.status === "completed";
    return true;
  });

  const visibleTasks = filteredTasks.slice(
    (page - 1) * visibleTasksLimit,
    page * visibleTasksLimit,
  );

  if (visibleTasks.length === 0) {
    handlePrevPage();
  }

  const totalPages = Math.ceil(filteredTasks.length / visibleTasksLimit);

  return (
    <div className="min-h-screen w-full relative">
      {/* Aurora Dream Soft Harmony */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
       radial-gradient(ellipse 80% 60% at 60% 20%, rgba(175, 109, 255, 0.50), transparent 65%),
        radial-gradient(ellipse 70% 60% at 20% 80%, rgba(255, 100, 180, 0.45), transparent 65%),
        radial-gradient(ellipse 60% 50% at 60% 65%, rgba(255, 235, 170, 0.43), transparent 62%),
        radial-gradient(ellipse 65% 40% at 50% 60%, rgba(120, 190, 255, 0.48), transparent 68%),
        linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)
      `,
        }}
      />
      {/* Your content goes here */}

      <div className="container mx-auto pt-8 relative z-10  ">
        <div className="w-full max-w-2xl p-6 mx-auto space-y-6">
          {/* Header component  */}
          <Header />
          {/* Add task */}
          <AddTask handleNewTaskAdded={fetchTasks} />
          {/* Stats and filters */}
          <StatsAndFilters
            activeTasksCount={activeTaskCount}
            completedTasksCount={completedTaskCount}
            filter={filter}
            setFilter={setFilter}
          />
          {/* Task list */}
          <TaskList
            filteredTasks={visibleTasks}
            handleTaskChange={fetchTasks}
            filter={filter}
          />
          {/* Pagination and filter  */}
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <TaskListPagination
              handleNext={handleNextPage}
              handlePrev={handlePrevPage}
              handlePageChange={handlePageChange}
              page={page}
              totalPages={totalPages}
            />
            <DateTimeFilter dateQuery={dateQuery} setDateQuery={setDateQuery} />
          </div>
          {/* Footer could go here  */}
          <Footer
            activeTaskCount={activeTaskCount}
            completedTaskCount={completedTaskCount}
          />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
