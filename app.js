/* ==========================================================================
   BELPA BEAUTY & BELFLORA - MOTOR DE TIENDA BOUTIQUE 🌸💖
   Estética Coquette, Delicada y Elegante
   ========================================================================== */

// --- Base de Datos Maestra de Productos ---
const productsCatalog = [
    {
        "id": 1,
        "name": "Ramo Rapunzel Ref 001",
        "category": "TEMÁTICAS & DISNEY",
        "filterCategory": "tematicas",
        "price": "$80,000 COP",
        "rawPrice": 80000,
        "badge": "Princesas 👑",
        "description": "Ramo temático de Rapunzel en limpiapipas artesanales de alta calidad. Incluye: 4 Lirios, 2 Gerberas, 2 Margaritas, 1 Tulipán, 1 Flor gota de sol, 1 Rosa, camaleón Pascal en limpiapipa, follaje y luces LED decorativas.",
        "mediaId": "MAHQOp8EUfM",
        "images": [
            "assets/catalog/item_1_MAHQOp8EUfM.jpg"
        ]
    },
    {
        "id": 2,
        "name": "Ramo Rapunzel Ref 002",
        "category": "TEMÁTICAS & DISNEY",
        "filterCategory": "tematicas",
        "price": "$115,000 COP",
        "rawPrice": 115000,
        "badge": "Princesas 👑",
        "description": "Ramo premium de Rapunzel tejido a mano. Incluye: 1 Lirio, 3 Gerberas, 2 Jazmín, 6 Tulipanes, 1 Flor gota de sol, 1 figura de Pascal artesanal, follaje y luces LED.",
        "mediaId": "MAHShGd7zIc",
        "images": [
            "assets/catalog/item_2_MAHShGd7zIc.jpg"
        ]
    },
    {
        "id": 3,
        "name": "Ramo Cenicienta",
        "category": "TEMÁTICAS & DISNEY",
        "filterCategory": "tematicas",
        "price": "$80,000 COP",
        "rawPrice": 80000,
        "badge": "Princesas 👑",
        "description": "Ramo mágico de Cenicienta con tonos celestes y blancos. Incluye flores artesanales, detalles temáticos de princesa, follaje decorativo y luces LED.",
        "mediaId": "MAHRoxdMUYc",
        "images": [
            "assets/catalog/item_3_MAHRoxdMUYc.jpg"
        ]
    },
    {
        "id": 4,
        "name": "Ramo La Princesa y el Sapo",
        "category": "TEMÁTICAS & DISNEY",
        "filterCategory": "tematicas",
        "price": "$115,000 COP",
        "rawPrice": 115000,
        "badge": "Princesas 👑",
        "description": "Inspirado en Tiana y el pantano mágico. Incluye: 1 Flor de loto, 1 Gerbera, 1 Tulipán, 2 Lirios, 2 ramas de follaje, figura de la luciérnaga Ray en limpiapipas y luces LED.",
        "mediaId": "MAHRowNcbB8",
        "images": [
            "assets/catalog/item_4_MAHRowNcbB8.png"
        ]
    },
    {
        "id": 5,
        "name": "Ramo Lotso Deluxe (7 Tulipanes & Lirios)",
        "category": "RAMOS CON PELUCHES",
        "filterCategory": "peluches",
        "price": "$135,000 COP",
        "rawPrice": 135000,
        "badge": "Peluches 🧸",
        "description": "Hermoso bouquet con peluche Lotso, 7 Tulipanes, 3 Lirios, 1 Lirio especial, 5 ramas de follaje y envoltura de lujo.",
        "mediaId": "MAHQ4CuIp3g",
        "images": [
            "assets/catalog/item_5_MAHQ4CuIp3g.png"
        ]
    },
    {
        "id": 6,
        "name": "Ramo Lotso Rosas & Gerberas",
        "category": "RAMOS CON PELUCHES",
        "filterCategory": "peluches",
        "price": "$110,000 COP",
        "rawPrice": 110000,
        "badge": "Peluches 🧸",
        "description": "Bouquet dulce de 7 Tulipanes, 2 Rosas, 3 Gerberas, follaje y peluche de Lotso con aroma delicioso.",
        "mediaId": "MAHPmj2Tpbk",
        "images": [
            "assets/catalog/item_6_MAHPmj2Tpbk.jpg"
        ]
    },
    {
        "id": 7,
        "name": "Ramo Lotso Clásico (7 Tulipanes)",
        "category": "RAMOS CON PELUCHES",
        "filterCategory": "peluches",
        "price": "$80,000 COP",
        "rawPrice": 80000,
        "badge": "Peluches 🧸",
        "description": "Ramo tierno con peluche de Lotso. Incluye: 7 Tulipanes, ramas de follaje y peluche suave de Lotso.",
        "mediaId": "MAHS1Qb4eEc",
        "images": [
            "assets/catalog/item_7_MAHS1Qb4eEc.jpg"
        ]
    },
    {
        "id": 8,
        "name": "Ramo Lotso Dormilón (Peluche 35 cm)",
        "category": "RAMOS CON PELUCHES",
        "filterCategory": "peluches",
        "price": "$135,000 COP",
        "rawPrice": 135000,
        "badge": "Peluches 🧸",
        "description": "Ramo especial con peluche Lotso de 35 cm. Incluye: 6 Tulipanes, 3 Rosas, 1 Anémona, follaje y peluche grande de Lotso.",
        "mediaId": "MAHS1RY-jEE",
        "images": [
            "assets/catalog/item_8_MAHS1RY-jEE.jpg"
        ]
    },
    {
        "id": 9,
        "name": "Ramo Annita Rosado",
        "category": "RAMOS CON PELUCHES",
        "filterCategory": "peluches",
        "price": "$120,000 COP",
        "rawPrice": 120000,
        "badge": "Peluches 🧸",
        "description": "Tierno ramo en tono Rosado con peluche. Incluye: 6 Tulipanes, 3 Lirios, 2 ramas de follaje y peluche afelpado.",
        "mediaId": "MAHQudzb4eg",
        "images": [
            "assets/catalog/item_9_MAHQudzb4eg.jpg"
        ]
    },
    {
        "id": 10,
        "name": "Ramo Anny 2.0 Rosado Pastel",
        "category": "RAMOS CON PELUCHES",
        "filterCategory": "peluches",
        "price": "$120,000 COP",
        "rawPrice": 120000,
        "badge": "Peluches 🧸",
        "description": "Ramo en tonalidad Rosado Pastel. Incluye: 6 Tulipanes, 3 Lirios, 2 ramas de follaje y peluche delicado.",
        "mediaId": "MAHQ4KYCeEQ",
        "images": [
            "assets/catalog/item_10_MAHQ4KYCeEQ.png"
        ]
    },
    {
        "id": 11,
        "name": "Ramo Anny Ovejita Nude",
        "category": "RAMOS CON PELUCHES",
        "filterCategory": "peluches",
        "price": "$125,000 COP",
        "rawPrice": 125000,
        "badge": "Peluches 🧸",
        "description": "Elegante bouquet en tono Rosado Nude. Incluye: 7 Tulipanes, 3 Lirios, 3 Rosas, follaje y peluche de ovejita ultra suave.",
        "mediaId": "MAHPmncoNSc",
        "images": [
            "assets/catalog/item_11_MAHPmncoNSc.jpg"
        ]
    },
    {
        "id": 12,
        "name": "Ramo My Melody",
        "category": "RAMOS CON PELUCHES",
        "filterCategory": "peluches",
        "price": "$70,000 COP",
        "rawPrice": 70000,
        "badge": "Sanrio 🎀",
        "description": "Inspirado en My Melody. Incluye: 7 Tulipanes tejidos, follaje y peluche original de My Melody.",
        "mediaId": "MAHQOsxcTQs",
        "images": [
            "assets/catalog/item_12_MAHQOsxcTQs.png"
        ]
    },
    {
        "id": 13,
        "name": "Ramo Hello Kitty Ref 001",
        "category": "RAMOS CON PELUCHES",
        "filterCategory": "peluches",
        "price": "$125,000 COP",
        "rawPrice": 125000,
        "badge": "Sanrio 🎀",
        "description": "Precioso ramo de Hello Kitty. Incluye: 5 Tulipanes, 3 Lirios, 3 Gerberas, 2 ramas de follaje y peluche de Hello Kitty.",
        "mediaId": "MAHQaR4F-LI",
        "images": [
            "assets/catalog/item_13_MAHQaR4F-LI.jpg"
        ]
    },
    {
        "id": 14,
        "name": "Ramo Hello Kitty Ref 002 (45 cm)",
        "category": "RAMOS CON PELUCHES",
        "filterCategory": "peluches",
        "price": "$150,000 COP",
        "rawPrice": 150000,
        "badge": "Sanrio 🎀",
        "description": "Gran bouquet con peluche Hello Kitty gigante de 45 cm. Incluye: 10 Tulipanes, 4 Lirios, 1 Gerbera y follaje.",
        "mediaId": "MAHS16mtKgM",
        "images": [
            "assets/catalog/item_14_MAHS16mtKgM.png"
        ]
    },
    {
        "id": 15,
        "name": "Ramo Hello Kitty Ref 003 (6 Tulipanes)",
        "category": "RAMOS CON PELUCHES",
        "filterCategory": "peluches",
        "price": "$70,000 COP",
        "rawPrice": 70000,
        "badge": "Sanrio 🎀",
        "description": "Bouquet tierno de 6 Tulipanes, 2 ramas de follaje y peluche Hello Kitty de 45 cm.",
        "mediaId": "MAHRMue2NRs",
        "images": [
            "assets/catalog/item_15_MAHRMue2NRs.jpg"
        ]
    },
    {
        "id": 16,
        "name": "Ramo Hello Kitty Ref 004 (50 cm)",
        "category": "RAMOS CON PELUCHES",
        "filterCategory": "peluches",
        "price": "$150,000 COP",
        "rawPrice": 150000,
        "badge": "Sanrio 🎀",
        "description": "El regalo supremo para fans de Hello Kitty. Incluye: 5 Tulipanes, 4 Lirios, 2 Gerberas, Margarita mini, follaje y peluche Hello Kitty de 50 cm.",
        "mediaId": "MAHRMuZHRJc",
        "images": [
            "assets/catalog/item_16_MAHRMuZHRJc.jpg"
        ]
    },
    {
        "id": 17,
        "name": "Ramo Snoopy Ref 01",
        "category": "RAMOS CON PELUCHES",
        "filterCategory": "peluches",
        "price": "$78,000 COP",
        "rawPrice": 78000,
        "badge": "Snoopy 🐶",
        "description": "Encantador ramo de 4 Tulipanes, 3 Gerberas, follaje y figura artesanal de Snoopy tejida en limpiapipas.",
        "mediaId": "MAHRo4IM_QY",
        "images": [
            "assets/catalog/item_17_MAHRo4IM_QY.jpg"
        ]
    },
    {
        "id": 18,
        "name": "Ramo Snoopy Ref 02 (12 Tulipanes)",
        "category": "RAMOS CON PELUCHES",
        "filterCategory": "peluches",
        "price": "$70,000 COP",
        "rawPrice": 70000,
        "badge": "Snoopy 🐶",
        "description": "Arreglo primaveral de 12 Tulipanes artesanales, follaje y figura tejida de Snoopy en limpiapipas.",
        "mediaId": "MAHST6bI3dM",
        "images": [
            "assets/catalog/item_18_MAHST6bI3dM.jpg"
        ]
    },
    {
        "id": 19,
        "name": "Ramo Delirio (12 Lirios con Luces & Banda)",
        "category": "LIRIOS",
        "filterCategory": "lirios",
        "price": "$110,000 COP",
        "rawPrice": 110000,
        "badge": "Lirios 🪷",
        "description": "Impactante ramo de 12 Lirios eternos hechos a mano, follaje, banda personalizada con frase y serie de luces LED.",
        "mediaId": "MAHS1lNKdhw",
        "images": [
            "assets/catalog/item_19_MAHS1lNKdhw.jpg"
        ]
    },
    {
        "id": 20,
        "name": "Ramo Belkis Lirios",
        "category": "LIRIOS",
        "filterCategory": "lirios",
        "price": "$90,000 COP",
        "rawPrice": 90000,
        "badge": "Lirios 🪷",
        "description": "Ramo clásico y elegante con 12 Lirios eternos tejidos a mano y fino follaje decorativo.",
        "mediaId": "MAHS14muKlY",
        "images": [
            "assets/catalog/item_20_MAHS14muKlY.png"
        ]
    },
    {
        "id": 21,
        "name": "Ramo Gloria con Luces",
        "category": "LIRIOS",
        "filterCategory": "lirios",
        "price": "$50,000 COP",
        "rawPrice": 50000,
        "badge": "Lirios 🪷",
        "description": "Delicado bouquet de 5 Lirios eternos artesanales, follaje y luces LED decorativas.",
        "mediaId": "MAHS15WkPNM",
        "images": [
            "assets/catalog/item_21_MAHS15WkPNM.png"
        ]
    },
    {
        "id": 22,
        "name": "Ramo Tuli (14 Tulipanes)",
        "category": "TULIPANES",
        "filterCategory": "tulipanes",
        "price": "$65,000 COP",
        "rawPrice": 65000,
        "badge": "Tulipanes 🌷",
        "description": "Bouquet voluminoso y colorido de 14 Tulipanes tejidos a mano con limpiapipas de alta calidad y follaje.",
        "mediaId": "MAHPmp3eA2I",
        "images": [
            "assets/catalog/item_22_MAHPmp3eA2I.jpg"
        ]
    },
    {
        "id": 23,
        "name": "Ramo Belkis Tulipanes (15 Tulipanes)",
        "category": "TULIPANES",
        "filterCategory": "tulipanes",
        "price": "$55,000 COP",
        "rawPrice": 55000,
        "badge": "Tulipanes 🌷",
        "description": "Ramillete dulce y duradero de 15 Tulipanes eternos en combinación de tonos pasteles.",
        "mediaId": "MAHS15aJDEc",
        "images": [
            "assets/catalog/item_23_MAHS15aJDEc.png"
        ]
    },
    {
        "id": 24,
        "name": "Ramo Mila (10 Tulipanes)",
        "category": "TULIPANES",
        "filterCategory": "tulipanes",
        "price": "$50,000 COP",
        "rawPrice": 50000,
        "badge": "Tulipanes 🌷",
        "description": "Ramo coqueto de 10 Tulipanes eternos y ramas de follaje suave.",
        "mediaId": "MAHS1_XlHvk",
        "images": [
            "assets/catalog/item_24_MAHS1_XlHvk.png"
        ]
    },
    {
        "id": 25,
        "name": "Ramo Evelyn Tulipanes & Lirios",
        "category": "TULIPANES",
        "filterCategory": "tulipanes",
        "price": "$70,000 COP",
        "rawPrice": 70000,
        "badge": "Tulipanes 🌷",
        "description": "Hermosa combinación de 7 Tulipanes, 3 Lirios, 6 copitos (flores mini) y follaje.",
        "mediaId": "MAHQW71FD-c",
        "images": [
            "assets/catalog/item_25_MAHQW71FD-c.png"
        ]
    },
    {
        "id": 26,
        "name": "Ramo Lolita (6 Tulisnoopy)",
        "category": "TULIPANES",
        "filterCategory": "tulipanes",
        "price": "$55,000 COP",
        "rawPrice": 55000,
        "badge": "Tulipanes 🌷",
        "description": "Ramo con 6 Tulisnoopy (tulipanes combinados con carita de Snoopy) y follaje decorativo.",
        "mediaId": "MAHS1hLOLCI",
        "images": [
            "assets/catalog/item_26_MAHS1hLOLCI.jpg"
        ]
    },
    {
        "id": 27,
        "name": "Ramo Evelyn Mini Mix",
        "category": "TULIPANES",
        "filterCategory": "tulipanes",
        "price": "$46,000 COP",
        "rawPrice": 46000,
        "badge": "Tulipanes 🌷",
        "description": "Ramo accesible y tierno con 3 Tulipanes, 2 Tulisnoopy, 1 Lirio y follaje.",
        "mediaId": "MAHS1m_fq6s",
        "images": [
            "assets/catalog/item_27_MAHS1m_fq6s.jpg"
        ]
    },
    {
        "id": 28,
        "name": "Ramo Majo (3 Girasoles & 3 Tulipanes)",
        "category": "GIRASOLES",
        "filterCategory": "girasoles",
        "price": "$65,000 COP",
        "rawPrice": 65000,
        "badge": "Girasoles 🌻",
        "description": "Lleno de energía y luz. Incluye: 3 Girasoles grandes, 3 Tulipanes y ramas de follaje.",
        "mediaId": "MAHRiZYz2-Q",
        "images": [
            "assets/catalog/item_28_MAHRiZYz2-Q.jpg"
        ]
    },
    {
        "id": 29,
        "name": "Ramo Yari (2 Girasoles & 2 Tulipanes)",
        "category": "GIRASOLES",
        "filterCategory": "girasoles",
        "price": "$50,000 COP",
        "rawPrice": 50000,
        "badge": "Girasoles 🌻",
        "description": "Detalle radiante de 2 Girasoles y 2 Tulipanes artesanales con follaje verde.",
        "mediaId": "MAHS1jyP-yc",
        "images": [
            "assets/catalog/item_29_MAHS1jyP-yc.jpg"
        ]
    },
    {
        "id": 30,
        "name": "Ramo Luz con Corona & Banda",
        "category": "GIRASOLES",
        "filterCategory": "girasoles",
        "price": "$92,000 COP",
        "rawPrice": 92000,
        "badge": "Girasoles 🌻",
        "description": "Ramo regio de 6 Girasoles eternos, follaje, corona dorada decorativa y banda floral con frase personalizada.",
        "mediaId": "MAHS1gXeVI0",
        "images": [
            "assets/catalog/item_30_MAHS1gXeVI0.jpg"
        ]
    },
    {
        "id": 31,
        "name": "Ramo Sol (7 Girasoles Mini)",
        "category": "GIRASOLES",
        "filterCategory": "girasoles",
        "price": "$60,000 COP",
        "rawPrice": 60000,
        "badge": "Girasoles 🌻",
        "description": "Ramo alegre compuesto por 7 Girasoles mini y follaje natural decorativo.",
        "mediaId": "MAHS2HJml-s",
        "images": [
            "assets/catalog/item_31_MAHS2HJml-s.png"
        ]
    },
    {
        "id": 32,
        "name": "Ramo Dariana (6 Gerberas & 6 Tulipanes)",
        "category": "GERBERAS",
        "filterCategory": "gerberas",
        "price": "$65,000 COP",
        "rawPrice": 65000,
        "badge": "Gerberas 🌸",
        "description": "Colorido ramo que reúne 6 Gerberas y 6 Tulipanes tejidos a mano con follaje.",
        "mediaId": "MAHS2IldEgw",
        "images": [
            "assets/catalog/item_32_MAHS2IldEgw.png"
        ]
    },
    {
        "id": 33,
        "name": "Ramo Jasley (12 Gerberas)",
        "category": "GERBERAS",
        "filterCategory": "gerberas",
        "price": "$75,000 COP",
        "rawPrice": 75000,
        "badge": "Gerberas 🌸",
        "description": "Abundante bouquet de 12 Gerberas eternas en paleta vibrante de colores y follaje.",
        "mediaId": "MAHS2PRaE_E",
        "images": [
            "assets/catalog/item_33_MAHS2PRaE_E.png"
        ]
    },
    {
        "id": 34,
        "name": "Ramo Yenni con Lavandas",
        "category": "RAMOS PRIMAVERA",
        "filterCategory": "primavera",
        "price": "$60,000 COP",
        "rawPrice": 60000,
        "badge": "Primavera 💐",
        "description": "Delicada armonía de 6 Tulipanes, 3 Lirios, 2 ramitas de Lavanda aromática y follaje.",
        "mediaId": "MAHS1mDKXcg",
        "images": [
            "assets/catalog/item_34_MAHS1mDKXcg.jpg"
        ]
    },
    {
        "id": 35,
        "name": "Ramo Evelyn Gran Primavera",
        "category": "RAMOS PRIMAVERA",
        "filterCategory": "primavera",
        "price": "$115,000 COP",
        "rawPrice": 115000,
        "badge": "Primavera 💐",
        "description": "El arreglo primaveral más completo: 7 Tulipanes, 3 Lirios, 2 Girasoles, 2 Gerberas, 2 Margaritas, 1 Anémona y follaje.",
        "mediaId": "MAHS1vHW5rE",
        "images": [
            "assets/catalog/item_35_MAHS1vHW5rE.jpg"
        ]
    },
    {
        "id": 36,
        "name": "Ramo Floral",
        "category": "RAMOS PRIMAVERA",
        "filterCategory": "primavera",
        "price": "$70,000 COP",
        "rawPrice": 70000,
        "badge": "Primavera 💐",
        "description": "Hermosa combinación de 4 Tulipanes, 4 Lirios, 2 Margaritas, 2 Gerberas y ramas de follaje.",
        "mediaId": "MAHPmkuxQdY",
        "images": [
            "assets/catalog/item_36_MAHPmkuxQdY.jpg"
        ]
    },
    {
        "id": 37,
        "name": "Ramo Lili",
        "category": "RAMOS PRIMAVERA",
        "filterCategory": "primavera",
        "price": "$55,000 COP",
        "rawPrice": 55000,
        "badge": "Primavera 💐",
        "description": "Ramo balanceado de 3 Tulipanes, 4 Lirios y follaje decorativo.",
        "mediaId": "MAHS1hpx7Ks",
        "images": [
            "assets/catalog/item_37_MAHS1hpx7Ks.jpg"
        ]
    },
    {
        "id": 38,
        "name": "Ramo Van Gogh",
        "category": "RAMOS PRIMAVERA",
        "filterCategory": "primavera",
        "price": "$75,000 COP",
        "rawPrice": 75000,
        "badge": "Inspiración 🎨",
        "description": "Inspirado en la paleta de colores de Vincent Van Gogh. Incluye: 7 Tulipanes, 1 Girasol, 2 Gerberas y follaje.",
        "mediaId": "MAHQOl9WAv4",
        "images": [
            "assets/catalog/item_38_MAHQOl9WAv4.jpg"
        ]
    },
    {
        "id": 39,
        "name": "Ramo Moli",
        "category": "RAMOS PRIMAVERA",
        "filterCategory": "primavera",
        "price": "$75,000 COP",
        "rawPrice": 75000,
        "badge": "Primavera 💐",
        "description": "Bouquet dulce y fresco con 7 Tulipanes, 2 Lirios y follaje.",
        "mediaId": "MAHPmqpV1sY",
        "images": [
            "assets/catalog/item_39_MAHPmqpV1sY.jpg"
        ]
    },
    {
        "id": 40,
        "name": "Ramo Tamy (8 Tulipanes & 8 Lirios)",
        "category": "RAMOS PRIMAVERA",
        "filterCategory": "primavera",
        "price": "$100,000 COP",
        "rawPrice": 100000,
        "badge": "Primavera 💐",
        "description": "Gran bouquet de 8 Tulipanes y 8 Lirios eternos con envoltura de satín de lujo.",
        "mediaId": "MAHNZFjOzxA",
        "images": [
            "assets/catalog/item_40_MAHNZFjOzxA.jpg"
        ]
    },
    {
        "id": 41,
        "name": "Ramo Love (Rosas, Tulipanes & Girasol)",
        "category": "RAMOS PRIMAVERA",
        "filterCategory": "primavera",
        "price": "$70,000 COP",
        "rawPrice": 70000,
        "badge": "Romance 💕",
        "description": "Ramo romántico de 5 Tulipanes, 1 Girasol, 5 Rosas eternas y follaje.",
        "mediaId": "MAHNaRFaFjE",
        "images": [
            "assets/catalog/item_41_MAHNaRFaFjE.jpg"
        ]
    },
    {
        "id": 42,
        "name": "Ramo Mía",
        "category": "RAMOS PRIMAVERA",
        "filterCategory": "primavera",
        "price": "$45,000 COP",
        "rawPrice": 45000,
        "badge": "Primavera 💐",
        "description": "Mix primaveral: 1 Girasol, 1 Lirio, 1 Margarita, 1 Capullo, 1 Anémona, 2 Gerberas y follaje.",
        "mediaId": "MAHIuBIvVmQ",
        "images": [
            "assets/catalog/item_42_MAHIuBIvVmQ.jpg"
        ]
    },
    {
        "id": 43,
        "name": "Ramo Beth con Hortensia",
        "category": "RAMOS PRIMAVERA",
        "filterCategory": "primavera",
        "price": "$95,000 COP",
        "rawPrice": 95000,
        "badge": "Primavera 💐",
        "description": "Arreglo exclusivo de 2 Lirios, 2 Gerberas, 2 Anémonas, 2 Rosas, 2 Tulipanes, 1 Hortensia y follaje.",
        "mediaId": "MAHS2MZ2ubY",
        "images": [
            "assets/catalog/item_43_MAHS2MZ2ubY.jpg"
        ]
    },
    {
        "id": 44,
        "name": "Ramo Ashley",
        "category": "RAMOS PRIMAVERA",
        "filterCategory": "primavera",
        "price": "$55,000 COP",
        "rawPrice": 55000,
        "badge": "Primavera 💐",
        "description": "Ramillete dulce con 7 Tulipanes, 2 Gerberas, 1 Lirio y follaje.",
        "mediaId": "MAHQaUTpCPQ",
        "images": [
            "assets/catalog/item_44_MAHQaUTpCPQ.jpg"
        ]
    },
    {
        "id": 45,
        "name": "Ramo Thalía",
        "category": "RAMOS PRIMAVERA",
        "filterCategory": "primavera",
        "price": "$55,000 COP",
        "rawPrice": 55000,
        "badge": "Primavera 💐",
        "description": "Incluye: 2 Lirios, 2 Gerberas, 1 Girasol, 1 Tulipán, 1 Capullo y follaje.",
        "mediaId": "MAHQcrNeUCI",
        "images": [
            "assets/catalog/item_45_MAHQcrNeUCI.png"
        ]
    },
    {
        "id": 46,
        "name": "Ramo Jess con Espejo",
        "category": "FLORES CON ESPEJO",
        "filterCategory": "espejos",
        "price": "$110,000 COP",
        "rawPrice": 110000,
        "badge": "Con Espejo 🪞",
        "description": "Innovador arreglo sobre espejo decorativo. Incluye: 2 Lirios, 1 Margarita, 1 Gerbera, 2 Tulipanes, 1 Girasol mini, 1 Rosa, follaje y espejo incorporado.",
        "mediaId": "MAHQcxF-Omg",
        "images": [
            "assets/catalog/item_46_MAHQcxF-Omg.png"
        ]
    },
    {
        "id": 47,
        "name": "Ramo Juli con Espejo",
        "category": "FLORES CON ESPEJO",
        "filterCategory": "espejos",
        "price": "$105,000 COP",
        "rawPrice": 105000,
        "badge": "Con Espejo 🪞",
        "description": "Diseño elegante con espejo: 2 Tulipanes, 1 Girasol mini, 1 Gerbera, 3 Lirios, 1 Margarita, follaje y espejo.",
        "mediaId": "MAHQc4kU0J0",
        "images": [
            "assets/catalog/item_47_MAHQc4kU0J0.png"
        ]
    },
    {
        "id": 48,
        "name": "Ramo Cecilia con Espejo",
        "category": "FLORES CON ESPEJO",
        "filterCategory": "espejos",
        "price": "$95,000 COP",
        "rawPrice": 95000,
        "badge": "Con Espejo 🪞",
        "description": "Incluye: 3 Lirios, 1 Margarita, 2 Gerberas, 1 Tulipán, 1 Girasol, 1 Girasol mini, follaje y espejo.",
        "mediaId": "MAHQcw8Hnw8",
        "images": [
            "assets/catalog/item_48_MAHQcw8Hnw8.png"
        ]
    },
    {
        "id": 49,
        "name": "Ramo Romy (9 Gerberas con Espejo)",
        "category": "FLORES CON ESPEJO",
        "filterCategory": "espejos",
        "price": "$85,000 COP",
        "rawPrice": 85000,
        "badge": "Con Espejo 🪞",
        "description": "Hermoso conjunto de 9 Gerberas eternas montadas con espejo decorativo y follaje.",
        "mediaId": "MAHQcxvnl8s",
        "images": [
            "assets/catalog/item_49_MAHQcxvnl8s.png"
        ]
    },
    {
        "id": 50,
        "name": "Cápsula Girasol Grande",
        "category": "CÁPSULAS DE CRISTAL",
        "filterCategory": "capsulas",
        "price": "$40,000 COP",
        "rawPrice": 40000,
        "badge": "Cúpula Cristal 🔮",
        "description": "Cápsula de cristal fino con 1 Girasol artesanal grande en base de madera decorativa.",
        "mediaId": "MAHQW-0A_E8",
        "images": [
            "assets/catalog/item_50_MAHQW-0A_E8.png"
        ]
    },
    {
        "id": 51,
        "name": "Cápsula Girasol Mini",
        "category": "CÁPSULAS DE CRISTAL",
        "filterCategory": "capsulas",
        "price": "$16,000 COP",
        "rawPrice": 16000,
        "badge": "Mini Cúpula 🔮",
        "description": "Cápsula compacta con 1 Girasol mini tejido a mano, ideal para escritorio o detalle sorpresa.",
        "mediaId": "MAHQW_SOR_o",
        "images": [
            "assets/catalog/item_51_MAHQW_SOR_o.png"
        ]
    },
    {
        "id": 52,
        "name": "Cápsula Girasol con Luces LED",
        "category": "CÁPSULAS DE CRISTAL",
        "filterCategory": "capsulas",
        "price": "$40,000 COP",
        "rawPrice": 40000,
        "badge": "Con Luces ✨",
        "description": "Cápsula de cristal con Girasol grande, base y luces LED a pila que crean una atmósfera mágica de noche.",
        "mediaId": "MAHQW9Qr7Yc",
        "images": [
            "assets/catalog/item_52_MAHQW9Qr7Yc.png"
        ]
    },
    {
        "id": 53,
        "name": "Cápsula Rapunzel Flor Fulgor",
        "category": "CÁPSULAS DE CRISTAL",
        "filterCategory": "capsulas",
        "price": "$45,000 COP",
        "rawPrice": 45000,
        "badge": "Princesas 👑",
        "description": "Inspirada en la Flor Dorada de Rapunzel. Incluye cúpula de cristal, flor fulgor tejida y luces LED a pila.",
        "mediaId": "MAHQWx9ZlBE",
        "images": [
            "assets/catalog/item_53_MAHQWx9ZlBE.png"
        ]
    },
    {
        "id": 54,
        "name": "Cápsula Love (Rosa Grande)",
        "category": "CÁPSULAS DE CRISTAL",
        "filterCategory": "capsulas",
        "price": "$35,000 COP",
        "rawPrice": 35000,
        "badge": "Cúpula Cristal 🔮",
        "description": "Cápsula de cristal con 1 Rosa eterna grande de crochet artesanal.",
        "mediaId": "MAHQW1udt2g",
        "images": [
            "assets/catalog/item_54_MAHQW1udt2g.png"
        ]
    },
    {
        "id": 55,
        "name": "Cápsula Rouse Triple (3 Rosas)",
        "category": "CÁPSULAS DE CRISTAL",
        "filterCategory": "capsulas",
        "price": "$60,000 COP",
        "rawPrice": 60000,
        "badge": "Cúpula Cristal 🔮",
        "description": "Cápsula de cristal con 3 Rosas eternas combinadas en tonos románticos.",
        "mediaId": "MAHQWw6P6m4",
        "images": [
            "assets/catalog/item_55_MAHQWw6P6m4.png"
        ]
    },
    {
        "id": 56,
        "name": "Cápsula Pink (Rosa Preservada)",
        "category": "CÁPSULAS DE CRISTAL",
        "filterCategory": "capsulas",
        "price": "$55,000 COP",
        "rawPrice": 55000,
        "badge": "Preservadas 🌸",
        "description": "Cápsula de cristal de lujo con Rosa rosada grande preservada de larga duración.",
        "mediaId": "MAHQWzuw9OQ",
        "images": [
            "assets/catalog/item_56_MAHQWzuw9OQ.png"
        ]
    },
    {
        "id": 57,
        "name": "Cápsula Rosa Amarilla Preservada",
        "category": "CÁPSULAS DE CRISTAL",
        "filterCategory": "capsulas",
        "price": "$55,000 COP",
        "rawPrice": 55000,
        "badge": "Preservadas 💛",
        "description": "Cápsula de cristal con Rosa amarilla grande preservada que simboliza alegría y luz eterna.",
        "mediaId": "MAHQW6wxDo4",
        "images": [
            "assets/catalog/item_57_MAHQW6wxDo4.png"
        ]
    },
    {
        "id": 58,
        "name": "Bouquet Ramo Enredados con Hello Kitty",
        "category": "BOUQUETS",
        "filterCategory": "bouquets",
        "price": "$85,000 COP",
        "rawPrice": 85000,
        "badge": "Bouquet 🎀",
        "description": "Bouquet temático con 2 Lirios, 5 Tulipanes, follaje y peluche de Hello Kitty.",
        "mediaId": "MAHPRzSttpY",
        "images": [
            "assets/catalog/item_58_MAHPRzSttpY.jpg"
        ]
    },
    {
        "id": 59,
        "name": "Bouquet Ramo Ashley con Peluche",
        "category": "BOUQUETS",
        "filterCategory": "bouquets",
        "price": "$73,000 COP",
        "rawPrice": 73000,
        "badge": "Bouquet 🎀",
        "description": "Bouquet primaveral con 3 Tulipanes, 1 Gerbera, 1 Rosa, 1 Anémona, follaje y peluche tierno.",
        "mediaId": "MAHQbeC55WU",
        "images": [
            "assets/catalog/item_59_MAHQbeC55WU.jpg"
        ]
    },
    {
        "id": 60,
        "name": "Cuadro Eterno Mía",
        "category": "CUADROS ETERNOS",
        "filterCategory": "cuadros",
        "price": "$44,000 COP",
        "rawPrice": 44000,
        "badge": "Cuadros 🖼️",
        "description": "Cuadro decorativo 3D con flores eternas, luces LED integradas y frase personalizada a elección.",
        "mediaId": "MAHQXPO_784",
        "images": [
            "assets/catalog/item_60_MAHQXPO_784.png"
        ]
    },
    {
        "id": 61,
        "name": "Cuadro Eterno Sol",
        "category": "CUADROS ETERNOS",
        "filterCategory": "cuadros",
        "price": "$45,000 COP",
        "rawPrice": 45000,
        "badge": "Cuadros 🖼️",
        "description": "Cuadro con composición de girasoles y flores amarillas, luces LED y dedicatoria personalizada.",
        "mediaId": "MAHQXMNSJy0",
        "images": [
            "assets/catalog/item_61_MAHQXMNSJy0.png"
        ]
    },
    {
        "id": 62,
        "name": "Cuadro Eterno Lía",
        "category": "CUADROS ETERNOS",
        "filterCategory": "cuadros",
        "price": "$50,000 COP",
        "rawPrice": 50000,
        "badge": "Cuadros 🖼️",
        "description": "Hermoso cuadro de fondo pastel con ramo de flores de crochet en relieve, luces cálidas y dedicatoria.",
        "mediaId": "MAHQXK9ApYM",
        "images": [
            "assets/catalog/item_62_MAHQXK9ApYM.png"
        ]
    },
    {
        "id": 63,
        "name": "Cuadro Eterno Antonella",
        "category": "CUADROS ETERNOS",
        "filterCategory": "cuadros",
        "price": "$35,000 COP",
        "rawPrice": 35000,
        "badge": "Cuadros 🖼️",
        "description": "Cuadro compacto de flores eternas con luces LED y mensaje personalizado para esa persona especial.",
        "mediaId": "MAHQXBS9UAw",
        "images": [
            "assets/catalog/item_63_MAHQXBS9UAw.png"
        ]
    },
    {
        "id": 64,
        "name": "Materito Carli",
        "category": "MATERITOS & JARRONES",
        "filterCategory": "materitos",
        "price": "$14,000 COP",
        "rawPrice": 14000,
        "badge": "Materito 🪴",
        "description": "Materito artesanal con flor tejida en limpiapipas, perfecto para decoración de escritorio o repisa.",
        "mediaId": "MAHQck5nZrI",
        "images": [
            "assets/catalog/item_64_MAHQck5nZrI.png"
        ]
    },
    {
        "id": 65,
        "name": "Jarrón de Vidrio Blanca",
        "category": "MATERITOS & JARRONES",
        "filterCategory": "materitos",
        "price": "$95,000 COP",
        "rawPrice": 95000,
        "badge": "Jarrón Lujo 🏺",
        "description": "Elegante jarrón de vidrio con arreglo floral completo de flores eternas tejidas a mano.",
        "mediaId": "MAHQcoXs6oo",
        "images": [
            "assets/catalog/item_65_MAHQcoXs6oo.png"
        ]
    },
    {
        "id": 66,
        "name": "Materito Belinda",
        "category": "MATERITOS & JARRONES",
        "filterCategory": "materitos",
        "price": "$15,000 COP",
        "rawPrice": 15000,
        "badge": "Materito 🪴",
        "description": "Materito decorativo con flor de crochet en maceta miniatura.",
        "mediaId": "MAHQcku9IYs",
        "images": [
            "assets/catalog/item_66_MAHQcku9IYs.png"
        ]
    },
    {
        "id": 67,
        "name": "Materito Roxi",
        "category": "MATERITOS & JARRONES",
        "filterCategory": "materitos",
        "price": "$18,000 COP",
        "rawPrice": 18000,
        "badge": "Materito 🪴",
        "description": "Materito artesanal con diseño floral especial en maceta de color pastel.",
        "mediaId": "MAHQcmSBWVg",
        "images": [
            "assets/catalog/item_67_MAHQcmSBWVg.png"
        ]
    },
    {
        "id": 68,
        "name": "Figurita Vaquita Lola",
        "category": "FIGURITAS",
        "filterCategory": "figuritas",
        "price": "$40,000 COP",
        "rawPrice": 40000,
        "badge": "Figuritas ✨",
        "description": "Figura coleccionable de la Vaquita Lola modelada artesanalmente con limpiapipas de alta suavidad.",
        "mediaId": "MAHQcwpIBq8",
        "images": [
            "assets/catalog/item_68_MAHQcwpIBq8.png"
        ]
    },
    {
        "id": 69,
        "name": "Figurita Pingüi",
        "category": "FIGURITAS",
        "filterCategory": "figuritas",
        "price": "$30,000 COP",
        "rawPrice": 30000,
        "badge": "Figuritas ✨",
        "description": "Adorable pingüinito artesanal hecho 100% a mano con limpiapipas.",
        "mediaId": "MAHQrZJuXQU",
        "images": [
            "assets/catalog/item_69_MAHQrZJuXQU.jpg"
        ]
    },
    {
        "id": 70,
        "name": "Figurita Snoopy",
        "category": "FIGURITAS",
        "filterCategory": "figuritas",
        "price": "$40,000 COP",
        "rawPrice": 40000,
        "badge": "Snoopy 🐶",
        "description": "Figura 3D de Snoopy en limpiapipas, con detalles tiernos y base decorativa.",
        "mediaId": "MAHQrYgr7ZY",
        "images": [
            "assets/catalog/item_70_MAHQrYgr7ZY.jpg"
        ]
    },
    {
        "id": 71,
        "name": "Figurita Hombre Araña (Spider-Man)",
        "category": "FIGURITAS",
        "filterCategory": "figuritas",
        "price": "$25,000 COP",
        "rawPrice": 25000,
        "badge": "Marvel 🕷️",
        "description": "Figura flexible y detallada de Spider-Man hecha a mano con limpiapipas rojo y azul.",
        "mediaId": "MAHRNDSL_Lc",
        "images": [
            "assets/catalog/item_71_MAHRNDSL_Lc.jpg"
        ]
    },
    {
        "id": 72,
        "name": "Figurita Virgen de Guadalupe",
        "category": "FIGURITAS",
        "filterCategory": "figuritas",
        "price": "$40,000 COP",
        "rawPrice": 40000,
        "badge": "Especial 🕊️",
        "description": "Hermosa representación artesanal de la Virgen de Guadalupe con manto estrellado y aureola dorada.",
        "mediaId": "MAHST6fgGYw",
        "images": [
            "assets/catalog/item_72_MAHST6fgGYw.jpg"
        ]
    },
    {
        "id": 73,
        "name": "Figurita Rapunzel",
        "category": "FIGURITAS",
        "filterCategory": "figuritas",
        "price": "$45,000 COP",
        "rawPrice": 45000,
        "badge": "Princesas 👑",
        "description": "Figura de Rapunzel con su largo cabello dorado trenzado con florecitas y vestido lila.",
        "mediaId": "MAHS2PEK93E",
        "images": [
            "assets/catalog/item_73_MAHS2PEK93E.jpg"
        ]
    },
    {
        "id": 74,
        "name": "Llavero Gerbera Artesanal",
        "category": "LLAVEROS",
        "filterCategory": "llaveros",
        "price": "$15,000 COP",
        "rawPrice": 15000,
        "badge": "Llaveros 🔑",
        "description": "Lindo llavero con gerbera tejida a mano y herraje resistente para tus llaves, bolso o morral.",
        "mediaId": "MAHS2NuSbvY",
        "images": [
            "assets/catalog/item_74_MAHS2NuSbvY.jpg"
        ]
    },
    {
        "id": 75,
        "name": "Kit de Skincare Rutina Completa",
        "category": "CUIDADO FACIAL",
        "filterCategory": "skincare",
        "price": "$38,000 COP",
        "rawPrice": 38000,
        "badge": "Viral 🔥",
        "description": "El set definitivo para el cuidado facial diario. Incluye gel limpiador suave, tónico equilibrante y crema hidratante iluminadora para dejar la piel fresca, suave y protegida.",
        "images": [
            "assets/product_2.jpg"
        ]
    },
    {
        "id": 76,
        "name": "Combo Moño Satín & Lip Gloss Trend",
        "category": "ACCESORIOS Y LABIOS",
        "filterCategory": "accesorios",
        "price": "$22,000 COP",
        "rawPrice": 22000,
        "badge": "Nuevo 🎀",
        "description": "El kit ideal de moños elegantes estilo satín combinados con brillo labial ultra hidratante. Perfecto para añadir un toque tierno a tu look diario.",
        "images": [
            "assets/product_3.jpg"
        ]
    },
    {
        "id": 77,
        "name": "Sheglam Lip Gloss Sparkling",
        "category": "MAQUILLAJE LABIOS",
        "filterCategory": "maquillaje",
        "price": "$18,000 COP",
        "rawPrice": 18000,
        "badge": "Best Seller ⭐",
        "description": "Brillo labial viral con micro-destellos de purpurina que reflejan la luz de manera espectacular. Proporciona hidratación profunda y volumen óptico sin sensación pegajosa.",
        "images": [
            "assets/product_4.jpg"
        ]
    },
    {
        "id": 78,
        "name": "Pestañina Prosa 4 en 1 Waterproof",
        "category": "MAQUILLAJE OJOS",
        "filterCategory": "maquillaje",
        "price": "$12,000 COP",
        "rawPrice": 12000,
        "badge": "Básico 👀",
        "description": "Fórmula profesional de larga duración resistente al agua. Enriquecida con aceites naturales de hueso de mamey, sábila, jojoba y germen de trigo.",
        "images": [
            "assets/product_5.jpg"
        ]
    },
    {
        "id": 79,
        "name": "Alissha Jelly Blush Tinta Rubor",
        "category": "MAQUILLAJE MEJILLAS",
        "filterCategory": "maquillaje",
        "price": "$15,000 COP",
        "rawPrice": 15000,
        "badge": "Nuevo Rubor 🍮",
        "description": "Divertido rubor y tinta multiusos con una textura jelly gelatinosa única. Es sumamente fácil de difuminar, refresca tu piel y aporta una tinta de larga duración.",
        "images": [
            "assets/product_6.jpg"
        ]
    }
];
const fullCatalog = productsCatalog;

