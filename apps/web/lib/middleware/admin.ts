import { parse } from "@/lib/middleware/utils";
import { ARTST_PROJECT_ID } from "@artst/utils";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { conn } from "../planetscale";
import { UserProps } from "../types";

export default async function AdminMiddleware(req: NextRequest) {
  const { path } = parse(req);
  let isAdmin = false;

  const session = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as {
    id?: string;
    email?: string;
    user?: UserProps;
  };

  isAdmin = await conn
    .execute("SELECT projectId FROM ProjectUsers WHERE userId = ?", [
      session?.user?.id,
    ])
    .then((res) =>
      res.rows.some(
        (row: { projectId: string }) => row.projectId === ARTST_PROJECT_ID,
      ),
    )
    .catch(() => false);

  if (path === "/login" && isAdmin) {
    return NextResponse.redirect(new URL("/", req.url));
  } else if (path !== "/login" && !isAdmin) {
    return NextResponse.redirect(new URL(`/login`, req.url));
  }

  return NextResponse.rewrite(
    new URL(`/admin.artst.io${path === "/" ? "" : path}`, req.url),
  );
}
