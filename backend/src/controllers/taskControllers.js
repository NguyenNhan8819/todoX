import Task from "../models/Task.js";

export const getTasks = async (req, res) => {
  const { filter } = req.query;
  const now = new Date();
  let startDate, endDate;
  switch (filter) {
    case "today": {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      break;
    }
    case "week": {
      const mondayDate =
        now.getDate() - (now.getDay() - 1) - (now.getDay() === 0 ? 7 : 0);
      startDate = new Date(now.getFullYear(), now.getMonth(), mondayDate);
      endDate = new Date(now.getFullYear(), now.getMonth(), mondayDate + 7);
      break;
    }
    case "month": {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      break;
    }
    case "all":
    default: {
      startDate = null;
      endDate = new Date();
    }
  }

  const query = startDate ? { createdAt: { $gte: startDate } } : {};

  try {
    // const tasks = await Task.find().sort({ createdAt: -1 });
    const result = await Task.aggregate([
      { $match: query },
      {
        $facet: {
          tasks: [{ $sort: { createdAt: -1 } }],
          activeCount: [{ $match: { status: "active" } }, { $count: "count" }],
          completedCount: [
            { $match: { status: "completed" } },
            { $count: "count" },
          ],
        },
      },
    ]);
    const tasks = result[0].tasks;
    const activeCount = result[0].activeCount[0]?.count || 0;
    const completedCount = result[0].completedCount[0]?.count || 0;

    // res.status(200).json(tasks);
    res.status(200).json({ tasks, activeCount, completedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const createTask = async (req, res) => {
  // Logic to add a new todo item
  try {
    const { title, status, completeAt } = req.body;
    const newTask = new Task({ title, status, completeAt });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, status, completeAt } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, status, completeAt },
      { new: true },
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
