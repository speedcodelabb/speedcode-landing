import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultSiteDocument,
  fetchPublishedDocument,
  type SiteDocument,
} from "../lib/siteContent";

type SiteContentContextValue = {
  content: SiteDocument;
  loading: boolean;
  usingFallback: boolean;
  refresh: () => Promise<void>;
};

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

export function SiteContentProvider({
  children,
  document,
}: {
  children: ReactNode;
  document?: SiteDocument;
}) {
  const [content, setContent] = useState(document ?? defaultSiteDocument);
  const [loading, setLoading] = useState(!document);
  const [usingFallback, setUsingFallback] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const nextContent = await fetchPublishedDocument();
      setContent(nextContent);
      setUsingFallback(nextContent === defaultSiteDocument);
    } catch (error) {
      console.error("Error inesperado al cargar el contenido público", error);
      setContent(defaultSiteDocument);
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (document) {
      setContent(document);
      setUsingFallback(false);
      setLoading(false);
      return;
    }
    void refresh();
  }, [document]);

  const value = useMemo(
    () => ({ content, loading, usingFallback, refresh }),
    [content, loading, usingFallback],
  );
  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context)
    throw new Error("useSiteContent debe usarse dentro de SiteContentProvider");
  return context;
}
