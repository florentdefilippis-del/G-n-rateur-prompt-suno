/* ============================================
   Générateur de Prompts Suno v6 — Logique
   ============================================ */

// --- State ---
const state = {
  sections: [],
  selectedSectionId: null,
  nextId: 0,
};

// --- Section types available ---
const SECTION_TYPES = [
  { tag: '[Intro]', label: 'Intro', placeholder: 'Section d\'ouverture, souvent instrumentale' },
  { tag: '[Verse 1]', label: 'Verse 1', placeholder: 'Premier couplet — narration' },
  { tag: '[Verse 2]', label: 'Verse 2', placeholder: 'Deuxième couplet — développement' },
  { tag: '[Verse]', label: 'Verse', placeholder: 'Couplet — narration' },
  { tag: '[Pre-Chorus]', label: 'Pré-refrain', placeholder: 'Montée d\'énergie avant le refrain' },
  { tag: '[Chorus]', label: 'Refrain', placeholder: 'Refrain — hook principal' },
  { tag: '[Post-Chorus]', label: 'Post-refrain', placeholder: 'Extension après le refrain' },
  { tag: '[Bridge]', label: 'Pont', placeholder: 'Section contrastée' },
  { tag: '[Hook]', label: 'Hook', placeholder: 'Phrase accrocheuse' },
  { tag: '[Interlude]', label: 'Interlude', placeholder: 'Pause instrumentale' },
  { tag: '[Instrumental Break]', label: 'Pause instrumentale', placeholder: 'Section sans voix' },
  { tag: '[Outro]', label: 'Outro', placeholder: 'Section de fin' },
  { tag: '[End]', label: 'Fin', placeholder: 'Arrêt net — fin du morceau' },
  { tag: '[Build]', label: 'Montée', placeholder: 'Montée d\'énergie progressive' },
  { tag: '[Drop]', label: 'Drop', placeholder: 'Pic d\'énergie maximum' },
  { tag: '[Break]', label: 'Break', placeholder: 'Pause brève, minimal' },
  { tag: '[Breakdown]', label: 'Breakdown', placeholder: 'Section dépouillée' },
  { tag: '[Guitar Solo]', label: 'Solo de guitare', placeholder: 'Solo de guitare' },
  { tag: '[Synth Solo]', label: 'Solo de synthé', placeholder: 'Solo de synthétiseur' },
  { tag: '[Piano Solo]', label: 'Solo de piano', placeholder: 'Solo de piano' },
  { tag: '[Final Chorus]', label: 'Refrain final', placeholder: 'Dernier refrain amplifié' },
];

// --- Presets ---
const PRESETS = {
  standard: [
    { type: '[Verse 1]', cues: [] },
    { type: '[Chorus]', cues: [] },
    { type: '[Verse 2]', cues: [] },
    { type: '[Chorus]', cues: [] },
    { type: '[Bridge]', cues: [] },
    { type: '[Chorus]', cues: [] },
    { type: '[Outro]', cues: [] },
  ],
  edm: [
    { type: '[Intro]', cues: [] },
    { type: '[Build]', cues: [] },
    { type: '[Drop]', cues: [] },
    { type: '[Verse]', cues: [] },
    { type: '[Build]', cues: [] },
    { type: '[Drop]', cues: [] },
    { type: '[Break]', cues: [] },
    { type: '[Drop]', cues: [] },
    { type: '[Outro]', cues: [] },
  ],
  ballad: [
    { type: '[Intro]', cues: [] },
    { type: '[Verse 1]', cues: [] },
    { type: '[Pre-Chorus]', cues: [] },
    { type: '[Chorus]', cues: [] },
    { type: '[Verse 2]', cues: [] },
    { type: '[Pre-Chorus]', cues: [] },
    { type: '[Chorus]', cues: [] },
    { type: '[Bridge]', cues: [] },
    { type: '[Chorus]', cues: [] },
    { type: '[Outro]', cues: [] },
  ],
  rap: [
    { type: '[Intro]', cues: [] },
    { type: '[Verse 1]', cues: [] },
    { type: '[Verse 2]', cues: [] },
    { type: '[Chorus]', cues: [] },
    { type: '[Verse 3]', cues: [] },
    { type: '[Verse 4]', cues: [] },
    { type: '[Chorus]', cues: [] },
    { type: '[Bridge]', cues: [] },
    { type: '[Chorus]', cues: [] },
    { type: '[Outro]', cues: [] },
  ],
};

