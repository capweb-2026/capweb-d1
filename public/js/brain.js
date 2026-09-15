export function validateMessage(raw) {
  if (typeof raw !== "string") {
    return {
      ok: false,
      error: "Le message doit être une chaîne de caractères",
    };
  }
  const value = raw.trim();
  if (value === "") {
    return { ok: false, error: "Les message ne peuvent pas être vides" };
  }
  if (value.length > 280) {
    return {
      ok: false,
      error: "Les message ne peuvent pas dépasser 280 caractères",
    };
  }
  return { ok: true, value };
}

export function replyTo(message) {
  const texte = message.trim().toLowerCase();
  if (texte === "bonjour" || texte === "salut") {
    return "Bonjour ! Comment puis-je vous aider aujourd'hui ?";
  }
  if (texte === "aide") {
    return " En quoi puis-je vous aider ?";
  }
  if (texte === "test") {
    return "Ceci est un message de test";
  }

  else {
    return "Je suis désolé, je n'ai pas compris votre message. Pouvez-vous reformuler ?";
  }
}
