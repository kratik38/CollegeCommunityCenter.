import React,{ useCallback, useEffect, useState } from 'react';
import { View,TextInput,StyleSheet,ImageBackground, TouchableOpacity,KeyboardAvoidingView, Platform, } from 'react-native';
import backgroundImage from '../assets/image/droplet.jpeg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import colors from '../constants/colors';
import { useSelector } from 'react-redux';
import PageContainer from '../components/PageContainer';
import Bubble from '../components/Bubble';
import { createChat , sendTextMessage } from '../utils/actions/chatActions';

const ChatScreen = props => {

	const userData = useSelector(state=>state.auth.userData);
	const storedUsers = useSelector(state=>state.users.storedUsers);
	const storedChats = useSelector(state=>state.chats.chatsData);


	const [chatUsers,setChatUsers] = useState([]);
	const [messageText,setMessageText] = useState("");
	const [chatId,setChatId] = useState(props.route?.params?.chatId);

	const chatData = (chatId && storedChats[chatId]) || props.route?.params?.newChatData;

	const getChatTitleFromName = ()=>{
		const otherUserId = chatUsers.find(uid=>uid!==userData.userId);
		const otherUserData = storedUsers[otherUserId];

		return otherUserData && `${otherUserData.firstName} ${otherUserData.lastName}`;
	}

	useEffect(()=>{

		props.navigation.setOptions({
			headerTitle:getChatTitleFromName()
		})

		setChatUsers(chatData.users);
	},[chatUsers]);


	const sendMessage = useCallback(async ()=>{
		
		try {

			let id = chatId;

			if(!id){
				id = await createChat(userData.userId, props.route.params.newChatData);
				setChatId(id);
			}

			await sendTextMessage(chatId, userData.userId, messageText);
			
		} catch (error) {
			console.log(error);
		}

			
			setMessageText("");
	},[messageText,chatId]);

	return (
		<SafeAreaView
		 edges = {['right','left','bottom']}
		 style={styles.container}
		>
			<KeyboardAvoidingView style={styles.screen}
			keyboardVerticalOffset={100}
			behavior={Platform.OS==="ios"?"padding":undefined}>
			<ImageBackground source={backgroundImage} style={styles.backgroundImage}>

				<PageContainer style={{backgroundColor:'transparent'}}>
					{
						!chatId && <Bubble text="This is a new chat say hi!" type="system"/>
					}
				
				</PageContainer>		

			</ImageBackground>	
			<View style={styles.inputContainer}>
				<TouchableOpacity style={styles.mediaButton} onPress={()=>{console.log('pressed')}}>
				 <Feather name="plus" size={24} color={colors.blue}/>	
				</TouchableOpacity>
				<TextInput style={styles.textBox} value={messageText} onSubmitEditing={sendMessage} onChangeText={text=> setMessageText(text)}/>
				{
					messageText==="" &&
					<TouchableOpacity style={styles.mediaButton} onPress={()=>{console.log('Pressed')}}>
						<Feather name="camera" size={24} color={colors.blue}/>
					</TouchableOpacity>
				}
				{
					messageText!=="" &&
					<TouchableOpacity style={{...styles.mediaButton,...styles.sendButton}} onPress={sendMessage}>
						<Feather name="send"  size={20} color='white'/>
					</TouchableOpacity>
				}
			</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
container:{
	flex:1,
	flexDirection:'column',
},
screen:{
	flex:1
},
backgroundImage:{
	flex:1,
},
inputContainer:{
	flexDirection:'row',
	paddingVertical:8,
	paddingHorizontal:10,
	height:50
},
textBox:{
	flex:1,
	borderWidth:1,
	borderRadius:15,
	borderColor:colors.lightGrey,
	marginHorizontal:15,
	paddingHorizontal:12,		
},
mediaButton:{
	justifyContent:'center',
	alignItems:'center',
	width:35,
},
sendButton:{
	backgroundColor:colors.blue,
	borderRadius:50,
	padding:8,
}
});

export default ChatScreen;