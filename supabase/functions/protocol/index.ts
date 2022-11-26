// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { serve } from "https://deno.land/std@0.131.0/http/server.ts"

//thanks to
//https://github.com/risan/country-flag-emoji/
import data from "./data.js"

const countryCodes = Object.keys(data);

const list = Object.values(data);

function getCountryFlagEmoji(countryCode: string) {
  if (countryCodes.includes(countryCode)) {
    return list[countryCodes.indexOf(countryCode)].emoji;
  }
  return '';
}

function ips(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(/\s*,\s*/);
}

serve(async (req) => {
  const { ip } = await req.json()
  console.log(ip)

  console.log(Deno.env.get('IPINFO_TOKEN'))
  const res = await fetch(`https://ipinfo.io/${ip}?token=${Deno.env.get('IPINFO_TOKEN')}`, {
      headers: { 'Content-Type': 'application/json'}});
  const { city, country } = await res.json();
  console.log(getCountryFlagEmoji(country));
  return new Response(
    JSON.stringify(`You're accessing from ${city}, ${country},${getCountryFlagEmoji(country)} `),
    { headers: { "Content-Type": "application/json" } },
  )
})

//To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"ip":"47.200.180.206"}'
