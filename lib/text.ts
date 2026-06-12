export function cleanSiteText(value?: string | null): string {
  if (!value) {
    return '';
  }

  return decodeHtmlEntities(stripHtmlTags(value)).trim();
}

function stripHtmlTags(value: string): string {
  return value.replace(/<[^>]*>/g, '');
}

function decodeHtmlEntities(value: string): string {
  return value
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&eacute;/g, 'é')
      .replace(/&egrave;/g, 'è')
      .replace(/&ecirc;/g, 'ê')
      .replace(/&agrave;/g, 'à')
      .replace(/&acirc;/g, 'â')
      .replace(/&ocirc;/g, 'ô')
      .replace(/&ucirc;/g, 'û')
      .replace(/&ugrave;/g, 'ù')
      .replace(/&icirc;/g, 'î')
      .replace(/&iuml;/g, 'ï')
      .replace(/&ccedil;/g, 'ç')
      .replace(/&rsquo;/g, '’')
      .replace(/&lsquo;/g, '‘')
      .replace(/&ldquo;/g, '“')
      .replace(/&rdquo;/g, '”');
}