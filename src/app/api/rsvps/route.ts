export const runtime = "nodejs";
import { submit } from "@/lib/api";
export const POST = (request: Request) => submit(request, "rsvp");