// ============================================================
// CONFIGURACIÓN DE REELS DE INSTAGRAM / INSPIRACIÓN 🌸✨
// ¡Aquí puedes agregar o cambiar fácilmente las URLs de tus Reels oficiales!
// ============================================================
const instagramConfig = {
    profileUrl: "https://www.instagram.com/belflora.co", // URL oficial de tu perfil de Instagram
    reels: [
        {
            id: 1,
            title: "Proceso de Rosas Eternas",
            tag: "🌹 Hecho a Mano",
            // 👉 Pega aquí la URL oficial de tu Reel de Instagram (ej: "https://www.instagram.com/reel/Cxxxxxx/"):
            reelUrl: "https://www.instagram.com/belflora.co",
            previewImage: "assets/hero_main.jpg",
            caption: "Moldeando cada pétalo a mano con limpiapipas suaves y dedicación ✨"
        },
        {
            id: 2,
            title: "Unboxing de Regalos & Luces",
            tag: "🎁 Empaque & Regalos",
            // 👉 Pega aquí la URL oficial de tu Reel de Instagram:
            reelUrl: "https://www.instagram.com/belflora.co",
            previewImage: "assets/product_1.jpg",
            caption: "Cajitas perfumadas con viruta de colores y series LED cálidas 🎀"
        },
        {
            id: 3,
            title: "Colección Temática Rapunzel",
            tag: "👑 Disney & Peluches",
            // 👉 Pega aquí la URL oficial de tu Reel de Instagram:
            reelUrl: "https://www.instagram.com/belflora.co",
            previewImage: "assets/catalog/item_1_MAHQOp8EUfM.jpg",
            caption: "Detalles mágicos inspirados en princesas y flores fulgor doradas 🌸"
        },
        {
            id: 4,
            title: "Maquillaje Viral & Tendencias",
            tag: "💄 Cosméticos & Belleza",
            // 👉 Pega aquí la URL oficial de tu Reel de Instagram:
            reelUrl: "https://www.instagram.com/belflora.co",
            previewImage: "assets/product_4.jpg",
            caption: "Brillos con microdestellos y tintas para tu rutina diaria 💕"
        }
    ]
};

