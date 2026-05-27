// Persistent per-browser session id (no login required).
const KEY = "obc.sessionId";

export function getSessionId() {
	if (typeof window === "undefined") return "00000000-0000-0000-0000-000000000000";
	let id = localStorage.getItem(KEY);
	if (!id) {
		id = crypto.randomUUID();
		localStorage.setItem(KEY, id);
	}
	return id;
}

const NICK_KEY = "obc.nickname";
export function getStoredNickname() {
	if (typeof window === "undefined") return "";

	// Pull from Elementopia's main user session
	try {
		const userStr = localStorage.getItem("elementopia_current_user");
		if (userStr) {
			const user = JSON.parse(userStr);
			if (user && user.username) {
				return user.username;
			}
		}
	} catch {
		// Ignore parse errors
	}

	// Fallback to older session keys or default
	return sessionStorage.getItem("nickname") || localStorage.getItem(NICK_KEY) || "Alchemist";
}
export function setStoredNickname(name) {
	if (typeof window === "undefined") return;
	localStorage.setItem(NICK_KEY, name);
	try {
		const userStr = localStorage.getItem("elementopia_current_user");
		if (userStr) {
			const user = JSON.parse(userStr);
			if (user) {
				user.username = name;
				user.firstName = name;
				localStorage.setItem("elementopia_current_user", JSON.stringify(user));
			}
		} else {
			const user = {
				userId: "user_" + Math.floor(Math.random() * 1000000),
				username: name,
				firstName: name,
				lastName: "User",
				role: "STUDENT"
			};
			localStorage.setItem("elementopia_current_user", JSON.stringify(user));
		}
	} catch {
		// Ignore
	}
}

const CHEM_NAMES = [
	"Neon", "Argon", "Xenon", "Krypton", "Helium", "Radon",
	"Iron", "Copper", "Silver", "Gold", "Cobalt", "Zinc",
	"Carbon", "Sulfur", "Iodine", "Boron", "Cesium", "Lithium",
];
export function autoNickname() {
	const n = CHEM_NAMES[Math.floor(Math.random() * CHEM_NAMES.length)];
	return `${n}_${Math.floor(Math.random() * 90 + 10)}`;
}
