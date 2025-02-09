import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import TabBar from '../components/TabBar'

const _layout = () => {
  return ( 
    <Tabs
        tabBar={props => <TabBar {...props} />}    
    >
        <Tabs.Screen
        name = "index" //index.js의 탭화면 이름을 여기서 수정한다.
        options={{ title: 'Home' 
        }}
        />
        <Tabs.Screen
        name = "explore" //index.js의 탭화면 이름을 여기서 수정한다.
        options={{ title: '로그인' 
        }}
        />
        <Tabs.Screen
        name = "create" //index.js의 탭화면 이름을 여기서 수정한다.
        options={{ title: 'Create' 
        }}
        />
        <Tabs.Screen
        name = "profile" //index.js의 탭화면 이름을 여기서 수정한다.
        options={{ title: 'Profile' 
        }}
        />
    </Tabs>
  )
}

export default _layout