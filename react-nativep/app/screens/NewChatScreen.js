import React, { useEffect } from 'react';
import {View,Text,StyleSheet } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../components/CustomHeaderButton';

const NewChatScreen = props => {

	useEffect(()=>{
			props.navigation.setOptions({
				headerLeft:()=>{
						return <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
						<Item
						title="Close"
						onPress={()=>props.navigation.goBack()}/>
					</HeaderButtons>
				},
				headerTitle:"New chat"
			})
	},[]);

	return <View style={styles.container}>
		<Text>This is the New chat screen.</Text>
	</View>
}

const styles = StyleSheet.create({
container:{
	flex:1,
	justifyContent:'center',
	alignItems:'center'
}
});
export default NewChatScreen;