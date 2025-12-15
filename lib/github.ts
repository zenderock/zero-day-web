import { Octokit } from "octokit"
import { auth } from "@/lib/auth"

export async function getGithubClient() {
  const session = await auth()
  // @ts-expect-error accessToken is typed in custom callback
  const token = session?.accessToken

  if (!token) return null

  return new Octokit({
    auth: token,
  })
}