// --- Autocomplete suggestions database ---
const SUGGESTIONS = {
  genre: [
    // Electronic / Dance
    'synthwave', 'retrowave', 'outrun', 'darksynth', 'cyberpunk', '80s synthwave',
    'melodic techno', 'deep house', 'tech house', 'minimal techno', 'acid techno',
    'detroit techno', 'hard techno', 'industrial techno', 'peak-time techno',
    'drum and bass', 'liquid drum and bass', 'neurofunk', 'jungle', 'breakbeat',
    'future bass', 'dubstep', 'riddim', 'brostep', 'melodic dubstep',
    'trance', 'uplifting trance', 'psytrance', 'goa', 'hard trance', 'progressive trance',
    'hardstyle', 'euphoric hardstyle', 'rawstyle', 'happy hardcore', 'UK hardcore',
    'house', 'deep house', 'soulful house', 'disco house', 'french house', 'garage house',
    'UK garage', 'speed garage', 'bassline', '2-step', 'future garage',
    'downtempo', 'trip hop', 'illbient', 'lo-fi hip hop', 'chillhop', 'jazzhop',
    'ambient electronic', 'dark ambient', 'ambient drone', 'space ambient', 'drone',
    'IDM', 'glitch', 'glitch hop', 'wonky', 'braindance', 'microsound',
    'electro', 'electroclash', 'freestyle', 'synthpop', 'electropop',
    'vaporwave', 'mallsoft', 'hardvapour', 'signalwave',
    'chillwave', 'glo-fi', 'shimmer', 'wave', 'coldwave',
    'phonk', 'drift phonk', 'trap metal', 'dark trap', 'melodic trap',
    'future bass', 'future trap', 'trap', 'drill', 'UK drill', 'Brooklyn drill',
    'lo-fi trap', 'cloud rap', 'emo rap', 'soundcloud rap',
    'footwork', 'juke', 'ghettotech', 'ballroom', 'vogue',
    'amapiano', 'afro house', 'afrobeats', 'afropop', 'afro fusion',
    'latin trap', 'reggaeton', 'dembow', 'moombahton', 'tropical house',
    'bass house', 'slap house', 'progressive house', 'big room', 'complextro',
    // Rock / Metal
    'alt-rock', 'alternative rock', 'indie rock', 'garage rock', 'post-punk',
    'punk rock', 'hardcore punk', 'post-hardcore', 'emo', 'screamo', 'skramz',
    'math rock', 'post-rock', 'space rock', 'shoegaze', 'dream pop', 'noise pop',
    'noise rock', 'sludge', 'sludge metal', 'doom metal', 'stoner rock', 'stoner metal',
    'drone metal', 'funeral doom', 'death-doom', 'death metal', 'melodic death metal',
    'technical death metal', 'brutal death metal', 'black metal', 'atmospheric black metal',
    'dsbm', 'depressive black metal', 'symphonic black metal', 'viking metal', 'pagan metal',
    'power metal', 'symphonic metal', 'gothic metal', 'gothic rock', 'darkwave',
    'metalcore', 'deathcore', 'progressive metalcore', 'nu metal', 'rap metal', 'funk metal',
    'thrash metal', 'speed metal', 'heavy metal', 'NWOBHM', 'glam metal', 'hard rock',
    'classic rock', 'blues rock', 'southern rock', 'country rock', 'folk rock',
    'psychedelic rock', 'krautrock', 'motorik', 'space rock', 'progressive rock', 'prog rock',
    'art rock', 'glam rock', 'surf rock', 'rockabilly', 'psychobilly',
    'britpop', 'madchester', 'shoegaze', 'britrock', 'post-britpop',
    'grunge', 'nu gaze', 'slowcore', 'sadcore', 'chamber pop', 'baroque pop',
    // Hip-Hop / Rap
    'hip hop', 'boom bap', 'conscious rap', 'gangsta rap', 'mumble rap',
    'old school hip hop', 'golden age hip hop', 'east coast rap', 'west coast rap',
    'dirty south', 'crunk', 'snap', 'hyphy', 'jerkin', 'trap',
    'drill', 'UK drill', 'Chicago drill', 'Brooklyn drill',
    'lo-fi rap', 'jazz rap', 'afrocentric hip hop', 'alternative hip hop',
    'abstract hip hop', 'experimental hip hop', 'plunderphonics', 'vapornoise',
    // Pop
    'pop', 'synthpop', 'electropop', 'indie pop', 'dream pop', 'chamber pop',
    'art pop', 'baroque pop', 'dark pop', 'hyperpop', 'bubblegum pop',
    'power pop', 'jangle pop', 'sunshine pop', 'sophisti-pop', 'dance-pop',
    'K-pop', 'J-pop', 'city pop', 'C-pop', 'mandopop',
    'latin pop', 'tropical pop', 'euro pop', 'nordic pop', 'french pop',
    // Folk / Acoustic
    'folk', 'folk acoustic', 'indie folk', 'folk rock', 'neo-folk', 'dark folk',
    'folk noir', 'anti-folk', 'twee pop', 'freak folk', 'psych folk',
    'americana', 'alt-country', 'outlaw country', 'country folk', 'bluegrass',
    'old-time', 'appalachian', 'celtic', 'celtic rock', 'celtic punk',
    'world folk', 'tuvan throat singing', 'mongolian folk', 'nordic folk', 'pagan folk',
    // Jazz / Blues / Soul
    'jazz', 'smooth jazz', 'jazz fusion', 'jazz-funk', 'spiritual jazz', 'free jazz',
    'bebop', 'hard bop', 'cool jazz', 'modal jazz', 'post-bop', 'avant-garde jazz',
    'latin jazz', 'bossa nova', 'samba', 'samba jazz', 'nu jazz', 'jazztronica',
    'big band', 'swing', 'gypsy jazz', 'jazz quartet', 'piano jazz trio',
    'blues', 'delta blues', 'chicago blues', 'electric blues', 'british blues',
    'blues rock', 'soul blues', 'texas blues', 'west coast blues', 'jump blues',
    'soul', 'neo-soul', 'northern soul', 'motown', 'memphis soul', 'philly soul',
    'funk', 'funk rock', 'funk jazz', 'p-funk', 'go-go', 'boogie',
    'R&B', 'contemporary R&B', 'alternative R&B', 'PBR&B', 'quiet storm',
    'disco', 'nu-disco', 'italo disco', 'space disco', 'euro disco', 'hi-NRG',
    // Orchestral / Cinematic
    'cinematic orchestral', 'epic orchestral', 'trailer music', 'film score',
    'neo-classical', 'modern classical', 'minimalism', 'post-minimalism',
    'dark classical', 'gothic orchestral', 'fantasy orchestral', 'adventure score',
    'horror soundtrack', 'sci-fi soundtrack', 'western score', 'noir score',
    'piano solo', 'solo piano', 'prepared piano', 'piano nocturne',
    'string quartet', 'chamber music', 'concerto', 'symphony', 'suite',
    // World / Latin
    'salsa', 'bachata', 'merengue', 'cumbia', 'bolero', 'ranchera',
    'mariachi', 'norteño', 'reggaeton', 'latin trap', 'latin pop', 'tropical',
    'tango', 'argentino tango', 'nuevo tango', 'milonga',
    'flamenco', 'flamenco fusion', 'nuevo flamenco', 'spanish guitar',
    'fado', 'klezmer', 'balkan', 'gypsy punk', 'serbian brass',
    'afrobeat', 'highlife', 'juju', 'afro-funk', 'ethio-jazz',
    'mbalax', 'kizomba', 'soukous', 'ndombolo', ' Coupe Decale',
    'bollywood', 'filmi', 'qawwali', 'ghazal', 'indian classical',
    'raga', 'sitar', 'tabla', 'indian fusion', 'indian electronica',
    'arabic', 'oud', 'maqam', 'arabic pop', 'arabic electronic',
    'turkish', 'bağlama', 'turkish psych', 'anatolian rock',
    'japanese', 'enka', 'japanese folk', 'japanese ambient', 'japanese city pop',
    'korean', 'korean folk', 'korean r&b', 'korean hip hop',
    'chinese', 'chinese traditional', 'chinese orchestral', 'erhu',
    'celtic', 'irish folk', 'scottish', 'welsh', 'breton',
    'nordic', 'nordic folk', 'nordic dark', 'icelandic', 'scandinavian',
    // Experimental / Other
    'noise', 'noise pop', 'noise rock', 'power electronics', 'harsh noise',
    'musique concrete', 'electroacoustic', 'tape music', 'field recording',
    'sound art', 'sound design', 'soundscape', 'soundscape ambient',
    'spoken word', 'poetry', 'audiobook', 'narrative', 'storytelling',
    'gospel', 'contemporary gospel', 'southern gospel', 'praise', 'worship',
    'christmas', 'holiday', 'christmas pop', 'christmas jazz',
    'ska', '2-tone', 'third-wave ska', 'ska punk', 'skacore',
    'reggae', 'dub', 'roots reggae', 'dancehall', 'ragga', 'lovers rock',
    'rocksteady', 'early reggae', 'steppers', 'one drop',
    'punk', 'oi', 'street punk', 'hardcore', 'post-hardcore', 'emo',
    'anarcho punk', 'crust', 'd-beat', 'powerviolence', 'emo violence',
    'grindcore', 'goregrind', 'pornogrind', 'noisegrind', 'cybergrind',
    'nintendocore', 'mathcore', 'djent', 'progressive djent', 'nü-metalcore',
    'visual kei', 'oshare kei', 'angura kei', 'j-rock', 'j-metal',
    'singer-songwriter', 'bedroom pop', 'lo-fi pop', 'diy', 'cassette',
    'post-pop', 'hypnagogic pop', 'hauntology', 'memory music', 'lost media',
  ],
  subgenre: [
    // Époque / Décennie
    'fin des années 80, rétro-futuriste', 'début 90, underground', 'milieu 70, chaleur analogique',
    'fin 60, psychédélique', 'début 2000, esthétique Y2K', 'milieu 80, ambiance néon',
    'début 70, progressif', 'fin 90, culture rave', 'milieu 90, âge d\'or',
    'début 80, new wave', 'fin 70, post-punk', 'milieu 60, culture mod',
    'années 50, rockabilly', 'années 40, big band', 'années 30, swing', 'années folles',
    'années 2000, bloghouse', 'années 2010, Soundcloud', 'vintage, 1970s', 'rétro, 1980s',
    // Ambiance / Atmosphère
    'sombre, atmosphérique', 'lumineux, ensoleillé, enthousiasmant', 'vintage, saturation bande',
    'moderne, poli, digital', 'lo-fi, enregistrement maison', 'live, organique, brut',
    'éthéré, onirique', 'agressif, direct', 'minimaliste, épuré',
    'riche, cinématique, épique', 'intime, micro proche', 'noyé de reverb, spacieux',
    'chaleureux, nostalgique, heure dorée', 'froid, robotique, mécanique', 'flou, distordu, bruyant',
    'cristallin, immaculé', 'rugueux, urbain, street', 'pastoral, inspiré nature',
    'futuriste, science-fiction', 'hanté, gothique', 'ludique, fantaisiste, original',
    'mélancolique, automnal', 'brise estivale, insouciant', 'minuit, noir, cinématique',
    'aube, plein d\'espoir, ascendant', 'tropical, baigné de soleil', 'industriel, métallique',
    'shoegaze, mur de son', 'acide, psychédélique', 'spirituel, méditatif',
    // Style de production
    'bande dégradée, altéré', 'craquement vinyle, poussiéreux', 'immaculé, hi-fi, propre',
    'saturé, overdriven, chaleureux', 'digital, clinique, précis',
    'analogique, chaleureux, harmoniques riches', 'bitcrushé, lo-bit, rétro jeu',
    'beaucoup de reverb, caverneux', 'sec, intime, direct', 'large, stéréo, expansif',
    'compressé, fort, écrasé', 'dynamique, respirant, naturel',
    'layeré, texturé, dense', 'dépouillé, nu, minimal',
    'mur de son, Phil Spector', 'scintillant, brillant', 'trouble, submergé, aqueux',
    'cristallin, vitreux, tranchant', 'chaleureux, rayonnant, ambre', 'glacé, fragile, gelé',
    'fumé, brumeux, flouté', 'néon, incandescent, électrique', 'poussiéreux, patiné, délavé',
    'riche, verdoyant, fleuri', 'stark, aride, désolé', 'doré, lumineux, rayonnant',
    'ombragé, tamisé, mystérieux', 'vibrant, saturé, coloré', 'terne, désaturé, fané',
    // Culturel / Régional
    'japonais, kawaii, pastel', 'coréen, élégant, moderne', 'français, chic, sophistiqué',
    'allemand, industriel, précis', 'nordique, froid, vaste', 'brésilien, chaleureux, rythmique',
    'africain, polyrythmique, organique', 'caribéen, brisant, festif',
    'moyen-oriental, mystique, modal', 'indien, dévotionnel, râga',
    'balkanique, énergique, cuivres', 'celtique, ancien, brumeux',
    'américain, cœur du pays, raciné', 'britannique, mélancolique, couvert',
    // Énergie / Dynamique
    'montée lente, crescendo, climax épique', 'drop soudain, explosif, cathartique',
    'groove stable, hypnotique, verrouillé', 'frénétique, chaotique, délirant',
    'placide, calme, immobile', 'turbulent, orageux, volatil',
    'doux, bercé, rocking', 'dégageant, implacable, propulsion',
    'flottant, sans poids, suspendu', 'ancré, terreux, enraciné',
    'ascendant, envolé, planant', 'descendant, chute, dissolution',
    'pulsant, vibrant, vivant', 'statique, bourdonnant, méditatif',
    'erratique, imprévisible, changeant', 'circulaire, bouclé, cyclique',
    'crescendo, montée, intensification', 'decrescendo, fondu, recul',
  ],
  mood: [
    // French descriptions
    'nocturne, mélancolique, cinétique', 'euphorique, énergique, festif',
    'dreamy, éthéré, flottant', 'sombre, intense, dramatique',
    'chaleureux, nostalgique, doux', 'agressif, puissant, dense',
    'minimaliste, contemplatif, spacieux', 'romantique, tendre, intime',
    'épique, héroïque, grandiose', 'mystérieux, énigmatique, inquiétant',
    'joyeux, lumineux, optimiste', 'triste, déchirant, vulnérable',
    'colérique, rebelle, défiant', 'serein, paisible, flottant',
    'tension, suspense, urgence', 'désir, passion, brûlant',
    'futuriste, froid, mécanique', 'organique, terrestre, brut',
    'onirique, surréaliste, psychédélique', 'solennel, majestueux, sacré',
    'urbain, nocturne, néon', 'pastoral, boisé, naturel',
    'minimaliste, épuré, glacé', 'dense, texturé, richement superposé',
    'intime, murmure, vulnérable', 'triomphant, puissant, élévateur',
    'mélancolique, pluvieux, introspectif', 'solaire, chaleureux, heure dorée',
    // Extended
    'nostalgique, rétro, 80s', 'futuriste, cybernétique, néon',
    'sauvage, primal, instinctif', 'céleste, divin, transcendental',
    'enfermé, claustrophobe, oppressant', 'libre, ouvert, illimité',
    'féroce, sauvage, indompté', 'doux, soyeux, caressant',
    'tranchant, acéré, percutant', 'flou, brumeux, indistinct',
    'vibrant, palpitant, vivant', 'morose, terne, monotone',
    'radieux, éclatant, brillant', 'ténébreux, lugubre, funeste',
    'espiègle, mutin, taquin', 'grave, solennel, pesant',
    'léger, aérien, délicat', 'lourd, massif, écrasant',
    'rapide, frénétique, frémissant', 'lent, pesant, exténué',
    'mystique, occulte, ésotérique', 'scientifique, clinique, précis',
    'artisanal, fait main, brut', 'numérique, virtuel, synthétique',
    'boisé, organique, naturel', 'métallique, industriel, froid',
    'liquide, fluide, ondulant', 'solide, ferme, stable',
    'enfantin, innocent, pur', 'mature, expérimenté, profond',
    'désespéré, angoissé, tourmenté', 'espérant, optimiste, confiant',
    'méfiant, paranoïaque, suspect', 'confiant, assuré, certain',
    'doux, apaisant, réconfortant', 'dur, rugueux, abrasif',
    'chatoyant, scintillant, étincelant', 'mat, terne, sourd',
    'frémissant, palpitant, vibrant', 'figé, statique, immobile',
    'extatique, transcendé, envolé', 'enraciné, posé, stable',
    'fragile, cassable, délicat', 'robuste, solide, indestructible',
    'transparent, diaphane, voilé', 'opaque, dense, impénétrable',
    'oragesux, électrique, crépitant', 'dormant, endormi, paisible',
    'révolutionnaire, insurgé, rebelle', 'conservateur, traditionnel, classique',
    'futur, prospectif, visionnaire', 'ancien, archaïque, primitif',
    'coloré, bigarré, multicolore', 'monochrome, neutre, sobre',
    'aromatique, parfumé, suave', 'âcre, âpre, rugueux',
    'fruité, sucré, acidulé', 'amer, âcre, piquant',
    'cristallin, pur, limpide', 'trouble, trouble, embrouillé',
    'feu, brûlant, incandescent', 'eau, coulant, rafraîchissant',
    'terre, argileux, profond', 'air, venteux, aérien',
    'aube, matin, réveil', 'crépuscule, soir, déclin',
    'minuit, nuit profonde, ténèbres', 'midi, plein jour, zénith',
    'printemps, floraison, renouveau', 'été, chaleur, plénitude',
    'automne, chute, déclin', 'hiver, froid, silence',
  ],
  instruments: [
    // Synthés / Électronique
    'synthés analogiques, batterie percutante, basse sub profonde',
    'synthés analogiques, batterie percutante, basse sub, chaleur analogique',
    'synthés modulaires, percussion glitchy, basse sub',
    'Moog vintage, batterie bande, piano Rhodes',
    'synthés pads, basse sub, batterie trap, vocal chops',
    'lead en dent de scie, basse roulante, batterie 909, acid squelch',
    'synthé lead, arpeggiator, kick quatre temps',
    'synthés FM, pads digitaux, batterie percutante, basse sub',
    'pads analogiques chaleureux, Roland TR-808, basse profonde, leads éthérés',
    'ligne acid 303 distordue, kick 909, hi-hats, pads sombres',
    'piano deep house, basse douce, kick 4/4, saxophone',
    'filter sweeps, basse analogique, clap, rimshot, accords jazzy',
    'pads synthé oniriques, batterie gated reverb, basse fretless',
    'pads ambiants, field recordings, guitare saturée de reverb',
    'string machine, pads analogiques, batterie douce, Rhodes',
    'Wurlitzer chaleureux, guitare vibrato, batterie brush, contrebasse',
    'guitare scintillante, chorus pedal, synthé doux, voix aériennes',
    'piano électrique, basse douce, percussion légère, cors doux',
    'cuivres analogiques, cloches FM, basse sub, hi-hats trap',
    'basse sub 808, rolls de caisse claire, pads sombres, voix pitchées',
    'piano dégradé bande, craquement vinyle, batterie lo-fi, trompette sourdine',
    'piano queue, quatuor à cordes, batterie brush, contrebasse',
    'harpe, célesta, glockenspiel, boîte à musique, cordes douces',
    'harpe de verre, bols tibétains, kalimba, drones atmosphériques',
    'Mellotron, orgues vintage, guitare fuzz, batterie chamber',
    'clavecin, luth, viole de gambe, théorbe, batterie baroque',
    // Guitares
    'guitare électrique, amplis overdriven, batterie live',
    'guitare électrique distordue, double pédale, basse agressive',
    'guitare acoustique fingerpicking, violoncelle, glockenspiel',
    'guitare acoustique, mandoline, piano doux',
    'banjo, fiddle, harmonica, basse acoustique',
    'guitare slide, lap steel, batterie brush, orgue Hammond',
    'guitare douze cordes, Rickenbacker jangly, batterie entraînante, basse',
    'guitare baryton, basse fuzz, batterie tribale, drone sitar',
    'guitare préparée, e-bow, boucles, drones ambiants, field recordings',
    'pedal steel, dobro, mandoline, contrebasse, batterie brush',
    'guitare classique, violon, accordéon, cajon',
    'guitare nylon, requinto, maracas, clave, bongos',
    'guitare espagnole, castagnettes, palmas, cajon, basse',
    'sitar, tabla, tanpura, flûte bansuri, harmonium',
    // Orchestral / Acoustique
    'cordes orchestrales, timbales, choeur',
    'section cordes, piano, cor d\'harmonie, timbales',
    'orchestre complet, section cuivres, timbales, cymbales',
    'cordes chamber, hautbois, basson, harpe',
    'violon solo, piano, violoncelle, alto',
    'trio piano, contrebasse, batterie légère',
    'Rhodes chaleureux, batterie brush, contrebasse',
    'saxophone, trompette, walking bass, batterie brush',
    'basse slap, guitare funky, cuivres stabs, batterie serrée',
    'flûte, clarinette, basson, harpe, célesta',
    'trompette, bugle, trombone, sax baryton, contrebasse',
    'big band, section cuivres complète, section rythmique, vibraphone',
    'orgue à tuyaux, choeur, timbales, reverb cathédrale',
    'piano queue, solo, sans accompagnement',
    'piano droit, marteaux feutrés, cordes étouffées, pédale douce',
    'piano honky-tonk, guitare slide, contrebasse, batterie brush',
    'Hammond B3 soul, guitare, basse, batterie, tambourine',
    // Batterie / Percussion
    '808s, rolls de hi-hats, pads atmosphériques',
    'batterie live percutante, tambourine, shaker, congas',
    'batterie boom bap, samples jazz, Rhodes, craquement vinyle',
    'batterie trap, slides 808, hi-hats, rimshots',
    'caisse claire militaire, timbales, cymbales swells, percussion cinétique',
    'tabla, dholak, daf, tambour sur cadre, poterie',
    'djembe, kora, balafon, kalimba, shaker',
    'bodhran, tin whistle, uilleann pipes, fiddle',
    'cajon, bongos, congas, timbales, shekere',
    'taiko, shakuhachi, koto, shamisen',
    'steel drums, marimba, synthés tropicaux, basse rebondissante',
    'gamelan, gongs, métallophones, flûte bambou',
    // Unique / Expérimental
    'thérémine, Ondes Martenot, harmonica de verre, choeur',
    'drones synthé modulaire, field recordings, voix traitées',
    'boucles bande, piano préparé, sons trouvés, micros contact',
    'jouets circuit-bent, synthés glitchy, batterie bitcrushée',
    'superposition vocale, choeur, beatbox, percussion corporelle',
    'waterphone, bols chantants, feuille d\'orage, machine à vent',
    'sampler, scratches vinyle, vocal chops, batterie lo-fi',
    'boîte à musique, piano jouet, glockenspiel, célesta, pads doux',
    'ukulélé baryton, kalimba, melodica, washboard',
    'didgeridoo, bullroarer, clapsticks, feuille d\'eucalyptus',
    'hardanger fiddle, nyckelharpa, flûte en saule, lur',
    'hang drum, handpan, tongue drum, rainstick, ocean drum',
  ],
  production: [
    // Propre / Moderne
    'mix moderne poli, large reverb, percutant',
    'propre et moderne, radio-ready, poli',
    'cristallin, immaculé, haute fidélité',
    'clarté digitale, mix chirurgical, transparent',
    'net, défini, mix séparé',
    'lumineux, aérien, aigus étincelants',
    'large, stéréo, expansif, panoramique',
    'immaculé, hi-fi, qualité référence',
    'basses serrées, médiums percutants, aigus aériens',
    'radio-ready, fort, compétitif, poli',
    // Chaleureux / Vintage
    'lo-fi, saturation bande chaleureuse, vintage',
    'analogique chaleureux, compression bande, harmoniques riches',
    'trouble, charme lo-fi, chaleur vinyle',
    'bande dégradée, altéré, nostalgique',
    'craquement vinyle, poussiéreux, patiné',
    'chaleureux, rayonnant, ambre, saturé',
    'chaleur console analogique, saturation transfo, compression glue',
    'chaleur ampli à lampes, compression naturelle, overtones riches',
    'souffle cassette, wow et flutter, fidélité dégradée',
    'reel-to-reel, écho bande, reverb printemps vintage',
    // Brut / Rugueux
    'brut, enregistrement garage, sans polish',
    'sec et percutant, direct, agressif',
    'overdriven, saturé, texture rugueuse',
    'sombre, oppressant, basses lourdes',
    'flou, distordu, bruyant, lo-fi',
    'bedroom pop, intime, légèrement dégradé',
    'rugueux, urbain, street, non poli',
    'live, organique, brut, sans edits',
    'one-take, live-off-the-floor, son de pièce',
    'préamps overdriven, distorsion analogique, clipping chaleureux',
    // Spatial / Atmosphérique
    'cinétique, épique, scène sonore large',
    'noyé de reverb, spatial, atmosphérique',
    'riche, orchestral, profondément layeré',
    'minimal, spacieux, respirant',
    'minimaliste, sec, micro proche',
    'mur de son, layeré, dense',
    'grande pièce, anthémique, taille stade',
    'dépouillé, acoustique, honnête',
    'reverb cathédrale, vaste, résonnant, éthéré',
    'reverb printemps, surf, twangy, vintage',
    'shimmer reverb, reverse reverb, atmosphérique',
    'convolution reverb, espace réaliste, naturel',
    // Sombre / Expérimental
    'sombre, cinétique, oppressant, tension',
    'industriel, métallique, froid, mécanique',
    'distordu, bitcrushé, lo-bit, glitchy',
    'harsh, bruyant, abrasif, confrontational',
    'basse sub lourde, sombre, ominous, profond',
    'lo-fi ambient, trouble, submergé, aqueux',
    'drone, soutenu, évolutif, minimal',
    'glitchy, saccadé, chopped, granulaire',
    // Pop / Radio
    'production pop, hooks accrocheurs, poli',
    'radio-friendly, fort, compressé, lumineux',
    'pop mainstream, glossy, voix layerées',
    'maximaliste, tout plus fort que tout',
    'brick-walled, fort, compétitif, écrasé',
    // Organique / Naturel
    'naturel, dynamique, respirant, non compressé',
    'organique, acoustique, chaleureux, roomy',
    'intime, micro proche, chuchoté, personnel',
    'ensemble live, micro pièce, bleed naturel',
    'enregistrement chamber, petite pièce, sec, détaillé',
    // Électronique / Club
    'club-ready, fort, percutant, sidechain compression',
    'quatre temps, sidechainé, pumping, énergique',
    'sub lourd, secouant les enceintes, festival-ready',
    'EDM net, leads lumineux, drops percutants',
    'techno, dégager, hypnotique, minimal, répétitif',
    'bass music, sub lourd, syncopé, basé sur le groove',
  ],
  bpm: [
    '40 BPM', '45 BPM', '50 BPM', '55 BPM', '60 BPM', '63 BPM',
    '65 BPM', '68 BPM', '70 BPM', '72 BPM', '75 BPM', '77 BPM',
    '78 BPM', '80 BPM', '82 BPM', '85 BPM', '87 BPM', '88 BPM',
    '90 BPM', '92 BPM', '93 BPM', '95 BPM', '96 BPM', '98 BPM',
    '100 BPM', '102 BPM', '105 BPM', '108 BPM', '110 BPM', '112 BPM',
    '115 BPM', '118 BPM', '120 BPM', '122 BPM', '124 BPM', '125 BPM',
    '126 BPM', '127 BPM', '128 BPM', '130 BPM', '132 BPM', '135 BPM',
    '138 BPM', '140 BPM', '142 BPM', '145 BPM', '148 BPM', '150 BPM',
    '155 BPM', '160 BPM', '165 BPM', '170 BPM', '174 BPM', '175 BPM',
    '180 BPM', '185 BPM', '190 BPM', '200 BPM', '210 BPM', '220 BPM',
    '240 BPM', '60 BPM — ballad', '70 BPM — slow jam', '80 BPM — chill',
    '90 BPM — boom bap', '95 BPM — lo-fi', '100 BPM — pop',
    '110 BPM — mid-tempo', '120 BPM — house/dance', '128 BPM — EDM',
    '140 BPM — dubstep/trap', '160 BPM — drum and bass', '174 BPM — drum and bass',
  ],
  exclude: [
    // Voix
    'autotune', 'voix masculine principale', 'voix féminine principale', 'choeur',
    'choeurs', 'harmonies vocales', 'voix parlée', 'chuchotement',
    'cri', 'growl', 'rap', 'ad-libs vocaux', 'vocal chops',
    'voix pitchées', 'voix auto-tunées', 'voix distordues',
    // Instruments
    'guitare acoustique', 'guitare électrique', 'piano', 'batterie', 'basse',
    'synthétiseur', 'cordes', 'cuivres', '808s', 'hi-hats',
    'saxophone', 'trompette', 'trombone', 'flûte', 'clarinette',
    'violon', 'violoncelle', 'harpe', 'orgue', 'Rhodes', 'Mellotron',
    'sitar', 'tabla', 'banjo', 'fiddle', 'harmonica',
    'marimba', 'steel drums', 'glockenspiel', 'boîte à musique',
    // Techniques de production
    'reverb', 'distorsion', 'fondu', ' changement de tonalité', 'modulation',
    'sidechain compression', 'bitcrush', 'lo-fi', 'craquement vinyle',
    'saturation bande', 'overdrive', 'fuzz', 'delay', 'chorus',
    'phaser', 'flanger', 'tremolo', 'vibrato', 'wah',
    'filtre passe-bas', 'filtre passe-haut', 'formant shift', 'time stretch',
    // Structure / Forme
    'solo de guitare', 'solo de batterie', 'solo de basse', 'pause instrumentale',
    'pont', 'changement de tonalité', 'changement de tempo', 'changement de signature',
    'intro longue', 'outro long', 'fin abrupte', 'fondu entrant',
    // Style / Genre
    'production glossy', 'production électronique', 'enregistrement live',
    'esthétique lo-fi', 'production maison', 'surproduit',
    'son pop mainstream', 'musique corporate', 'musique stock',
    'progression d\'accords cliché', 'kick quatre temps',
    'drop', 'breakdown', 'build-up', 'anti-drop',
    // Styles vocaux
    'melisma', 'runs vocaux', 'belting', 'falsetto', 'vocal fry',
    'yodel', 'scat', 'beatbox', 'chant diphonique',
    // Ambiances
    'joyeux', 'triste', 'agressif', 'calme', 'romantique', 'sombre',
    'énergique', 'chill', 'épique', 'minimal', 'maximaliste',
  ],
};

