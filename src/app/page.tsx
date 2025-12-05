export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background text-foreground animate-in fade-in duration-500">
      <main className="max-w-3xl text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent pb-2">
            Run Better Retrospectives
          </h1>
          <p className="text-xl text-muted max-w-xl mx-auto">
            The simplest way to collaborate with your team. Stop, Start, and Keep doing what matters.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <a
            href="/register"
            className="btn btn-primary text-lg px-8 py-3 h-auto"
          >
            Get Started
          </a>
          <a
            href="/login"
            className="btn btn-secondary text-lg px-8 py-3 h-auto bg-card hover:bg-muted"
          >
            Log In
          </a>
        </div>

        <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="card border-border/50 bg-card/50">
            <h3 className="font-bold text-lg mb-2">Real-time Boards</h3>
            <p className="text-sm text-muted">Collaborate instantly with your team. Updates appear as they happen.</p>
          </div>
          <div className="card border-border/50 bg-card/50">
            <h3 className="font-bold text-lg mb-2">Team Management</h3>
            <p className="text-sm text-muted">Organize projects by team and control access with roles.</p>
          </div>
          <div className="card border-border/50 bg-card/50">
            <h3 className="font-bold text-lg mb-2">Simple Invites</h3>
            <p className="text-sm text-muted">Invite colleagues via email links and get started in seconds.</p>
          </div>
        </div>
      </main>

      <footer className="mt-24 text-sm text-muted">
        Built with Next.js, Prisma, and ❤️
      </footer>
    </div>
  );
}
