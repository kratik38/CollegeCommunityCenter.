import React from 'react';
import {Button, View,Text,StyleSheet } from 'react-native';

const ChatListScreen = props => {

	return <View style={styles.container}>
		<Text>This is the chat list screen.</Text>
		<Button title="go to Chat Screen" onPress={()=>{props.navigation.navigate("ChatScreen")}}/>
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