// --- Custom Autocomplete ---
const ARROW_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>';

function initAutocomplete() {
  const fields = ['genre', 'subgenre', 'mood', 'instruments', 'production', 'bpm', 'exclude'];

  fields.forEach(fieldId => {
    const input = document.getElementById(fieldId);
    if (!input) return;

    const suggestions = SUGGESTIONS[fieldId] || [];

    // Wrap input in combobox wrapper
    const parent = input.parentElement;
    const wrapper = document.createElement('div');
    wrapper.className = 'combobox-wrapper';
    parent.insertBefore(wrapper, input);
    wrapper.appendChild(input);

    // Add dropdown trigger button
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'combobox-trigger';
    trigger.innerHTML = ARROW_SVG;
    trigger.title = 'Voir toutes les suggestions';
    wrapper.appendChild(trigger);

    // Create autocomplete dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'autocomplete-dropdown';
    wrapper.appendChild(dropdown);

    let currentHighlight = -1;
    let currentMatches = [];
    let isOpen = false;

    // --- Multi-select helpers ---
    function getCurrentToken(value) {
      var parts = value.split(',');
      return parts[parts.length - 1].trim();
    }

    function getSelectedItems(value) {
      return value.split(',').map(function(p) { return p.trim().toLowerCase(); }).filter(Boolean);
    }

    function addSuggestionToInput(suggestion) {
      var parts = input.value.split(',').map(function(p) { return p.trim(); }).filter(Boolean);
      var currentToken = getCurrentToken(input.value).toLowerCase();

      // Drop the in-progress token, we'll replace it
      if (currentToken && parts.length > 0) {
        parts = parts.slice(0, -1);
      }

      // Avoid duplicates
      var exists = parts.some(function(p) { return p.toLowerCase() === suggestion.toLowerCase(); });
      if (!exists) {
        parts.push(suggestion);
      }

      input.value = parts.join(', ') + ', ';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function showSuggestions() {
      var query = getCurrentToken(input.value).toLowerCase();
      var selected = getSelectedItems(input.value);

      if (query.length === 0) {
        currentMatches = suggestions.slice();
      } else {
        currentMatches = suggestions.filter(function(s) {
          return s.toLowerCase().includes(query);
        });
      }

      if (currentMatches.length === 0) {
        closeDropdown();
        return;
      }

      currentMatches = currentMatches.slice(0, 50);
      currentHighlight = -1;
      renderOptions(query, selected);
      openDropdown();
    }

    function renderOptions(query, selected) {
      dropdown.innerHTML = currentMatches.map(function(s, i) {
        var display = escapeHtml(s);
        if (query.length > 0) {
          var lowerS = s.toLowerCase();
          var idx = lowerS.indexOf(query);
          if (idx >= 0) {
            display = escapeHtml(s.substring(0, idx)) +
              '<mark>' + escapeHtml(s.substring(idx, idx + query.length)) + '</mark>' +
              escapeHtml(s.substring(idx + query.length));
          }
        }
        var isSelected = selected.indexOf(s.toLowerCase()) >= 0;
        var checkMark = isSelected ? ' <span class="autocomplete-check">✓</span>' : '';
        return '<div class="autocomplete-option' + (isSelected ? ' autocomplete-option--selected' : '') + '" data-index="' + i + '">' + display + checkMark + '</div>';
      }).join('');

      dropdown.querySelectorAll('.autocomplete-option').forEach(function(opt) {
        opt.addEventListener('mousedown', function(e) {
          e.preventDefault();
          var idx = parseInt(opt.dataset.index);
          addSuggestionToInput(currentMatches[idx]);
          // Keep dropdown open for multi-select
          showSuggestions();
          input.focus();
        });
      });
    }

    function openDropdown() {
      isOpen = true;
      dropdown.classList.add('autocomplete-dropdown--open');
      wrapper.classList.add('combobox-wrapper--open');
    }

    function closeDropdown() {
      isOpen = false;
      dropdown.classList.remove('autocomplete-dropdown--open');
      wrapper.classList.remove('combobox-wrapper--open');
    }

    function updateHighlight() {
      dropdown.querySelectorAll('.autocomplete-option').forEach((opt, i) => {
        opt.classList.toggle('autocomplete-option--highlighted', i === currentHighlight);
      });
      const highlighted = dropdown.querySelector('.autocomplete-option--highlighted');
      if (highlighted) {
        highlighted.scrollIntoView({ block: 'nearest' });
      }
    }

    // Trigger button — toggles full list
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      if (isOpen) {
        closeDropdown();
      } else {
        showSuggestions();
      }
    });

    // Input events
    input.addEventListener('focus', function() {
      if (getCurrentToken(input.value).length === 0) {
        showSuggestions();
      } else {
        showSuggestions();
      }
    });
    input.addEventListener('input', showSuggestions);

    input.addEventListener('keydown', function(e) {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        currentHighlight = Math.min(currentHighlight + 1, currentMatches.length - 1);
        updateHighlight();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        currentHighlight = Math.max(currentHighlight - 1, 0);
        updateHighlight();
      } else if (e.key === 'Enter' && currentHighlight >= 0) {
        e.preventDefault();
        addSuggestionToInput(currentMatches[currentHighlight]);
        showSuggestions();
      } else if (e.key === 'Escape') {
        closeDropdown();
      }
    });

    // Close on blur (slight delay to allow click)
    input.addEventListener('blur', () => {
      setTimeout(() => closeDropdown(), 150);
    });
  });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// --- Custom Select Dropdowns ---
