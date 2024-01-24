import { DomainProps } from "@/lib/types";
import { ARTST_DOMAINS, SHORT_DOMAIN, fetcher } from "@artst/utils";
import { useParams } from "next/navigation";
import useSWR from "swr";
import useProject from "./use-project";

export default function useDomains({ domain }: { domain?: string } = {}) {
  const { slug } = useParams() as {
    slug: string;
  };

  const { data, error, mutate } = useSWR<DomainProps[]>(
    slug && `/api/projects/${slug}/domains`,
    fetcher,
    {
      dedupingInterval: 60000,
    },
  );

  const allProjectDomains = data || [];
  const projectDomains = data?.filter((domain) => !domain.archived);
  const archivedProjectDomains = data?.filter((domain) => domain.archived);

  const { defaultDomains: projectDefaultDomains } = useProject();

  const defaultDomains =
    (projectDefaultDomains &&
      ARTST_DOMAINS.filter((d) => projectDefaultDomains?.includes(d.slug))) ||
    ARTST_DOMAINS;

  const allDomains = [
    ...(data || []),
    ...(slug !== "artst" ? defaultDomains : []),
  ];
  const allActiveDomains = [
    ...(projectDomains || []),
    ...(slug !== "artst" ? defaultDomains : []),
  ];

  const primaryDomain =
    projectDomains?.find((domain) => domain.primary)?.slug ||
    defaultDomains.find((domain) => domain.primary)?.slug ||
    SHORT_DOMAIN;

  const verified = domain
    ? // If a domain is passed, check if it's verified
      [...allActiveDomains, ...(archivedProjectDomains || [])].find(
        (d) => d.slug === domain,
      )?.verified
    : // If no domain is passed, check if any of the project domains are verified
      projectDomains?.some((d) => d.verified);

  return {
    projectDomains,
    archivedProjectDomains,
    defaultDomains,
    allProjectDomains,
    allActiveDomains,
    allDomains,
    primaryDomain,
    verified,
    loading: !data && !error,
    mutate,
    error,
  };
}
