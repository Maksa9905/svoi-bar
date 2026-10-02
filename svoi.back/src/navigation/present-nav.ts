export type NavRecord = {
  id: string;
  placement: string;
  label: string;
  sortOrder: number;
  targetType: string;
  sectionId: string | null;
  pagePath: string | null;
  action: string | null;
};

export type SectionAnchor = {
  id: string;
  anchor: string | null;
};

export function presentNavLink(
  link: NavRecord,
  sections: Map<string, SectionAnchor>,
) {
  if (link.targetType === 'page') {
    return {
      id: link.id,
      label: link.label,
      sortOrder: link.sortOrder,
      target: { type: 'page' as const, path: link.pagePath },
    };
  }

  if (link.targetType === 'action') {
    return {
      id: link.id,
      label: link.label,
      sortOrder: link.sortOrder,
      target: { type: 'action' as const, action: link.action },
    };
  }

  const section = link.sectionId ? sections.get(link.sectionId) : undefined;
  if (!section?.anchor) {
    return {
      id: link.id,
      label: link.label,
      sortOrder: link.sortOrder,
      target: { type: 'broken' as const, sectionId: link.sectionId },
    };
  }

  return {
    id: link.id,
    label: link.label,
    sortOrder: link.sortOrder,
    target: {
      type: 'section' as const,
      sectionId: section.id,
      anchor: section.anchor,
      href: `/#${section.anchor}`,
    },
  };
}
