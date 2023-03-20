import { validate } from 'validate.js';

export const validateString = (id,value) =>{

			const constraints = {
			presence:{allowEmpty:false}
			};

			if(value!==""){
			constraints.format = {
				pattern:"[a-z]+",
				flags:"i",
				message:"value can only contain letters"
			}
		}
		const validationResult = validate({[id]: value},{[id]:constraints});
		return validationResult&&validationResult[id]; 
}

export const validateEmail= (id,value) =>{

			const constraints = {
			presence:{allowEmpty:false}
			};

			if(value!==""){
			constraints.email = true;
		}
		// we can also use the length property of password to validate our sgsits gmail id which has a larger length
		// than the usual mail ids.
		const validationResult = validate({[id]: value},{[id]:constraints});
		return validationResult&&validationResult[id]; 
}

export const validatePassword = (id,value) =>{

			const constraints = {
			presence:{allowEmpty:false}
			};

			if(value!==""){
			constraints.length = {
				minimum : 6,
				message : 'must be atleast 6 characters'
			}
		}
		const validationResult = validate({[id]: value},{[id]:constraints});
		return validationResult&&validationResult[id]; 
}