window.belpaInstagramConfig = instagramConfig;


// Mapa de productos por ID para acceso rápido
const productsMap = {};
fullCatalog.forEach(p => { productsMap[p.id] = p; });

const whatsappLinkBase = 'https://wa.me/message/Z4TVXHB3UPMRI1';

// Estado global de la aplicación
let currentCategory = 'all';
let currentSearch = '';
let cart = [];

// Cargar carrito desde localStorage
try {
    const savedCart = localStorage.getItem('belpa_cart_v2');
    if (savedCart) cart = JSON.parse(savedCart);
} catch (e) {
    cart = [];
}

function saveCart() {
    try {
        localStorage.setItem('belpa_cart_v2', JSON.stringify(cart));
    } catch (e) {}
    updateCartBadge();
    renderCartDrawer();
}

// Formateador de moneda en Pesos Colombianos (COP)
function formatCOP(number) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    }).format(number);
}

// Notificación Toast flotante
function showToast(message, icon = '🌸') {
    let toast = document.getElementById('belpa-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'belpa-toast';
        toast.className = 'belpa-toast';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="toast-icon">${icon}</span> <span class="toast-msg">${message}</span>`;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Menú Móvil
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-open');
            mobileMenuBtn.classList.toggle('open');
        });

        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('mobile-open');
                mobileMenuBtn.classList.remove('open');
            });
        });
    }

    // 2. Cabecera Shrink en Scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('shrink');
        } else {
            header.classList.remove('shrink');
        }
    });

    // 3. Inicializaciones
    renderCategoryFilters();
    renderProducts();
    initSearch();
    initCartSystem();
    initQuickViewModal();
    initFAQ();
    initMascot();
    initContactForm();
    initSparkles();
    initInstagramReels();
    initThreeJS();
});

// Helper para categorización
function matchProductCategory(product, catId) {
    if (catId === 'all') return true;
    if (catId === 'rosas_ramos') {
        return ['tulipanes', 'girasoles', 'lirios', 'gerberas', 'primavera', 'bouquets'].includes(product.filterCategory);
    }
    if (catId === 'tematicas') {
        return ['tematicas', 'peluches'].includes(product.filterCategory);
    }
    if (catId === 'capsulas_cuadros') {
        return ['capsulas', 'cuadros', 'espejos'].includes(product.filterCategory);
    }
    if (catId === 'materitos_figuras') {
        return ['materitos', 'figuritas', 'llaveros'].includes(product.filterCategory);
    }
    if (catId === 'maquillaje') {
        return ['maquillaje', 'skincare', 'accesorios'].includes(product.filterCategory);
    }
    return product.filterCategory === catId;
}

// --- FILTROS DE CATEGORÍA ELEGANTES & COQUETTE ---
function renderCategoryFilters() {
    const categoriesContainer = document.getElementById('visual-categories-container');
    if (!categoriesContainer) return;

    const categories = [
        { id: 'all', name: 'Todos', icon: '🌸', count: fullCatalog.length },
        { id: 'rosas_ramos', name: 'Rosas & Ramos Eternos', icon: '🌹', count: fullCatalog.filter(p => matchProductCategory(p, 'rosas_ramos')).length },
        { id: 'tematicas', name: 'Disney & Peluches', icon: '👑', count: fullCatalog.filter(p => matchProductCategory(p, 'tematicas')).length },
        { id: 'capsulas_cuadros', name: 'Cápsulas & Cuadros 3D', icon: '🔮', count: fullCatalog.filter(p => matchProductCategory(p, 'capsulas_cuadros')).length },
        { id: 'materitos_figuras', name: 'Materitos & Figuras', icon: '🪴', count: fullCatalog.filter(p => matchProductCategory(p, 'materitos_figuras')).length },
        { id: 'maquillaje', name: 'Maquillaje & Belleza', icon: '💄', count: fullCatalog.filter(p => matchProductCategory(p, 'maquillaje')).length }
    ];

    categoriesContainer.innerHTML = categories.map(cat => `
        <div class="category-circle-card ${currentCategory === cat.id ? 'active' : ''}" data-filter="${cat.id}">
            <span class="circle-icon-bg">${cat.icon}</span>
            <span>${cat.name}</span>
            <small class="cat-count">(${cat.count})</small>
        </div>
    `).join('');

    categoriesContainer.querySelectorAll('.category-circle-card').forEach(card => {
        card.addEventListener('click', () => {
            categoriesContainer.querySelectorAll('.category-circle-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            currentCategory = card.getAttribute('data-filter');
            renderProducts();
        });
    });
}

// --- BUSCADOR EN TIEMPO REAL ---
function initSearch() {
    const searchInput = document.getElementById('catalog-search-input');
    const searchClear = document.getElementById('catalog-search-clear');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase().trim();
        if (searchClear) {
            searchClear.style.display = currentSearch ? 'flex' : 'none';
        }
        renderProducts();
    });

    if (searchClear) {
        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            currentSearch = '';
            searchClear.style.display = 'none';
            searchInput.focus();
            renderProducts();
        });
    }
}

// --- RENDERIZADO DE PRODUCTOS ---
function renderProducts() {
    const grid = document.getElementById('product-grid');
    const countEl = document.getElementById('products-count-badge');
    if (!grid) return;

    let filtered = fullCatalog.filter(p => {
        const matchCategory = matchProductCategory(p, currentCategory);
        const matchSearch = !currentSearch || 
            p.name.toLowerCase().includes(currentSearch) || 
            p.category.toLowerCase().includes(currentSearch) || 
            p.description.toLowerCase().includes(currentSearch) ||
            p.price.toLowerCase().includes(currentSearch);

        return matchCategory && matchSearch;
    });

    if (countEl) {
        countEl.textContent = `Mostrando ${filtered.length} de ${fullCatalog.length} productos`;
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="empty-catalog-state">
                <div class="empty-icon">🌸🔍</div>
                <h3>No encontramos productos para "${currentSearch}"</h3>
                <p>Intenta con otra palabra como "Rapunzel", "Lotso", "Girasol", "Lirio", "Cúpula", "Kitty", o explora las categorías.</p>
                <button class="btn-primary-premium" onclick="resetFilters()">Ver todos los productos</button>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(p => {
        const imageSrc = p.images && p.images[0] ? p.images[0] : 'assets/product_1.jpg';
        
        return `
            <div class="product-card" data-product-id="${p.id}">
                <div class="product-image-container" onclick="openQuickView(${p.id})">
                    <img src="${imageSrc}" alt="${p.name}" class="product-img" loading="lazy">
                    <span class="product-badge">${p.badge || 'Handmade 🌸'}</span>
                    <button class="quickview-hover-btn" title="Vista Rápida" onclick="event.stopPropagation(); openQuickView(${p.id})">
                        <span>👁️ Ver detalles</span>
                    </button>
                </div>
                <div class="product-info">
                    <span class="product-category-label">${p.category}</span>
                    <h3 class="product-name" onclick="openQuickView(${p.id})">${p.name}</h3>
                    <p class="product-desc">${p.description.length > 80 ? p.description.substring(0, 80) + '...' : p.description}</p>
                    
                    <div class="product-price-row">
                        <span class="product-price">${p.price}</span>
                    </div>
                    
                    <div class="card-action-row">
                        <button class="btn-card-add-cart" onclick="handleAddCardToCart(${p.id}, this)" title="Añadir a mi carrito">
                            <span>🛒 Añadir</span>
                        </button>
                        <button class="btn-card-whatsapp" onclick="handleCardDirectBuy(${p.id}, this)" title="Pedir por WhatsApp">
                            <span>💬 Pedir</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

window.resetFilters = function() {
    currentCategory = 'all';
    currentSearch = '';
    const searchInput = document.getElementById('catalog-search-input');
    if (searchInput) searchInput.value = '';
    renderCategoryFilters();
    renderProducts();
};

window.handleAddCardToCart = function(productId, btn) {
    addToCart(productId, 1);
    
    // Feedback visual sutil
    const origText = btn.innerHTML;
    btn.innerHTML = '<span>✓ ¡Listo!</span>';
    btn.classList.add('added');
    setTimeout(() => {
        btn.innerHTML = origText;
        btn.classList.remove('added');
    }, 1200);
};

window.handleCardDirectBuy = function(productId, btn) {
    const p = productsMap[productId];
    if (!p) return;

    const message = `¡Hola Belpa Beauty! 💖 Vengo de su página web y me encantaría ordenar:\n*• 1x ${p.name}* (${p.price})\n\n¿Me confirman disponibilidad para coordinar la entrega? ¡Muchas gracias! ✨`;
    window.open(`${whatsappLinkBase}?text=${encodeURIComponent(message)}`, '_blank');
};

// --- 4. SISTEMA DE CARRITO DE COMPRAS ---
function initCartSystem() {
    updateCartBadge();
    renderCartDrawer();

    const openCartBtns = document.querySelectorAll('.trigger-open-cart');
    const closeCartBtn = document.getElementById('cart-drawer-close');
    const overlay = document.getElementById('cart-drawer-overlay');

    openCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openCartDrawer();
        });
    });

    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCartDrawer);
    if (overlay) overlay.addEventListener('click', closeCartDrawer);

    const checkoutBtn = document.getElementById('cart-checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkoutWhatsApp);
    }
}

