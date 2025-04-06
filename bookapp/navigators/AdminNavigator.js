import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native';
import AdminHomeScreen from '../screens/AdminHomeScreen';
import UserListScreen from '../screens/UserListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BookListScreen from '../screens/Book/BookListScreen';
import BookCreateScreen from '../screens/Book/BookCreateScreen';
import BookEditScreen from '../screens/Book/BookEditScreen';
import AdminOrdersScreen from '../screens/AdminOrdersScreen';
import { logout } from '../redux/auth';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function BookStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BookList"
        component={BookListScreen}
        options={({ navigation }) => ({
          headerShown: true,
          title: 'Books',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.openDrawer()}
              style={{ marginLeft: 15 }}
            >
              <Icon name="bars" size={24} color="#000" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="BookCreate"
        component={BookCreateScreen}
        options={{ title: 'Create Book' }}
      />
      <Stack.Screen
        name="BookEdit"
        component={BookEditScreen}
        options={{ title: 'Edit Book' }}
      />
    </Stack.Navigator>
  );
}

export default function AdminNavigator() {
  const dispatch = useDispatch();

  return (
    <Drawer.Navigator
      initialRouteName="AdminHome"
      screenOptions={({ navigation }) => ({
        drawerStyle: { width: '80%' },
        drawerActiveTintColor: '#e91e63',
        drawerInactiveTintColor: '#333',
        headerShown: true,
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{ marginLeft: 15 }}
          >
            <Icon name="bars" size={24} color="#000" />
          </TouchableOpacity>
        ),
      })}
    >
      <Drawer.Screen
        name="AdminHome"
        component={AdminHomeScreen}
        options={{
          drawerLabel: 'Home',
          drawerIcon: ({ color }) => <Icon name="home" size={24} color={color} />,
          title: 'Admin Home',
        }}
      />
      <Drawer.Screen
        name="UserList"
        component={UserListScreen}
        options={{
          drawerLabel: 'User List',
          drawerIcon: ({ color }) => <Icon name="list" size={24} color={color} />,
          title: 'User List',
        }}
      />
      <Drawer.Screen
        name="Books"
        component={BookStack}
        options={{
          drawerLabel: 'Books',
          drawerIcon: ({ color }) => <Icon name="book" size={24} color={color} />,
          headerShown: false, // Let BookStack manage its own header
        }}
      />
      <Drawer.Screen
        name="Orders"
        component={AdminOrdersScreen}
        options={{
          drawerLabel: 'Orders',
          drawerIcon: ({ color }) => <Icon name="truck" size={24} color={color} />,
          title: 'Orders',
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerLabel: 'Profile',
          drawerIcon: ({ color }) => <Icon name="user" size={24} color={color} />,
          title: 'Profile',
        }}
      />
      <Drawer.Screen
        name="Logout"
        component={AdminHomeScreen} // Dummy component, overridden by listeners
        options={{
          drawerLabel: 'Logout',
          drawerIcon: ({ color }) => <Icon name="sign-out" size={24} color={color} />,
          headerShown: false,
        }}
        listeners={{
          drawerItemPress: (e) => {
            e.preventDefault();
            dispatch(logout());
          },
        }}
      />
    </Drawer.Navigator>
  );
}