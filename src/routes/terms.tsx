import { createFileRoute } from "@tanstack/react-router";
import { TermsPage } from "@/components/terms/TermsPage";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});
