"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { Vinyl, VinylInput } from "@/types/vinyl";
import { updateVinylAction } from "@/app/actions/vinyl";
import { getClientSessionId } from "@/lib/client-session";
import VinylForm from "@/components/VinylForm";
import { useToast } from "@/components/ToastProvider";

type VinylDetailViewProps = {
  vinyl: Vinyl;
};

function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export default function VinylDetailView({ vinyl: initial }: VinylDetailViewProps) {
  const { showSuccess } = useToast();
  const [vinyl, setVinyl] = useState<Vinyl>(initial);
  const [isEditing, setIsEditing] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[]> | undefined
  >(undefined);
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleEditClick() {
    setIsEditing(true);
    setFieldErrors(undefined);
    setFormError(null);
  }

  function handleCancel() {
    setIsEditing(false);
    setFieldErrors(undefined);
    setFormError(null);
  }

  function handleSubmit(data: VinylInput) {
    startTransition(async () => {
      setFormError(null);
      setFieldErrors(undefined);
      const sessionId = getClientSessionId();
      const result = await updateVinylAction(sessionId, vinyl.id, data);
      if (!result.success) {
        setFormError(result.error);
        setFieldErrors(result.fieldErrors);
        return;
      }
      setVinyl(result.data);
      setIsEditing(false);
      showSuccess(`Saved “${result.data.title}”.`);
    });
  }

  if (isEditing) {
    return (
      <div className="detail-panel">
        <div className="page-header page-header--compact">
          <Link href="/" className="back-link">
            Back to collection
          </Link>
          <p className="eyebrow">Editing</p>
          <h1 className="display-title">{vinyl.title}</h1>
          <p className="muted">{vinyl.artist}</p>
        </div>
        {formError ? (
          <p className="banner banner--error" role="alert">
            {formError}
          </p>
        ) : null}
        <VinylForm
          initial={vinyl}
          errors={fieldErrors}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel="Save"
          isPending={isPending}
        />
      </div>
    );
  }

  return (
    <div className="detail-panel">
      <div className="page-header page-header--compact">
        <div className="page-header__row">
          <Link href="/" className="back-link">
            Back to collection
          </Link>
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleEditClick}
          >
            Edit
          </button>
        </div>
        <p className="eyebrow">Record detail</p>
        <h1 className="display-title">{vinyl.title}</h1>
        <p className="lede">{vinyl.artist}</p>
      </div>

      <dl className="detail-list">
        <div className="detail-list__item">
          <dt>Year</dt>
          <dd>{vinyl.year}</dd>
        </div>
        <div className="detail-list__item">
          <dt>Genre</dt>
          <dd>{vinyl.genre}</dd>
        </div>
        <div className="detail-list__item">
          <dt>Condition</dt>
          <dd>{vinyl.condition}</dd>
        </div>
        <div className="detail-list__item">
          <dt>Colored vinyl</dt>
          <dd>{vinyl.isColoredVinyl ? "Yes" : "No"}</dd>
        </div>
        <div className="detail-list__item">
          <dt>Price paid</dt>
          <dd>{formatPrice(vinyl.pricePaid)}</dd>
        </div>
        <div className="detail-list__item">
          <dt>Catalog number</dt>
          <dd>{vinyl.catalogNumber || "—"}</dd>
        </div>
        <div className="detail-list__item">
          <dt>Acquired</dt>
          <dd>{formatDate(vinyl.acquiredAt)}</dd>
        </div>
        <div className="detail-list__item detail-list__item--full">
          <dt>Notes</dt>
          <dd className="detail-notes">{vinyl.notes || "—"}</dd>
        </div>
      </dl>
    </div>
  );
}
