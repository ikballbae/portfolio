import AwardsContent from './AwardsContent'

export const metadata = {
  title: 'Penghargaan · Akhmad Ikbal, Web Developer',
  description:
    'Daftar pencapaian dan penghargaan kompetisi bidang web development, akademik, dan desain oleh Akhmad Ikbal.',
  openGraph: {
    title: 'Penghargaan · Akhmad Ikbal, Web Developer',
    description:
      'Daftar pencapaian dan penghargaan kompetisi bidang web development, akademik, dan desain oleh Akhmad Ikbal.',
    type: 'website',
  },
}

export default function AwardsPage() {
  return <AwardsContent />
}
