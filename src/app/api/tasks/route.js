// /tasks

import { getResponseMessage } from "@/helper/responseMessage";
import { Task } from "@/models/task";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDb } from "@/helper/db";

//get all the tasks
export async function GET(request) {
  try {
    await connectDb();
    const tasks = await Task.find();
    return NextResponse.json(tasks);
  } catch (error) {
    console.log(error);
    return getResponseMessage("Error in getting data !!", 500, false);
  }
}

// create all the tasks
export async function POST(request) {
  try {
    const { title, content, status } = await request.json();

    if (!title?.trim() || !content?.trim()) {
      return getResponseMessage("Title and content are required !!", 400, false);
    }

    if (!["pending", "completed"].includes(status)) {
      return getResponseMessage("Please select valid task status !!", 400, false);
    }

    const authToken = request.cookies.get("authToken")?.value;
    const data = jwt.verify(authToken, process.env.JWT_KEY);

    const task = new Task({
      title: title.trim(),
      content: content.trim(),
      userId: data._id,
      status,
    });

    await connectDb();
    const createdTask = await task.save();
    return NextResponse.json(createdTask, {
      status: 201,
    });
  } catch (error) {
    console.log(error);
    return getResponseMessage("Failed to create Task !! ", 500, false);
  }
}

//
