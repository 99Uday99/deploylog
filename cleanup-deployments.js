import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Cleaning up stuck deployments...');

    // Find all deployments that are not success/failed
    const result = await prisma.deployment.updateMany({
        where: {
            status: {
                notIn: ['success', 'failed']
            }
        },
        data: {
            status: 'failed',
            logs: 'Manually marked as failed (Timed out or Stuck).'
        }
    });

    console.log(`Updated ${result.count} stuck deployments to 'failed'.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
