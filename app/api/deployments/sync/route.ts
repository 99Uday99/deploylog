import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const repoOwner = 'Jay061205';
        const repoName = 'deploylog';

        // 1. Fetch latest runs from GitHub
        const headers: HeadersInit = {
            'Accept': 'application/vnd.github.v3+json',
        };

        if (process.env.GITHUB_TOKEN) {
            headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
        }

        // 1. Fetch latest runs from GitHub
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/actions/runs?per_page=10`, {
            headers,
            next: { revalidate: 0 } // No cache
        });

        if (!response.ok) {
            console.error('GitHub API error:', response.statusText);
            return NextResponse.json({ error: 'Failed to fetch from GitHub' }, { status: response.status });
        }

        const data = await response.json();
        const runs = data.workflow_runs || [];

        // 2. Process runs and update DB
        for (const run of runs) {
            let status = 'queued';

            if (run.status === 'completed') {
                status = run.conclusion === 'success' ? 'success' : 'failed';
            } else if (run.status === 'in_progress') {
                status = 'running';

                // Detailed step check (Simulated for efficiency, ideally requires fetching job details)
                // For 'running' status, we will just leave it as running unless we fetch jobs
                // To keep it fast, we'll implement job fetching only for "in_progress" runs
                try {
                    const jobsRes = await fetch(run.jobs_url, { headers });
                    if (jobsRes.ok) {
                        const jobsData = await jobsRes.json();
                        const job = jobsData.jobs[0]; // Assuming one main job
                        if (job) {
                            const currentStep = job.steps.find((s: { status: string; name: string }) => s.status === 'in_progress');
                            if (currentStep) {
                                const name = currentStep.name.toLowerCase();
                                if (name.includes('lint')) status = 'linting';
                                else if (name.includes('test')) status = 'testing';
                                else if (name.includes('build') || name.includes('docker')) status = 'building';
                            }
                        }
                    }
                } catch (e) {
                    console.error('Failed to fetch jobs', e);
                }
            }

            // Upsert into DB
            await prisma.deployment.upsert({
                where: { id: run.id.toString() }, // Use GitHub Run ID as our ID
                update: {
                    status: status,
                    updatedAt: new Date(run.updated_at),
                    endedAt: run.conclusion ? new Date(run.updated_at) : null,
                },
                create: {
                    id: run.id.toString(),
                    projectName: 'DeployLog (GitHub)',
                    status: status,
                    branch: run.head_branch,
                    commitHash: run.head_sha,
                    commitMessage: run.head_commit?.message || 'GitHub Run',
                    createdAt: new Date(run.created_at),
                }
            });
        }

        return NextResponse.json({ success: true, count: runs.length });
    } catch (error) {
        console.error('Sync error:', error);
        return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
    }
}
