import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import AdminHomeScreen from '../screens/AdminHomeScreen';
import UserListScreen from '../screens/UserListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BookListScreen from '../screens/Book/BookListScreen';
import BookCreateScreen from '../screens/Book/BookCreateScreen';
import BookEditScreen from '../screens/Book/BookEditScreen';
import AdminOrdersScreen from '../screens/AdminOrdersScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function BookStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BookList" component={BookListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="BookCreate" component={BookCreateScreen} options={{ headerShown: false }} />
      <Stack.Screen name="BookEdit" component={BookEditScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function AdminNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="AdminHome"
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#e91e63',
      }}
    >
      <Tab.Screen
        name="AdminHome"
        component={AdminHomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Icon name="home" color={color} size={30} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="UserList"
        component={UserListScreen}
        options={{
          tabBarIcon: ({ color }) => <Icon name="list" color={color} size={30} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Books"
        component={BookStack}
        options={{
          tabBarIcon: ({ color }) => <Icon name="book" color={color} size={30} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Orders"
        component={AdminOrdersScreen}
        options={{
          tabBarIcon: ({ color }) => <Icon name="truck" color={color} size={30} />,
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