// Alternative type pairings to preview with `?font=<id>`. The choice is kept in
// localStorage so it follows you across pages; `?font=default` clears it.
// Each pairing only re-points the --font-* tokens in global.css.
export const FONT_VARIANTS = {
  classic: {
    label: 'Classic editorial',
    href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Lora:ital,wght@0,400;0,500;1,400;1,500&family=Source+Sans+3:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;700&display=swap',
  },
  modern: {
    label: 'Modern grotesk',
    href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400;1,9..40,500&family=DM+Mono:wght@400;500&display=swap',
  },
  friendly: {
    label: 'Warm & friendly',
    href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,500;1,7..72,400;1,7..72,500&family=JetBrains+Mono:wght@400;700&display=swap',
  },
} as const;
