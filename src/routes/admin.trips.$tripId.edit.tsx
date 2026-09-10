import { createFileRoute } from "@tanstack/react-router";
import AdminTripEditor from "../components/admin/trips/AdminTripEditor";

export const Route = createFileRoute("/admin/trips/$tripId/edit")({
  component: AdminTripEditorRoute,
});

function AdminTripEditorRoute() {
  const { tripId } = Route.useParams();

  return <AdminTripEditor tripId={tripId} />;
}