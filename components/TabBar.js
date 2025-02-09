import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import explore from '../app/explore';
import create from '../app/create';
import profile from '../app/profile';
import Entypo from '@expo/vector-icons/Entypo';
//<Entypo name="compass" size={24} color="black" />

//https://icons.expo.fyi/Index 여기에서 아이콘 검색 및 가져오기
const TabBar = ({ state, descriptors, navigation }) => {

    const icons = {
        index: (props)=> <AntDesign name="home" size={26} color={greyColor} {...props} />,
        explore: (props)=> <AntDesign name="login" size={26} color={greyColor} {...props} />,
        create: (props)=> <AntDesign name="pluscircleo" size={26} color={greyColor} {...props} />,
        profile: (props)=> <AntDesign name="user" size={26} color={greyColor} {...props} />,
    }

    const primaryColor = '#0891b2';
    const greyColor = '#c7c7cc';

  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = //각 항목의 레이블을 가져오고고
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;
        
        if(['_sitemap', '+not-found'].includes(route.name)) return null; //탭바에 없는 항목은 제외
            
        console.log('route name:', route.name);

        const isFocused = state.index === index; //다른색상을 위한 포커스

        const onPress = () => {
          const event = navigation.emit({ //탭 누름 이벤트를 내보내 해당화면으로 이동하고 포커스
            type: 'tabPress', //포커스가 맞춰지지 않으면 해당 화면으로 이동합니다
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => { //길게 누르기 이벤트
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return ( // 모든속성을 사용하여, 버튼을 정의
          <TouchableOpacity
            key={route.key}
            style={styles.tabbarItem}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
          > 
          {icons[route.name]({
            color: isFocused ? primaryColor : greyColor
          })
          }
            <Text style={{ 
                color: isFocused ? primaryColor : greyColor,
                fontSize: 11
                }}> 
              {label} 
            </Text>
          </TouchableOpacity> //isFocused가 true이면 빨간색으로, 아니면 검은색으로 isFocused는 밑에 바에 있는 버튼
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
    tabbar: {
        position: 'absolute', 
        bottom: 25,  //버튼위치 조정 밑에서 얼마만큼큼
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        marginHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 25,
        borderCurve: 'continuous',
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 10},
        shadowRadius: 10,
        shadowOpacity: 0.1
    },
    tabbarItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4
    }

})



export default TabBar;
