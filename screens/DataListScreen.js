import React, { useEffect } from "react";
import { FlatList, Text } from "react-native";
import PageContainer from "../components/PageContainer";
import { useSelector } from "react-redux";
import DataItem from "../components/DataItem";
import { formatAmPm } from "../components/Bubble";

const DataListScreen = props=>{

	const {title,data,type,chatId} = props.route.params;
	const storedUsers = useSelector(state=>state.users.storedUsers);
	const userData = useSelector(state=>state.auth.userData);
	const messagesData = useSelector(state=>state.messages.messagesData);

	useEffect(()=>{
		props.navigation.setOptions({headerTitle:title})
	},[title]);

	return <PageContainer>
				<FlatList
				 data={data}
				 keyExtractor={item=> item.messageId || item}
				 renderItem={(itemData)=>{
						let key, onPress, image, title, subTitle, itemType,day,date;

						if(type==="users")
						{
							const uid = itemData.item;
							const currentUser = storedUsers[uid];

							if(!currentUser) return;

							const isLoggedInUser = uid===userData.userId;

							key = uid;
							image = currentUser.profilePicture;
							title = `${currentUser.firstName} ${currentUser.lastName}`
							subTitle = currentUser.about;
							itemType = isLoggedInUser ? undefined : "link"; 
							onPress = isLoggedInUser ? undefined : ()=>{props.navigation.navigate("Contact",{uid, chatId})}
						}
						else if(type==="messages")
						{
							const starData = itemData.item;

							const {chatId, messageId} = starData;
							const messagesForChat = messagesData[chatId];
							if(!messagesForChat) return;

							const messageData = messagesForChat[messageId];
							const sender = messageData.sentBy && storedUsers[messageData.sentBy];
							const name = sender && `${sender.firstName} ${sender.lastName}`;


							key = messageId;
							title = name;
							subTitle = messageData.text; 
							itemType = "";
							onPress = ()=>{}
						}
						else if(type==='notice'){

							title = itemData.item.messageText;
							const storedDate = itemData.item.putAt;
							const d = new Date(storedDate);
						  day = d.getDay(storedDate);
							date = data && formatAmPm(storedDate);
							key = itemData.item.chatId.messageId;
							onPress = ()=>{}
							itemType = "notice"
						}

						return <DataItem
						        key={key}
										onPress={onPress}
										image={image}
										title={title}
										hideImage={true}
										subTitle={subTitle}
										type={itemType}
										date={date}
										day={day}
										/>

				 }}
				/>
	</PageContainer>
}

export default DataListScreen;