import { Octokit } from '@octokit/core'

const DEFAULT_OWNER = process.env.GITHUB_OWNER || ''
const DEFAULT_REPO = process.env.GITHUB_REPO || ''
const DEFAULT_BRANCH = process.env.GITHUB_BRANCH || 'main'

const GITHUB_PAT = process.env.GITHUB_PAT || ''

export interface CommitFileInput {
  path: string
  content: string
  encoding?: 'utf-8' | 'base64'
}

export interface CommitResult {
  ok: boolean
  commitUrl?: string
  error?: string
}

let octokitInstance: Octokit | null = null
function getOctokit(): Octokit {
  if (!octokitInstance) {
    if (!GITHUB_PAT) throw new Error('GITHUB_PAT não configurada.')
    octokitInstance = new Octokit({ auth: GITHUB_PAT })
  }
  return octokitInstance
}

function getOwnerRepo() {
  if (!DEFAULT_OWNER || !DEFAULT_REPO) {
    const GITHUB_REPO_COMBO = process.env.GITHUB_REPO || ''
    const parts = GITHUB_REPO_COMBO.split('/')
    if (parts.length !== 2) throw new Error('GITHUB_REPO deve ser owner/repo ou definir GITHUB_OWNER + GITHUB_REPO separados.')
    return { owner: parts[0], repo: parts[1] }
  }
  return { owner: DEFAULT_OWNER, repo: DEFAULT_REPO }
}

export async function commitFiles(message: string, files: CommitFileInput[]): Promise<CommitResult> {
  try {
    const octokit = getOctokit()
    const { owner, repo } = getOwnerRepo()
    const branch = DEFAULT_BRANCH

    const { data: refData } = await octokit.request('GET /repos/{owner}/{repo}/git/ref/{ref}', {
      owner,
      repo,
      ref: `heads/${branch}`,
    })
    const latestCommitSha = refData.object.sha

    const { data: commitData } = await octokit.request('GET /repos/{owner}/{repo}/git/commits/{commit_sha}', {
      owner,
      repo,
      commit_sha: latestCommitSha,
    })
    const baseTreeSha = commitData.tree.sha

    const blobs: { sha: string; path: string }[] = []
    for (const f of files) {
      const { data: blobData } = await octokit.request('POST /repos/{owner}/{repo}/git/blobs', {
        owner,
        repo,
        content: f.content,
        encoding: f.encoding ?? 'utf-8',
      })
      blobs.push({ sha: blobData.sha, path: f.path })
    }

    const tree = blobs.map((b) => ({
      path: b.path,
      mode: '100644' as const,
      type: 'blob' as const,
      sha: b.sha,
    }))

    const { data: newTree } = await octokit.request('POST /repos/{owner}/{repo}/git/trees', {
      owner,
      repo,
      base_tree: baseTreeSha,
      tree,
    })

    const { data: newCommit } = await octokit.request('POST /repos/{owner}/{repo}/git/commits', {
      owner,
      repo,
      message,
      tree: newTree.sha,
      parents: [latestCommitSha],
    })

    await octokit.request('PATCH /repos/{owner}/{repo}/git/refs/{ref}', {
      owner,
      repo,
      ref: `heads/${branch}`,
      sha: newCommit.sha,
    })

    return { ok: true, commitUrl: newCommit.html_url }
  } catch (err: any) {
    const msg = err?.message || JSON.stringify(err)
    console.error('[github] commit failed:', msg)
    return { ok: false, error: msg }
  }
}
