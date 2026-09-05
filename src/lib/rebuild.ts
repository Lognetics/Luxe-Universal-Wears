import "server-only";

/**
 * Ask Vercel to build the site again.
 *
 * The build pulls the catalogue from NETICS (scripts/pull-catalogue.mjs), so
 * "publish" is simply "rebuild". A Vercel Deploy Hook is a URL that starts
 * one; it is created once under the project's Git settings and kept in
 * VERCEL_DEPLOY_HOOK_URL. No GitHub token, no commits: the repository only
 * changes when code changes.
 */

export type RebuildResult = { queued: true; job: string };

export async function triggerRebuild(reason: string): Promise<RebuildResult> {
  const hook = process.env.VERCEL_DEPLOY_HOOK_URL?.trim();
  if (!hook) throw new Error("VERCEL_DEPLOY_HOOK_URL is not configured on the server.");
  const res = await fetch(hook, { method: "POST", cache: "no-store" });
  if (!res.ok) throw new Error(`Vercel refused the rebuild: ${res.status}`);
  let job = "";
  try {
    const body = (await res.json()) as { job?: { id?: string } };
    job = body.job?.id ?? "";
  } catch {
    // The hook answered without a body; the build is still queued.
  }
  console.info("[rebuild] queued", reason, job);
  return { queued: true, job };
}
