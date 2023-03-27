import 'react-native-gesture-handler';
import * as React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HeaderBackButton } from '@react-navigation/elements';
import { AuthProvider } from './src/authContext';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { auth } from './src/firebase';


// AUTH PAGES
import Login from './src/pages/auth/Login';
import Register from './src/pages/auth/Register';

// USER PAGES
import Home from './src/pages/user/Home';
import Shop from './src/pages/user/Shop';
import ShopLanding from './src/pages/user/ShopLanding';
import Product from './src/pages/user/Product';
import Cart from './src/pages/user/Cart';
import Checkout from './src/pages/user/Checkout';
import Account from './src/pages/user/Account';
import AddressBook from './src/pages/user/AddressBook';
import AddAddress from './src/pages/user/AddAddress';

// LOGO
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const AuthStack = createNativeStackNavigator();
const ShopStack = createNativeStackNavigator();
const CartStack = createNativeStackNavigator();
const AddressStack = createNativeStackNavigator();
const ProfileTab = createBottomTabNavigator();
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
    <ShopStack.Navigator initialRouteName='ShopLanding' screenOptions={{ drawerActiveTintColor: '#DF687D', headerTintColor: '#DF687D', headerShadowVisible: false }}>
      <ShopStack.Screen name="ShopLanding" component={ShopLanding} options={{ headerShown: false }} />
      <ShopStack.Screen name="Shop" component={Shop} options={{
        headerLeft: (props) => (<HeaderBackButton {...props} onPress={() => {
          navigation.getParent('main').setOptions({ headerShown: true, swipeEnabled: true })
          navigation.navigate('ShopLanding');
        }} />)
      }} />
      <ShopStack.Screen name="Product" component={Product} options={{
        headerLeft: (props) => (<HeaderBackButton {...props} onPress={() => {
          navigation.navigate('Shop');
        }} />)
      }} />
    </ShopStack.Navigator>
  )
}

const CartStackScreen = () => {
  return (
    <CartStack.Navigator>
      <CartStack.Screen name="Cart" component={Cart} options={{ headerShown: false }} />
      <CartStack.Screen name="Checkout" component={Checkout} options={{ headerShown: false }}/>
    </CartStack.Navigator>
  )
}

const AddressStackScreen = () => {
  return (
    <AddressStack.Navigator initialRouteName='Address' screenOptions={{headerShown:false}}>
      <AddressStack.Screen name='Address' component={AddressBook} />
      <AddressStack.Screen name='AddAddress' component={AddAddress} />
    </AddressStack.Navigator>
  )
}

const ProfileTabScreen = () => {
  return (
    <ProfileTab.Navigator initialRouteName='Account'
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          color = focused ? '#DF687D' : '#FFD8DF';
          if (route.name == 'Account') {
            iconName = 'user-cog';
            
          } else if (route.name == 'AddressStack') {
            iconName = 'address-book';
          }
          return <FontAwesome5 name={iconName} size={size} color={color} solid/>
        },
        headerShown:false,
        tabBarInactiveTintColor: '#FFD8DF',
        tabBarActiveTintColor: '#DF687D'
        
      })}

    >
      <ProfileTab.Screen name='Account' component={Account} />
      <ProfileTab.Screen name='AddressStack' options={{title:'Address Book'}} component={AddressStackScreen} />
    </ProfileTab.Navigator>
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

      const user = auth.currentUser;
      if (user) {
        const { email, uid } = user;
        dispatch({ type: 'RESTORE_TOKEN', token: uid })
      } else {
        dispatch({ type: 'SIGN_OUT', token: null })
      }
    }
    getUser();
  }, []);

  const authContext = React.useMemo(() => ({
    signIn: async (data) => {
      dispatch({ type: 'SIGN_IN', token: data.uid });

    },
    signOut: () => dispatch({ type: 'SIGN_OUT', token: null }),
    signUp: async (data) => {
      dispatch({ type: 'SIGN_IN', token: data.uid });
    },
  }), []);

  return (
    <AuthProvider value={authContext}>
      <NavigationContainer >
        <Drawer.Navigator id='main' initialRouteName="Home" screenOptions={({ navigation }) => ({ drawerActiveTintColor: '#DF687D', headerTintColor: '#DF687D', headerShadowVisible: false, headerRight: () => { if (state.userToken != null) return (<TouchableOpacity onPress={() => {navigation.dispatch(CommonActions.reset({index:0, routes:[{name:'CartStack'}]}))}} className="mr-4"><Text className="text-accent-default font-bold">Cart</Text></TouchableOpacity>) } })} >
          <Drawer.Screen name="Home" component={Home} />
          <Drawer.Screen name="ShopScreen" component={ShopStackScreen} options={{ title: 'Shop' }} />
          {state.userToken != null ? <Drawer.Screen name="ProfileTab" component={ProfileTabScreen} options={{ title: 'Profile', animationTypeForReplace: state.isSignout ? 'pop' : 'push', }} /> : <Drawer.Screen name="Authentication" options={{ title: 'Login / Register' }} component={AuthStackScreen} />}
          <Drawer.Screen name="CartStack"  component={CartStackScreen} options={{ title:'Cart', drawerItemStyle: { height: 0 }, headerTitle: '' }} />
        </Drawer.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}