function initCustomSelects() {
  document.querySelectorAll('.custom-select').forEach(select => {
    const trigger = select.querySelector('.custom-select-trigger');
    const options = select.querySelector('.custom-select-options');
    const valueDisplay = select.querySelector('.custom-select-value');
    const hiddenInput = select.parentElement.querySelector('input[type="hidden"]');
    const selectName = select.dataset.select;

    // Toggle open/close
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = select.classList.contains('custom-select--open');
      // Close all other selects
      document.querySelectorAll('.custom-select').forEach(s => {
        if (s !== select) s.classList.remove('custom-select--open');
      });
      select.classList.toggle('custom-select--open');
    });

    // Option click
    options.querySelectorAll('.custom-select-option').forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const value = opt.dataset.value;
        const text = opt.textContent;

        // Update display
        valueDisplay.textContent = text;

        // Update hidden input
        if (hiddenInput) {
          hiddenInput.value = value;
          hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // Update selected state
        options.querySelectorAll('.custom-select-option').forEach(o => {
          o.classList.remove('custom-select-option--selected');
        });
        opt.classList.add('custom-select-option--selected');

        // Close dropdown
        select.classList.remove('custom-select--open');
      });
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-select')) {
      document.querySelectorAll('.custom-select').forEach(s => {
        s.classList.remove('custom-select--open');
      });
    }
  });
}

