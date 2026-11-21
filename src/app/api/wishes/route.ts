export const runtime = "nodejs";
import { list, submit } from "@/lib/api";
export const POST = (request: Request) => submit(request, "wish");
export const GET = (request: Request) => list(request, "wish");
