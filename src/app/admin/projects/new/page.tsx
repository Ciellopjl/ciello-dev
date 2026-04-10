import ProjectForm from "@/components/admin/ProjectForm";

export const metadata = {
  title: "Novo Projeto · Admin",
};

export default function NewProjectPage() {
  return <ProjectForm mode="create" />;
}
