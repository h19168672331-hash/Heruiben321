export type Project = {
  slug: string; no: string; title: string; cnTitle: string; category: string; year: string;
  group: 'interaction' | 'spatial' | 'brand' | 'visual'; cover: string; coverPosition?: string;
  intro: string; brief: string; role: string[]; images: string[]; captions?: string[]; accent: string; pdfIntro?: string; video?: string;
  exhibitionPhotos?: { src: string; title: string; body: string }[];
  researchQuestion?: string;
  researchSteps?: { no: string; title: string; body: string }[];
  findings?: { value: string; label: string }[];
  collaboration?: string;
  galleryOnly?: boolean;
};

export const groups = [
  { slug:'interaction', no:'A', title:'Interaction & Experience', cnTitle:'交互与体验', description:'以叙事、声音、代码与参与式体验回应记忆、信息与文化。' },
  { slug:'spatial', no:'B', title:'Product & Spatial', cnTitle:'产品与空间', description:'从身体、居住和使用情境出发，研究物件与空间如何塑造感受。' },
  { slug:'brand', no:'C', title:'Brand & Visual', cnTitle:'品牌与视觉', description:'通过角色、插画和系统化视觉语言，建立可延展的品牌体验。' },
  { slug:'visual', no:'D', title:'Visual Narrative', cnTitle:'视觉叙事', description:'以绘本、图像与连续叙事探索角色、色彩与想象空间。' },
] as const;

