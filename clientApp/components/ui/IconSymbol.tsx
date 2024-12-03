// This file is a fallback for using MaterialIcons on Android and web.

import AntDesignIcons from '@expo/vector-icons/AntDesign';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, StyleProp } from 'react-native';

// Add your SFSymbol to MaterialIcons mappings here.
const MAPPING = {
  // See MaterialIcons here: https://icons.expo.fyi
  // See SF Symbols in the SF Symbols app on Mac.
  'house.fill': 'home',
  'person.fill': 'user',
  'book.fill': 'book',
  'search.fill': 'search1',
  'arrow.up': 'caretup',
  'notification.fill': 'notification',
  'message.fill': 'message1',
} as Partial<
  Record<
    import('expo-symbols').SymbolViewProps['name'],
    React.ComponentProps<typeof AntDesignIcons>['name']
  >
>;

export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<any>;
  weight?: SymbolWeight;
}) {
  const iconName = MAPPING[name] as React.ComponentProps<typeof AntDesignIcons>['name'];
  return <AntDesignIcons color={color} size={size} name={iconName} style={style} />;
}