export const reducer = (state,action)=>{
		const { inputId,validationResult,inputValue } = action;

		const updatedValues = {
			...state.inputValues,
			[inputId]:inputValue
		}

		const updatedValidities = {
			...state.inputValidities,
			[inputId] : validationResult
		}

		let updatedFormValidities = true;

		for(const key in updatedValidities){
			if(updatedValidities[key]!==undefined){
				updatedFormValidities = false;
				break;
			}
		}

		return {
			inputValues:updatedValues,
			inputValidities:updatedValidities,
			formIsValid: updatedFormValidities
		}
	}