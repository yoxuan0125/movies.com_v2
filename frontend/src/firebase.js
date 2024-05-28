import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import Cookies from "js-cookie";

const firebaseConfig = {
	apiKey: "AIzaSyCkTXcu9Hrq6f5ruHSQUHzwD_pPi5wG_LI",
	authDomain: "movies-com-65eae.firebaseapp.com",
	projectId: "movies-com-65eae",
	storageBucket: "movies-com-65eae.appspot.com",
	messagingSenderId: "674877073835",
	appId: "1:674877073835:web:552656b271d30cd8d88aee",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth, db };

export function SignIn() {
	const provider = new GoogleAuthProvider();

	signInWithPopup(auth, provider)
		.then((res) => {
			console.log("Signed In");
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			const email = error.email;
			const credential = GoogleAuthProvider.credentialFromError(error);
		});
}

export function SignOut() {
	auth
		.signOut()
		.then(() => {
			localStorage.clear()
			Cookies.remove("jwt")
			console.log("Signed Out");
			window.location.href = "/";
		})
		.catch((error) => {
			console.log(error);
		});
}
