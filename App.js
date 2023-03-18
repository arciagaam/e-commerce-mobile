import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import {HeaderBackButton} from '@react-navigation/elements';
import { AuthProvider } from './src/authContext';
import { useNavigation } from '@react-navigation/native';
// AUTH PAGES
import Login from './src/pages/auth/Login';
import Register from './src/pages/auth/Register';

// USER PAGES
import Home from './src/pages/user/Home';
import Profile from './src/pages/user/Profile';
import Shop from './src/pages/user/Shop';
import ShopLanding from './src/pages/user/ShopLanding';
import Product from './src/pages/user/Product';


const AuthStack = createNativeStackNavigator();
const ShopStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();



const AuthStackScreen = () => {
  return (
    <AuthStack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Register" component={Register} />
    </AuthStack.Navigator>
  )
}

const ShopStackScreen = () => {
  const navigation = useNavigation();
  return (
    <ShopStack.Navigator initialRouteName='ShopLanding' screenOptions={{drawerActiveTintColor:'#DF687D', headerTintColor:'#DF687D', headerShadowVisible:false}}>
      <ShopStack.Screen name="ShopLanding" component={ShopLanding} options={{headerShown:false}}/>
      <ShopStack.Screen name="Shop" component={Shop} options={{headerLeft: (props) => (<HeaderBackButton {...props} onPress={()=>{
        navigation.getParent('main').setOptions({headerShown:true, swipeEnabled:true})
        navigation.navigate('ShopLanding');
      }}/>)}}/>
      <ShopStack.Screen name="Product" component={Product} options={{headerLeft: (props) => (<HeaderBackButton {...props} onPress={()=>{
        navigation.navigate('Shop');
      }}/>)}}/>
    </ShopStack.Navigator>
  )
}

export default function App({ navigation }) {

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN': return { ...prevState, isLoading: false, userToken: action.token };
        case 'SIGN_IN': return { ...prevState, isSignout: false, userToken: action.token };
        case 'SIGN_OUT': return { ...prevState, isSignout: true, userToken: null };
      };
    }, { isLoading: true, isSignout: false, userToken: null }
  );

  React.useEffect(() => {
    const getUser = async () => {
      if(await AsyncStorage.getItem('user')){
        const { email, uid } = JSON.parse(await AsyncStorage.getItem('user'));
        dispatch({ type: 'RESTORE_TOKEN', token: uid })
      }
    }
    getUser();
  }, []);

  const authContext = React.useMemo(() => ({
      signIn: async (data) => {
        dispatch({ type: 'SIGN_IN', token: data.uid });

      },
      signOut: () => dispatch({ type: 'SIGN_OUT', token:null }),
      signUp: async (data) => {
        dispatch({ type: 'SIGN_IN', token: data.uid });
      },
    }), []);
  
  return (
    <AuthProvider value={authContext}>
        <NavigationContainer >
          <Drawer.Navigator id='main' initialRouteName="Home" options={{title:'Test'}} screenOptions={{drawerActiveTintColor:'#DF687D', headerTintColor:'#DF687D', headerShadowVisible:false}} >
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="Shop Landing" component={ShopStackScreen} options={{title:'Shop'}}/>

            {state.userToken != null ? <Drawer.Screen name="Profile" component={Profile} options={{animationTypeForReplace: state.isSignout ? 'pop' : 'push',}}/> : <Drawer.Screen name="Login / Register" component={AuthStackScreen}  />}

          </Drawer.Navigator>
        </NavigationContainer>
    </AuthProvider>
  );
}



