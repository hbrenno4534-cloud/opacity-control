import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SUPERBET_REGISTER_URL =
  "https://api.web.production.betler.superbet.bet.br/api/v1/register?clientSourceType=Desktop_new";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate the caller
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } =
      await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub as string;

    const body = await req.json();

    const {
      documentNumber,
      dateOfBirth,
      firstName,
      lastName,
      gender,
      nationality,
      postalCode,
      address,
      city,
      phone,
      email,
      username,
      password,
      wafToken,
      correlationId,
    } = body;

    // Build Superbet payload
    const superbetPayload = {
      documentNumber,
      dateOfBirth,
      firstName,
      lastName,
      gender,
      nationality: nationality || "BR",
      postalCode,
      address,
      city,
      phone,
      email,
      username,
      password,
      termsAgree: true,
      isPep: false,
      locale: "pt-BR",
      externalDeviceId: crypto.randomUUID(),
    };

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    };

    if (wafToken) {
      headers["x-aws-waf-token"] = wafToken;
    }
    if (correlationId) {
      headers["x-analytics-correlation-id"] = correlationId;
    }

    console.log("Calling Superbet register for user:", userId);

    const superbetRes = await fetch(SUPERBET_REGISTER_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(superbetPayload),
    });

    const superbetData = await superbetRes.text();
    console.log("Superbet response status:", superbetRes.status);
    console.log("Superbet response:", superbetData);

    if (superbetRes.ok) {
      // Mark profile as externally provisioned
      const adminClient = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      await adminClient
        .from("profiles")
        .update({ external_provisioned: true })
        .eq("id", userId);

      return new Response(
        JSON.stringify({ success: true, data: JSON.parse(superbetData) }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Non-OK but don't fail the local signup
    return new Response(
      JSON.stringify({
        success: false,
        status: superbetRes.status,
        message: superbetData,
      }),
      {
        status: 200, // Return 200 so frontend doesn't treat as error
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("superbet-register error:", err);
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