// --- Theme toggle ---
(function () {
  const t = document.querySelector('[data-theme-toggle]');
  const r = document.documentElement;
  let d = matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  r.setAttribute('data-theme', d);
  t && t.addEventListener('click', () => {
    d = d === 'dark' ? 'light' : 'dark';
    r.setAttribute('data-theme', d);
    t.setAttribute('aria-label', 'Basculer vers le mode ' + (d === 'dark' ? 'clair' : 'sombre'));
    t.innerHTML = d === 'dark'
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  });
})();

// --- Range sliders ---
['style-influence', 'variety', 'weirdness'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  const valEl = document.getElementById(id.split('-')[0] === 'style' ? 'si-value' : id.split('-')[0] === 'variety' ? 'var-value' : 'weird-value');
  el.addEventListener('input', () => {
    if (valEl) valEl.textContent = el.value;
  });
});

// --- Structure Builder ---
// Cues are stored as arrays of strings (no brackets in stored form)
// e.g. ['Build', 'Belted', 'Female Vocal']
function createSection(type, cues = []) {
  return {
    id: state.nextId++,
    type,
    cues: Array.isArray(cues) ? [...cues] : [],
  };
}

function cuesToString(cues) {
  if (!cues || cues.length === 0) return '';
  return cues.join(', ');
}