export const projects: Project[] = [
  { slug:'childhood', no:'01', title:'Childhood', cnTitle:'童年', category:'Illustration · Sound Installation', group:'interaction', cover:'page-02-01.jpg', coverPosition:'50% 46%', year:'2026', accent:'#3150ff',
    intro:'An immersive illustration and sound installation that turns memories of childhood into a playful, tactile experience.',
    brief:'Built from interviews with people aged 8 to 82, Childhood asks how sensory memories survive as we grow older. Hand-drawn rabbit adventures are scanned to trigger different sounds and movements, allowing each visitor to compose a personal journey through remembered play.',
    role:['Research','Illustration','Interaction Design','Coding'],
    images:['page-02-01.jpg','childhood-pdf-03.png','childhood-pdf-04.png','childhood-pdf-05.png','childhood-pdf-06.png'],
    captions:['01 / Final installation — the complete interactive illustration wall','02 / Project documentation — visual research and process','03 / Project documentation — spatial and interaction development','04 / Project documentation — illustration and sound system','05 / Project documentation — final project outcome'] },
  { slug:'a-plant-as-i-know', no:'02', title:'A Plant As I Know', cnTitle:'一些“知道”的植物', category:'Critical Design · Interactive Installation', group:'interaction', cover:'page-07-01.jpg', year:'2026', accent:'#ff4a2f',
    intro:'A critical design project questioning when opinions begin to look like knowledge in fragmented media environments.',
    brief:'Drawing on popular-science content across social platforms, the project creates invented plant species from unverified claims. Voice choices progressively clarify a virtual plant, making visible how repetition, likes and consensus can turn uncertain opinions into apparent fact.',
    role:['Graphic Design','3D Modelling','Interaction Design','Coding'], images:['page-07-01.jpg','page-08-01.jpg','page-09-07.jpg','page-11-01.jpg','page-11-02.jpg','page-11-03.jpg','page-12-03.jpg'] },
  { slug:'portable-sketching-chair', no:'03', title:'Portable Sketching Chair', cnTitle:'便携写生椅', category:'Product Design · User Experience', group:'spatial', cover:'page-13-01.jpg', coverPosition:'50% 50%', year:'2026', accent:'#d9ff43',
    intro:'A backpack, portable seat and art-supply storage system designed for people who sketch outdoors.',
    brief:'The project responds to poor posture, fatigue and cumbersome equipment during outdoor sketching. A lightweight recyclable wood structure combines a padded backpack, telescopic drawer and adjustable stool legs, balancing comfort, storage and portability.',
    role:['User Research','Product Design','Ergonomics','3D Modelling'], images:['page-13-01.jpg','page-14-01.jpg','page-15-10.jpg','page-16-06.jpg','page-17-01.jpg','page-17-02.jpg','page-17-04.jpg'] },
  { slug:'character-resonance', no:'04', title:'Character Resonance', cnTitle:'简繁体字音乐棋盘', category:'Interaction Design · Sound', group:'interaction', cover:'page-22-07.jpg', coverPosition:'50% 42%', year:'2026', accent:'#ff5d8f',
    intro:'An interactive music chessboard exploring coexistence between simplified and traditional Chinese characters.',
    brief:'Traditional and simplified characters become opposing chess pieces fitted with NFC chips. Instead of framing the two systems as competitors, light and sound respond to every move and reveal a relationship of exchange, resonance and cultural inheritance.',
    role:['Cultural Research','Interaction Design','Prototyping','Sound'],
    images:['page-19-01.jpg','page-22-07.jpg','chess-user-solo.jpg','chess-gameplay-overhead.jpg','chess-board-game-mode.jpg','chess-board-pieces.jpg'],
    captions:['01 / User research — interviews and attitudes toward simplified and traditional characters','02 / User experience — two players compose with simplified and traditional characters','03 / Live interaction — placing a character piece triggers light and sound','04 / Gameplay detail — the illuminated response follows each move','05 / Game mode — colour fields turn character placement into composition','06 / System outcome — chess pieces, board and responsive lighting'] },
  { slug:'feng-shui-vr', no:'05', title:'Feng Shui as a Cultural Symbol', cnTitle:'风水、空间记忆与归属感', category:'MRes Thesis · Spatial Research · Virtual Reality', group:'spatial', cover:'feng-shui-vr-cover.png', coverPosition:'50% 50%', year:'2025', accent:'#67e1c0', video:'feng-shui-vr-showcase.mp4',
    intro:'A practice-led MRes study visualising belonging through Feng Shui, spatial memory, VR experimentation and illustration.',
    brief:'The research asks whether culturally familiar spatial symbols can support Chinese international students living alone in compact London apartments. Interviews and floor-plan observation informed two VR environments—a standard studio and a Feng Shui-enhanced version. Participants’ memories were then translated into black-and-white visual narratives through the House–Tree–Person framework.',
    role:['Practice-led Research','Interviews','VR Modelling','Spatial Design','Illustration'],
    researchQuestion:'How can Feng Shui operate as a cultural and emotional language—rather than a fixed doctrine—to help Chinese students abroad reconstruct a sense of home?',
    researchSteps:[
      {no:'01',title:'Listen',body:'Two rounds of qualitative interviews mapped how 14 Chinese international students understand Feng Shui, cultural identity and everyday comfort.'},
      {no:'02',title:'Model',body:'A representative Griffon Studios floor plan became two comparable VR apartments: one standard and one embedded with five culturally symbolic objects.'},
      {no:'03',title:'Test',body:'Seven participants experienced both environments and described the memories, places and feelings triggered by each spatial intervention.'},
      {no:'04',title:'Translate',body:'Feedback was re-composed through the House–Tree–Person framework as seven black-and-white illustrations—portable emotional maps of home.'}
    ],
    findings:[
      {value:'14',label:'participants in the initial study'},
      {value:'93%',label:'viewed Feng Shui as meaningful'},
      {value:'2×',label:'VR environments compared'},
      {value:'100%',label:'of testers found the enhanced space more familiar'},
      {value:'7',label:'final illustrated memory maps'}
    ],
    images:['feng-shui-vr-showcase.mp4','mres-ideal-studios.jpg','mres-five-elements.jpg','mres-floor-plan.jpg','mres-vr-model.jpg','mres-vr-standard.jpg','mres-vr-enhanced.jpg','mres-feedback.jpg','mres-illustration-yuqin.jpg','mres-outcomes.jpg'],
    captions:['01 / VR showcase — From Blank Space to Belonging','02 / Visual elicitation — participants’ ideal studio sketches','03 / Five Elements — symbolic objects selected for the intervention','04 / Spatial observation — representative Griffon Studios floor plan','05 / Prototype — apartment model developed for VR testing','06 / Control environment — standard studio apartment','07 / Intervention environment — Feng Shui symbols embedded in VR','08 / Participant feedback — objects as triggers of cultural memory','09 / HTP translation — Yuqin’s illustrated memory of home','10 / Outcome — six further visual narratives of belonging'] },
  { slug:'xingying-travel-ip', no:'06', title:'Xingying Travel IP', cnTitle:'行影旅行品牌 IP', category:'Brand Identity · IP Design · Campaign', group:'brand', cover:'xingying-pdf-page-43.png', coverPosition:'50% 50%', year:'2025—2026', accent:'#90c9ff', pdfIntro:'xingying-pdf-page-40.png',
    intro:'A travel brand system built around Xingying Bear, connecting destination stories, character design and digital product touchpoints.',
    brief:'As the lead brand designer, I developed Xingying Travel’s IP from zero to one and translated it into a flexible visual system. The work spans landmark illustrations, travel-themed sticker packs, interactive maps, destination pages, seasonal campaigns, calendars and wallpapers—giving the niche travel brand a consistent, memorable personality across content and product experiences.',
    role:['Brand Direction','IP Design','Illustration','Campaign Design','Digital Content'],
    images:['xingying-pdf-page-41.png','xingying-pdf-page-42.png','xingying-pdf-page-43.png','xingying-pdf-page-44.png','xingying-pdf-page-45.png'],
    captions:['01 / Map, calendar, sticker pack and ICON system','02 / Destination title system and route pages','03 / Travel content pages and destination stories','04 / Mobile travel stories and interactive content','05 / Wallpaper and calendar applications'] },
  { slug:'ark-flickering-candles', no:'07', title:'Flickering Candles in the Wind', cnTitle:'风中火烛 · 大报恩寺互动灯光装置', category:'Team Project · Interaction Design · Digital Heritage', group:'interaction', cover:'ark3-ritual-night-cover.jpg', coverPosition:'50% 50%', year:'2026', accent:'#ffb22e',
    intro:'A collective lighting ritual that transforms visitors from spectators into participants beneath Nanjing’s Porcelain Tower.',
    brief:'Inspired by the oil lamps and candlelight of the Grand Bao’en Temple, the ArK Labs team designed a responsive handheld lantern system for the museum’s nightly ceremony. Visitors awaken a lantern, carry it into the square, shake it to change colour and synchronise with the pagoda before releasing a wish as a shared beam of light.',
    collaboration:'TEAM PROJECT — Wang Teng · Zhang Yaohui · Chen Jialu · Ruiben He. Ruiben He was responsible for visual and technical development within the four-person multidisciplinary team.',
    role:['Team Project','Interaction Research','Visual Development','Prototype Collaboration'],
    researchQuestion:'How can a historic lighting ritual become a contemporary public action—connecting individual gestures, collective memory and the illuminated tower?',
    researchSteps:[
      {no:'01',title:'Trace the ritual',body:'The team studied global lantern customs and the Porcelain Tower’s history as a beacon lit by 144 oil lamps.'},
      {no:'02',title:'Design participation',body:'A visitor journey links receiving, awakening, carrying and shaking the lantern with a final collective wish-release moment.'},
      {no:'03',title:'Prototype response',body:'ESP-NOW communication, RSSI proximity sensing, MPU6050 motion input and addressable LEDs connect movement to light.'},
      {no:'04',title:'Scale the ceremony',body:'The tested three-node prototype expands toward multiple handheld lamps and six spatial wish-projection columns.'}
    ],
    findings:[
      {value:'4',label:'multidisciplinary team members'},
      {value:'A/B/C',label:'interactive lamp nodes tested'},
      {value:'144',label:'historic tower lamps informing the narrative'},
      {value:'6',label:'wish-projection columns proposed'},
      {value:'3.3V',label:'low-voltage prototype system'}
    ],
    images:['ark3-heritage-poster.jpg','ark-title-candles.png','ark3-global-lighting.jpg','ark3-lamp-cad.jpg','ark3-user-journey.jpg','ark-user-breath-after-awakening.png','ark-user-awakening-detail.png','ark-user-pair-interaction.png','ark-user-tower-group.png','ark3-technical-system.jpg','ark3-site-plan.jpg','ark3-ritual-night.jpg','ark-exhibition-light-columns.png','ark4-tower-projection.jpg','ark3-audience-research.jpg','ark4-award-team.jpg'],
    captions:['01 / Heritage narrative — the Porcelain Tower as an enduring beacon','02 / Project identity — Flickering Candles in the Wind','04 / Cultural research — shared lantern traditions across regions','05 / Product development — handheld lamp form and dimensions','06 / Experience journey — collect, awaken, carry, synchronise and release','07 / User scenario — the breath after awakening','08 / User scenario — awakening the handheld light','09 / User scenario — light creates a shared moment between participants','10 / User scenario — collective interaction beneath the illuminated tower','11 / Technical prototype — tested sensing and lighting components','12 / Site strategy — interaction route and wish-light positions','13 / Collective outcome — visitors illuminate the tower together','14 / Exhibition installation — illuminated wish columns on site','15 / Live presentation — Digital Heritage projected across the Porcelain Tower','03 / Audience research — needs, barriers and ritual opportunities','16 / Award moment — ArK Labs receives the Best Global Appeal Prize'] },
  { slug:'eagle-product-development', no:'08', title:'EAGLE Product Development', cnTitle:'益而高文具产品开发', category:'Product Development · Market Research · Campaign', group:'brand', cover:'eagle-canton-day2-sharpener.png', coverPosition:'50% 50%', year:'2026', accent:'#ee2834',
    intro:'A research-led stationery development programme turning market evidence into sticky-note collections, product positioning and campaign visuals.',
    brief:'For EAGLE, I mapped price bands, packaging formats, use cases and channel differences across Hong Kong retail and international e-commerce. The findings informed product opportunity clusters, 76 mm sticky-note series and event communications—connecting research, product definition and market-facing visual outcomes.',
    role:['Product Development','Market Research','Product Strategy','Sticky-note Design','Campaign Posters'],
    researchQuestion:'How can EAGLE move beyond lowest-price competition by translating channel data, packaging patterns and user scenarios into distinctive stationery products?',
    researchSteps:[
      {no:'01',title:'Scan the market',body:'Compared six pen categories across PDD, HKTVmall and Amazon, recording price, pack size, format, use case and sales signals.'},
      {no:'02',title:'Define opportunities',body:'Separated office basics, BTS student sets, creative drawing kits and corporate promotional products into channel-specific directions.'},
      {no:'03',title:'Develop the range',body:'Built 76 × 76 mm sticky-note collections across illustrated landscapes, cultural themes and character-led formats.'},
      {no:'04',title:'Communicate the product',body:'Translated products into launch posters, trade-fair countdowns and social assets for international B2B and consumer-facing contexts.'}
    ],
    findings:[
      {value:'3',label:'commerce platforms compared'},
      {value:'6',label:'pen categories benchmarked'},
      {value:'4',label:'product opportunity clusters'},
      {value:'200+',label:'sticky-note concepts developed'},
      {value:'76mm',label:'core square-note format'}
    ],
    images:['eagle3-sticky-ben99.jpg','eagle3-sticky-ukiyo.jpg','eagle3-sticky-pen.jpg','eagle3-sticky-heritage.jpg','eagle-canton-day0-invitation.png','eagle-canton-day2-stapler.png','eagle-canton-day2-christmas.png','eagle-canton-day2-eg5161.png','eagle-canton-day2-sharpener.png','eagle-canton-day2-rabbit-notes.png','eagle-canton-day2-tape.png','eagle-canton-day3-landscape.png','eagle-canton-day4-city.png','eagle-canton-final-day.png'],
    captions:['01 / Sticky-note development — illustrated landscape concept','02 / Sticky-note range — four-season ukiyo-e collection','03 / Sticky-note range — minimal line-art format','04 / Sticky-note range — cultural landscape collection','05 / Canton Fair — invitation poster / campaign opening','06 / Day 2 — recycled stapler product poster','07 / Day 2 — Christmas gift-box product poster','08 / Day 2 — EG-5161 product poster','09 / Day 2 — recycled sharpener product poster','10 / Day 2 — rabbit sticky-note product poster','11 / Day 2 — clear tape dispenser product poster','12 / Day 3 — landscape countdown poster','13 / Day 4 — city and landmark countdown poster','14 / Final day — Canton Fair invitation poster'] },
  { slug:'rabbit-journey-illustration-display', no:'09', title:"Rabbit's Journey", cnTitle:'旅行的兔子 · 线描作品陈列', category:'Illustration · Artwork Display', group:'brand', cover:'rabbit-linework-display-cover.png', coverPosition:'50% 50%', year:'2022—2026', accent:'#3150ff', galleryOnly:true,
    intro:'A travelling rabbit moves through real landscapes and imagined worlds, using dense linework and negative space to connect scenery with inner emotion.',
    brief:'《兔子的梦》曾于伦敦 Kupfer Gallery 与 Murray Grove 展出，《兔的蜕变》于伦敦 Espacio Gallery 展出。系列插画随后延展至 2025 伦敦时装周与 2026 纽约时装周，让纸上叙事进入时尚现场。',
    role:[],
    exhibitionPhotos:[
      {src:'rabbit-exhibition-kupfer-gallery.jpg',title:'《兔子的梦》 / Kupfer Gallery',body:'伦敦 Kupfer Gallery 展览现场：两幅线描作品并置呈现，观众与作品保持近距离观看。'},
      {src:'rabbit-exhibition-murray-grove.jpg',title:'《兔子的梦》 / Murray Grove',body:'伦敦 Murray Grove 展览现场：四幅作品以网格关系陈列，延续系列的节奏与留白。'},
      {src:'rabbit-exhibition-espacio-gallery.jpg',title:'《兔的蜕变》 / Espacio Gallery',body:'伦敦 Espacio Gallery 展览现场：九幅作品组成垂直墙面，线描风景在光影中形成连续叙事。'}
    ],
    images:['rabbit-linework-display-cover.png','rabbit-journey-clean-01.jpg','rabbit-journey-clean-02.jpg','rabbit-journey-clean-03.jpg','rabbit-journey-clean-04.jpg','rabbit-journey-clean-05.jpg','rabbit-journey-clean-06.jpg','rabbit-journey-clean-07.jpg','rabbit-journey-pdf-10.png','rabbit-journey-pdf-11.png','rabbit-journey-pdf-12.png','rabbit-journey-pdf-13.png','rabbit-journey-pdf-14.png','rabbit-journey-pdf-15.png'] },
  { slug:'rabbit-color-picture-book', no:'10', title:"Rabbit's Colour Book", cnTitle:'彩色兔子 · 绘本系列', category:'Visual Narrative · Picture Book', group:'visual', cover:'rabbit-color-cover.png', coverPosition:'50% 50%', year:'2022—2026', accent:'#f2a7c6', galleryOnly:true,
    intro:'A 43-image colour picture-book series following the rabbit through playful scenes, shifting palettes and imagined landscapes.',
    brief:'以彩色兔子为主角的连续绘本图像，保留原始作品的观看顺序与节奏，完整呈现角色、场景和色彩叙事。',
    role:[],
    images:['rabbit-color-01.jpg','rabbit-color-02.jpg','rabbit-color-03.jpg','rabbit-color-04.png','rabbit-color-05.jpg','rabbit-color-06.png','rabbit-color-07.png','rabbit-color-08.png','rabbit-color-09.png','rabbit-color-10.jpg','rabbit-color-11.jpg','rabbit-color-12.png','rabbit-color-13.jpg','rabbit-color-14.jpg','rabbit-color-15.png','rabbit-color-16.png','rabbit-color-17.png','rabbit-color-18.png','rabbit-color-19.jpg','rabbit-color-20.png','rabbit-color-21.png','rabbit-color-22.png','rabbit-color-23.png','rabbit-color-24.jpg','rabbit-color-25.png','rabbit-color-26.png','rabbit-color-27.png','rabbit-color-28.png','rabbit-color-29.png','rabbit-color-30.png','rabbit-color-31.png','rabbit-color-32.png','rabbit-color-33.png','rabbit-color-34.png','rabbit-color-35.png','rabbit-color-36.png','rabbit-color-37.jpg','rabbit-color-38.jpg','rabbit-color-39.png','rabbit-color-40.png','rabbit-color-41.png','rabbit-color-42.png','rabbit-color-43.png'] },
  { slug:'laipin-brand-experience', no:'11', title:'Laipin', cnTitle:'莱品 · 品牌与数字体验', category:'Brand Identity · Mini Program Prototype · Campaign', group:'brand', cover:'laipin-poster.png', coverPosition:'50% 50%', year:'2026', accent:'#dcebd8',
    intro:'A warm, everyday nutrition brand experience connecting visual identity, a mini-program-style H5 prototype, campaign graphics and seven packaging concepts.',
    brief:'莱品以“营养，回到每一天”为核心，将奶油白、森林绿和温和的视觉语言贯穿品牌传播、小程序风格 H5 原型与包装。互动演示包含选品、购物袋、模拟订单、每日记录、成长计划与积分兑换；所有交易和奖励均为演示，不代表真实上线服务。',
    role:['Brand Experience','UI / UX Design','Campaign Visual','Packaging System'],
    images:[] },
];

export const getProject = (slug: string) => projects.find((project) => project.slug === slug);
