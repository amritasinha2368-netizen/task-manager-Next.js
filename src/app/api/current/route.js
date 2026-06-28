import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { User } from "@/models/user";
import { connectDb } from "@/helper/db";

export async function GET(request) {
  try {
    const authToken = request.cookies.get("authToken")?.value;

    if (!authToken) {
      return NextResponse.json(
        {
          message: "user is not logged in !!",
          success: false,
        },
        {
          status: 401,
        }
      );
    }

    const data = jwt.verify(authToken, process.env.JWT_KEY);
    await connectDb();
    const user = await User.findById(data._id).select("-password");

    if (!user) {
      return NextResponse.json(
        {
          message: "user not found !!",
          success: false,
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      {
        message: "invalid login token !!",
        success: false,
      },
      {
        status: 401,
      }
    );
  }
}
