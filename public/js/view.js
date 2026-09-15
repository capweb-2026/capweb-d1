export function renderMessages(messages, container) {
	const lignes = messages.map((msg) => {
		const li = document.createElement("li");
		li.textContent = "Cap-Web : " + msg.role + " : " + msg.text;
		return li;
	});
	container.replaceChildren(...lignes);
}