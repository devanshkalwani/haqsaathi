import {
  Baby,
  Banknote,
  BookOpen,
  Briefcase,
  Building2,
  Flame,
  GraduationCap,
  Hammer,
  HandHeart,
  HeartPulse,
  Home,
  House,
  Landmark,
  Accessibility,
  Receipt,
  Search,
  ShoppingBasket,
  Sparkles,
  Sprout,
  Store,
  Tractor,
  User,
  UserRound,
  Users,
  Wheat,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/**
 * Clean line icons for the ids in src/data/options.ts (genders, areas, occupations,
 * flags, scheme categories). Used instead of emojis so the site looks professional.
 */
const ICONS: Record<string, LucideIcon> = {
  // genders
  female: UserRound,
  male: User,
  other: Users,
  // areas
  rural: Wheat,
  urban: Building2,
  // occupations
  farmer: Tractor,
  labourer: Hammer,
  domestic_worker: HandHeart,
  street_vendor: ShoppingBasket,
  artisan: Wrench,
  small_business: Store,
  student: GraduationCap,
  salaried: Briefcase,
  homemaker: Home,
  unemployed: Search,
  retired: Accessibility,
  // flags
  has_bank_account: Landmark,
  has_bpl_card: Receipt,
  owns_farmland: Sprout,
  has_pucca_house: House,
  has_lpg: Flame,
  daughter_under_10: Baby,
  pregnant_or_new_mother: Baby,
  has_disability: Accessibility,
  pays_income_tax: Banknote,
  // scheme categories
  farmers: Sprout,
  health: HeartPulse,
  housing: House,
  money: Landmark,
  workers: Hammer,
  women: UserRound,
  students: GraduationCap,
  elderly: Accessibility,
  business: Store,
};

export default function OptionIcon({ id, className = "h-5 w-5" }: { id: string; className?: string }) {
  const I = ICONS[id] ?? (id === "about" ? BookOpen : Sparkles);
  return <I className={className} strokeWidth={1.8} aria-hidden />;
}
