import { validateMessage, replyTo } from "./brain.js";
import { renderMessages } from "./view.js";

const formulaire = document.querySelector("#chat-form");
const statut = document.querySelector("#status");
const versionElt = document.querySelector("#version");

const champ = document.querySelector("#message");
const liste = document.querySelector("#messages");
const boutonEffacer = document.querySelector("#effacer");

let historique = [];

const donneesHistorique = localStorage.setItem(
  "capweb.historique",
  JSON.stringify(historique),
);

// J1 : interface seule, on bloque l’envoi et on l’explique.
// ...existing code...

formulaire?.addEventListener("submit", (event) => {
  event.preventDefault();

  const message = champ.value.trim();
  const validation = validateMessage(message);

  if (!validation.ok) {
    statut.textContent = validation.error;
    return;
  }

  historique.push({
    role: "user",
    text: validation.value,
  });

  const reponse = replyTo(validation.value);

  if (reponse) {
    historique.push({
      role: "assistant",
      text: reponse,
    });
  }

  try {
    if (donneesHistorique) {
      historique = JSON.parse(donneesHistorique);
      console.log(
        "Historique chargé depuis le stockage local :",
        donneesHistorique,
      );
    }
    console.log(historique);
  } catch (error) {
    console.error("Erreur lors de l'analyse du JSON :", error);
  }

  renderMessages(historique, liste);

  champ.value = "";
  champ.focus();
});

function effacerHistorique() {
  if (historique.length > 0) {
    historique = [];
    localStorage.removeItem("capweb.historique");
    renderMessages(historique, liste);
    console.log("Historique supprimé du stockage local");
  } else {
    console.log("Aucun historique à supprimer");
  }
}

boutonEffacer?.addEventListener("click", effacerHistorique);

// ...existing code...

// Version du serveur local, échec discret si indisponible.
fetch("/version.json", { headers: { accept: "application/json" } })
  .then((reponse) => (reponse.ok ? reponse.json() : null))
  .then((donnees) => {
    if (donnees && typeof donnees.version === "string" && versionElt) {
      versionElt.textContent = `version ${donnees.version}`;
    }
  })
  .catch(() => {});
