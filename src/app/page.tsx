import VinylList from "@/components/VinylList";

export default function HomePage() {
  return (
    <div className="page-shell">
      <header className="page-header">
        <p className="brand">Vinyl Archive</p>
        <h1 className="display-title">Collection</h1>
        <p className="lede">
          A session-scoped record shelf — browse, add, edit, and remove vinyls
          in this browser tab.
        </p>
      </header>
      <VinylList />
    </div>
  );
}
