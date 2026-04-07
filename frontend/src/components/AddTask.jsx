import React from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import apiClient from "@/lib/axios";
const AddTask = ({ handleNewTaskAdded }) => {
  const [newTaskTitle, setNewTaskTitle] = React.useState("");
  const handleAddTask = async () => {
    // Logic to add task will go here
    if (newTaskTitle.trim()) {
      try {
        await apiClient.post("/tasks", {
          title: newTaskTitle,
        });
        toast.success(`Thêm nhiệm vụ "${newTaskTitle}" thành công!`);
        handleNewTaskAdded(); // Call the callback to refresh the task list
      } catch (error) {
        console.error("Lỗi khi thêm nhiệm vụ:", error);
        toast.error("Lỗi khi thêm nhiệm vụ. Vui lòng thử lại.");
      }
      setNewTaskTitle("");
    } else {
      toast.error("Bạn cần nhập nội dung của nhiệm vụ.");
    }

    console.log("Adding task:", newTaskTitle);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  return (
    <Card className="p-6 border-0 bg-gradient-card shadow-custom-lg">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="text"
          placeholder="Cần phải làm gì?"
          className="h-12 text-base bg-slate-50 sm:flex-1 border-border/50 focus:border-primary/50 focus:ring-primary/20"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button
          variant="gradient"
          size="xl"
          className="px-6"
          onClick={handleAddTask}
          disabled={!newTaskTitle.trim()}
        >
          <Plus className="size-5" />
          Thêm
        </Button>
      </div>
    </Card>
  );
};

export default AddTask;
