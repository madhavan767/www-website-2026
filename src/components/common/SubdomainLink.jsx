import React from 'react';
import { Link } from 'react-router-dom';
import { getCurrentSubdomain, getSubdomainUrl } from '../../utils/subdomains';

/**
 * Intelligent Subdomain-Aware Link
 * - Uses client-side React Router <Link> when linking within the active host.
 * - Uses standard <a> tag with full absolute URL when linking across subdomains or to/from main.
 */
export function SubdomainLink({
  subdomain = 'main',
  to = '/',
  href,
  children,
  className,
  target,
  rel,
  onClick,
  ...rest
}) {
  const currentSubdomain = getCurrentSubdomain();
  const targetSubdomain = subdomain;
  const path = href || to || '/';

  // If path is an external protocol link (mailto:, tel:, https:// external), render simple <a>
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('mailto:') || path.startsWith('tel:')) {
    return (
      <a
        href={path}
        className={className}
        target={target || (path.startsWith('http') ? '_blank' : undefined)}
        rel={rel || (path.startsWith('http') ? 'noopener noreferrer' : undefined)}
        onClick={onClick}
        {...rest}
      >
        {children}
      </a>
    );
  }

  // Same host: SPA client-side routing
  if (currentSubdomain === targetSubdomain) {
    return (
      <Link to={path} className={className} onClick={onClick} {...rest}>
        {children}
      </Link>
    );
  }

  // Cross-subdomain or Main <-> Subdomain: Real browser URL transition
  const destinationUrl = getSubdomainUrl(targetSubdomain, path);

  return (
    <a
      href={destinationUrl}
      className={className}
      target={target}
      rel={rel}
      onClick={onClick}
      {...rest}
    >
      {children}
    </a>
  );
}

export default SubdomainLink;
