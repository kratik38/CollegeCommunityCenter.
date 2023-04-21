import React, { useEffect, useRef, useState } from 'react';
import {View,Text,StyleSheet, TextInput, ActivityIndicator, FlatList } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../components/CustomHeaderButton';
import { FontAwesome } from '@expo/vector-icons';
import colors from '../constants/colors';
import PageContainer from '../components/PageContainer';
import commonStyles from '../constants/commonStyles';
import { searchUsers } from '../utils/actions/userActions';
import DataItem from '../components/DataItem';
import { useDispatch, useSelector } from 'react-redux';
import { setStoredUsers } from '../store/userSlice';
import ProfileImage from '../components/ProfileImage';

const NewChatScreen = props => {

	const dispatch = useDispatch();

	const [isLoading,setIsLoading] = useState(false);
	const [users,setUsers] = useState();
	const [noResultsFound,setNoResultsFound] = useState(false);
	const [searchTerm,setSearchTerm] = useState('');
	const [chatName,setChatName] = useState("");
	const [selectedUsers,setSelectedUsers] = useState([]);

	const selectedUsersFlatList = useRef();

	const userData = useSelector(state=>state.auth.userData);
	const storedUsers = useSelector(state=>state.users.storedUsers);

	const isGroupChat = props.route.params && props.route.params.isGroupChat;
	const isGroupChatDisabled = selectedUsers === 0 || chatName === "";

	useEffect(()=>{
			props.navigation.setOptions({
				headerLeft:()=>{
						return <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
						<Item
						title="Close"
						onPress={()=>props.navigation.goBack()}/>
					</HeaderButtons>
				},
				headerRight:()=>{
						return <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
					{ isGroupChat &&
						<Item
						title="Create"
						disabled={isGroupChatDisabled}
						color={isGroupChatDisabled? colors.lightGrey:undefined}
						onPress={()=>{}}/>

					}
					</HeaderButtons>
				},
				headerTitle: isGroupChat? "Add participants":"New chat"
			})
	},[chatName,selectedUsers]);

	useEffect(()=>{
	const delaySearch = setTimeout(async ()=>{
			if(!searchTerm || searchTerm===""){
				setUsers();
				setNoResultsFound(false);
				return;	
			}

			setIsLoading(true);

			const userResult = await searchUsers(searchTerm);
			delete userResult[userData.userId];
			setUsers(userResult);

			if(Object.keys(userResult).length === 0 )
			{
				setNoResultsFound(true);
			}
			else{
				setNoResultsFound(false);

				dispatch(setStoredUsers({ newUsers: userResult }));
			}

			setIsLoading(false);
		},500);

		return ()=> clearTimeout(delaySearch);
	},[searchTerm])

	const userPressed = userId => {
		if(isGroupChat){
			const newSelectedUsers = selectedUsers.includes(userId)?
			      selectedUsers.filter(id=> id !== userId):
						selectedUsers.concat(userId);
			
			setSelectedUsers(newSelectedUsers);
		}
		else{
			props.navigation.navigate("ChatList",{
				selectedUserId : userId
			})
		}
	}

	return <PageContainer>

		{
			isGroupChat &&
			<>
			<View style={styles.chatNameContainer}>
				<View style={styles.inputContainer}>
					<TextInput
					 style={styles.textBox}
					 placeholder='Enter a name for your chat'
					 autoCorrect={false}
					 autoComplete={false}
					 onChangeText={text=> setChatName(text)}
					/>
				</View>
			</View>

			<View style={styles.selectedUsersContainer}>
				 <FlatList 
				   style={styles.selectedUsersList}
					 contentContainerStyle={{alignItems:'center'}}
					 ref={ref => selectedUsersFlatList.current = ref}
					 //bug auto scrolltoend is not working right now 
					 onContentSizeChange={() =>{}}
					 data={selectedUsers}
					 horizontal={true}
					 keyExtractor={item=>item}
					 renderItem={ itemData=>{
					   const userId = itemData.item;
						 const userData = storedUsers[userId]
						 return <ProfileImage
						 						style={styles.selectedUserStyle}
						            size={40}
												uri={userData.profilePicture}
												onPress={()=>userPressed(userId)}
												showRemoveButton={true}
										/>
					 }}
				 />
			</View>
			</>
		}
			<View style={styles.searchContainer}>
				<FontAwesome name="search" size={15} color={colors.lightGrey} />
				<TextInput 
					placeholder='Search'
					style={styles.searchBox}
					onChangeText={(text)=>setSearchTerm(text)}/>
			</View>

			{
				isLoading &&
				<View style={commonStyles.center}>
					<ActivityIndicator size={'large'} color={colors.primary}/>
				</View>
			}

			{
				//add some random users using randomuser.me/api
				!isLoading && !noResultsFound && users && 
				<FlatList
				 data={Object.keys(users)}
				 renderItem={(itemData)=>{
						const userId = itemData.item;
						const userData = users[userId];

						return <DataItem 
										title={`${userData.firstName} ${userData.lastName}`}
										subTitle={userData.about}
										image={userData.profilePicture}
										onPress={()=>{userPressed(userId)}}
										type={isGroupChat ? "checkbox":""}
										isChecked={selectedUsers.includes(userId)}
										/> 
				 }}
				/>
			}

			{
				!isLoading && noResultsFound && (
				<View style={commonStyles.center} >
				 <FontAwesome 
				  name="question"
					size={55}
					color={colors.lightGrey}
					style={styles.noResultsIcon}
					/>

					<Text style={styles.noResultsText}>No Results Found!</Text>	
					</View>
				)
			}

			{
				!isLoading && !users && (
				<View style={commonStyles.center} >
				 <FontAwesome 
				  name="users"
					size={55}
					color={colors.lightGrey}
					style={styles.noResultsIcon}
					/>

					<Text style={styles.noResultsText}>Enter a name to search for a user!</Text>	
					</View>
				)
			}
	</PageContainer>
}

const styles = StyleSheet.create({
	searchContainer:{
		flexDirection:'row',
		alignItems:'center',
		backgroundColor:colors.extraLightGrey,
		height:30,
		marginVertical:8,
		paddingHorizontal:8,
		paddingVertical:5,
		borderRadius:5
	},
	searchBox:{
		marginLeft:8,
		fontSize:15,
		width:'100%'
	},
	noResultsIcon:{
		marginBottom:20	
	},
	noResultsText:{
		color:colors.textColor,
		fontFamily:'regular',
		letterSpacing:0.3
	},
	chatNameContainer:{
		paddingVertical:10
	},
	inputContainer:{
		width:'100%',
		paddingVertical:15,
		backgroundColor: colors.nearlyWhite,
		flexDirection:'row',
		borderRadius:2
	},
	textBox:{
		color:colors.textColor,
		width:'100%',
		fontFamily:'regular',
		letterSpacing:0.3
	},
	selectedUsersContainer:{
		 height: 50,
		 justifyContent:'center'
	},
	selectedUsersList:{
		height:'100%',
		paddingTop:10
	},
	selectedUserStyle:{
		marginRight:10,
		marginBottom:10
	}
});
export default NewChatScreen;