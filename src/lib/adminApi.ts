import { supabase, isSupabaseConfigured } from './supabase';
import type { PortfolioItem, SiteContent } from './siteContent';

export async function updateSiteContent(current: SiteContent, patch: Partial<SiteContent>): Promise<SiteContent> {
  const merged: SiteContent = { ...current, ...patch };

  if (isSupabaseConfigured && supabase) {
    await supabase
      .from('site_content')
      .update({
        hero_title: merged.heroTitle,
        hero_subtitle: merged.heroSubtitle,
        about_text: merged.aboutText,
        contact_email: merged.contactEmail,
        contact_phone: merged.contactPhone,
        whatsapp_number: merged.whatsappNumber,
        faq_items: merged.faqItems,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1);
  }

  return merged;
}

export async function createPortfolioItem(
  item: Omit<PortfolioItem, 'id'>,
): Promise<PortfolioItem> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('portfolio_items')
      .insert({
        name: item.name,
        industry: item.industry,
        metric: item.metric,
        result: item.result,
        image_url: item.imageUrl,
        sort_order: item.sortOrder,
      })
      .select()
      .single();

    if (!error && data) {
      return {
        id: data.id,
        name: data.name,
        industry: data.industry,
        metric: data.metric,
        result: data.result,
        imageUrl: data.image_url,
        sortOrder: data.sort_order,
      };
    }
  }

  return { ...item, id: crypto.randomUUID() };
}

export async function updatePortfolioItem(item: PortfolioItem): Promise<PortfolioItem> {
  if (isSupabaseConfigured && supabase) {
    await supabase
      .from('portfolio_items')
      .update({
        name: item.name,
        industry: item.industry,
        metric: item.metric,
        result: item.result,
        image_url: item.imageUrl,
        sort_order: item.sortOrder,
      })
      .eq('id', item.id);
  }

  return item;
}

export async function deletePortfolioItem(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('portfolio_items').delete().eq('id', id);
  }
}

export async function uploadPortfolioImage(file: File): Promise<string> {
  if (isSupabaseConfigured && supabase) {
    const path = `${crypto.randomUUID()}-${file.name}`;
    const { error } = await supabase.storage.from('portfolio-images').upload(path, file);

    if (!error) {
      const { data } = supabase.storage.from('portfolio-images').getPublicUrl(path);
      return data.publicUrl;
    }
  }

  // Modo demo local: preview en memoria, no persiste entre recargas.
  return URL.createObjectURL(file);
}
