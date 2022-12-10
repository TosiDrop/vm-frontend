import Project from "src/components/Projects/Project";
import useProjects from "src/hooks/cardano/projects/useProjects";
import Loading from "src/pages/Loading";

const Projects = () => {
  const { projects, loading } = useProjects();

  return loading ? (
    <Loading></Loading>
  ) : (
    <>
      <p className="text-3xl">Explore TosiDrop Projects</p>
      <div className="flex flex-col gap-4">
        {projects.map((project, i) => {
          return <Project key={i} projectData={project}></Project>;
        })}
      </div>
    </>
  );
};

export default Projects;
