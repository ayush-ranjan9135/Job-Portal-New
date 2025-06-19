import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import JobApplication from "@/models/JobApplication";

export async function POST(req) {
  try {
    await connectDB();

    const { userId } = auth(); // Clerk's user ID
    const { jobId, companyId } = await req.json();

    if (!userId || !jobId || !companyId) {
      return new Response(JSON.stringify({ message: "Missing fields" }), { status: 400 });
    }

    const newApplication = await JobApplication.create({
      userId, // store as string
      jobId,
      companyId,
      date: Date.now(),
    });

    return new Response(JSON.stringify(newApplication), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error creating job application", error: error.message }), { status: 500 });
  }
}
