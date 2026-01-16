async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
    const baseUrl = 'http://localhost:3000/api/deployments';

    console.log('--- Starting FAILURE Simulation ---');

    // 1. Queue Deployment
    console.log('1. Creating Deployment (Queued)...');
    const createRes = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            projectName: 'DeployLog-Failure-Test',
            branch: 'bugfix/login-crash',
            commitHash: 'deadbeef',
            commitMessage: 'Fixing critical bug (will fail tests)',
            status: 'queued',
        }),
    });
    const deployment = await createRes.json();
    console.log(`   > Created ID: ${deployment.id} [${deployment.status}]`);

    console.log(`   > VIEW IT HERE: http://localhost:3000/visualmode/${deployment.id}`);
    await sleep(3000);

    // 2. Linting (Passes)
    console.log('2. Starting Linting...');
    await fetch(`${baseUrl}/${deployment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'linting' }),
    });
    await sleep(3000);

    // 3. Testing (FAILS)
    console.log('3. Starting Tests (FAILING)...');
    await fetch(`${baseUrl}/${deployment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'testing' }),
    });
    await sleep(4000);

    // 4. Report Failure
    console.log('4. Reporting Failure...');
    await fetch(`${baseUrl}/${deployment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            status: 'failed',
            logs: `
[Linting] ... Done
[Linting] Success.

[Testing] Running unit tests...
[Testing] Test suite 1: PASS
[Testing] Test suite 2: PASS
[Testing] Test suite 3: FAILED
Error: expected 200 to equal 500
    at /app/tests/auth.test.ts:42:15

Tests: Failed. Pipeline aborted.
      `,
        }),
    });
    console.log('   > Update sent: failed');
}

main().catch(console.error);
