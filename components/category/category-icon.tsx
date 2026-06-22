import {
  BarChart3,
  Bot,
  Box,
  CalendarClock,
  Captions,
  Code,
  Contact,
  GraduationCap,
  HandCoins,
  Headset,
  Image,
  Languages,
  Megaphone,
  MessageSquare,
  Mic,
  Music,
  NotebookPen,
  Palette,
  PenLine,
  Presentation,
  Tag,
  Telescope,
  TrendingUp,
  Video,
  Wand2,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Explicit map of the lucide-react icon names used by category documents.
 * Server-renderable and tree-shakeable (only these icons are bundled) — unlike
 * lucide's `DynamicIcon`, which is client-only and flashes on the server.
 * When a new category icon is introduced in Sanity, add it here.
 */
const ICON_MAP: Record<string, LucideIcon> = {
  BarChart3,
  Bot,
  Box,
  CalendarClock,
  Captions,
  Code,
  Contact,
  GraduationCap,
  HandCoins,
  Headset,
  Image,
  Languages,
  Megaphone,
  MessageSquare,
  Mic,
  Music,
  NotebookPen,
  Palette,
  PenLine,
  Presentation,
  Telescope,
  TrendingUp,
  Video,
  Wand2,
  Zap,
};

/** Renders a category's lucide icon by name, falling back to a generic Tag. */
export function CategoryIcon({
  name,
  className,
}: {
  name?: string;
  className?: string;
}) {
  const Icon = (name && ICON_MAP[name]) || Tag;
  return <Icon className={className} aria-hidden="true" />;
}
