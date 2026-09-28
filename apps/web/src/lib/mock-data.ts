import type { Category, Product, Store, Order } from "@victoire/shared";

export const mockCategories: Category[] = [
  { id: "c1", name: "Alimentation", slug: "alimentation" },
  { id: "c2", name: "Mode & Textile", slug: "mode" },
  { id: "c3", name: "Électronique", slug: "electronique" },
  { id: "c4", name: "Maison", slug: "maison" },
  { id: "c5", name: "Beauté", slug: "beaute" },
  { id: "c6", name: "Artisanat", slug: "artisanat" },
  { id: "c7", name: "Bébé & Enfant", slug: "bebe" },
  { id: "c8", name: "Sport & Loisirs", slug: "sport" },
];

export const mockStores: Store[] = [
  {
    id: "s1",
    sellerProfileId: "p1",
    name: "Boutique Mokolo",
    slug: "boutique-mokolo",
    description: "Prêt-à-porter féminin, pagnes et accessoires du quartier Mokolo.",
    generalArea: "Bertoua — Mokolo",
    hasPhysicalLocation: true,
    verified: true,
  },
  {
    id: "s2",
    sellerProfileId: "p2",
    name: "Épicerie du Centre",
    slug: "epicerie-du-centre",
    description: "Produits alimentaires, conserves et épices du marché central.",
    generalArea: "Bertoua — Centre",
    hasPhysicalLocation: true,
    verified: true,
  },
  {
    id: "s3",
    sellerProfileId: "p3",
    name: "Tech Nkolbisson",
    slug: "tech-nkolbisson",
    description: "Téléphones, accessoires et petit électroménager.",
    generalArea: "Bertoua — Nkolbisson",
    hasPhysicalLocation: true,
    verified: false,
  },
  {
    id: "s4",
    sellerProfileId: "p4",
    name: "Chez Mama Ada",
    slug: "chez-mama-ada",
    description: "Cuisine locale préparée, plats du jour et épicerie fine.",
    generalArea: "Bertoua — Mokolo",
    hasPhysicalLocation: false,
    verified: false,
  },
  {
    id: "s5",
    sellerProfileId: "p5",
    name: "Salon Beauté Ngoa",
    slug: "salon-beaute-ngoa",
    description: "Cosmétiques, soins capillaires et huiles essentielles.",
    generalArea: "Bertoua — Ngoa",
    hasPhysicalLocation: true,
    verified: true,
  },
  {
    id: "s6",
    sellerProfileId: "p6",
    name: "Artisanat Beti",
    slug: "artisanat-beti",
    description: "Sculptures, vanneries et bijoux faits main par des artisans locaux.",
    generalArea: "Bertoua — Centre",
    hasPhysicalLocation: true,
    verified: true,
  },
];

type RawProduct = {
  id: string; storeId: string; categoryId: string;
  name: string; price: number; stock: number; desc: string;
};