function addToCart(productId, quantity = 1) {
    const p = productsMap[productId];
    if (!p) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            id: p.id,
            name: p.name,
            price: p.price,
            rawPrice: p.rawPrice,
            image: p.images && p.images[0] ? p.images[0] : 'assets/product_1.jpg',
            quantity: quantity
        });
    }

    saveCart();
    showToast(`¡${p.name} añadido al carrito! 🛍️`, '🌸');
}

function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badges = document.querySelectorAll('.cart-badge-count');
    badges.forEach(b => {
        b.textContent = totalItems;
        b.style.display = totalItems > 0 ? 'inline-flex' : 'none';
    });

    const floatingBtn = document.getElementById('floating-cart-btn');
    if (floatingBtn) {
        floatingBtn.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function openCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-drawer-overlay');
    if (drawer && overlay) {
        renderCartDrawer();
        drawer.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-drawer-overlay');
    if (drawer && overlay) {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }
}

function renderCartDrawer() {
    const list = document.getElementById('cart-items-list');
    const subtotalEl = document.getElementById('cart-subtotal-val');
    const countHeader = document.getElementById('cart-drawer-items-count');
    if (!list) return;

    const totalCount = cart.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = cart.reduce((sum, i) => sum + (i.rawPrice * i.quantity), 0);

    if (countHeader) countHeader.textContent = `(${totalCount})`;
    if (subtotalEl) subtotalEl.textContent = formatCOP(subtotal);

    if (cart.length === 0) {
        list.innerHTML = `
            <div class="empty-cart-view">
                <div class="empty-cart-icon">🛒🌸</div>
                <h4>Tu carrito está vacío</h4>
                <p>Explora nuestras rosas eternas y cosméticos para agregar tus favoritos.</p>
                <button class="btn-primary-premium" onclick="closeCartDrawer()">Explorar Colección</button>
            </div>
        `;
        const footer = document.getElementById('cart-drawer-footer');
        if (footer) footer.style.display = 'none';
        return;
    }

    const footer = document.getElementById('cart-drawer-footer');
    if (footer) footer.style.display = 'block';

    list.innerHTML = cart.map(item => `
        <div class="cart-item-row" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.name}</h4>
                <div class="cart-item-price">${formatCOP(item.rawPrice)} c/u</div>
                <div class="cart-item-controls">
                    <div class="cart-item-qty-box">
                        <button onclick="changeCartItemQty(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeCartItemQty(${item.id}, 1)">+</button>
                    </div>
                    <span class="cart-item-row-total">${formatCOP(item.rawPrice * item.quantity)}</span>
                </div>
            </div>
            <button class="cart-item-remove-btn" onclick="removeCartItem(${item.id})" title="Eliminar">🗑️</button>
        </div>
    `).join('');
}

window.changeCartItemQty = function(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== id);
    }
    saveCart();
};

