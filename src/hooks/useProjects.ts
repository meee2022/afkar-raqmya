import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { normalizeProject, type AgencyProject } from "../../shared/projects";
export function useProjects() {
  const rows = useQuery(api.projects.list);
  return {
    projects: ((rows ?? []) as AgencyProject[])
      .filter((p) => p.isActive !== false)
      .map(normalizeProject)
      .filter((p) => p.imageUrl || p.videoUrl),
    loading: rows === undefined,
  };
}
