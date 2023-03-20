import React from 'react';
import { View,Text,StyleSheet } from 'react-native';

const ChatSettingsScreen = props => {

	return <View style={styles.container}>
		<Text>This is the chat setting screen.</Text>
	</View>
}

const styles = StyleSheet.create({
container:{
	flex:1,
	justifyContent:'center',
	alignItems:'center'
}
});
export default ChatSettingsScreen;