window.removeCartItem = function(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
};

function checkoutWhatsApp() {
    if (cart.length === 0) return;

    const clientName = document.getElementById('cart-client-name')?.value.trim() || 'Cliente Web';
    const deliveryMethod = document.getElementById('cart-delivery-method')?.value || 'Cúcuta (Domicilio)';
    const clientAddress = document.getElementById('cart-client-address')?.value.trim() || 'Por coordinar';
    const clientNotes = document.getElementById('cart-client-notes')?.value.trim() || '';

    const subtotal = cart.reduce((sum, i) => sum + (i.rawPrice * i.quantity), 0);

    let message = `¡Hola Belpa Beauty & BelFlora! 💖✨\n`;
    message += `Vengo de su página web y quiero realizar el siguiente pedido:\n\n`;
    message += `🛍️ *RESUMEN DEL PEDIDO:*\n`;

    cart.forEach(item => {
        message += `• *${item.quantity}x ${item.name}* (${formatCOP(item.rawPrice * item.quantity)})\n`;
    });

    message += `\n💰 *Subtotal Productos:* ${formatCOP(subtotal)}\n`;
    message += `🚚 *Método de Entrega:* ${deliveryMethod}\n`;
    message += `👤 *Nombre:* ${clientName}\n`;
    message += `📍 *Ciudad / Dirección:* ${clientAddress}\n`;
    if (clientNotes) {
        message += `💌 *Dedicatoria / Notas:* "${clientNotes}"\n`;
    }
    message += `\n¿Me confirman disponibilidad y los datos para el pago? ¡Muchas gracias! 🌸🎀`;

    window.open(`${whatsappLinkBase}?text=${encodeURIComponent(message)}`, '_blank');
}

