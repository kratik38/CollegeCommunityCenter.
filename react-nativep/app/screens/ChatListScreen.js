import React, { useEffect } from 'react';
import {Button, View,Text,StyleSheet } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../components/CustomHeaderButton';

const ChatListScreen = props => {

	useEffect(()=>{
			props.navigation.setOptions({
				headerRight:()=>{
						return <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
						<Item
						title="New chat"
						iconName='create-outline'
						onPress={()=>{

						}}/>
					</HeaderButtons>
				}
			})
	},[]);

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