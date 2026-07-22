import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  defaultPortfolioItems,
  defaultSiteContent,
  fetchPortfolioItems,
  fetchSiteContent,
  type PortfolioItem,
  type SiteContent,
} from '../lib/siteContent';

type SiteContentContextValue = {
  content: SiteContent;
  portfolioItems: PortfolioItem[];
  loading: boolean;
  setContent: (content: SiteContent) => void;
  setPortfolioItems: (items: PortfolioItem[]) => void;
};

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(defaultPortfolioItems);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.all([fetchSiteContent(), fetchPortfolioItems()]).then(([fetchedContent, fetchedItems]) => {
      if (cancelled) return;
      setContent(fetchedContent);
      setPortfolioItems(fetchedItems);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SiteContentContext.Provider value={{ content, portfolioItems, loading, setContent, setPortfolioItems }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext);
  if (!ctx) throw new Error('useSiteContent debe usarse dentro de SiteContentProvider');
  return ctx;
}
