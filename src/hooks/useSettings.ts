import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const DEFAULTS = {
  whatsapp: "97433000000",
  phone: "+974 33 000 000",
  email: "hello@afkarraqmeya.com",
  instagramUrl: "",
  twitterUrl: "",
};

export function useSettings() {
  const data = useQuery(api.settings.get);
  if (data === undefined) return DEFAULTS;
  if (data === null) return DEFAULTS;
  return {
    whatsapp: data.whatsapp || DEFAULTS.whatsapp,
    phone: data.phone || DEFAULTS.phone,
    email: data.email || DEFAULTS.email,
    instagramUrl: data.instagramUrl || "",
    twitterUrl: data.twitterUrl || "",
  };
}
