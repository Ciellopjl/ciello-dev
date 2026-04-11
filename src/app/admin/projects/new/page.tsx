export const dynamic = 'force-dynamic';
export const revalidate = 0;

import ProjectForm from "@/components/projects/ProjectForm";

export const metadata = {
  title: "Novo Projeto · Admin",
};

export default function NewProjectPage() {
  return <ProjectForm mode="create" />;
}
