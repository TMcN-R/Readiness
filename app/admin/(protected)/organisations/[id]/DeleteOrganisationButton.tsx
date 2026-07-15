"use client";

export default function DeleteOrganisationButton({
  organisationId,
  organisationName,
  action,
}: {
  organisationId: string;
  organisationName: string;
  action: (formData: FormData) => void;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        const confirmed = window.confirm(
          `Delete "${organisationName}"? This permanently removes their assessment responses, countries, and activity data. This cannot be undone.`
        );
        if (!confirmed) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={organisationId} />
      <button
        type="submit"
        className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        Delete organisation
      </button>
    </form>
  );
}
