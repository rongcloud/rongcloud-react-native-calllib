import * as React from 'react';
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Home from './home'
import Room from './room'
import JoinRoom from './joinroom'

const Stack = createStackNavigator()

const AppKey = ''
const AppSecret = ''

class App extends React.Component {
  render () {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ title: '融云 CallLib RN 示例' }}
            initialParams={{
              AppKey,
              AppSecret
            }}/>
          <Stack.Screen
            name="JoinRoom"
            component={JoinRoom}
            options={{
              headerShown: false,
              gestureEnabled: false
            }}/>
          <Stack.Screen
            name="Room"
            component={Room}
            options={{
              headerShown: false,
              gestureEnabled: false
            }}/>
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}

export default App
