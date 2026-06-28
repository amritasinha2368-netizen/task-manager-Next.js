// api/tasks/{taskId}

import { connectDb } from "@/helper/db";
import { getResponseMessage } from "@/helper/responseMessage";
import { Task } from "@/models/task";
import { NextResponse } from "next/server";

// get single tasks
export async function GET(request, { params }) {
  const { taskId } = params;

  try {
    await connectDb();
    const task = await Task.findById(taskId);

    if (!task) {
      return getResponseMessage("Task not found !!", 404, false);
    }

    return NextResponse.json(task);
  } catch (error) {
    console.log(error);
    return getResponseMessage("Error in getting task !!", 404, false);
  }
}

export async function PUT(request, { params }) {
  try {
    const { taskId } = params;

    const { title, content, status } = await request.json();

    if (!title?.trim() || !content?.trim()) {
      return getResponseMessage("Title and content are required !!", 400, false);
    }

    if (!["pending", "completed"].includes(status)) {
      return getResponseMessage("Please select valid task status !!", 400, false);
    }

    await connectDb();
    let task = await Task.findById(taskId);

    if (!task) {
      return getResponseMessage("Task not found !!", 404, false);
    }

    task.title = title.trim();
    task.content = content.trim();
    task.status = status;

    const updatedTask = await task.save();
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.log(error);
    return getResponseMessage("Error in updating task !! ", 500, false);
  }
}

export async function DELETE(request, { params }) {
  try {
    const { taskId } = params;

    await connectDb();
    const result = await Task.deleteOne({
      _id: taskId,
    });

    if (result.deletedCount === 0) {
      return getResponseMessage("Task not found !!", 404, false);
    }

    return getResponseMessage("Task Deleted !!", 200, true);
  } catch (error) {
    console.log(error);
    return getResponseMessage("Error in deleting Task !", 500, false);
  }
}
