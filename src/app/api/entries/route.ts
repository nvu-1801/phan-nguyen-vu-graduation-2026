export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { listEntries, submitEntry } from "@/lib/api";
export const POST = (request: Request) => submitEntry(request);
export const GET = (request: Request) => listEntries(request);
