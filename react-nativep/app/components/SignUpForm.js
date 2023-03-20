import React, { useCallback, useEffect, useReducer, useState } from 'react';
import Input from '../components/Input';
import { FontAwesome, Feather } from '@expo/vector-icons';
import SubmitButton from '../components/SubmitButton';
import { validateInput } from '../utils/actions/formActions';
import { reducer } from '../utils/reducers/formReducer';
import { signUp } from '../utils/actions/authActions';
import { ActivityIndicator, Alert } from 'react-native';
import { useDispatch } from 'react-redux';

	const initialState = {
		inputValues:{
			firstName:"",
			lastName:"",
			email:"",
			password:""
		},
		inputValidities:{
			firstName:false,
			lastName:false,
			email:false,
			password:false
		},
		formIsValid:false
	}

	const SignUpForm = ()=>{
		
		const dispatch = useDispatch();
		// to access the userData we can use 
		// const stateData = useSelector(state=>state.auth);
		// console.log(stateData);
	const [error,setError] = useState();
	const [isLoading,setIsLoading] = useState(false);
	const [formState,dispatchFormState] = useReducer(reducer,initialState);

	const inputChangeHandler = useCallback((inputId,inputValue)=>{
			const result = validateInput(inputId,inputValue);
			dispatchFormState({inputId,validationResult:result,inputValue})
		},[dispatchFormState]);

	useEffect(
		()=>{
			if(error){
				Alert.alert("An Error Occured",''+error);	
			}
		},[error]
	);

	const authHandler = async ()=>{
		try {
			setIsLoading(true);

			const action = signUp(
					formState.inputValues.firstName,
					formState.inputValues.lastName,
					formState.inputValues.email,
					formState.inputValues.password,
			)

			dispatch(action);
			setError(null);
		} catch (error) {
			setError(error);
			setIsLoading(false);
		}
	}

	return (
		<>
				<Input id="firstName" label="First name" icon="user-o" iconPack={FontAwesome}
				autoCapitalize="none"
				errorText={formState.inputValidities["firstName"]}
				onInputChange = {inputChangeHandler}/>
				
				<Input id="lastName" label="Last name" icon="user-o" iconPack={FontAwesome}
				autoCapitalize="none"
				errorText={formState.inputValidities["lastName"]}
				onInputChange = {inputChangeHandler}/>

				<Input id="email" label="Email" icon="mail" iconPack={Feather}
				keyboardType="email-address"//this property add a @ in the keyboard	
				autoCapitalize="none"
				errorText={formState.inputValidities["email"]}
				onInputChange = {inputChangeHandler}/>
				
				<Input id="password" label="Password" icon="lock" iconPack={Feather}
				autoCapitalize="none" secureTextEntry 
				errorText={formState.inputValidities["password"]}
				onInputChange = {inputChangeHandler}/>

				{
					isLoading ? 
					<ActivityIndicator size={'small'} color={colors.primary} style={{marginTop:37}} /> : 
						<SubmitButton 
						title="Sign Up" 
						style={{marginTop:20}}
						onPress={authHandler} 
						disabled = {!formState.formIsValid} />
				}
		</>
	)
}
export default SignUpForm;