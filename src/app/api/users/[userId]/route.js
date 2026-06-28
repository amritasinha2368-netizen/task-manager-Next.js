import { User } from "@/models/user";
import { connectDb } from "@/helper/db";
import { NextResponse } from "next/server";

// export const GET=()=>{

// }

// get user
export async function GET(request, { params }) {
  try {
    const { userId } = params;
    await connectDb();
    const user = await User.findById(userId).select("-password");

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
        message: "failed to get user !!",
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}

// delete user
export async function DELETE(request, { params }) {
  const { userId } = params;

  try {
    await connectDb();
    await User.deleteOne({
      _id: userId,
    });

    return NextResponse.json({
      message: "user deleted !!",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Error in deleting user !!",
      success: false,
    });
  }
}

//update user:

export async function PUT(request, { params }) {
  const { userId } = params;

  const { name, password, about, profileURL } = await request.json();

  try {
    await connectDb();
    const user = await User.findById(userId);

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

    user.name = name;
    user.about = about;
    if (password) {
      user.password = password;
    }
    user.profileURL = profileURL;
    // add more informationss

    const updatedUser = await user.save();
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({
      message: "failed to update user !!",
      success: false,
    });
  }
}
