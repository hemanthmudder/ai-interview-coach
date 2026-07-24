export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="flex justify-between items-center px-8 py-6">
        <h1 className="text-2xl font-bold text-blue-400">
          AI Interview Coach
        </h1>

        <button className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg">
          Login
        </button>
      </nav>

      <section className="flex flex-col items-center justify-center text-center mt-32 px-6">
        <h2 className="text-5xl font-bold">
          Crack Your Next Interview
        </h2>

        <p className="text-gray-400 mt-6 max-w-2xl">
          Practice interviews powered by AI, improve your resume,
          receive instant feedback, and land your dream job.
        </p>

        <button className="mt-10 bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl text-lg font-semibold">
          Start Practicing
        </button>
      </section>
    </main>
  );
}