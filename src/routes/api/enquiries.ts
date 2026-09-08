import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const enquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().nullable(),
  message: z.string().min(1, "Message is required"),
  trip_id: z.string().uuid().optional().nullable(),
});

function getSupabaseClient(request: Request) {
  const supabaseUrl = process.env["SUPABASE_URL"];
  const supabaseKey = process.env["SUPABASE_PUBLISHABLE_KEY"];

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase server environment variables are missing.");
  }

  const authorization = request.headers.get("Authorization");

  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: authorization
        ? {
            Authorization: authorization,
          }
        : {},
    },
  });
}

export const Route = createFileRoute("/api/enquiries")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();

          const result = enquirySchema.safeParse(body);

          if (!result.success) {
            return Response.json(
              {
                success: false,
                message: "Invalid enquiry details.",
                errors: result.error.flatten().fieldErrors,
              },
              { status: 400 },
            );
          }

          const supabase = getSupabaseClient(request);

          /*
           * If a trip was supplied, make sure it exists
           * and is currently published.
           */
          if (result.data.trip_id) {
            const { data: trip, error: tripError } = await supabase
              .from("trips")
              .select("id")
              .eq("id", result.data.trip_id)
              .eq("status", "published")
              .maybeSingle();

            if (tripError) {
              console.error("Enquiry trip lookup error:", tripError);

              return Response.json(
                {
                  success: false,
                  message: "Could not verify the selected trip.",
                },
                { status: 500 },
              );
            }

            if (!trip) {
              return Response.json(
                {
                  success: false,
                  message: "The selected trip was not found.",
                },
                { status: 404 },
              );
            }
          }

          const { data: enquiry, error } = await supabase
            .from("enquiries")
            .insert({
              name: result.data.name,
              email: result.data.email,
              phone: result.data.phone,
              message: result.data.message,
              trip_id: result.data.trip_id,
              status: "new",
            })
            .select()
            .single();

          if (error) {
            console.error("Create enquiry error:", error);

            return Response.json(
              {
                success: false,
                message: "Could not save your enquiry.",
              },
              { status: 500 },
            );
          }

          return Response.json(
            {
              success: true,
              message: "Enquiry submitted successfully.",
              enquiry,
            },
            { status: 201 },
          );
        } catch (error) {
          console.error("Enquiry POST error:", error);

          return Response.json(
            {
              success: false,
              message: "Could not submit your enquiry.",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});