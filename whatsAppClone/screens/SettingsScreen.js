import React, { useCallback, useMemo, useReducer, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View,ScrollView } from 'react-native';
import PageTitle from '../components/PageTitle';
import PageContainer from '../components/PageContainer';
import Input from '../components/Input';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { reducer } from '../utils/reducers/formReducer';
import { validateInput } from '../utils/actions/formActions';
import { useDispatch, useSelector } from 'react-redux';
import colors from '../constants/colors';
import SubmitButton from '../components/SubmitButton';
import { updateSignedInUserData, userLogout } from '../utils/actions/authActions';
import { updateLoggedInUserData } from '../store/authSlice';
import ProfileImage from '../components/ProfileImage';
import DataItem from '../components/DataItem';
// import { ScrollView } from 'react-native-gesture-handler';


const SettingsScreen = props => {

	const dispatch = useDispatch();

	const [isLoading,setIsLoading] = useState(false);
	const [showSuccessMessage,setShowSuccessMessage] = useState(false);
	const userData = useSelector(state=>state.auth.userData);
	const starredMessages = useSelector(state=>state.messages.starredMessages ?? {});

	const sortedStarredMessages = useMemo(()=>{
			let result = [];

		const chats = Object.values(starredMessages);

		chats.forEach(chat=>{
			 const chatMessages = Object.values(chat);
			 result = result.concat(chatMessages);
		})

		return result;

	},[starredMessages]);

	const firstName = userData.firstName || "";
	const lastName = userData.lastName || "";
	const email = userData.email|| "";
	const about = userData.about || "";

	const initialState = {
		inputValues:{
			firstName,
			lastName,
			email,
			about
		},
		inputValidities:{
			firstName:undefined,
			lastName:undefined,
			email:undefined,
			about:undefined,
		},
		formIsValid:false
	}

	const [formState,dispatchFormState] = useReducer(reducer,initialState);

	const inputChangeHandler = useCallback((inputId,inputValue)=>{
			const result = validateInput(inputId,inputValue);
			dispatchFormState({inputId,validationResult:result,inputValue})
		},[dispatchFormState]);

	const saveHandler = useCallback(async ()=>{
		 const updatedValues = formState.inputValues;	
			try {
				setIsLoading(true);
				await updateSignedInUserData(userData.userId,updatedValues);
				dispatch(updateLoggedInUserData({newData:updatedValues}));

				setShowSuccessMessage(true);

				setTimeout(()=>{
					setShowSuccessMessage(false);	
				},3000);

			} catch (error) {
				console.log(error);	
			}
			finally{
				setIsLoading(false);
			}
			
	},[formState,dispatch])

	const hasChanged = ()=>{
		 const currentValues = formState.inputValues;
			return currentValues.firstName != firstName ||
			 currentValues.lastName!=lastName ||
			 currentValues.email!=email ||
			 currentValues.about!=about;
	}

	return <PageContainer>
						
						<PageTitle text="Settings"/>

						<ScrollView contentContainerStyle={styles.formContainer}>
							
						<ProfileImage 
						  size={80}
							userId={userData.userId}
							uri={userData.profilePicture}
							showEditButton={true}/>

						<Input id="firstName" label="First name" icon="user-o" iconPack={FontAwesome}
						autoCapitalize="none"
						errorText={formState.inputValidities["firstName"]}
						onInputChange = {inputChangeHandler}
						initialValue = {userData.firstName}/>
						
						<Input id="lastName" label="Last name" icon="user-o" iconPack={FontAwesome}
						autoCapitalize="none"
						errorText={formState.inputValidities["lastName"]}
						onInputChange = {inputChangeHandler}
						initialValue ={userData.lastName}/>

						<Input id="email" label="Email" icon="mail" iconPack={Feather}
						keyboardType="email-address"//this property add a @ in the keyboard	
						autoCapitalize="none"
						errorText={formState.inputValidities["email"]}
						onInputChange = {inputChangeHandler}
						initialValue = {userData.email}/>

						<Input id="about" label="About" icon="user-o" iconPack={FontAwesome}
						autoCapitalize="none"
						errorText={formState.inputValidities["about"]}
						onInputChange = {inputChangeHandler}
						initialValue = {userData.about}/>
						<View style={{marginTop:20}}>
							{					
							  showSuccessMessage && <Text>Saved!</Text>
							}
						
						{
						isLoading ? 
						<ActivityIndicator size={'small'} color={colors.primary} style={{marginTop:37}} /> : 
							hasChanged() &&
							<SubmitButton 
							title="Save" 
							style={{marginTop:20}}
							onPress={saveHandler} 
							disabled = {!formState.formIsValid} />
						}
						</View>
						
							<DataItem 
							type={"link"}
							title="Starred Messages"
							hideImage={true}
							onPress={()=>props.navigation.navigate("DataList",{title:"Starred Messages",data: sortedStarredMessages, type:"messages"})}
							/>

							<SubmitButton 
							title="Log Out" 
							style={{marginTop:20}}
							onPress={()=>{dispatch(userLogout(userData))}}
							color={colors.red}/> 
							
						 </ScrollView>					

				</PageContainer>
}

const styles = StyleSheet.create({
container:{
	flex:1,
},
formContainer:{
	alignItems:'center'
}
});
export default SettingsScreen;