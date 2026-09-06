import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    let page = 1;
    const perPage = 1000;
    let emailExists = false;

    while (true) {
      const {
        data: { users },
        error,
      } = await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage,
      });

      if (error) {
        console.error("Error checking users:", error.message);

        return NextResponse.json(
          { error: "Unable to check email" },
          { status: 500 }
        );
      }

      emailExists = users.some(
        (user) => user.email?.toLowerCase() === normalizedEmail
      );

      if (emailExists || users.length < perPage) {
        break;
      }

      page++;
    }

    return NextResponse.json({
      exists: emailExists,
    });
  } catch (error) {
    console.error("Check email error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}