interface FormInput { 
  username: string; 
  password: string; 
} 
function validateFormInput(input: FormInput): boolean { 
  const usernameIsValid = input.username.length > 0; 
  const passwordIsValid = input.password.length >= 8; 
    return usernameIsValid && passwordIsValid;
}
const formInput: FormInput = { 
  username: "user123", 
  password: "password123" 
}; 
const isValid = validateFormInput(formInput); 
console.log(`Form input is valid: ${isValid}`);     
