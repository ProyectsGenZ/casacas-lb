export interface BrandConfig {
  name: string;
  shortName: string;
  tagline: string;
  location: string;
  announcement: {
    badge: string;
    text: string;
    linkText?: string;
  };
  freeShippingThreshold: number; // in ARS
  standardShippingCost: number; // in ARS
  installmentsCount: number;
  contact: {
    whatsapp: string;
    whatsappFormatted: string;
    whatsappMessage: string;
    email: string;
    address: string;
    addressDetail: string;
    hours: string;
    mapsUrl: string;
    mapsEmbedUrl: string;
  };
  social: {
    instagram: string;
    instagramHandle: string;
    tiktok: string;
  };
  validCoupons: Record<string, number>;
}

export const brandConfig: BrandConfig = {
  name: "CASACAS LB",
  shortName: "CASACAS LB",
  tagline: "Indumentaria para los que hacen que pase",
  location: "Las Breñas, Chaco, Argentina",
  announcement: {
    badge: "RETIRO EN LAS BREÑAS",
    text: "Consultas y pedidos personalizados por WhatsApp • +54 9 3735 549290 • Envíos a todo el país",
    linkText: "Escribir a Leo ↗"
  },
  freeShippingThreshold: 80000,
  standardShippingCost: 4500,
  installmentsCount: 3,
  contact: {
    whatsapp: "5493735549290",
    whatsappFormatted: "+54 9 3735 549290",
    whatsappMessage: "Hola Leo, te consulto por los productos y personalización de CASACAS LB.",
    email: "contacto@casacaslb.com.ar",
    address: "Av. General Jones",
    addressDetail: "Entre Mercante y Gral. Vedia, Las Breñas, Chaco",
    hours: "Lunes a viernes de 09:00 a 12:00 hs y de 15:00 a 21:00 hs",
    mapsUrl: "https://maps.app.goo.gl/gJxqQM6dDFkQV5b37",
    mapsEmbedUrl: "https://www.google.com/maps?q=-27.0852594,-61.0864307&z=18&output=embed"
  },
  social: {
    instagram: "https://www.instagram.com/casacaslb/",
    instagramHandle: "@casacaslb",
    tiktok: "https://tiktok.com/@casacaslb"
  },
  validCoupons: {
    "CASACAS10": 10,
    "BREÑAS15": 15,
    "EQUIPO10": 10
  }
};
