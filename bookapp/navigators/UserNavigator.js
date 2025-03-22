import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import UserHomeScreen from '../screens/UserHomeScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BookDetailsScreen from '../screens/BookDetailsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack for UserHome with Details screen
function UserHomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="UserHome" component={UserHomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="BookDetails" component={BookDetailsScreen} options={{ title: 'Book Details' }} />
    </Stack.Navigator>
  );
}

export default function UserNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="UserHomeStack" // Fixed: Changed from "UserHome" to "UserHomeStack"
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#e91e63',
      }}
    >
      <Tab.Screen
        name="UserHomeStack"
        component={UserHomeStack}
        options={{
          tabBarIcon: ({ color }) => <Icon name="home" color={color} size={30} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ color }) => <Icon name="shopping-cart" color={color} size={30} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <Icon name="user" color={color} size={30} />,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}