import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { ActivityIndicator,View } from "react-native";
import { useDispatch } from "react-redux";
import colors from "../constants/colors";
import commonStyles from "../constants/commonStyles";
import { authenticate, setDidTryAutoLogin } from "../store/authSlice";
import { getUserData } from "../utils/actions/userActions";

const StartUpScreen = ()=>{
	const dispatch = useDispatch();

	useEffect(()=>{
		const tryLogin = async ()=>{
			const storedAuthInfo = await AsyncStorage.getItem("userData");

			if(!storedAuthInfo){
				dispatch(setDidTryAutoLogin());
				return;	
			}

			const parsedData = JSON.parse(storedAuthInfo);
			const { token,userId,expiryDate:expiryDateString } = parsedData;
			
			const expiryDate = new Date(expiryDateString);

			if(expiryDate <= Date() || !token || !userId){
				dispatch(setDidTryAutoLogin());
				return;	
			}

			const userData = await getUserData(userId);
			dispatch(authenticate({token,userData}));
		}

		tryLogin();
	},[dispatch])

	return <View style={commonStyles.center}>
		<ActivityIndicator size={'large'} color={colors.primary}/>
	</View>
}

export default StartUpScreen;