// No require needed for native fetch in Node 18+

async function main() {
    const deploymentId = '21058804266'; // ID from previous fetch
    console.log(`Updating stage for deployment: ${deploymentId}`);

    try {
        const res = await fetch(`http://localhost:3000/api/deployments/${deploymentId}/stages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Lint', status: 'running' })
        });

        const data = await res.json();
        console.log('Response:', data);
    } catch (err) {
        console.error('Error:', err);
    }
}

main();
