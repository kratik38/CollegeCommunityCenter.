import React, { useEffect } from 'react';
import {Button, View,Text,StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../components/CustomHeaderButton';
import { useSelector } from 'react-redux';
import DataItem from '../components/DataItem';
import PageContainer from '../components/PageContainer';
import PageTitle from '../components/PageTitle';
import colors from '../constants/colors';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

const ChatListScreen = props => {
	
	const selectedUser = props.route?.params?.selectedUserId;
	const selectedUserList = props.route?.params?.selectedUsers;
	const chatName = props.route?.params?.chatName;
	
	const userData = useSelector(state => state.auth.userData);
	const storedUsers = useSelector(state=>state.users.storedUsers);
	const userChats = useSelector(state=>{
		const chatsData = state.chats.chatsData
		return Object.values(chatsData).sort((a,b)=>{
			return new Date(b.updatedAt) - new Date(a.updatedAt);
		});	
	});


	useEffect(()=>{
			props.navigation.setOptions({
				headerRight:()=>{
						return <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
						<View style={styles.headerButtonContainer}>
							<FontAwesome name="search" size={20} color={colors.blue} />
						<Item
						title="Search Admin"
						iconName=""
						IconComponent={MaterialCommunityIcons}
						onPress={()=>props.navigation.navigate("NewChat")}/>
						</View>
					</HeaderButtons>
				}
			})
	},[]);

	useEffect(()=>{

		if(!selectedUser && !selectedUserList){
			return;
		}

		let chatData;
		let navigationProps;

		if(selectedUser){
			chatData = userChats.find(cd => !cd.isGroupChat && cd.users.includes(selectedUser))
		}

		if(chatData){
			navigationProps = { chatId:chatData.key }
		}
		else{
			const chatUsers = selectedUserList || [selectedUser];
	  	if(!chatUsers.includes(userData.userId)){
		   	chatUsers.push(userData.userId);
		  }
			
		 navigationProps = {
			newChatData : { 
			 users : chatUsers,
			 isGroupChat: selectedUserList !== undefined,
			 chatName
		  }
		}
	  }

		props.navigation.navigate("ChatScreen", navigationProps);

	},[props.route?.params,chatName]);

	return <PageContainer>

				<PageTitle text="Communitites"/>
				
				<TouchableOpacity style={styles.newGroupTextContainer}
					onPress={()=>props.navigation.navigate("NewChat",{isGroupChat:true})}>
						<View style={{margin:4}}>
					    <FontAwesome name="plus" size={17} color={colors.blue}/>
						</View>
					<Text style={styles.newGroupText}>
						Create Community
					</Text>
				</TouchableOpacity>
				<FlatList 
	        data = {userChats}
					renderItem={(itemData)=>{
						const chatData = itemData.item;
						const chatId = chatData.key;
						const isGroupChat = chatData.isGroupChat;

						let title="";
						const subTitle = chatData.latestMessageText || "New chat";
						let image="";

						if(isGroupChat){
							title = chatData.chatName;
							image = chatData.chatImage;
						}
						else{
						const otherUserId = chatData.users.find(uid => uid !== userData.userId);
						const otherUser = storedUsers[otherUserId];				

						if(!otherUser) return;

						title = `${otherUser.firstName} ${otherUser.lastName}`;
						image = otherUser.profilePicture;
						}
						return <DataItem 
										type={"chatList"}
						        title={title}
										subTitle={subTitle}
										image={image}
										onPress={()=> props.navigation.navigate("ChatScreen",{chatId})}
										/>

					}}/>
	</PageContainer>
}

const styles = StyleSheet.create({
container:{
	flex:1,
	justifyContent:'center',
	alignItems:'center',
	backgroundColor: '#FFFFFF'
},
newGroupTextContainer:{
	flexDirection:'row',
	borderRadius:10,
	backgroundColor:colors.lightYellow,
	margin:10,
	width:200,
	padding:3
},
newGroupText:{
	marginLeft:10,
	marginTop:1,
	color:colors.textColor,
	fontSize:17,
	marginBottom:5
},
buttonContainer: {
	backgroundColor: '#2E9298',
	borderRadius: 10,
	padding: 10,
	shadowColor: '#000000',
	shadowOffset: {
		width: 0,
		height: 3
	},
	shadowRadius: 5,
	shadowOpacity: 1.0
},
headerButtonContainer:{
	flexDirection:'row',
	backgroundColor:colors.lightYellow,
	padding:5,
	borderRadius:15,
	margin:3,
}
});
export default ChatListScreen;