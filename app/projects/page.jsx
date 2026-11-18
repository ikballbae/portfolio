import ProjectsContent from './ProjectsContent'

export const metadata = {
  title: 'Proyek · Akhmad Ikbal, Web Developer',
  description:
    'Koleksi proyek web development, sistem informasi, dan perangkat lunak yang dikembangkan oleh Akhmad Ikbal.',
  openGraph: {
    title: 'Proyek · Akhmad Ikbal, Web Developer',
    description:
      'Koleksi proyek web development, sistem informasi, dan perangkat lunak yang dikembangkan oleh Akhmad Ikbal.',
    type: 'website',
  },
}

export default function ProjectsPage() {
  return <ProjectsContent />
}