function renderStructure() {
  const container = document.getElementById('structure-builder');
  container.innerHTML = '';

  if (state.sections.length === 0) {
    container.innerHTML = '<p class="field-hint" style="padding: var(--space-4); text-align: center;">Aucune section. Cliquez sur « Ajouter une section » ou choisissez un modèle.</p>';
    return;
  }

  state.sections.forEach((section, index) => {
    const item = document.createElement('div');
    item.className = 'structure-item';
    if (section.id === state.selectedSectionId) {
      item.classList.add('structure-item--selected');
    }
    item.dataset.sectionId = section.id;

    const handle = document.createElement('span');
    handle.className = 'structure-item-handle';
    handle.textContent = (index + 1) + '.';

    // Custom dropdown for section type
    const typeWrapper = document.createElement('div');
    typeWrapper.className = 'structure-item-type-wrapper';

    const typeTrigger = document.createElement('button');
    typeTrigger.type = 'button';
    typeTrigger.className = 'structure-item-type';
    typeTrigger.textContent = section.type;
    typeTrigger.title = 'Changer le type de section';

    const typeDropdown = document.createElement('div');
    typeDropdown.className = 'structure-item-type-dropdown';

    SECTION_TYPES.forEach(s => {
      const opt = document.createElement('div');
      opt.className = 'structure-item-type-option';
      if (s.tag === section.type) opt.classList.add('structure-item-type-option--selected');
      opt.textContent = s.tag;
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        section.type = s.tag;
        renderStructure();
      });
      typeDropdown.appendChild(opt);
    });

    typeTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      // Close all other dropdowns
      document.querySelectorAll('.structure-item-type-dropdown--open').forEach(d => {
        if (d !== typeDropdown) d.classList.remove('structure-item-type-dropdown--open');
      });
      typeDropdown.classList.toggle('structure-item-type-dropdown--open');
    });

    typeWrapper.appendChild(typeTrigger);
    typeWrapper.appendChild(typeDropdown);

    const cuesEl = document.createElement('span');
    cuesEl.className = 'structure-item-cues';
    cuesEl.textContent = cuesToString(section.cues);

    const removeBtn = document.createElement('button');
    removeBtn.className = 'structure-item-remove';
    removeBtn.type = 'button';
    removeBtn.innerHTML = '&times;';
    removeBtn.title = 'Supprimer cette section';
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      state.sections = state.sections.filter(s => s.id !== section.id);
      if (state.selectedSectionId === section.id) {
        state.selectedSectionId = null;
      }
      renderStructure();
    });

    item.appendChild(handle);
    item.appendChild(typeWrapper);
    item.appendChild(cuesEl);
    item.appendChild(removeBtn);

    item.addEventListener('click', () => {
      state.selectedSectionId = section.id;
      renderStructure();
    });

    container.appendChild(item);
  });

  // Close type dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.structure-item-type-wrapper')) {
      document.querySelectorAll('.structure-item-type-dropdown--open').forEach(d => {
        d.classList.remove('structure-item-type-dropdown--open');
      });
    }
  }, { once: true });
}

// Add section button
document.getElementById('add-section').addEventListener('click', () => {
  showSectionPicker();
});

function showSectionPicker() {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:200;display:flex;align-items:center;justify-content:center;padding:var(--space-4);';

  const picker = document.createElement('div');
  picker.style.cssText = 'background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:var(--space-6);max-width:500px;width:100%;max-height:80vh;overflow-y:auto;box-shadow:var(--shadow-lg);';

  const title = document.createElement('h3');
  title.textContent = 'Choisir une section';
  title.style.cssText = 'font-family:var(--font-display);font-size:var(--text-lg);margin-bottom:var(--space-4);';
  picker.appendChild(title);

  const grid = document.createElement('div');
  grid.style.cssText = 'display:grid;grid-template-columns:repeat(2,1fr);gap:var(--space-2);';

  SECTION_TYPES.forEach(s => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn--ghost btn--sm';
    btn.textContent = s.tag;
    btn.style.cssText = 'text-align:left;font-family:monospace;';
    btn.addEventListener('click', () => {
      state.sections.push(createSection(s.tag));
      renderStructure();
      overlay.remove();
    });
    grid.appendChild(btn);
  });

  picker.appendChild(grid);

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'btn btn--ghost';
  closeBtn.textContent = 'Annuler';
  closeBtn.style.cssText = 'margin-top:var(--space-4);width:100%;';
  closeBtn.addEventListener('click', () => overlay.remove());
  picker.appendChild(closeBtn);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  overlay.appendChild(picker);
  document.body.appendChild(overlay);
}

