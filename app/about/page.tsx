import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 pb-4 border-b border-gray-200">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4 inline-flex items-center gap-1 transition-all duration-200 hover:-translate-x-1"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            About DeployLog
          </h1>
        </header>

        <article className="prose prose-gray max-w-none">
          <section className="mb-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.01]">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Project Overview
            </h2>
            <p className="text-gray-600 leading-relaxed">
              <strong>DeployLog</strong> is a real-time CI/CD observability
              dashboard designed to provide instant visibility into your
              deployment pipelines. Instead of digging through GitHub Action
              logs, DeployLog offers a clean, visual interface that updates as
              your pipeline progresses from
              <em>Queued</em> to <em>Linting</em>, <em>Testing</em>,{' '}
              <em>Building</em>, and finally <em>Success</em>.
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-6">
            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.01]">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Architecture
              </h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">🔄</span>
                  <span>
                    <strong>Active Feedback Loop:</strong> The CI pipeline
                    actively reports its status to the DeployLog server.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">⚡</span>
                  <span>
                    <strong>Real-time Updates:</strong> The dashboard polls for
                    changes every 5 seconds to keep you in sync.
                  </span>
                </li>
              </ul>
            </section>

            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.01]">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Tech Stack
              </h2>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <span className="font-medium text-gray-800">Frontend:</span>{' '}
                  Next.js 15, Tailwind CSS
                </li>
                <li>
                  <span className="font-medium text-gray-800">Backend:</span>{' '}
                  Next.js API Routes, Prisma, SQLite
                </li>
                <li>
                  <span className="font-medium text-gray-800">DevOps:</span>{' '}
                  GitHub Actions, Docker
                </li>
                <li>
                  <span className="font-medium text-gray-800">Testing:</span>{' '}
                  Selenium WebDriver
                </li>
              </ul>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}
