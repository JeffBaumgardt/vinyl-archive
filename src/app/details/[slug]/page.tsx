"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { Vinyl } from "@/types/vinyl";
import { getVinylAction } from "@/app/actions/vinyl";
import { getClientSessionId } from "@/lib/client-session";
import VinylDetailView from "@/components/VinylDetailView";

export default function VinylDetailsPage() {
  const params = useParams<{ slug: string }>();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const [vinyl, setVinyl] = useState<Vinyl | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadVinyl() {
      if (!slug) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setLoadError(null);
      setNotFound(false);

      const sessionId = getClientSessionId();
      const result = await getVinylAction(sessionId, slug);

      if (cancelled) {
        return;
      }

      if (!result.success) {
        const isMissing = /not found/i.test(result.error);
        setNotFound(isMissing);
        setLoadError(isMissing ? null : result.error);
        setVinyl(null);
        setIsLoading(false);
        return;
      }

      setVinyl(result.data);
      setIsLoading(false);
    }

    void loadVinyl();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="page-shell" aria-busy="true" aria-live="polite">
        <p className="muted">Loading record…</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="page-shell">
        <Link href="/" className="back-link">
          Back to collection
        </Link>
        <p className="banner banner--error" role="alert">
          {loadError}
        </p>
      </div>
    );
  }

  if (notFound || !vinyl) {
    return (
      <div className="page-shell">
        <header className="page-header">
          <Link href="/" className="back-link">
            Back to collection
          </Link>
          <p className="eyebrow">Not found</p>
          <h1 className="display-title">Record missing</h1>
          <p className="lede">
            No vinyl with that id exists in this tab&apos;s session archive.
          </p>
        </header>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <VinylDetailView vinyl={vinyl} />
    </div>
  );
}