const RAW: RawProduct[] = [
  { id: "p1",  storeId: "s1", categoryId: "c2", name: "Robe wax élégante",            price: 18000, stock: 12, desc: "Robe cintrée en pagne wax, coupe moderne, tailles 36 à 44." },
  { id: "p2",  storeId: "s1", categoryId: "c2", name: "Chemise homme en coton",       price: 12500, stock: 8,  desc: "Chemise habillée coupe droite, coton 100 %." },
  { id: "p3",  storeId: "s1", categoryId: "c2", name: "Foulard en soie imprimé",      price: 6500,  stock: 20, desc: "Foulard léger, motifs traditionnels revisités." },
  { id: "p4",  storeId: "s2", categoryId: "c1", name: "Sac de riz 25 kg",             price: 17000, stock: 30, desc: "Riz parfumé de qualité supérieure." },
  { id: "p5",  storeId: "s2", categoryId: "c1", name: "Huile de palme 5 L",           price: 5500,  stock: 24, desc: "Huile de palme rouge artisanale." },
  { id: "p6",  storeId: "s2", categoryId: "c1", name: "Panier de légumes frais",      price: 4500,  stock: 15, desc: "Assortiment de saison : tomates, gombos, aubergines." },
  { id: "p7",  storeId: "s3", categoryId: "c3", name: "Smartphone 128 Go",            price: 95000, stock: 4,  desc: "Écran 6,5\", double SIM, batterie longue durée." },
  { id: "p8",  storeId: "s3", categoryId: "c3", name: "Écouteurs sans fil",           price: 12500, stock: 18, desc: "Bluetooth 5.3, boîtier de charge, autonomie 24 h." },
  { id: "p9",  storeId: "s3", categoryId: "c3", name: "Ventilateur rechargeable",     price: 22000, stock: 7,  desc: "Ventilateur portable avec lampe LED et USB." },
  { id: "p10", storeId: "s3", categoryId: "c3", name: "Batterie externe 20 000 mAh",  price: 15000, stock: 22, desc: "Charge rapide, 2 ports USB + USB-C." },
  { id: "p11", storeId: "s4", categoryId: "c1", name: "Plat du jour — Eru",           price: 2500,  stock: 10, desc: "Eru préparé maison, servi avec water-fufu." },
  { id: "p12", storeId: "s4", categoryId: "c1", name: "Beignets haricots (10 pièces)", price: 1500, stock: 40, desc: "Beignets frais du matin, pâte de haricots." },
  { id: "p13", storeId: "s4", categoryId: "c1", name: "Jus de gingembre 1 L",         price: 2000,  stock: 25, desc: "Jus artisanal au gingembre frais." },
  { id: "p14", storeId: "s5", categoryId: "c5", name: "Beurre de karité pur 500 g",   price: 3500,  stock: 35, desc: "Karité brut non raffiné, riche en vitamines." },
  { id: "p15", storeId: "s5", categoryId: "c5", name: "Huile de baobab 250 ml",       price: 5000,  stock: 14, desc: "Huile pressée à froid, soin capillaire et peau." },
  { id: "p16", storeId: "s5", categoryId: "c5", name: "Savon noir africain",          price: 1800,  stock: 50, desc: "Savon traditionnel purifiant, 200 g." },
  { id: "p17", storeId: "s6", categoryId: "c6", name: "Masque Bantou sculpté",        price: 25000, stock: 3,  desc: "Sculpture bois d'ébène, pièce unique." },
  { id: "p18", storeId: "s6", categoryId: "c6", name: "Panier tressé",                price: 8500,  stock: 11, desc: "Panier en raphia tressé main, coloris naturel." },
  { id: "p19", storeId: "s6", categoryId: "c6", name: "Bracelet perles de rocaille",  price: 4500,  stock: 27, desc: "Bracelet artisanal, perles multicolores." },
  { id: "p20", storeId: "s2", categoryId: "c4", name: "Bouilloire en inox",           price: 7500,  stock: 9,  desc: "Bouilloire 1,5 L compatible tous feux." },
  { id: "p21", storeId: "s1", categoryId: "c7", name: "Ensemble bébé 2 pièces",       price: 8500,  stock: 16, desc: "Taille 6-24 mois, coton doux." },
  { id: "p22", storeId: "s3", categoryId: "c8", name: "Ballon de football",           price: 5500,  stock: 20, desc: "Ballon cousu main, taille 5." },
];

export const mockProducts: Product[] = RAW.map((r) => ({
  id: r.id,
  storeId: r.storeId,
  categoryId: r.categoryId,
  name: r.name,
  slug: r.id,
  description: r.desc,
  sellerNetPrice: r.price,
  active: true,
  pickupAvailable: true,
  deliveryAvailable: true,
  createdAt: new Date(Date.now() - Math.random() * 30 * 864e5).toISOString(),
}));

export const mockStock: Record<string, number> = Object.fromEntries(
  RAW.map((r) => [r.id, r.stock]),
);

export function storeById(id: string): Store | undefined {
  return mockStores.find((s) => s.id === id);
}
export function productById(id: string): Product | undefined {
  return mockProducts.find((p) => p.id === id);
}
export function categoryById(id: string): Category | undefined {
  return mockCategories.find((c) => c.id === id);
}