// --- 5. VENTANA MODAL (QUICK VIEW) ---
let activeQuickViewId = null;

function initQuickViewModal() {
    const modal = document.getElementById('quickview-modal');
    const closeBtn = document.getElementById('modal-close');

    if (closeBtn) closeBtn.addEventListener('click', closeQuickView);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeQuickView();
        });
    }

    const decBtn = document.getElementById('modal-dec-btn');
    const incBtn = document.getElementById('modal-inc-btn');
    const qtyVal = document.getElementById('modal-qty-val');

    if (decBtn && incBtn && qtyVal) {
        decBtn.addEventListener('click', () => {
            let val = parseInt(qtyVal.textContent) || 1;
            qtyVal.textContent = Math.max(1, val - 1);
        });
        incBtn.addEventListener('click', () => {
            let val = parseInt(qtyVal.textContent) || 1;
            qtyVal.textContent = val + 1;
        });
    }

    const modalAddCartBtn = document.getElementById('modal-add-cart-btn');
    if (modalAddCartBtn) {
        modalAddCartBtn.addEventListener('click', () => {
            if (!activeQuickViewId) return;
            const qty = parseInt(qtyVal?.textContent) || 1;
            addToCart(activeQuickViewId, qty);
            closeQuickView();
            openCartDrawer();
        });
    }

    const modalBuyDirectBtn = document.getElementById('modal-buy-btn');
    if (modalBuyDirectBtn) {
        modalBuyDirectBtn.addEventListener('click', () => {
            if (!activeQuickViewId) return;
            const p = productsMap[activeQuickViewId];
            if (!p) return;
            const qty = parseInt(qtyVal?.textContent) || 1;
            const message = `¡Hola Belpa Beauty! 💖 Vengo de su página web y me encantaría ordenar:\n*• ${qty}x ${p.name}* (${p.price})\n\n¿Me confirman disponibilidad y el total? ¡Muchas gracias! ✨`;
            window.open(`${whatsappLinkBase}?text=${encodeURIComponent(message)}`, '_blank');
            closeQuickView();
        });
    }
}

