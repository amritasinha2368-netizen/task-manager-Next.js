import { NextResponse } from "next/server";
import { User } from "@/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDb } from "@/helper/db";

export async function POST(request) {
  const { email, password } = await request.json();

  try {
    if (!email?.trim() || !password?.trim()) {
      return NextResponse.json(
        {
          message: "Email and password are required !!",
          success: false,
        },
        {
          status: 400,
        }
      );
    }

    await connectDb();
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (user == null) {
      throw new Error("user not found !!");
    }

    const matched = bcrypt.compareSync(password, user.password);
    if (!matched) {
      throw new Error("Password not matched !!");
    }

    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "1d",
      }
    );

    const safeUser = user.toObject();
    delete safeUser.password;

    const response = NextResponse.json({
      message: "Login success !!",
      success: true,
      user: safeUser,
    });

    response.cookies.set("authToken", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message,
        success: false,
      },
      {
        status: 401,
      }
    );
  }
}
