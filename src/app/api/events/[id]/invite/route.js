import { NextResponse } from "next/server";
import { inviteUserToEvent, getUserFromToken } from "../../../_data/store";

export async function POST(req, { params }) {
  try {
    const auth = req.headers.get("authorization") || "";
    const me = getUserFromToken(auth);
    if (!me)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { id } = params;
    const body = await req.json();
    const toUserId = body?.userId;
    if (!toUserId)
      return NextResponse.json(
        { message: "userId is required" },
        { status: 400 }
      );
    const event = inviteUserToEvent(id, toUserId, me.id);
    return NextResponse.json({
      eventId: event.id,
      participants: event.participants,
    });
  } catch (e) {
    return NextResponse.json(
      { message: e.message || "Failed to invite user" },
      { status: 400 }
    );
  }
}
