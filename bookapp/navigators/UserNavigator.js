import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import UserHomeScreen from '../screens/UserHomeScreen';
import CartScreen from '../screens/CartScreen';
import BookDetailsScreen from '../screens/BookDetailsScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import ReviewScreen from '../screens/ReviewScreen';
import OrderScreen from '../screens/OrderScreen'; // Add this import

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function UserHomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={UserHomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="BookDetails" component={BookDetailsScreen} options={{ title: 'Book Details' }} />
      <Stack.Screen name="Orders" component={OrderDetailsScreen} options={{ title: 'My Orders' }} />
      <Stack.Screen name="Review" component={ReviewScreen} options={{ title: 'Review Order' }} />
    </Stack.Navigator>
  );
}

function CartStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Cart" component={CartScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Order" component={OrderScreen} options={{ title: 'Checkout' }} />
    </Stack.Navigator>
  );
}

export default function UserNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="UserHomeStack"
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
        name="CartStack"
        component={CartStack}
        options={{
          tabBarIcon: ({ color }) => <Icon name="shopping-cart" color={color} size={30} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrderDetailsScreen}
        options={{
          tabBarIcon: ({ color }) => <Icon name="list" color={color} size={30} />,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}