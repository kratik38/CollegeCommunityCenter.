import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications'; 

import React, { useEffect, useState } from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import ChatListScreen from '../screens/ChatListScreen';
import ChatSettingsScreen from '../screens/ChatSettingsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ChatScreen from '../screens/ChatScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NewChatScreen from '../screens/NewChatScreen';
import { useDispatch, useSelector } from 'react-redux';
import { getFirebaseApp } from '../utils/firebaseHelper';
import { child, get, getDatabase, off, onValue, ref } from 'firebase/database';
import { setChatsData } from '../store/chatSlice';
import { setStoredUsers } from '../store/userSlice';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import commonStyles from '../constants/commonStyles';
import colors from '../constants/colors';
import { setChatMessages } from '../store/messagesSlice';
import { setStarredMessages } from '../store/messagesSlice';
import ContactScreen from '../screens/ContactScreen';
import DataListScreen from '../screens/DataListScreen';
import { StackActions, useNavigation } from '@react-navigation/native';
import { useRef } from 'react';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();  

const TabNavigator = ()=>{

  return (
    <Tab.Navigator screenOptions={{
      headerTitle:'',
      headerShadowVisible:false
    }}>
      <Tab.Screen name="ChatList" component={ChatListScreen} options={{
        tabBarLabel:'Chats',
        tabBarIcon:({ color, size })=>(
          <View style={styles.tabIconContainer}>
          <Ionicons name="chatbubble-ellipses-outline" size={size} color={color}/>
          </View>
        )
      }}/>
      <Tab.Screen name="Settings" component={SettingsScreen} options={{
        tabBarLabel:'Settings',
        tabBarIcon:({color, size})=>(
          <View style={styles.tabIconContainer}>
            <Ionicons name="ios-settings-outline" size={size} color={color} />
          </View>
        )
      }}/>
    </Tab.Navigator>
  )
}

const StackNavigator = ()=>{

  return (
			<Stack.Navigator>
        <Stack.Group>
				<Stack.Screen name="Home" component={TabNavigator} options={{ headerShown:false }}/>
				<Stack.Screen name="ChatScreen" component={ChatScreen} options={{
          headerTitle:'',
          headerBackTitle:'Back',
				}}/>
				<Stack.Screen name="ChatSettings" component={ChatSettingsScreen} options={{
					headerTitle:'',
          headerBackTitle:'Back',
          headerShadowVisible: false
				}}/>
				<Stack.Screen name="Contact" component={ContactScreen} options={{
					headerTitle:'Contact Info',
          headerBackTitle:'Back'
				}}/>
				<Stack.Screen name="DataList" component={DataListScreen} options={{
					headerTitle:'',
          headerBackTitle:'Back'
				}}/>
        </Stack.Group>

        <Stack.Group screenOptions={{presentation:'containedModal'}}>
         <Stack.Screen
         name="NewChat"
         component={NewChatScreen}/>
        </Stack.Group>
			</Stack.Navigator>
  )
}

const MainNavigator = (props)=>{
  
  const dispatch = useDispatch();
  const navigation = useNavigation()

  const [isLoading,setIsLoading] = useState(true);
  
  const userData = useSelector(state=>state.auth.userData);
  const storedUsers = useSelector(state=>state.users.storedUsers);

  const [expoPushToken, setExpoPushToken] = useState('');
  console.log(expoPushToken);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    //handle recieved notification
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const { data }  = response.notification.request.content;
      const chatId = data["chatId"];
      
      if(chatId){
          const pushAction = StackActions.push("ChatScreen",{ chatId});
          navigation.dispatch(pushAction);
     }
     else{
      console.log("No chat id sent with notifcation");
     }

    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);


  useEffect(()=>{

    console.log("subscribing to firebase listeners");

    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const userChatsRef = child(dbRef,`userChats/${userData.userId}`);

    const refs = [userChatsRef];

    onValue(userChatsRef,(querySnapshot)=>{
      const chatIdsData = querySnapshot.val() || {};
      const chatIds = Object.values(chatIdsData);

      const chatsData = {};
      let chatsFoundCount = 0;

      for (let i = 0; i < chatIds.length; i++) {
        const chatId = chatIds[i];
        const chatRef = child(dbRef,`chats/${chatId}`);
        refs.push(chatRef);

        onValue(chatRef,(chatSnapshot)=>{

          chatsFoundCount++;  

          const data = chatSnapshot.val();

          if(data){
            data.key = chatSnapshot.key;

            data.users.forEach(userId=>{
              if(storedUsers[userId]) return;

              const userRef = child(dbRef,`users/${userId}`);

              get(userRef).then((userSnapShot)=>{
                  const userSnapShotData = userSnapShot.val();
                  dispatch(setStoredUsers({newUsers:{userSnapShotData}})); 
              })

              refs.push(userRef);

            })

            chatsData[chatSnapshot.key] = data;
          }

          if(chatsFoundCount >= chatIds.length){
            dispatch(setChatsData({ chatsData }));
            setIsLoading(false);
          }
          
        })

        const messagesRef = child(dbRef,`messages/${chatId}`);
        refs.push(messagesRef);

        onValue(messagesRef,messagesSnapshot=>{
          const messagesData = messagesSnapshot.val();
          dispatch(setChatMessages({ chatId , messagesData }));  
        })
       
        if(chatsFoundCount == 0){
          setIsLoading(false);
        }
      }
       
    })

    const userStarredMessagesRef = child(dbRef,`userStarredMessages/${userData.userId}`);
    refs.push(userStarredMessagesRef);
    onValue(userStarredMessagesRef,querySnapshot=>{
       const starredMessages = querySnapshot.val() ?? {}; 
       dispatch(setStarredMessages({ starredMessages }));
    })

    return ()=>{
      console.log("unsubscribing firebase listener");
      refs.forEach(ref => off(ref));
    }

  },[])

  if(isLoading){
    <View style={commonStyles.center}>
       <ActivityIndicator size={'large'} color={colors.primary}/>
    </View>
  }
	return (
    <KeyboardAvoidingView style={{flex:1}}
			behavior={Platform.OS==="ios"?"padding":undefined}>
        <StackNavigator/>
      </KeyboardAvoidingView>
	)
}

styles = StyleSheet.create({
  tabIconContainer:{
    backgroundColor:colors.darkYellow,
    margin:10,
    padding:10,
    borderRadius:50,
    height:80,
    width:80,
    alignItems:'center',
    justifyContent:'center'
  }
})

export default MainNavigator;

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}