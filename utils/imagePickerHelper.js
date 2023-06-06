import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';
import { getFirebaseApp } from './firebaseHelper';
import uuid from 'react-native-uuid';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

export const launchImagePicker = async ()=>{
		await checkMediaPermissions();

		const result = await ImagePicker.launchImageLibraryAsync({
			allowsEditing:true,
			aspect:[1,1],
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			quality:1
		})
		if(!result.canceled)
	  	return result.uri;
}

export const openCamera = async ()=>{

		const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
		
		if(permissionResult.granted===false){
			console.log('No permission to access the camera');
			return;
		}

		const result = await ImagePicker.launchCameraAsync({
			allowsEditing:true,
			aspect:[1,1],
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			quality:1
		})
		if(!result.canceled)
	  	return result.uri;
}

export const uploadImageAsync = async (uri,isChatImage=false)=>{
	const app = getFirebaseApp();
	
	const blob = await new Promise((resolve,reject)=>{
			const xhr = new XMLHttpRequest();
			xhr.onload = function(){
				 resolve(xhr.response);
			}
			xhr.onerror = function(e){
				console.log(e);
				reject(new TypeError("Network request failed"));
			}

			xhr.responseType = "blob";
			xhr.open('GET',uri,true);
			xhr.send();
	});

	const pathFolder = isChatImage? 'chatImages':'profilePics';
	const storageRef = ref(getStorage(app),`${pathFolder}/${uuid.v4()}`);

	await uploadBytesResumable(storageRef,blob);

	blob.close();

	return await getDownloadURL(storageRef);
}

const checkMediaPermissions = async ()=>{
			if(Platform.OS !== 'web'){
				const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

				if(permissionResult.granted === false){
					return Promise.reject("we need permission to access your photos");
				}
				
				return Promise.resolve();
			}
}	