window.openQuickView = function(productId) {
    const p = productsMap[productId];
    if (!p) return;

    activeQuickViewId = productId;
    const modal = document.getElementById('quickview-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBadge = document.getElementById('modal-badge');
    const modalPrice = document.getElementById('modal-price');
    const modalDescription = document.getElementById('modal-description');
    const modalMainImg = document.getElementById('modal-main-img');
    const modalThumbnails = document.getElementById('modal-thumbnails');
    const modalQtyVal = document.getElementById('modal-qty-val');

    if (modalTitle) modalTitle.textContent = p.name;
    if (modalBadge) modalBadge.textContent = p.badge || 'Handmade 🌸';
    if (modalPrice) modalPrice.textContent = p.price;
    if (modalDescription) modalDescription.textContent = p.description;
    if (modalQtyVal) modalQtyVal.textContent = '1';

    const images = p.images && p.images.length > 0 ? p.images : ['assets/product_1.jpg'];
    if (modalMainImg) {
        modalMainImg.src = images[0];
        modalMainImg.alt = p.name;
    }

    if (modalThumbnails) {
        modalThumbnails.innerHTML = '';
        if (images.length > 1) {
            images.forEach((src, idx) => {
                const thumb = document.createElement('img');
                thumb.className = `modal-thumb ${idx === 0 ? 'active' : ''}`;
                thumb.src = src;
                thumb.alt = `${p.name} ${idx + 1}`;
                thumb.addEventListener('click', () => {
                    modalThumbnails.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                    if (modalMainImg) modalMainImg.src = src;
                });
                modalThumbnails.appendChild(thumb);
            });
        }
    }

    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
};

window.closeQuickView = function() {
    const modal = document.getElementById('quickview-modal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
    activeQuickViewId = null;
};

// --- 6. FAQ ---
function initFAQ() {
    const faqCards = document.querySelectorAll('.faq-card');
    faqCards.forEach(card => {
        const btn = card.querySelector('.faq-question');
        if (btn) {
            btn.addEventListener('click', () => {
                const isOpen = card.classList.contains('open');
                faqCards.forEach(c => c.classList.remove('open'));
                if (!isOpen) card.classList.add('open');
            });
        }
    });
}

// --- 7. MASCOTA BELPA KITTY ---
function initMascot() {
    const mascot = document.getElementById('belpa-mascot');
    const speechBubble = document.getElementById('mascot-speech-bubble');

    const quotes = [
        "¡Tenemos rosas eternas hechas a mano y cosméticos hermosos! 🌸",
        "¡Los ramos de Disney y peluches Sanrio son de los favoritos! 👑🧸",
        "¡Personalizamos tu ramo con colores favoritos y dedicatoria! 💌",
        "¡Las cúpulas de cristal y cuadros vienen con luces LED! 🔮✨",
        "¡Puedes agregar varios productos a tu carrito y pedir en un solo paso! 🛒💖",
        "¡Hacemos entregas a domicilio en Cúcuta y envíos a Colombia! ✈️🇨🇴"
    ];

    let idx = 0;
    if (mascot && speechBubble) {
        mascot.addEventListener('click', () => {
            idx = (idx + 1) % quotes.length;
            speechBubble.style.opacity = '0';
            setTimeout(() => {
                speechBubble.textContent = quotes[idx];
                speechBubble.style.opacity = '1';
            }, 200);
        });
    }
}

// --- 8. FORMULARIO DE CONTACTO ---
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name')?.value || '';
            const msg = document.getElementById('message-text')?.value || '';
            const text = `¡Hola Belpa Beauty! 💖 Mi nombre es *${name}* y les escribo desde su página web con la siguiente consulta:\n\n"${msg}"\n\n¡Muchas gracias! ✨`;
            window.open(`${whatsappLinkBase}?text=${encodeURIComponent(text)}`, '_blank');
            form.reset();
        });
    }
}

