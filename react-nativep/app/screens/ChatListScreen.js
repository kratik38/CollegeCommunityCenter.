import React, { useEffect } from 'react';
import {Button, View,Text,StyleSheet } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../components/CustomHeaderButton';
import { useSelector } from 'react-redux';

const ChatListScreen = props => {
	
	const selectedUser = props.route?.params?.selectedUserId;
	const userData = useSelector(state => state.auth.userData);

	const userChats = useSelector(state=>state.chats.chatsData);
	console.log(userChats);

	useEffect(()=>{
			props.navigation.setOptions({
				headerRight:()=>{
						return <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
						<Item
						title="New chat"
						iconName='create-outline'
						onPress={()=>props.navigation.navigate("NewChat")}/>
					</HeaderButtons>
				}
			})
	},[]);

	useEffect(()=>{

		if(!selectedUser){
			return;
		}

		const chatUsers = [selectedUser,userData.userId];

		const navigationProps = {
			newChatData : { users : chatUsers }
		}

		props.navigation.navigate("ChatScreen", navigationProps);

	},[props.route?.params]);

	return <View style={styles.container}>
		<Text>This is the chat list screen.</Text>
		<Button title="go to Chat Screen" onPress={()=>{props.navigation.navigate("ChatScreen")}}/>
		<Button title="go to Chat settings" onPress={()=>{props.navigation.navigate("ChatSettings")}}/>
	</View>
}

const styles = StyleSheet.create({
container:{
	flex:1,
	justifyContent:'center',
	alignItems:'center'
}
});
export default ChatListScreen;