// Preset buttons
document.querySelectorAll('[data-preset]').forEach(btn => {
  btn.addEventListener('click', () => {
    const preset = PRESETS[btn.dataset.preset];
    if (!preset) return;
    state.sections = preset.map(s => createSection(s.type, s.cues));
    state.selectedSectionId = null;
    renderStructure();
  });
});

// --- Toggle a cue in the selected section (exact string match, not split) ---
function toggleCue(cueText) {
  if (state.selectedSectionId === null) {
    showToast('Sélectionnez d\'abord une section');
    return false;
  }
  const section = state.sections.find(s => s.id === state.selectedSectionId);
  if (!section) return false;

  const idx = section.cues.indexOf(cueText);
  if (idx === -1) {
    section.cues.push(cueText);
  } else {
    section.cues.splice(idx, 1);
  }
  renderStructure();
  return true;
}

// --- Intensity tags ---
document.querySelectorAll('#intensity-tags .chip').forEach(chip => {
  chip.addEventListener('click', () => {
    // Store without brackets: 'Build', 'Drop', 'Instrumental Break', etc.
    const tag = chip.dataset.tag.replace(/^\[|\]$/g, '');
    toggleCue(tag);
  });
});

// --- Vocal tags ---
document.querySelectorAll('#vocal-tags .chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const vocal = chip.dataset.vocal;
    toggleCue(vocal);
  });
});

// --- Tab switching ---
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('tab--active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('tab-panel--active'));
    tab.classList.add('tab--active');
    document.querySelector(`[data-panel="${tab.dataset.tab}"]`).classList.add('tab-panel--active');
  });
});

// --- Generate prompt ---
document.getElementById('generate-btn').addEventListener('click', generatePrompt);

function generatePrompt() {
  const genre = document.getElementById('genre').value.trim();
  const subgenre = document.getElementById('subgenre').value.trim();
  const mood = document.getElementById('mood').value.trim();
  const instruments = document.getElementById('instruments').value.trim();
  const vocals = document.getElementById('vocals').value.trim();
  const production = document.getElementById('production').value.trim();
  const bpm = document.getElementById('bpm').value.trim();
  const language = document.getElementById('language').value;
  const exclude = document.getElementById('exclude').value.trim();
  const modelVariant = document.getElementById('model-variant').value;
  const styleInfluence = document.getElementById('style-influence').value;
  const variety = document.getElementById('variety').value;
  const weirdness = document.getElementById('weirdness').value;

  // --- GMVP Style Field ---
  // Format: Genre: ... | Mood: ... | Vocals: ... | Production: ...
  // With BPM and instruments folded into the appropriate sections
  const genreText = [genre, subgenre].filter(Boolean).join(', ');
  const moodText = [mood, bpm].filter(Boolean).join(' — ');
  const vocalsText = (vocals && vocals !== 'instrumental, sans voix') ? vocals : 'instrumental';
  const productionParts = [production, instruments].filter(Boolean);
  const productionText = productionParts.join(', ');

  const stylePrompt = [
    `Genre: ${genreText || '—'}`,
    `Mood: ${moodText || '—'}`,
    `Vocals: ${vocalsText}`,
    `Production: ${productionText || '—'}`,
  ].join(' | ');

  // --- Lyrics Field ---
  // Section cues use plain text (no nested brackets) inside the section tag
  // Format: [Section | cue1, cue2, ...] or standalone [Build] tags before sections
  let lyricsParts = [];

  if (state.sections.length === 0) {
    lyricsParts.push('[Intro]');
    lyricsParts.push('');
    lyricsParts.push('[Verse 1]');
    lyricsParts.push('(Vos paroles ici)');
    lyricsParts.push('');
    lyricsParts.push('[Pre-Chorus]');
    lyricsParts.push('(Montée d\'énergie)');
    lyricsParts.push('');
    lyricsParts.push('[Chorus]');
    lyricsParts.push('(Refrain — hook principal)');
    lyricsParts.push('');
    lyricsParts.push('[Verse 2]');
    lyricsParts.push('(Suite des paroles)');
    lyricsParts.push('');
    lyricsParts.push('[Chorus]');
    lyricsParts.push('(Refrain)');
    lyricsParts.push('');
    lyricsParts.push('[Bridge]');
    lyricsParts.push('(Section contrastée)');
    lyricsParts.push('');
    lyricsParts.push('[Final Chorus]');
    lyricsParts.push('(Refrain final amplifié)');
    lyricsParts.push('');
    lyricsParts.push('[Outro]');
    lyricsParts.push('(Fin du morceau)');
  } else {
    state.sections.forEach(section => {
      // Separate intensity tags (standalone) from performance cues (inline)
      const intensityTags = ['Build', 'Build-Up', 'Drop', 'Break', 'Breakdown',
        'Crescendo', 'Decrescendo', 'Instrumental Break', 'Guitar Solo',
        'Synth Solo', 'Piano Solo', 'Fade In', 'Fade Out', 'Silence',
        'Key Change', 'Interlude', 'Hook', 'Post-Chorus', 'End'];

      const vocalTags = ['Whispered', 'Belted', 'Falsetto', 'Spoken', 'Humming',
        'Scream', 'Ad-lib', 'Harmonies', 'Backing Vocals', 'Rap Verse',
        'Call and Response', 'Duet', 'Choir', 'Male Vocal', 'Female Vocal'];

      const standalone = section.cues.filter(c => intensityTags.includes(c));
      const inline = section.cues.filter(c => !intensityTags.includes(c));

      // Emit standalone intensity tags on their own lines BEFORE the section
      standalone.forEach(tag => {
        lyricsParts.push(`[${tag}]`);
      });

      // Build the section header with inline cues (no nested brackets)
      let tagLine = section.type;
      if (inline.length > 0) {
        // v6 parameterized format: [Section | cue1, cue2]
        tagLine = section.type.replace(/\]$/, ` | ${inline.join(', ')}]`);
      }
      lyricsParts.push(tagLine);
      lyricsParts.push('(Vos paroles ici)');
      lyricsParts.push('');
    });
  }

  // Remove trailing empty line
  if (lyricsParts[lyricsParts.length - 1] === '') {
    lyricsParts.pop();
  }

  const lyricsPrompt = lyricsParts.join('\n');

  // --- Exclude field ---
  const excludePrompt = exclude || '—';

  // --- Settings ---
  const settingsLines = [
    `Modèle : ${modelVariant}`,
    `Influence du Style : ${styleInfluence}%`,
    `Variété : ${variety}%`,
    `Créativité : ${weirdness}%`,
  ];
  if (language) settingsLines.push(`Langue des paroles : ${language}`);
  if (bpm) settingsLines.push(`Tempo cible : ${bpm}`);

  const settingsPrompt = settingsLines.join('\n');

  // --- Full output ---
  const fullParts = [
    '=== CHAMP STYLE (GMVP) ===',
    stylePrompt,
    '',
    '=== CHAMP PAROLES ===',
    lyricsPrompt,
    '',
    '=== STYLES À EXCLURE ===',
    excludePrompt,
    '',
    '=== RÉGLAGES v6 ===',
    settingsPrompt,
  ];
  const fullPrompt = fullParts.join('\n');

  // --- Render outputs ---
  document.getElementById('style-output').textContent = stylePrompt || '(Remplissez les champs ci-dessus)';
  document.getElementById('lyrics-output').textContent = lyricsPrompt;
  document.getElementById('exclude-output').textContent = excludePrompt;
  document.getElementById('settings-output').textContent = settingsPrompt;
  document.getElementById('full-output').textContent = fullPrompt;

  // Character counts
  updateCharCount('style-chars', stylePrompt.length, 1000);
  updateCharCount('lyrics-chars', lyricsPrompt.length, 5000);

  // GMVP Breakdown
  renderGMVPBreakdown({ genre: genreText, mood: moodText, vocals: vocalsText, production: productionText });

  // Show output
  document.getElementById('output-section').style.display = '';
  document.getElementById('output-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateCharCount(id, count, limit) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = `${count} / ${limit}`;
  el.classList.remove('char-count--warning', 'char-count--danger');
  if (count > limit) {
    el.classList.add('char-count--danger');
  } else if (count > limit * 0.85) {
    el.classList.add('char-count--warning');
  }
}