// --- 9. PARTÍCULAS DE BRILLO SUTILES ---
function initSparkles() {
    const container = document.getElementById('sparkle-container');
    if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    function createSparkle(x, y) {
        const p = document.createElement('div');
        p.className = 'sparkle-particle';
        const icons = ['🌸', '✨', '🎀', '💕'];
        p.textContent = icons[Math.floor(Math.random() * icons.length)];
        p.style.fontSize = (Math.random() * 8 + 10) + 'px';
        p.style.left = x + 'px';
        p.style.top = y + 'px';
        p.style.position = 'fixed';
        p.style.pointerEvents = 'none';
        p.style.zIndex = '9999';
        p.style.transition = 'transform 1s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 1s ease';

        container.appendChild(p);

        const angle = Math.random() * Math.PI * 2;
        const vel = Math.random() * 40 + 15;
        const dx = Math.cos(angle) * vel;
        const dy = Math.sin(angle) * vel;

        setTimeout(() => {
            p.style.transform = `translate(${dx}px, ${dy}px) scale(0)`;
            p.style.opacity = '0';
        }, 30);

        setTimeout(() => p.remove(), 1100);
    }

    window.addEventListener('click', (e) => {
        for (let i = 0; i < 4; i++) createSparkle(e.clientX, e.clientY);
    });
}

// --- 10. REELS DE INSTAGRAM & INSPIRACIÓN ---
function initInstagramReels() {
    const container = document.getElementById('instagram-reels-container');
    const profileBtn = document.getElementById('btn-instagram-profile');
    if (profileBtn && instagramConfig.profileUrl) {
        profileBtn.href = instagramConfig.profileUrl;
    }
    if (!container) return;

    container.innerHTML = instagramConfig.reels.map(reel => {
        const targetUrl = reel.reelUrl || instagramConfig.profileUrl;
        return `
            <a href="${targetUrl}" target="_blank" rel="noreferrer" class="reel-card" title="${reel.title}">
                <div class="reel-media-wrapper">
                    <img src="${reel.previewImage}" alt="${reel.title}" class="reel-preview-img" loading="lazy">
                    <span class="reel-badge-tag">${reel.tag}</span>
                    <div class="reel-play-overlay">▶</div>
                    <div class="reel-content-overlay">
                        <h4 class="reel-title">${reel.title}</h4>
                        <p class="reel-caption">${reel.caption}</p>
                        <span class="reel-action-link">Ver Reel en Instagram ↗</span>
                    </div>
                </div>
            </a>
        `;
    }).join('');
}

// --- 11. ESCENA 3D THREE.JS ---
function initThreeJS() {
    const canvas = document.getElementById('hero-3d-canvas');
    const fallbackImg = document.getElementById('hero-fallback-img');
    if (!canvas || !fallbackImg || typeof THREE === 'undefined') return;

    try {
        const width = 340, height = 340;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.z = 4.8;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        scene.add(new THREE.AmbientLight(0xffffff, 0.75));
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
        dirLight.position.set(5, 5, 5);
        scene.add(dirLight);

        const flowerGroup = new THREE.Group();
        const tiltGroup = new THREE.Group();
        flowerGroup.add(tiltGroup);
        scene.add(flowerGroup);

        // Centro Dorado Pastel
        const centerMat = new THREE.MeshPhysicalMaterial({ color: 0xF7D070, roughness: 0.2, metalness: 0.5 });
        const centerMesh = new THREE.Mesh(new THREE.SphereGeometry(0.35, 32, 32), centerMat);
        centerMesh.position.set(0, 0, 0.2);
        tiltGroup.add(centerMesh);

        // Pétalos Rosa Empolvado
        const petalMat = new THREE.MeshPhysicalMaterial({ color: 0xE8A0B5, roughness: 0.2, clearcoat: 0.8 });
        for (let i = 0; i < 8; i++) {
            const petalGeo = new THREE.SphereGeometry(0.65, 32, 16);
            petalGeo.scale(0.5, 0.9, 0.15);
            const petalMesh = new THREE.Mesh(petalGeo, petalMat);
            const angle = (i * Math.PI * 2) / 8;
            petalMesh.position.set(Math.cos(angle) * 0.52, Math.sin(angle) * 0.52, 0.05);
            petalMesh.rotation.z = angle - Math.PI / 2;
            petalMesh.rotation.x = 0.2;
            tiltGroup.add(petalMesh);
        }

        // Tallo Verde Suave
        const stemMat = new THREE.MeshPhysicalMaterial({ color: 0x6B9075, roughness: 0.35 });
        const stemMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.8, 16), stemMat);
        stemMesh.position.set(0, -0.9, -0.1);
        tiltGroup.add(stemMesh);

        function animate() {
            requestAnimationFrame(animate);
            flowerGroup.rotation.y += 0.005;
            renderer.render(scene, camera);
        }
        animate();
    } catch (e) {
        if (canvas) canvas.style.display = 'none';
        if (fallbackImg) fallbackImg.style.display = 'block';
    }
}
