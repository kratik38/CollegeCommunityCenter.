import React, { createContext ,useContext,useEffect,useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View , ActivityIndicator} from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import Chat from './screen/Chat';
import Login from './screen/Login';
import SignUp from './screen/SignUp';
import Home from './screen/Home';

const Stack = createStackNavigator();
const AuthenticatedUserContext = createContext({});

const AuthenticatedUserProvider = ({children})=>{
  const [user,setUser] = useState(null);

  return(
    <AuthenticatedUserContext.Provider value={{user,setUser}}>
        {children}      
    </AuthenticatedUserContext.Provider>
  )
}   

function ChatStack(){
  return(
    <Stack.Navigator defaultScreenOptions={Home}> 
      <Stack.Screen name={'Home'} component={Home}/>
      <Stack.Screen name={'Chat'} component={Chat}/>
    </Stack.Navigator>
  ) 
}

function AuthStack(){
  return(
    <Stack.Navigator screenOptions={{headerShown:false}} >
      <Stack.Screen name={'Login'} component={Login}/>
      <Stack.Screen name={'SignUp'} component={SignUp}/>
    </Stack.Navigator>
  )
} 

function RootNavigator(){
  const { user,setUser } = useContext(AuthenticatedUserContext)
  const [loading,setLoading] = useState(true);
  useEffect(
    ()=>{
      const unsubscribeAuth = onAuthStateChanged(auth,
        async (authenticatedUser)=>{
           authenticatedUser?setUser(authenticatedUser):setUser(null);
           setLoading(false);
        }
        );

        return unsubscribeAuth;
    },[user]);

  if(loading){
    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>   
        <ActivityIndicator size="large"/>
      </View>
    )
  }
  return (
    <NavigationContainer>
      {user?<ChatStack/>:<AuthStack/>}
    </NavigationContainer>
  )
}

export default function App() {
  return ( 
    <AuthenticatedUserProvider>
      <RootNavigator/>
    </AuthenticatedUserProvider>
  )
}