async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const baseUrl = 'http://localhost:3000/api/deployments';

  console.log('--- Starting Pipeline Simulation ---');

  // 1. Queue Deployment
  console.log('1. Creating Deployment (Queued)...');
  const createRes = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      projectName: 'DeployLog-Simulation',
      branch: 'feature/observability',
      commitHash: 'a1b2c3d',
      commitMessage: 'Testing status updates',
      status: 'queued',
    }),
  });
  const deployment = await createRes.json();
  console.log(`   > Created ID: ${deployment.id} [${deployment.status}]`);
  await sleep(2000);

  // 2. Linting
  console.log('2. Starting Linting...');
  await fetch(`${baseUrl}/${deployment.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'linting' }),
  });
  console.log('   > Update sent: linting');
  await sleep(2500);

  // 3. Testing
  console.log('3. Starting Tests...');
  await fetch(`${baseUrl}/${deployment.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'testing' }),
  });
  console.log('   > Update sent: testing');
  await sleep(3000);

  // 4. Building
  console.log('4. Starting Docker Build...');
  await fetch(`${baseUrl}/${deployment.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'building' }),
  });
  console.log('   > Update sent: building');
  await sleep(3000);

  // 5. Success
  console.log('5. Pipeline Completed!');
  await fetch(`${baseUrl}/${deployment.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: 'success',
      logs: 'Simulation completed successfully.\n- Lint: OK\n- Test: OK\n- Build: OK',
    }),
  });
  console.log('   > Update sent: success');
}

main().catch(console.error);
