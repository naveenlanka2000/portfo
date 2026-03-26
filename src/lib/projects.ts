export type Project = {
  slug: string;
  title: string;
  tagline: string;
  year: string;
  role: string;
  stack: string[];
  highlights: string[];
  summary: string;
  challenge: string;
  solution: string;
  outcome: string;
};

export const projects: Project[] = [
  {
    slug: 'online-banking-application',
    title: 'Online Banking Application',
    tagline:
      'A full-stack banking application with a focus on security and user experience, featuring a comprehensive feedback module.',
    year: '2025',
    role: 'Backend + Frontend',
    stack: ['Java', 'Spring Boot', 'React', 'MySQL', 'Postman', 'Git'],
    highlights: [
      'Implemented feedback flow end-to-end',
      'Secure data handling and validation',
      'Clean API + database integration',
    ],
    summary:
      'Built a banking workflow that combined a React frontend with Spring Boot services and MySQL persistence, with extra attention on validation, security, and user feedback flows.',
    challenge:
      'The project needed to handle sensitive data and user feedback in a way that stayed clear, reliable, and safe across both frontend and backend layers.',
    solution:
      'Structured the app around clean API boundaries, strong request validation, and database-backed feedback handling so the main banking actions stayed predictable and maintainable.',
    outcome:
      'Delivered an end-to-end banking application with secure data handling, a complete feedback module, and a cleaner full-stack architecture for future expansion.',
  },
  {
    slug: 'air-ticket-booking-system',
    title: 'Air Ticket Booking System',
    tagline:
      'A robust airline reservation system developed with Java and SQL, designed for efficient booking, cancellations, and passenger data management.',
    year: '2024',
    role: 'Backend / Database',
    stack: ['Java', 'SQL', 'Data Modeling', 'Git'],
    highlights: [
      'Designed booking and cancellation workflows',
      'Built structured passenger data handling',
      'Focused on data integrity and edge cases',
    ],
    summary:
      'Developed an airline reservation system in Java and SQL for core booking operations, passenger records, and cancellation handling.',
    challenge:
      'Reservation systems depend on accurate records, consistent seat and passenger data, and flows that can handle changes without corrupting bookings.',
    solution:
      'Modeled the reservation data carefully and implemented Java workflows for booking, cancellation, and passenger management with a stronger focus on integrity and edge cases.',
    outcome:
      'Produced a more reliable reservation flow with clearer data handling and structured backend logic for airline-style booking scenarios.',
  },
  {
    slug: 'medicare-application',
    title: 'Medicare Application',
    tagline:
      'A cross-platform mobile app for healthcare, enabling users to manage appointments and access medical resources seamlessly.',
    year: '2024',
    role: 'Mobile App Development',
    stack: ['Flutter', 'Dart', 'Mobile UI', 'Git'],
    highlights: [
      'Appointment-focused UX',
      'Clean navigation and UI structure',
      'Cross-platform delivery',
    ],
    summary:
      'Created a Flutter mobile app for healthcare use cases, centered on appointments, accessible navigation, and cross-platform delivery.',
    challenge:
      'Healthcare apps need simple navigation and fast task completion so users can manage appointments and information without friction.',
    solution:
      'Designed a Flutter experience with straightforward screens, clean navigation, and mobile-first flows focused on booking and accessing healthcare resources.',
    outcome:
      'Shipped a cross-platform healthcare app with a clearer appointment journey and a more usable mobile interface.',
  },
  {
    slug: 'food-market-db-management',
    title: 'Food Market DB Management',
    tagline:
      'A web-based inventory and sales management tool for a food market, built with a SQL backend and a user-friendly interface.',
    year: '2023',
    role: 'Full-Stack',
    stack: ['HTML', 'CSS', 'JavaScript', 'SQL', 'Git'],
    highlights: [
      'CRUD flows for inventory and suppliers',
      'Practical relational schema and queries',
      'Simple, usable UI for daily operations',
    ],
    summary:
      'Built a web-based inventory and sales management tool for a food market using HTML, CSS, JavaScript, and SQL.',
    challenge:
      'Daily inventory work depends on simple data entry, dependable supplier records, and queries that keep stock and sales information easy to manage.',
    solution:
      'Implemented CRUD workflows, a practical SQL schema, and a straightforward browser interface for inventory, suppliers, and sales tracking.',
    outcome:
      'Delivered a usable market-management app that improved day-to-day data handling with a relational database and a simple web UI.',
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
