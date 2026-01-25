export type Project = {
  slug: string;
  title: string;
  tagline: string;
  year: string;
  role: string;
  stack: string[];
  highlights: string[];
};

export const projects: Project[] = [
  {
    slug: 'online-banking-application',
    title: 'Online Banking Application',
    tagline: 'Secure banking workflows with a feedback module and clean data handling.',
    year: '2025',
    role: 'Backend + Frontend',
    stack: ['Java', 'Spring Boot', 'React', 'MySQL'],
    highlights: ['Implemented feedback flow end-to-end', 'Secure data handling and validation', 'Clean API + database integration'],
  },
  {
    slug: 'air-ticket-booking-system',
    title: 'Air Ticket Booking System',
    tagline: 'Java + SQL reservation flows for booking, cancellations, and passenger records.',
    year: '2024',
    role: 'Backend / Database',
    stack: ['Java', 'SQL', 'Data Modeling'],
    highlights: ['Designed booking & cancellation workflows', 'Built structured passenger data handling', 'Focused on data integrity and edge cases'],
  },
  {
    slug: 'medicare-application',
    title: 'Medicare Application',
    tagline: 'A Flutter app for appointments and healthcare resources.',
    year: '2024',
    role: 'Mobile App Development',
    stack: ['Flutter', 'Dart', 'Mobile UI'],
    highlights: ['Appointment-focused UX', 'Clean navigation and UI structure', 'Cross-platform delivery'],
  },
  {
    slug: 'food-market-db-management',
    title: 'Food Market DB Management',
    tagline: 'Inventory, sales, and supplier management with a SQL-backed web UI.',
    year: '2023',
    role: 'Full‑Stack',
    stack: ['HTML', 'CSS', 'JavaScript', 'SQL'],
    highlights: ['CRUD flows for inventory and suppliers', 'Practical relational schema and queries', 'Simple, usable UI for daily operations'],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
