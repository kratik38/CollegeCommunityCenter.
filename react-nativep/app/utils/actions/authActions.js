import { getFirebaseApp } from "../firebaseHelper";
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { child, getDatabase, ref, set } from 'firebase/database';
import { authenticate } from "../../store/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const signUp = (firstName,lastName,email,password) =>{
	return async dispatch =>{

		const app = getFirebaseApp();
		const auth = getAuth(app);

		try {
				const result = await createUserWithEmailAndPassword(auth,email,password);	
				//uid is the uid column in user section in authentication in firebase
				const { uid,stsTokenManager  } = result.user;
				const { accessToken,expirationTime } = stsTokenManager;
				const expiryDate = new Date(expirationTime);

				const userData = await createUser(firstName,lastName,email,uid);
				  dispatch(authenticate({token:accessToken,userData}));
					saveDateToStorage(accessToken,uid,expiryDate);

		} catch (error) {
			const errorCode = error.code;

			console.log(error);

			let message = "Something went wrong.";

			if(errorCode==="auth/email-already-in-use"){
				message = "This email is already in use";
			}

			throw new Error(message);
		}
	}
}

const createUser = async (firstName,lastName,email,userId)=>{
	 const firstLast = `${firstName} ${lastName}`.toLowerCase();
	 const userData = {
			firstName,
			lastName,
			firstLast,
			email,
			userId,
			signUpDate: new Date().toISOString() 
	 }	
	//creating database reference and creating location to store data of every user by childRef and set data in childRef 
	 const dbRef = ref(getDatabase());
	 const childRef = child(dbRef,`users/${userId}`);
	 await set(childRef,userData);
	 return userData;
}

const saveDateToStorage = (token,userId,expiryDate)=>{
	AsyncStorage.setItem("userData",JSON.stringify({
		token,
		userId,
		expiryDate: expiryDate.toISOString(),
	}));			
}