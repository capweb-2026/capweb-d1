export const ASSISTANT_NAME = "Cap’Num";
export const ASSISTANT_EMOJI = "💻";

function signer(texte) {
  return `${texte} — ${ASSISTANT_NAME} ${ASSISTANT_EMOJI}`;
}

export const WELCOME_MESSAGE =
  "Bienvenue, je suis Cap’Num 💻. Pose-moi tes questions sur ton parcours scolaire et les métiers du numérique. Mes propositions sont indicatives et ne remplacent pas l’avis d’un professionnel de l’orientation.";

export const SUGGESTED_QUESTIONS = [
  "Quels métiers du numérique correspondent à mon parcours scolaire ?",
  "Comment choisir mon orientation dans le numérique ?",
  "Quel parcours scolaire pour travailler dans le numérique ?",
];

function validerMessageStrict(raw) {
  if (typeof raw !== "string") {
    return {
      ok: false,
      error: "Le message doit être une chaîne de caractères",
    };
  }
  const value = raw.trim();
  if (value === "") {
    return { ok: false, error: "Le message ne peut pas être vide" };
  }
  if (value.length > 280) {
    return {
      ok: false,
      error: "Le message ne peut pas dépasser 280 caractères",
    };
  }
  return { ok: true, value };
}

export function replyTo(message) {
  const texte = message.trim().toLowerCase();
  if (texte === "bonjour" || texte === "salut") {
    return signer("Bonjour ! Comment puis-je vous aider aujourd'hui ?");
  }
  if (texte === "aide") {
    return signer("En quoi puis-je vous aider ?");
  }
  if (texte === "test") {
    return signer("Ceci est un message de test");
  }

  const orientation = repondreOrientation(texte);
  if (orientation) {
    return signer(orientation);
  }

  else {
    return signer("Je suis désolé, je n'ai pas compris votre message. Pouvez-vous reformuler ?");
  }
}

const NIVEAUX = [
  "terminale",
  "première",
  "premiere",
  "seconde",
  "troisième",
  "troisieme",
  "bac",
  "bts",
  "but",
  "dut",
  "licence",
  "master",
  "sti2d",
  "sio",
  "sin",
];

const MATIERES = [
  "maths",
  "mathématiques",
  "mathematiques",
  "nsi",
  "informatique",
  "physique",
  "svt",
  "technologie",
  "réseau",
  "reseau",
  "dev",
  "développement",
  "developpement",
  "sin",
  "électronique",
  "electronique",
  "data",
  "statistiques",
  "sti2d",
  "sio",
  "spécialité",
  "specialite",
  "spécialités",
  "specialites",
  "matières",
  "matieres",
  "matiere",
  "matière",
];

const METIERS = [
  {
    nom: "Développeur web",
    description: "Conçoit et code des sites et applications.",
    formations: "terminale spécialité NSI, BTS SIO, BTS/DUT informatique, licence informatique, école d’ingénieur (bac+5).",
    motsCles: ["nsi", "sio", "informatique", "dev", "développement", "developpement", "terminale", "bac", "web"],
  },
  {
    nom: "Développeur logiciel",
    description: "Conçoit et code des applications complètes.",
    formations: "BTS/DUT informatique, licence informatique, master informatique ou école d’ingénieur (bac+5).",
    motsCles: ["nsi", "sio", "informatique", "dev", "développement", "developpement", "licence", "master", "logiciel"],
  },
  {
    nom: "Développeur embarqué",
    description: "Programme des systèmes électroniques.",
    formations: "bac STI2D spécialité SIN, BUT informatique/électronique, école d’ingénieur (bac+5).",
    motsCles: ["sti2d", "sin", "électronique", "electronique", "but", "embarqué", "technologie", "physique"],
  },
  {
    nom: "Ingénieur DevOps",
    description: "Automatise le déploiement et la supervision des applications.",
    formations: "licence informatique, master informatique ou école d’ingénieur (bac+5).",
    motsCles: ["licence", "master", "réseau", "reseau", "dev", "informatique", "sio"],
  },
  {
    nom: "Data scientist",
    description: "Construit des modèles pour prédire et analyser des données complexes.",
    formations: "licence maths/informatique, master data science ou école d’ingénieur (bac+5).",
    motsCles: ["maths", "mathématiques", "mathematiques", "data", "statistiques", "licence", "master", "nsi"],
  },
];

const RAPPEL = "Ces propositions sont indicatives et ne remplacent pas l’avis d’un professionnel de l’orientation.";

function contientUn(liste, texte) {
  return liste.some((mot) => texte.includes(mot));
}

function repondreOrientation(texte) {
  const parleOrientation = /métier|metier|numérique|numerique|orientation|parcours|bac|bts|but|dut|licence|master|terminale|première|premiere|seconde|sti2d|sio|sin|nsi|maths|dev|réseau|reseau|informatique|travail/i.test(texte);
  if (!parleOrientation) {
    return null;
  }
  const aNiveau = contientUn(NIVEAUX, texte);
  const aMatiere = contientUn(MATIERES, texte);
  if (!(aNiveau && aMatiere)) {
    return "Pour te proposer des métiers adaptés, peux-tu préciser ton niveau scolaire et tes matières ou spécialités ? Par exemple : ta classe et les matières que tu étudies.";
  }
  const selection = choisirMetiers(texte);
  const blocs = selection.map(
    (metier) =>
      `Métier : ${metier.nom}\n\nDescription : ${metier.description}\n\nLien avec ton parcours : formations possibles : ${metier.formations}`,
  );
  return `Voici 3 pistes en lien avec ton parcours :\n\n${blocs.join("\n\n")}\n\n${RAPPEL}`;
}

function choisirMetiers(texte) {
  const scores = METIERS.map((metier) => ({
    metier,
    score: metier.motsCles.filter((mot) => texte.includes(mot)).length,
  }));
  scores.sort((a, b) => b.score - a.score);
  return scores.slice(0, 3).map((entree) => entree.metier);
}

// Tolérance : un message à peine trop long (jusqu'à 300 caractères) reste accepté.
export function validateMessage(raw) {
  const resultat = validerMessageStrict(raw);
  if (resultat.ok || typeof raw !== 'string') {
    return resultat;
  }
  const value = raw.trim();
  if (value !== '' && value.length <= 300) {
    return { ok: true, value };
  }
  return resultat;
}