function renderGMVPBreakdown({ genre, mood, vocals, production }) {
  const container = document.getElementById('gmvp-breakdown');
  container.innerHTML = `
    <div class="gmvp-item gmvp-item--genre">
      <div class="gmvp-item-label">Genre</div>
      <div class="gmvp-item-value">${genre || '—'}</div>
    </div>
    <div class="gmvp-item gmvp-item--mood">
      <div class="gmvp-item-label">Ambiance</div>
      <div class="gmvp-item-value">${mood || '—'}</div>
    </div>
    <div class="gmvp-item gmvp-item--vocals">
      <div class="gmvp-item-label">Voix</div>
      <div class="gmvp-item-value">${vocals || '—'}</div>
    </div>
    <div class="gmvp-item gmvp-item--production">
      <div class="gmvp-item-label">Production</div>
      <div class="gmvp-item-value">${production || '—'}</div>
    </div>
  `;
}

// --- Copy function ---
function copyText(elementId) {
  const el = document.getElementById(elementId);
  const text = el.textContent;
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copié dans le presse-papiers');
  }).catch(() => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast('Copié dans le presse-papiers');
    } catch (e) {
      showToast('Erreur lors de la copie');
    }
    document.body.removeChild(textarea);
  });
}

// --- Toast ---
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('toast--visible');
  setTimeout(() => {
    toast.classList.remove('toast--visible');
  }, 2500);
}

// --- Init ---
initCustomSelects();
initAutocomplete();
renderStructure();

// Load default preset
state.sections = PRESETS.standard.map(s => createSection(s.type, s.cues));
renderStructure();

/* ============================================
   Project Manager / Persistence — V1.1
   ============================================ */
(function initProjectManager() {
  const STORAGE_KEY = 'suno-gmvp-project-v1';
  const HISTORY_KEY = 'suno-gmvp-history-v1';

  function collectForm() {
    const ids = ['genre','subgenre','mood','instruments','vocals','production','bpm','language','exclude','model-variant','style-influence','variety','weirdness'];
    const fields = {};
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) fields[id] = el.value;
    });
    return {
      version: 1,
      savedAt: new Date().toISOString(),
      fields,
      sections: state.sections.map(s => ({ id: s.id, type: s.type, cues: [...s.cues] })),
      selectedSectionId: state.selectedSectionId
    };
  }

  function restoreForm(data) {
    if (!data || !data.fields) return false;
    Object.entries(data.fields).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) el.value = value;
    });

    // Refresh custom-select visible labels.
    document.querySelectorAll('.custom-select').forEach(select => {
      const name = select.dataset.select;
      const hidden = document.getElementById(name);
      const display = select.querySelector('.custom-select-value');
      const options = select.querySelectorAll('.custom-select-option');
      if (!hidden || !display) return;
      const option = [...options].find(o => o.dataset.value === hidden.value);
      if (option) {
        display.textContent = option.textContent;
        options.forEach(o => o.classList.toggle('custom-select-option--selected', o === option));
      }
    });

    state.sections = (data.sections || []).map(s => ({
      id: Number.isFinite(s.id) ? s.id : state.nextId++,
      type: s.type,
      cues: Array.isArray(s.cues) ? [...s.cues] : []
    }));
    const maxId = state.sections.reduce((m, s) => Math.max(m, s.id), -1);
    state.nextId = Math.max(state.nextId, maxId + 1);
    state.selectedSectionId = data.selectedSectionId ?? null;
    renderStructure();
    document.querySelectorAll('[id="style-influence"], [id="variety"], [id="weirdness"]').forEach(el => el.dispatchEvent(new Event('input')));
    generatePrompt();
    return true;
  }

  function saveLocal(show = true) {
    try {
      const data = collectForm();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      const snapshot = { ...data, id: Date.now(), name: document.getElementById('project-name')?.value.trim() || 'Projet sans nom' };
      history.unshift(snapshot);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 12)));
      if (show) showToast('Projet sauvegardé');
    } catch (e) {
      if (show) showToast('Sauvegarde indisponible');
    }
  }

  function newProject() {
    if (!confirm('Créer un nouveau projet ? Les modifications non sauvegardées seront perdues.')) return;
    document.querySelectorAll('input:not([type="hidden"])').forEach(el => {
      if (['style-influence','variety','weirdness'].includes(el.id)) return;
      el.value = '';
    });
    const defaults = { 'style-influence':'50', variety:'50', weirdness:'30' };
    Object.entries(defaults).forEach(([id,v]) => { const el=document.getElementById(id); if(el) el.value=v; });
    const defaultsSelect = { vocals:'voix féminine douce, breathy', language:'français', 'model-variant':'v6' };
    Object.entries(defaultsSelect).forEach(([id,v]) => { const el=document.getElementById(id); if(el) el.value=v; });
    document.getElementById('project-name').value = '';
    state.sections = PRESETS.standard.map(s => createSection(s.type, s.cues));
    state.selectedSectionId = null;
    renderStructure();
    generatePrompt();
    showToast('Nouveau projet');
  }

  function exportProject() {
    const data = collectForm();
    data.name = document.getElementById('project-name')?.value.trim() || 'Suno GMVP';
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${data.name.replace(/[^a-z0-9-_]+/gi,'_') || 'suno-gmvp'}.json`;
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    showToast('Projet exporté');
  }

  function importProject() {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'application/json,.json';
    input.onchange = () => {
      const file = input.files?.[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          if (!data || !data.fields) throw new Error('invalid');
          if (document.getElementById('project-name')) document.getElementById('project-name').value = data.name || '';
          restoreForm(data);
          showToast('Projet importé');
        } catch (_) { showToast('Fichier JSON invalide'); }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  function addProjectBar() {
    const header = document.querySelector('.header-inner');
    if (!header || document.getElementById('project-tools')) return;
    const tools = document.createElement('div');
    tools.id = 'project-tools';
    tools.innerHTML = `
      <input id="project-name" class="project-name" type="text" placeholder="Nom du projet" aria-label="Nom du projet">
      <button class="btn btn--ghost btn--sm" id="new-project" type="button">Nouveau</button>
      <button class="btn btn--ghost btn--sm" id="save-project" type="button">Sauvegarder</button>
      <button class="btn btn--ghost btn--sm" id="export-project" type="button">Exporter</button>
      <button class="btn btn--ghost btn--sm" id="import-project" type="button">Importer</button>`;
    header.insertBefore(tools, header.querySelector('.theme-toggle'));
    document.getElementById('new-project').onclick = newProject;
    document.getElementById('save-project').onclick = () => saveLocal(true);
    document.getElementById('export-project').onclick = exportProject;
    document.getElementById('import-project').onclick = importProject;
  }

  function loadSaved() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data && data.fields) {
        if (document.getElementById('project-name')) document.getElementById('project-name').value = data.name || '';
        restoreForm(data);
        showToast('Projet précédent restauré');
      }
    } catch (_) {}
  }

  // Wait until the original app initialization has created the structure.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { addProjectBar(); loadSaved(); });
  } else {
    addProjectBar(); loadSaved();
  }

  // Autosave silently after edits.
  let timer;
  document.addEventListener('input', e => {
    if (!e.target.closest('.config-section')) return;
    clearTimeout(timer);
    timer = setTimeout(() => saveLocal(false), 700);
  });

  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault(); generatePrompt();
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault(); saveLocal(true);
    }
  });
})();
