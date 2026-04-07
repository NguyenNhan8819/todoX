import React from "react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import {
  Calendar,
  CheckCircle2,
  Circle,
  SquarePen,
  Trash2,
} from "lucide-react";
import { Button } from "./ui/button";
import apiClient from "@/lib/axios";
import { toast } from "sonner";
import { Input } from "./ui/input";
const TaskCard = ({ task, index, handleTaskChange }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [updateTaskTitle, setUpdateTaskTitle] = React.useState(
    task.title || "",
  );

  //function delete task
  const deleteTask = async (taskId) => {
    // logic xóa task sẽ được triển khai ở đây
    try {
      await apiClient.delete(`/tasks/${taskId}`);
      toast.success("Nhiệm vụ đã được xóa thành công!");
      handleTaskChange(); // Call the callback to refresh the task list
    } catch (error) {
      console.error("Lỗi khi xóa nhiệm vụ:", error);
      toast.error("Lỗi khi xóa nhiệm vụ. Vui lòng thử lại.");
    }

    console.log("Deleting task:", taskId);
  };

  // function update task
  const updateTask = async () => {
    try {
      setIsEditing(false);
      await apiClient.put(`/tasks/${task._id}`, { title: updateTaskTitle });
      toast.success(`Nhiệm vụ đã được đổi thành "${updateTaskTitle}"!`);
      handleTaskChange(); // Call the callback to refresh the task list
    } catch (error) {
      console.error("Lỗi khi cập nhật nhiệm vụ:", error);
      toast.error("Lỗi khi cập nhật nhiệm vụ. Vui lòng thử lại.");
    }
  };
  // function toggle task status
  const toggleTaskStatus = async () => {
    try {
      if (task.status === "active") {
        await apiClient.put(`/tasks/${task._id}`, {
          status: "completed",
          completeAt: new Date().toISOString(),
        });
        toast.success(`Nhiệm vụ "${task.title}" đã được hoàn thành!`);
      } else {
        await apiClient.put(`/tasks/${task._id}`, {
          status: "active",
          completeAt: null,
        });
        toast.success(`Nhiệm vụ "${task.title}" đã được mở lại!`);
      }

      handleTaskChange(); // Call the callback to refresh the task list
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái nhiệm vụ:", error);
      toast.error("Lỗi khi cập nhật trạng thái nhiệm vụ. Vui lòng thử lại.");
    }
  };

  return (
    <Card
      className={cn(
        "p-4 bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-200 animate-fade-in group",
        task.status === "completed" && "opacity-75",
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center gap-4 ">
        {/* nút tròn */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "flex shrink-0 size-8 rounder-full transition-all duration-200",
            task.status === "completed"
              ? "text-success/80 hover:text-success"
              : "text-muted-foreground hover:text-primary",
          )}
          onClick={() => toggleTaskStatus()}
        >
          {/* icon check */}
          {task.status === "completed" ? (
            <CheckCircle2 className="size-5" />
          ) : (
            <Circle className="size-5" />
          )}
        </Button>
        {/* hiển thị hoặc chỉnh sửa tiêu đề */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <Input
              type="text"
              placeholder="Cần phải làm gì?"
              className="flex-1 text-base border-border/50 focus:border-primary/50 focus:ring-primary/50"
              value={updateTaskTitle}
              onChange={(e) => setUpdateTaskTitle(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  updateTask();
                }
              }}
              onBlur={() => {
                setIsEditing(false); // Kết thúc chế độ chỉnh sửa khi mất focus
                setUpdateTaskTitle(task.title || ""); // Reset lại tiêu đề nếu người dùng không muốn thay đổi
              }}
            />
          ) : (
            <p
              className={cn(
                "text-base transition-all duration-200",
                task.status === "completed"
                  ? "line-through text-muted-foreground"
                  : "text-foreground",
              )}
            >
              {task.title}
            </p>
          )}
          {/* ngày tạo và ngày hoàn thành  */}
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="size-3 text-muted-foreground" />

            <span className="text-xs text-muted-foreground">
              {new Date(task.createdAt).toLocaleDateString()}
            </span>
            {task.completeAt && (
              <>
                <span className="text-xl text-muted-foreground">-</span>
                <Calendar className="size-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {new Date(task.completeAt).toLocaleDateString()}
                </span>
              </>
            )}
          </div>
        </div>
        {/* nút chỉnh sửa và xóa*/}
        <div className="hidden gap-2 group-hover:inline-flex animate-slide-up">
          {/* nút chỉnh sửa */}
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 transition-color size-8 text-muted-foreground hover:text-info"
            onClick={() => {
              setIsEditing(true);
              setUpdateTaskTitle(task.title || "");
            }}
          >
            <SquarePen className="size-4" />
          </Button>
          {/* nút xóa */}
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 transition-color size-8 text-muted-foreground hover:text-destructive"
            onClick={() => deleteTask(task._id)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
