import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#050508] px-6 text-center text-white">
      <h1 className="mb-2 text-3xl font-bold">Project not found</h1>
      <p className="mb-8 text-white/50">This case study does not exist or is not published.</p>
      <Link
        href="/#projects"
        className="rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-6 py-3 text-sm font-medium"
      >
        Back to Projects
      </Link>
    </div>
  );
}
