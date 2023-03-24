import React, {
	useState,
	useLayoutEffect,
	useCallback
} from "react";
import { TouchableOpacity } from "react-native";
import { GiftedChat } from 'react-native-gifted-chat';
import {
	collection,
	addDoc,
	orderBy,
	query,
	onSnapshot
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native'
import { auth,database } from '../config/firebase';
import { AntDesign } from '@expo/vector-icons';
import colors from '../colors';

export default function Chat(){
	
	 const [messages,setMessages] = useState([]);
	 const navigation = useNavigation();

	 const onSignOut = ()=>{
			signOut(auth).catch(err=>console.log('logout error',err));
	 };

	 useLayoutEffect(()=>{
		navigation.setOptions({
			headerRight:()=>(
				<TouchableOpacity 
				style={
					{marginRight:10}
				}
				onPress={onSignOut}
				>
					<AntDesign name="logout" size={25} color={colors.grey} style={{marginRight:10}}/>
				</TouchableOpacity>
			)
		});
	 },[navigation]);

	 useLayoutEffect(()=>{
		const collectionRef = collection(database,'chats');
		const q = query(collectionRef,orderBy('createdAt','desc')); 

		const updateMessages = onSnapshot(q,snapshot=>
			{
				console.log('snapshot');
				setMessages(
					snapshot.docs.map(doc=>({
						_id: doc.id,
						createAt:doc.data().createAt,
						text:doc.data().text,
						user:doc.data().user,
					}))
				)
			});

			return updateMessages;
	 },[]);

	 const onSend = useCallback((messages=[])=>{
			setMessages(previousMessages=>GiftedChat.append(previousMessages,messages));
			
			const {_id,createdAt,text,user} = messages[0];
			addDoc(collection(database,'chats'),{
				_id,
				createdAt,
				text,
				user
			});
	 },[]);

	return (
		<GiftedChat
			messages={messages}
			onSend={messages=>onSend(messages)}
			user={{
				_id:auth?.currentUser?.email,
				avatar: 'https://i.pravatar.cc/300'
			}}	
			messagesContainerStyle={
				{
					backgroundColor:'#f3f1f1'
				}
			}
		/>
	)
} 