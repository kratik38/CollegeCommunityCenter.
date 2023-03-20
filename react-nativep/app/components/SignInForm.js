import React , { useReducer,useCallback} from 'react';
import Input from '../components/Input';
import { Feather } from '@expo/vector-icons';
import SubmitButton from '../components/SubmitButton';
import { validateInput } from '../utils/actions/formActions';
import { reducer } from '../utils/reducers/formReducer';

	const initialState = {
		inputValues:{
			email:"",
			password:""
		},
		inputValidities:{
			email:false,
			password:false
		},
		formIsValid:false
	}

const SignInForm = ()=>{

	const [formState,dispatchFormState] = useReducer(reducer,initialState);

	const inputChangeHandler = useCallback((inputId,inputValue)=>{
			const result = validateInput(inputId,inputValue);
			dispatchFormState({inputId,validationResult:result,inputValue})
		},[dispatchFormState]);

	return (
		<>
				<Input id="email" label="Email" icon="mail" iconPack={Feather}
				onInputChange = {inputChangeHandler}
				errorText={formState.inputValidities["email"]}
				autoCapitalize="none" keyboardType="email-address"/>
				<Input id="password" label="Password" icon="lock" iconPack={Feather}
				onInputChange = {inputChangeHandler}
				errorText={formState.inputValidities["password"]}
				autoCapitalize="none" secureTextEntry/>
				<SubmitButton 
				title="Sign In" 
				style={{marginTop:20}}
				onPress={()=>{console.log('button Pressed')}} 
				disabled = {!formState.formIsValid} />
		</>
	)
}
export default SignInForm;