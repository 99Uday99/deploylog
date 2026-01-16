// Native fetch in Node 18+

async function main() {
  const baseUrl = 'http://127.0.0.1:3000/api/deployments';

  // 1. Create Deployment
  console.log('Creating deployment...');
  const createRes = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ branch: 'feature/test-patch', status: 'running' }),
  });
  const deployment = await createRes.json();
  console.log('Created:', deployment.id, deployment.status);

  // 2. Update Deployment
  console.log('Updating deployment to success...');
  const updateRes = await fetch(`${baseUrl}/${deployment.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'success' }),
  });
  const updated = await updateRes.json();
  console.log('Updated:', updated.id, updated.status, updated.endedAt);
}

// In Node 18+ fetch is global, but if not we might fail.
// Given the environment, let's try standard global fetch (Node 18+).
main().catch(console.error);
