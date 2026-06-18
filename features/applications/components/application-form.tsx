"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { AxiosError } from "axios";

import { ApplicationSuccess } from "@/features/applications/components/application-success";
import { DocumentUploadField } from "@/features/applications/components/cv-upload-field";
import { useApplicationMutations } from "@/features/applications/hooks/use_applications_mutations";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type FieldKey = "name" | "phone" | "email" | "state" | "address" | "cv" | "coverLetter";
type FieldErrors = Partial<Record<FieldKey, string>>;

function FieldError({ error }: { error?: string }) {
  if (!error) {
    return null;
  }

  return <p className="text-sm font-medium text-destructive">{error}</p>;
}

/** Maps the API error response (zod `details.fieldErrors` or top-level `fieldErrors`) to form field errors. */
function parseApiError(error: unknown): { message: string; fieldErrors: FieldErrors } {
  const fallback = "We could not submit your application. Please try again.";

  if (!(error instanceof AxiosError) || !error.response) {
    return { message: fallback, fieldErrors: {} };
  }

  const data = error.response.data as {
    error?: string;
    fieldErrors?: Partial<Record<FieldKey, string>>;
    details?: { fieldErrors?: Partial<Record<FieldKey, string[]>> };
  } | null;

  const fieldErrors: FieldErrors = {};
  const detailErrors = data?.details?.fieldErrors;
  if (detailErrors) {
    for (const key of Object.keys(detailErrors) as FieldKey[]) {
      const first = detailErrors[key]?.[0];
      if (first) fieldErrors[key] = first;
    }
  }
  if (data?.fieldErrors) {
    Object.assign(fieldErrors, data.fieldErrors);
  }

  return { message: data?.error ?? fallback, fieldErrors };
}

interface ApplicationFormProps {
  jobId: string;
}

export function ApplicationForm({ jobId }: ApplicationFormProps) {
  const { create } = useApplicationMutations();
  const [succeeded, setSucceeded] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    const cv = formData.get("cv");
    if (!(cv instanceof File) || cv.size === 0) {
      setMessage("Please upload your CV.");
      setFieldErrors({ cv: "CV is required" });
      return;
    }

    create.mutate(formData, {
      onSuccess: () => setSucceeded(true),
      onError: (error) => {
        const parsed = parseApiError(error);
        setMessage(parsed.message);
        setFieldErrors(parsed.fieldErrors);
      },
    });
  }

  if (succeeded) {
    return <ApplicationSuccess />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Apply without an account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="hidden" name="jobId" value={jobId} />

          {message && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" aria-hidden="true" />
              <AlertTitle>Application not submitted</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-semibold">
                Name
              </label>
              <Input id="name" name="name" autoComplete="name" />
              <FieldError error={fieldErrors.name} />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-semibold">
                Phone
              </label>
              <Input id="phone" name="phone" autoComplete="tel" />
              <FieldError error={fieldErrors.phone} />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold">
                Email
              </label>
              <Input id="email" name="email" type="email" autoComplete="email" />
              <FieldError error={fieldErrors.email} />
            </div>
            <div className="space-y-2">
              <label htmlFor="state" className="text-sm font-semibold">
                State
              </label>
              <Input id="state" name="state" autoComplete="address-level1" />
              <FieldError error={fieldErrors.state} />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-semibold">
              Address
            </label>
            <Textarea id="address" name="address" autoComplete="street-address" />
            <FieldError error={fieldErrors.address} />
          </div>

          <DocumentUploadField name="cv" label="CV" buttonLabel="Upload CV" error={fieldErrors.cv} />

          <DocumentUploadField
            name="coverLetter"
            label="Cover letter (optional)"
            buttonLabel="Upload cover letter"
            helper="Optional. PDF, DOC, or DOCX."
            error={fieldErrors.coverLetter}
          />

          <Button size="lg" type="submit" className="w-full" disabled={create.isPending}>
            {create.isPending ? "Submitting..." : "Submit application"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
