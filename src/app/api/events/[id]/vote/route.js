import { NextResponse } from "next/server";
import { castVote, getUserFromToken } from "../../../_data/store";

export async function POST(req, { params }) {
  try {
    const auth = req.headers.get("authorization") || "";
    const me = getUserFromToken(auth);
    if (!me)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { id } = params;
    const body = await req.json();
    const optionIndex = Number(body?.optionIndex);
    if (!Number.isInteger(optionIndex) || optionIndex < 0) {
      return NextResponse.json(
        { message: "Invalid option index" },
        { status: 400 }
      );
    }
    const event = castVote(id, me.id, optionIndex);
    return NextResponse.json({ ok: true, eventId: event.id });
  } catch (e) {
    return NextResponse.json(
      { message: e.message || "Failed to vote" },
      { status: 400 }
    );
  }
}
