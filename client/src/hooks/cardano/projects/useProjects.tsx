import { useEffect, useState } from "react";
import { ProjectData } from "src/entities/project.entities";
import useErrorHandler from "src/hooks/useErrorHandler";
import { getProjects } from "src/services/common";

export default function useProjects() {
  const [loading, setLoading] = useState<boolean>(true);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const { handleError } = useErrorHandler();

  const getProjectsFromAPI = async () => {
    try {
      const projects = await getProjects();
      setProjects(projects);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProjectsFromAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    projects,
    loading,
  };
}
