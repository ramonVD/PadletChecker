
export const possibleLanguages = ["EN", "ESP", "CAT"];

const words = {			CAT: [ 	
						"Comprovant els missatges del Padlet...", 
						"És la teva primera visita, acabo de guardar les dades dels missatges existents, torna a mirar en una estona!",
						"ATENCIÓ: ",
						" missatges(s) afegits, ",
						" missatges(s) eliminats des de la teva última comprovació",
						" Cap canvi des de l'última comprovació",
						"S'ha produït un error obtenint les dades, torna-ho a intentar...",
						"Comprovant les dades del Padlet...",
						"Comprova un altre cop els missatges del Padlet!",
						"Hi ha nous missatges al meu ",
						"Última comprovació: ",
						"Llenguatge: ",
						"Obre el llistat de missatges actuals",
						"Missatges al Padlet",
						"Nou!",
						"No s'ha pogut trobar cap missatge!",
						"Torna a dalt",
						"Tanca el llistat de missatges actuals"
						],
						ESP: [
						"Comprobando los mensajes del Padlet...", 
						"Es tu primera visita, acabo de guardar los datos de los mensajes existentes, vuelve a mirar en un rato!",
						"ATENCIÓN: ",
						" mensajes(s) añadidos, ",
						" mensaje(s) eliminados des de tu última comprobación",
						" Sin cambios desde la última comprobación",
						"Se ha producido un error obteniendo los datos, vuelve a probar...",
						"Comprobando los datos del Padlet...",
						"Comprueba otra vez los mensajes del Padlet!",
						"Hay nuevos mensajes en mi ",
						"Última comprobación: ",
						"Lenguaje: ",
						"Abre el listado de mensajes actuales",
						"Mensajes en el Padlet",
						"Nuevo!",
						"No se ha podido encontrar ningún mensaje",
						"Vuelve arriba",
						"Cierra el listado de mensajes actuales"
						],
						EN: [
						"Checking Padlets' messages...", 
						"It's your first visit, I've saved existent message data, check again in a couple minutes!",
						"ATTENTION: ",
						" message(s) added, ",
						" message(s) removed since you last checked",
						" No change since you last checked",
						"An error has occurred obtaining the data. Please try again...",
						"Checking Padlet data...",
						"Check Padlet's messages again!",
						"Are there new messages in my ",
						"Last check: ",
						"Language: ",
						"Open the actual message list",
						"Padlet message list",
						"New!",
						"Couldn't find any message",
						"Go up",
						"Close the actual message list"
						]
					};



export function getWord(lang, wordPos) {
	if (words[lang] === undefined || words[lang].length < wordPos) { return "LANGUAGE ERROR";}
	return words[lang][wordPos];
}
