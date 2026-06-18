import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ApplicationSuccess() {
  return (
    <Card>
      <CardContent className="space-y-5 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <CheckCircle2 className="size-6" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Application received</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Thanks for applying. Please check your email for updates as the hiring team reviews your
            application.
          </p>
        </div>
        <Button nativeButton={false} variant="outline" render={<Link href="/jobs" />}>
          Back to jobs
        </Button>
      </CardContent>
    </Card>
  );
}
