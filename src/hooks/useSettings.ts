import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const DEFAULTS = {
  whatsapp: "97466488228",
  phone: "+974 6648 8228",
  email: "",
  instagramUrl: "https://www.instagram.com/athartechdesign/",
  twitterUrl: "",
};

// The old brand handle may still be stored in settings; always point to the current account.
const isOldInstagram = (u: string) => /afkar|fikra/i.test(u);

export function useSettings() {
  const data = useQuery(api.settings.get);
  if (data === undefined) return DEFAULTS;
  if (data === null) return DEFAULTS;
  return {
    whatsapp: (data.whatsapp || DEFAULTS.whatsapp).replace(/\D/g, ""),
    phone: data.phone || DEFAULTS.phone,
    email:
      data.email && !/fikra|afkar/i.test(data.email)
        ? data.email
        : DEFAULTS.email,
    instagramUrl:
      data.instagramUrl && !isOldInstagram(data.instagramUrl)
        ? data.instagramUrl
        : DEFAULTS.instagramUrl,
    twitterUrl: data.twitterUrl || "",
  };
}
