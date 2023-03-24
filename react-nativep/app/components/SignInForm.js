import React , {useEffect,useReducer,useCallback,useState} from 'react';
import Input from '../components/Input';
import { Feather } from '@expo/vector-icons';
import SubmitButton from '../components/SubmitButton';
import { validateInput } from '../utils/actions/formActions';
import { reducer } from '../utils/reducers/formReducer';
import { ActivityIndicator, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { signIn } from '../utils/actions/authActions';
import colors from '../constants/colors';

	const testMode = true;//for development purpose 

	const initialState = {
		inputValues:{
			email:testMode?"kratik@gmail.com":"",
			password:testMode?"kratik":""
		},
		inputValidities:{
			email:testMode,
			password:testMode
		},
		formIsValid:testMode
	}

const SignInForm = ()=>{
	 
	const dispatch = useDispatch();

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
		
	const authHandler = useCallback(async ()=>{
		try {
			setIsLoading(true);

			const action = signIn(
					formState.inputValues.email,
					formState.inputValues.password,
			)

			setError(null);
			await dispatch(action);

		} catch (error) {
			setError(error);
			setIsLoading(false);
		}
	},[dispatch,formState]);

	return (
		<>
				<Input id="email" label="Email" icon="mail" iconPack={Feather}
				onInputChange = {inputChangeHandler}
				value={formState.inputValues.email}
				errorText={formState.inputValidities["email"]}
				autoCapitalize="none" keyboardType="email-address"/>
				<Input id="password" label="Password" icon="lock" iconPack={Feather}
				onInputChange = {inputChangeHandler}
				value={formState.inputValues.password}
				errorText={formState.inputValidities["password"]}
				autoCapitalize="none" secureTextEntry/>
				{
				isLoading ? 
				<ActivityIndicator size={'small'} color={colors.primary} style={{marginTop:37}} /> : 
				<SubmitButton 
					title="Sign In" 
					style={{marginTop:20}}
					onPress={authHandler} 
					disabled = {!formState.formIsValid} />
       }
		</>
	)
}
export default SignInForm;