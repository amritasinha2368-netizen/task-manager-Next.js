import { connectDb } from "@/helper/db";
import { User } from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// get request function
export async function GET(request) {
  let users = [];
  try {
    await connectDb();
    users = await User.find().select("-password");
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "failed to get users",
      success: false,
    });
  }

  return NextResponse.json(users);
}

// post request function
// data post
//create user
export async function POST(request) {
  const { name, email, password, about, profileURL } = await request.json();

  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    return NextResponse.json(
      {
        message: "Name, email and password are required !!",
        success: false,
      },
      {
        status: 400,
      }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      {
        message: "Password must be at least 6 characters !!",
        success: false,
      },
      {
        status: 400,
      }
    );
  }

  const user = new User({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    about,
    profileURL,
  });

  try {
    await connectDb();

    const existingUser = await User.findOne({
      email: user.email,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "Email is already registered !!",
          success: false,
        },
        {
          status: 409,
        }
      );
    }

    user.password = bcrypt.hashSync(
      user.password,
      parseInt(process.env.BCRYPT_SALT || "10")
    );

    const createdUser = await user.save();

    const safeUser = createdUser.toObject();
    delete safeUser.password;

    const response = NextResponse.json(safeUser, {
      status: 201,
    });
    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "failed to create user !!",
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}

// delete request  function
// uri variable
