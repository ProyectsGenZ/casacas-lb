import { Product, CategoryItem } from '../types';

export const productsData: Product[] = [
  {
    id: 'prod-1',
    numericId: 1,
    name: 'Vaso Chopp Polímero',
    category: 'Accesorios',
    price: 7500,
    priceBase: 7500,
    priceCustom: 11500,
    minQuantity: 1,
    sku: 'VC',
    customizable: true,
    stock: 14,
    shortDescription: 'Base resistente y liviana para eventos, promociones y regalos.',
    description: 'Vaso chopp de polímero de alta resistencia, preparado para estampado full color con terminación brillante y durabilidad garantizada.',
    fit: 'Capacidad 500cc',
    material: 'Polímero virgen de alto impacto',
    composition: '100% Polímero libre de BPA',
    careInstructions: ['Apto para lavavajillas', 'No usar esponjas abrasivas en la zona estampada'],
    colors: [
      { name: 'Blanco Nieve', hex: '#FFFFFF' },
      { name: 'Negro Mate', hex: '#1C1C1C' },
      { name: 'Rojo Señal', hex: '#C8102E' }
    ],
    sizes: ['Único'],
    images: [
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80'
    ],
    isFeatured: true
  },
  {
    id: 'prod-2',
    numericId: 2,
    name: 'Vaso Aluminio',
    category: 'Accesorios',
    price: 7500,
    priceBase: 7500,
    priceCustom: null,
    minQuantity: 1,
    sku: 'VA',
    customizable: false,
    stock: 0,
    shortDescription: 'Aluminio anodizado térmico y liviano, ideal para uso diario.',
    description: 'Vaso de aluminio con borde reforzado y excelente conservación de temperatura para bebidas frías.',
    fit: 'Capacidad 450cc',
    material: 'Aluminio anodizado pulido',
    composition: '100% Aluminio de grado alimenticio',
    careInstructions: ['Lavar a mano', 'No meter al microondas'],
    colors: [
      { name: 'Plateado Natural', hex: '#CCCCCC' },
      { name: 'Negro Carbón', hex: '#1C1C1C' }
    ],
    sizes: ['Único'],
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=1000&q=80'
    ],
    isFeatured: false
  },
  {
    id: 'prod-3',
    numericId: 3,
    name: 'Termo Hoppy Polímero',
    category: 'Accesorios',
    price: 12000,
    priceBase: 12000,
    priceCustom: 15000,
    minQuantity: 1,
    sku: 'TH',
    customizable: true,
    stock: 18,
    tag: 'Más vendido',
    shortDescription: 'Botella deportiva con pico vertedor y agarre ergonómico.',
    description: 'Termo hoppy para entrenamiento, viajes o el colegio, personalizable con escudos, nombres o logos de marcas.',
    fit: 'Capacidad 600ml',
    material: 'Polímero térmico reforzado',
    composition: 'Polímero de alta densidad con tapa hermética',
    careInstructions: ['Lavar con agua tibia y jabón suave'],
    colors: [
      { name: 'Blanco', hex: '#FFFFFF' },
      { name: 'Negro', hex: '#1C1C1C' },
      { name: 'Rojo', hex: '#C8102E' }
    ],
    sizes: ['Único'],
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=1000&q=80'
    ],
    isFeatured: true
  },
  {
    id: 'prod-4',
    numericId: 4,
    name: 'Gorra Trucker',
    category: 'Accesorios',
    price: 5500,
    priceBase: 5500,
    priceCustom: 7000,
    minQuantity: 6,
    sku: 'GT',
    customizable: true,
    stock: 32,
    tag: 'Para Equipos',
    shortDescription: 'Frente acolchado y malla respirable para equipos y empresas.',
    description: 'Gorra clásica trucker con broche regulable, lista para bordado o estampa frontal de alta definición.',
    fit: 'Ajustable con broche plástico',
    material: 'Frente de gomaespuma poliéster y malla trasera',
    composition: '100% Poliéster respirable',
    careInstructions: ['Lavar a mano con cepillo suave', 'No lavarropas'],
    colors: [
      { name: 'Negro Total', hex: '#161616' },
      { name: 'Negro y Blanco', hex: '#2C2C2C' },
      { name: 'Rojo y Blanco', hex: '#C8102E' }
    ],
    sizes: ['Único'],
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=1000&q=80'
    ],
    isFeatured: true
  },
  {
    id: 'prod-5',
    numericId: 5,
    name: 'Remera SPUM',
    category: 'Indumentaria',
    price: 10000,
    priceBase: 10000,
    priceCustom: 15000,
    minQuantity: 1,
    sku: 'RS',
    customizable: true,
    stock: 4,
    tag: 'Más vendido',
    shortDescription: 'Tela suave con caída deportiva, apta para sublimación nítida.',
    description: 'Remera clásica SPUM de tacto algodón, no encoge, no pierde color con los lavados y es perfecta para promociones y eventos.',
    fit: 'Regular fit unisex',
    material: 'Spum peinado suave 160g',
    composition: '100% Poliéster hilado tacto algodón',
    careInstructions: ['Lavar a máquina en frío', 'No planchar sobre estampas'],
    colors: [
      { name: 'Blanco Nieve', hex: '#FDFDFD' },
      { name: 'Gris Melange', hex: '#A8A8A8' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=85'
    ],
    measurements: [
      { size: 'S', chest: 50, length: 68 },
      { size: 'M', chest: 53, length: 70 },
      { size: 'L', chest: 56, length: 72 },
      { size: 'XL', chest: 59, length: 74 },
      { size: 'XXL', chest: 62, length: 76 }
    ],
    isFeatured: true
  },
  {
    id: 'prod-6',
    numericId: 6,
    name: 'Remera Algodón 24/1',
    category: 'Indumentaria',
    price: 16000,
    priceBase: 16000,
    priceCustom: 28000,
    minQuantity: 1,
    sku: 'RA',
    customizable: true,
    stock: 15,
    tag: 'Nuevo',
    shortDescription: '100% algodón peinado de textura pesada y cuello reforzado.',
    description: 'Remera urbana de corte estándar, pensada para estampa DTF, vinilo textil o serigrafía de calidad premium.',
    fit: 'Boxy / Regular Fit',
    material: 'Jersey 24/1 100% algodón peinado 210g',
    composition: '100% Algodón puro argentino',
    careInstructions: ['Lavar del revés con agua fría', 'Secar a la sombra'],
    colors: [
      { name: 'Negro Profundo', hex: '#141414' },
      { name: 'Blanco Puro', hex: '#FFFFFF' },
      { name: 'Rojo Señal', hex: '#C8102E' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85'
    ],
    measurements: [
      { size: 'S', chest: 52, length: 69 },
      { size: 'M', chest: 55, length: 71 },
      { size: 'L', chest: 58, length: 73 },
      { size: 'XL', chest: 61, length: 75 },
      { size: 'XXL', chest: 64, length: 77 }
    ],
    isFeatured: true
  },
  {
    id: 'prod-7',
    numericId: 7,
    name: 'Remera Deportiva',
    category: 'Indumentaria',
    price: 15000,
    priceBase: 15000,
    priceCustom: 22000,
    minQuantity: 7,
    sku: 'RD',
    customizable: true,
    stock: 8,
    tag: 'Para Equipos',
    shortDescription: 'Microfibra con respiración rápida para clubes y torneos.',
    description: 'Indumentaria deportiva técnica con costuras reforzadas, secado express y ajuste cómodo para alta competencia.',
    fit: 'Athletic Fit',
    material: 'Microfibra Set de poliéster 140g con tecnología dry',
    composition: '100% Poliéster técnico microperforado',
    careInstructions: ['Lavar en lavarropas ciclo deportivo', 'Secado rápido'],
    colors: [
      { name: 'Negro y Rojo', hex: '#1C1C1C' },
      { name: 'Azul Francia', hex: '#0047AB' },
      { name: 'Blanco', hex: '#FFFFFF' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=85'
    ],
    isFeatured: true
  },
  {
    id: 'prod-8',
    numericId: 8,
    name: 'Chomba Deportiva',
    category: 'Indumentaria',
    price: 19000,
    priceBase: 19000,
    priceCustom: 27750,
    minQuantity: 10,
    sku: 'CD',
    customizable: true,
    stock: 20,
    shortDescription: 'Elegancia y rendimiento en una sola prenda para equipos.',
    description: 'Chomba deportiva sublimada con cuello tejido, cartera con botones y telas transpirables que soportan el uso intenso.',
    fit: 'Classic Collar Fit',
    material: 'Poliéster técnico con cuello tejido jacquard',
    composition: '100% Poliéster transpirable',
    careInstructions: ['Lavar con agua fría', 'Planchar cuello con paño protector'],
    colors: [
      { name: 'Negro con vivos Rojos', hex: '#161616' },
      { name: 'Blanco con vivos Negros', hex: '#EAEAEA' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&w=1000&q=80'
    ],
    isFeatured: false
  },
  {
    id: 'prod-9',
    numericId: 9,
    name: 'Stickers UV Individual',
    category: 'UV & vinilo',
    price: 1500,
    priceBase: 1500,
    priceCustom: null,
    minQuantity: 1,
    sku: 'SU',
    customizable: false,
    stock: 0,
    shortDescription: 'Adhesión extrema sobre plástico, metal, vidrio y superficies duras.',
    description: 'Calco con relieve UV DTF de alta durabilidad, resistente al agua, rayos solares y raspaduras.',
    fit: 'Medida aproximada 6x6 cm',
    material: 'Tinta UV con barniz de alto brillo y adhesivo 3M',
    composition: 'Film transfer UV con curado ultravioleta',
    careInstructions: ['Limpiar superficie con alcohol antes de pegar', 'Frotar bien antes de retirar el film'],
    colors: [{ name: 'Full Color con Barniz', hex: '#FF2A1A' }],
    sizes: ['Único'],
    images: [
      'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80'
    ],
    isFeatured: false
  },
  {
    id: 'prod-10',
    numericId: 10,
    name: 'Plancha UV Chica',
    category: 'UV & vinilo',
    price: 5000,
    priceBase: 5000,
    priceCustom: null,
    minQuantity: 1,
    sku: 'PU',
    customizable: false,
    stock: 12,
    shortDescription: 'Surtido variado en formato compacto para personalización múltiple.',
    description: 'Plancha de stickers UV con varios diseños listos para transferir con presión directa.',
    fit: 'Formato A5 (15x21 cm)',
    material: 'Stickers UV DTF troquelados',
    composition: 'Tintas UV y barniz protector con relieve',
    careInstructions: ['Presionar firmemente y despegar film despacio'],
    colors: [{ name: 'Surtido Diseños', hex: '#C8102E' }],
    sizes: ['Único'],
    images: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=1000&q=80'
    ],
    isFeatured: false
  },
  {
    id: 'prod-11',
    numericId: 11,
    name: 'Plancha UV Grande',
    category: 'UV & vinilo',
    price: 9000,
    priceBase: 9000,
    priceCustom: null,
    minQuantity: 1,
    sku: 'PG',
    customizable: false,
    stock: 35,
    shortDescription: 'Formato extendido para kits completos de marcas y clubes.',
    description: 'Plancha completa de transferencias UV con alta densidad de adhesivo e impresión nítida.',
    fit: 'Formato A4 (21x30 cm)',
    material: 'Lámina UV DTF alta definición',
    composition: 'Tintas UV con barniz táctil',
    careInstructions: ['Aplicar sobre superficies limpias y desengrasadas'],
    colors: [{ name: 'Full Color Mix', hex: '#C8102E' }],
    sizes: ['Único'],
    images: [
      'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=1000&q=80'
    ],
    isFeatured: false
  },
  {
    id: 'prod-12',
    numericId: 12,
    name: 'UV Personalizado 30 cm',
    category: 'UV & vinilo',
    price: 20000,
    priceBase: 20000,
    priceCustom: 20000,
    minQuantity: 1,
    sku: '30',
    customizable: true,
    stock: 19,
    shortDescription: 'Tira personalizada de 30 cm de ancho con tus propios logos.',
    description: 'Producción por metro lineal reducido para pruebas o producciones chicas con fondo transparente.',
    fit: '30 cm x largo variable',
    material: 'Film UV DTF industrial',
    composition: 'Impresión UV CMYK + Blanco + Barniz',
    careInstructions: ['Enviar archivo en curvas o PNG transparente'],
    colors: [{ name: 'A Elección', hex: '#C8102E' }],
    sizes: ['Único'],
    images: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80'
    ],
    isFeatured: false
  },
  {
    id: 'prod-13',
    numericId: 13,
    name: 'UV Personalizado 50 cm',
    category: 'UV & vinilo',
    price: 30000,
    priceBase: 30000,
    priceCustom: 30000,
    minQuantity: 1,
    sku: '50',
    customizable: true,
    stock: 22,
    shortDescription: 'Tira personalizada de 50 cm lista para recortar y aplicar.',
    description: 'Impresión UV DTF con barniz protector para personalizar termos, cascos y artículos comerciales.',
    fit: '50 cm x largo variable',
    material: 'Film UV DTF industrial',
    composition: 'Impresión directa con tinta UV curada',
    careInstructions: ['Superficies rígidas: termos, tazas, acrílico, metal'],
    colors: [{ name: 'Diseño Propio', hex: '#C8102E' }],
    sizes: ['Único'],
    images: [
      'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=1000&q=80'
    ],
    isFeatured: false
  },
  {
    id: 'prod-14',
    numericId: 14,
    name: 'UV Metro x 1',
    category: 'UV & vinilo',
    price: 45000,
    priceBase: 45000,
    priceCustom: 45000,
    minQuantity: 1,
    sku: 'M1',
    customizable: true,
    stock: 3,
    shortDescription: 'Metro lineal completo para productores y revendedores.',
    description: 'Un metro lineal de impresión UV continua con tintas elásticas y terminación con relieve táctil.',
    fit: '100 cm lineal',
    material: 'Bobina UV DTF industrial',
    composition: 'CMYK + White + Varnish',
    careInstructions: ['Conservar en lugar seco antes de la aplicación'],
    colors: [{ name: 'Personalizado', hex: '#C8102E' }],
    sizes: ['Único'],
    images: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80'
    ],
    isFeatured: false
  },
  {
    id: 'prod-15',
    numericId: 15,
    name: 'UV Metro x 3',
    category: 'UV & vinilo',
    price: 40000,
    priceBase: 40000,
    priceCustom: 40000,
    minQuantity: 3,
    sku: 'M3',
    customizable: true,
    stock: 16,
    tag: 'Para Equipos',
    shortDescription: 'Paquete por 3 metros con tarifa preferencial para marcas.',
    description: 'Producción por volumen para packaging, merchandising y rotulación con entrega en bobina.',
    fit: '3 metros lineales',
    material: 'Bobina UV DTF',
    composition: 'Tintas curadas por lámparas LED UV',
    careInstructions: ['Fijación instantánea en frío'],
    colors: [{ name: 'Personalizado', hex: '#C8102E' }],
    sizes: ['Único'],
    images: [
      'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=1000&q=80'
    ],
    isFeatured: false
  },
  {
    id: 'prod-16',
    numericId: 16,
    name: 'UV Metro x 5',
    category: 'UV & vinilo',
    price: 35000,
    priceBase: 35000,
    priceCustom: 35000,
    minQuantity: 5,
    sku: 'M5',
    customizable: true,
    stock: 28,
    shortDescription: 'Escala mayor para talleres, tiendas y clubes regionales.',
    description: 'Impresión por volumen con control de color estricto y barniz brillante.',
    fit: '5 metros lineales',
    material: 'Bobina UV DTF de alta velocidad',
    composition: 'Alta durabilidad a la fricción',
    careInstructions: ['Almacenar enrollado'],
    colors: [{ name: 'Personalizado', hex: '#C8102E' }],
    sizes: ['Único'],
    images: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80'
    ],
    isFeatured: false
  },
  {
    id: 'prod-17',
    numericId: 17,
    name: 'UV Metro x 10',
    category: 'UV & vinilo',
    price: 30000,
    priceBase: 30000,
    priceCustom: 30000,
    minQuantity: 10,
    sku: 'M10',
    customizable: true,
    stock: 0,
    shortDescription: 'La mejor relación costo/beneficio en transferencias UV.',
    description: '10 metros continuos con archivo armado por el cliente o asistido por CASACAS LB.',
    fit: '10 metros lineales continuos',
    material: 'Bobina UV DTF con descuento mayorista',
    composition: 'Barniz con relieve tridimensional',
    careInstructions: ['Listo para recorte manual o por plotter'],
    colors: [{ name: 'Personalizado', hex: '#C8102E' }],
    sizes: ['Único'],
    images: [
      'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=1000&q=80'
    ],
    isFeatured: false
  },
  {
    id: 'prod-18',
    numericId: 18,
    name: 'Vinilo Sublimado sin corte',
    category: 'UV & vinilo',
    price: 6000,
    priceBase: 6000,
    priceCustom: 6000,
    minQuantity: 1,
    sku: 'VS',
    customizable: true,
    stock: 10,
    shortDescription: 'Lámina sublimable corrida para aplicaciones continuas.',
    description: 'Material para planchado o montaje directo sobre paneles y textiles.',
    fit: 'Metro cuadrado / lineal',
    material: 'Vinilo textil sublimable de alta adherencia',
    composition: 'Base termoactiva',
    careInstructions: ['Temperatura de bajada: 160°C por 15 segundos'],
    colors: [{ name: 'Sublimado Full', hex: '#C8102E' }],
    sizes: ['Único'],
    images: [
      'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=1000&q=80'
    ],
    isFeatured: false
  },
  {
    id: 'prod-19',
    numericId: 19,
    name: 'Vinilo Sublimado con corte',
    category: 'UV & vinilo',
    price: 9000,
    priceBase: 9000,
    priceCustom: 9000,
    minQuantity: 1,
    sku: 'VC2',
    customizable: true,
    stock: 24,
    shortDescription: 'Corte perimetral exacto para números, siluetas y logos.',
    description: 'Vinilo troquelado por plotter de precisión listo para transferir en prenda o accesorio.',
    fit: 'Corte digital con descarte incluido',
    material: 'Vinilo termotransferible troquelado',
    composition: 'Poliuretano textil mate',
    careInstructions: ['Lavar del revés, no aplicar plancha directa'],
    colors: [{ name: 'Troquelado', hex: '#C8102E' }],
    sizes: ['Único'],
    images: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80'
    ],
    isFeatured: false
  },
  {
    id: 'prod-20',
    numericId: 20,
    name: 'Chomba de Algodón',
    category: 'Indumentaria',
    price: 25000,
    priceBase: 25000,
    priceCustom: 35000,
    minQuantity: 10,
    sku: 'CA',
    customizable: true,
    stock: 25,
    tag: 'Para Equipos',
    shortDescription: 'Corte clásico urbano con cuello camisa y tejido suave.',
    description: 'Ideal para uniformes corporativos, staff de eventos y marcas que buscan una presencia formal.',
    fit: 'Regular Fit clásico',
    material: 'Jersey pesado 100% algodón',
    composition: '100% Algodón peinado',
    careInstructions: ['Lavar con agua fría', 'Plancha tibia'],
    colors: [
      { name: 'Negro', hex: '#161616' },
      { name: 'Blanco', hex: '#FFFFFF' },
      { name: 'Azul Marino', hex: '#1A2436' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1000&q=80'
    ],
    isFeatured: false
  },
  {
    id: 'prod-21',
    numericId: 21,
    name: 'Chomba de Piqué',
    category: 'Indumentaria',
    price: 25000,
    priceBase: 25000,
    priceCustom: 35000,
    minQuantity: 10,
    sku: 'CP',
    customizable: true,
    stock: 14,
    shortDescription: 'Tejido de piqué tradicional, fresco y de alta prestancia.',
    description: 'Chomba institucional con puños reforzados y soporte para bordado directo o parche termosellado.',
    fit: 'Piqué Classic Fit',
    material: 'Piqué de algodón peinado con trama nido de abeja',
    composition: '80% Algodón, 20% Poliéster para indeformabilidad',
    careInstructions: ['Lavar del revés', 'Secado en percha'],
    colors: [
      { name: 'Negro Carbón', hex: '#181818' },
      { name: 'Blanco Hueso', hex: '#F0ECE1' },
      { name: 'Rojo Carmín', hex: '#C8102E' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1000&q=80'
    ],
    isFeatured: false
  },
  {
    id: 'prod-22',
    numericId: 22,
    name: 'Bandera 1.40 x 0.90',
    category: 'Banderas',
    price: 29500,
    priceBase: 29500,
    priceCustom: 29500,
    minQuantity: 1,
    sku: 'B1',
    customizable: true,
    stock: 0,
    tag: 'Más vendido',
    shortDescription: 'Tamaño tribuna o cancha con cinta de refuerzo y ojales.',
    description: 'Tela náutica o tafeta pesada sublimada con colores intensos que resisten la intemperie.',
    fit: 'Medida 140 x 90 cm',
    material: 'Tafeta náutica pesada con protección solar',
    composition: '100% Poliéster textil antidesgarro con doble dobladillo',
    careInstructions: ['Lavar en lavarropas con agua fría', 'No centrifugar a altas revoluciones'],
    colors: [{ name: 'Diseño Personalizado', hex: '#C8102E' }],
    sizes: ['Único'],
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=80'
    ],
    isFeatured: true
  },
  {
    id: 'prod-23',
    numericId: 23,
    name: 'Bandera con soporte',
    category: 'Banderas',
    price: 5500,
    priceBase: 5500,
    priceCustom: 55000,
    minQuantity: 1,
    sku: 'BS',
    customizable: true,
    stock: 18,
    shortDescription: 'Estructura portátil desmontable para eventos y exposiciones.',
    description: 'Bandera tipo drop o vela con mástil flexible y base pesada para exterior o interior.',
    fit: 'Altura regulable hasta 2.50m',
    material: 'Mástil de fibra de vidrio y tela sublimada doble faz',
    composition: 'Estructura metálica y fibra con funda transportable',
    careInstructions: ['Desarmar y guardar en su funda acolchada'],
    colors: [{ name: 'Estructura + Impresión', hex: '#1C1C1C' }],
    sizes: ['Único'],
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80'
    ],
    isFeatured: false
  },
  {
    id: 'prod-24',
    numericId: 24,
    name: 'Bombacha de campo',
    category: 'Indumentaria',
    price: 19500,
    priceBase: 19500,
    priceCustom: null,
    minQuantity: 1,
    sku: 'BC',
    customizable: true,
    stock: 32,
    tag: 'Nuevo',
    shortDescription: 'Confección tradicional chaqueña, resistente y cómoda para trabajo.',
    description: 'Prenda de sarga reforzada con doble costura, botón metálico y tiro amplio para movilidad.',
    fit: 'Tiro alto tradicional con pinzas',
    material: 'Sarga de algodón pesada 8 onzas',
    composition: '100% Algodón puro de alta resistencia',
    careInstructions: ['Apta para lavado intensivo'],
    colors: [
      { name: 'Beige Tradicional', hex: '#C2B280' },
      { name: 'Negro Trabajo', hex: '#1C1C1C' },
      { name: 'Verde Campero', hex: '#3B4836' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=85'
    ],
    measurements: [
      { size: 'S', chest: 0, length: 100, waist: 78 },
      { size: 'M', chest: 0, length: 102, waist: 82 },
      { size: 'L', chest: 0, length: 104, waist: 86 },
      { size: 'XL', chest: 0, length: 106, waist: 90 },
      { size: 'XXL', chest: 0, length: 108, waist: 96 }
    ],
    isFeatured: true
  },
  {
    id: 'prod-25',
    numericId: 25,
    name: 'Parche bordado',
    category: 'Accesorios',
    price: 7500,
    priceBase: 7500,
    priceCustom: 7500,
    minQuantity: 7,
    sku: 'PB',
    customizable: true,
    stock: 4,
    tag: 'Para Equipos',
    shortDescription: 'Bordado con relieve y borde reforzado con termoadhesivo.',
    description: 'Escudos, marcas o insignias listas para pegar con calor o coser en camperas, gorras y mochilas.',
    fit: 'Bordado computarizado de alta densidad',
    material: 'Hilo poliéster brillante con base de gabardina',
    composition: 'Termoadhesivo trasero activable con calor',
    careInstructions: ['Planchar 20 segundos con calor fuerte o coser'],
    colors: [
      { name: 'Escudo Personalizado', hex: '#C8102E' }
    ],
    sizes: ['Único'],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80'
    ],
    isFeatured: false
  },
  {
    id: 'prod-26',
    numericId: 26,
    name: 'Remera SPUM Sub completo',
    category: 'Indumentaria',
    price: 22000,
    priceBase: 22000,
    priceCustom: null,
    minQuantity: 7,
    sku: 'SC',
    customizable: true,
    stock: 15,
    tag: 'Más vendido',
    shortDescription: 'Sublimación frente, espalda y mangas con diseño 100% integral.',
    description: 'Confección desde cero con corte y confección posterior al estampado para que no queden pliegues blancos.',
    fit: 'Corte deportivo ergonómico',
    material: 'Microfibra set o Spum sublimable full print',
    composition: '100% Poliéster con tintas importadas sin decoloración',
    careInstructions: ['Lavar en frío', 'No planchar con temperatura excesiva'],
    colors: [
      { name: 'Diseño Total', hex: '#C8102E' },
      { name: 'Negro y Oro', hex: '#161616' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85'
    ],
    measurements: [
      { size: 'S', chest: 51, length: 69 },
      { size: 'M', chest: 54, length: 71 },
      { size: 'L', chest: 57, length: 73 },
      { size: 'XL', chest: 60, length: 75 },
      { size: 'XXL', chest: 63, length: 77 }
    ],
    isFeatured: true
  },
  {
    id: 'prod-27',
    numericId: 27,
    name: 'Remera SPUM Promos',
    category: 'Indumentaria',
    price: 22000,
    priceBase: 22000,
    priceCustom: null,
    minQuantity: 7,
    sku: 'PR',
    customizable: true,
    stock: 8,
    tag: 'Para Equipos',
    shortDescription: 'Pensada para egresados, promociones escolares y peñas.',
    description: 'Paquete especial para grupos con personalización de apodos, números y diseño grupal.',
    fit: 'Oversize / Boxy para promos',
    material: 'Spum pesado suave al tacto',
    composition: '100% Poliéster hilado con tacto algodón',
    careInstructions: ['Ideal para usar toda la temporada'],
    colors: [
      { name: 'Colores de tu Promo', hex: '#C8102E' },
      { name: 'Negro y Flúor', hex: '#1C1C1C' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85'
    ],
    measurements: [
      { size: 'S', chest: 53, length: 70 },
      { size: 'M', chest: 56, length: 72 },
      { size: 'L', chest: 59, length: 74 },
      { size: 'XL', chest: 62, length: 76 },
      { size: 'XXL', chest: 65, length: 78 }
    ],
    isFeatured: true
  }
];

export const categoriesList: CategoryItem[] = [
  {
    name: 'Indumentaria',
    slug: 'Indumentaria',
    count: 9,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Remeras SPUM, algodón peinado, chombas deportivas y bombachas de campo.'
  },
  {
    name: 'Accesorios',
    slug: 'Accesorios',
    count: 5,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Vasos chopp, vasos de aluminio, termos hoppy, gorras trucker y parches.'
  },
  {
    name: 'UV & vinilo',
    slug: 'UV & vinilo',
    count: 11,
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1572025442646-866d16c84a54?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Stickers UV DTF con barniz en relieve, planchas y metros lineales para marcas.'
  },
  {
    name: 'Banderas',
    slug: 'Banderas',
    count: 2,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Banderas de cancha 1.40 x 0.90 y banderas con mástil para eventos.'
  }
];

export const reviewsData = [
  {
    id: 1,
    author: 'Equipo deportivo',
    origin: 'Torneo Regional',
    text: 'La atención, el diseño y el resultado final fueron excelentes. Nos ayudaron a convertir una idea en una identidad para todo el equipo.',
    stars: 5,
    featured: true
  },
  {
    id: 2,
    author: 'Emprendimiento local',
    origin: 'Las Breñas',
    text: 'Nos acompañaron en cada detalle de la estampa UV y los parches. Entrega impecable y a tiempo.',
    stars: 5,
    featured: false
  },
  {
    id: 3,
    author: 'Promoción egresados',
    origin: 'Chaco',
    text: 'Una experiencia simple, cercana y con una prenda que realmente sentimos propia para el grupo.',
    stars: 5,
    featured: false
  }
];
