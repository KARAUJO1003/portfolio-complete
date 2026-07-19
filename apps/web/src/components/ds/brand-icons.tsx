/**
 * lucide-react nao inclui logos de marca (removidos por questao de
 * licenca/trademark). Mesmos paths ja usados em `portfolio-home.tsx`,
 * centralizados aqui para reuso (admin e portfolio publico).
 */

export function GithubIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 0 1.6 1.1 1.6 1.1.9 1.5 2.4 1.1 2.9.8.1-.7.4-1.1.7-1.3-2.2-.2-4.5-1.1-4.5-4.9 0-1.1.4-2 1.1-2.7-.1-.3-.5-1.3.1-2.7 0 0 .9-.3 2.8 1.1A9.5 9.5 0 0 1 12 6c.9 0 1.7.1 2.5.3 1.9-1.4 2.8-1.1 2.8-1.1.6 1.4.2 2.4.1 2.7.7.7 1.1 1.6 1.1 2.7 0 3.8-2.3 4.7-4.5 4.9.4.3.7.9.7 1.8V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

export function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M6.8 8.8H3.7V20h3.1V8.8ZM5.2 4C4.2 4 3.5 4.7 3.5 5.6s.7 1.6 1.7 1.6 1.7-.7 1.7-1.6S6.2 4 5.2 4Zm15.3 9.6c0-3.2-1.7-5.1-4.3-5.1-1.7 0-2.7.9-3.2 1.8V8.8H9.9V20H13v-6.1c0-1.6.9-2.6 2.2-2.6 1.2 0 2 .8 2 2.5V20h3.3v-6.4Z" />
    </svg>
  );
}
