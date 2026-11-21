export const runtime = "nodejs";
import { list } from "@/lib/api";
export const GET = (request: Request) => list(request, "rsvp");
