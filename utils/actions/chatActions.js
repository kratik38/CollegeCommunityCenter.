import { getFirebaseApp } from '../firebaseHelper';
import { ref,child,push,getDatabase, update, get, set, remove } from 'firebase/database';
import { addUserChat, deleteUserChat, getUserChats } from './userActions';
import { getUserPushTokens } from './authActions';

export const createChat = async (loggedInUserId,chatData)=>{
	
	if(chatData.chatName===undefined) chatData.chatName = "";{/* added after */}

	const newChatData = {
		...chatData,
		createdBy: loggedInUserId,
		updatedBy:loggedInUserId,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	}

	const app = getFirebaseApp();
	const dbRef = ref(getDatabase(app));
	const newChat = await push(child(dbRef,'chats'),newChatData);
	const chatUsers = newChatData.users;
	for (let i = 0; i < chatUsers.length; i++) {
		const userId = chatUsers[i];
		await push(child(dbRef,`userChats/${userId}`),newChat.key);
	}

	return newChat.key;
}

export const sendTextMessage = async (chatId,senderData,messageText, replyTo,chatUsers)=>{

	await sendMessage(chatId,senderData.userId,messageText,null,replyTo,null);	

	const otherUsers = chatUsers.filter(uid=>uid!==senderData.userId);
	await sendPushNotificationForUsers(otherUsers,`${senderData.firstName} ${senderData.lastName}`, messageText,chatId)

}

export const sendInfoMessage = async (chatId,senderId,messageText)=>{

	await sendMessage(chatId,senderId,messageText,null,null,"info");	
}

export const sendImage = async (chatId,senderData,imageUrl, replyTo,chatUsers)=>{

	await sendMessage(chatId,senderId,'Image',imageUrl,replyTo,null);	

	const otherUsers = chatUsers.filter(uid=>uid!==senderData.userId);
	await sendPushNotificationForUsers(otherUsers,`${senderData.firstName} ${senderData.lastName}`, `${senderData.firstName} send an image`,chatId);
}

export const updateChatData = async (chatId, userId, chatData)=>{
		const app = getFirebaseApp();
		const dbRef = ref(getDatabase(app));
		const chatRef = child(dbRef,`chats/${chatId}`);

		await update(chatRef,{
			...chatData,
			updatedAt:new Date().toISOString(),
			updatedBy:userId
		})
		
}


export const sendMessage = async (chatId,senderId,messageText,imageUrl, replyTo,type)=>{

	const app = getFirebaseApp();
	const dbRef = ref(getDatabase(app));
	const messageRef = child(dbRef,`messages/${chatId}`);

	const messageData = {
		sentBy : senderId,
		sentAt : new Date().toISOString(),
		text : messageText
	}

	if(replyTo){
		messageData.replyTo = replyTo;
	}

	if(imageUrl){
		messageData.imageUrl = imageUrl;
	}

	if(type){
		messageData.type = type;
	}

	await push(messageRef,messageData);

	const chatRef = child(dbRef,`chats/${chatId}`);
	await update(chatRef,{
		updatedBy: senderId,
		updatedAt: new Date().toISOString(),
		latestMessageText: messageText
	});
}


export const starMessage= async (messageId,chatId,userId)=>{

try {
	const app = getFirebaseApp();
	const dbRef = ref(getDatabase(app));
	const childRef = child(dbRef,`userStarredMessages/${userId}/${chatId}/${messageId}`);

	const snapShot = await get(childRef);

		if(snapShot.exists()){
			//unstar
			await remove(childRef);
		}
		else{
			const starredMessage = {
				messageId,
				chatId,
				starredAt:new Date().toISOString()
			}	

			await set(childRef,starredMessage);
		}
		
	} catch (error) {
		console.log(error);	
	}
}

export const removeUserFromChat = async (userLoggedInData,userToRemoveData,chatData)=>{
	   const userToRemoveId = userToRemoveData.userId;

		 const newUsers = chatData.users.filter(uid=>uid!==userToRemoveId);
		 await updateChatData(chatData.key,userLoggedInData.userId,{ users: newUsers });
		 
		 const userChats = await getUserChats(userToRemoveId);

		 for(const key in userChats){
				const currentChatId = userChats[key];

				if(currentChatId===chatData.key){
					await deleteUserChat(userToRemoveId,key);
						break;
				}
		 }
		 
		 const messageText = userLoggedInData.userId === userToRemoveData.userId ?
		 	`${userLoggedInData.firstName} left the chat`:
		  `${userLoggedInData.firstName} removed ${userToRemoveData.firstName} from the chat`; 
		 
		 await sendInfoMessage(chatData.key,userLoggedInData.userId,messageText);
}

export const addUsersToChat = async (userLoggedInData,userToAddData,chatData)=>{

	const existingUsers = Object.values(chatData.users);
	const newUsers = [];

	let UserAddedName = '';

	userToAddData.forEach(async userToAdd => {
			const userToAddId = userToAdd.userId;

			if(existingUsers.includes(userToAddId)) return;

			newUsers.push(userToAddId);

			await addUserChat(userToAddId,chatData.key);

			UserAddedName = `${userToAdd.firstName} ${userToAdd.lastName}`;
	});

	if(newUsers.length===0) return;
	
	await updateChatData(chatData.key,userLoggedInData.userId,{users:existingUsers.concat(newUsers)})

	const moreUsersMessage = newUsers.length > 1 ? `and ${newUsers.length-1} others ` : '';
	const messageText = `${userLoggedInData.firstName} ${userLoggedInData.lastName} added ${UserAddedName} ${moreUsersMessage}to the chat`;

	await sendInfoMessage(chatData.key, userLoggedInData.userId, messageText);
}

const sendPushNotificationForUsers = (chatUsers, title, body,chatId) =>{
	 chatUsers.forEach(async uid=>{

		 const tokens = await getUserPushTokens(uid);	
		  for(const key in tokens){
				 const token = tokens[key];

				 await fetch("https://exp.host/--/api/v2/push/send", {
					method:"POST",
					headers:{
						'Content-Type':'application/json'
					},
					body:JSON.stringify({
						to:token,
						title,
						body,
						data:{chatId}
					})
				 });
			}
	 })
}