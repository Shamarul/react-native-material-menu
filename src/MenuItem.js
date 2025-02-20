import React from 'react';

import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableHighlight, Platform } from 'react-native';

function MenuItem({
  children,
  disabled,
  disabledTextColor,
  onPress,
  style,
  textStyle,
  underlayColor,
  ...props
}) {
  return (
    <TouchableHighlight
      {...props}
      disabled={disabled}
      onPress={onPress}
      style={[styles.container, style]}
      underlayColor={underlayColor}
    >
      <Text
        ellipsizeMode={Platform.OS === 'ios' ? 'clip' : 'tail'}
        // numberOfLines={4}
        style={[
          styles.title,
          disabled && { color: disabledTextColor },
          textStyle,
        ]}
      >
        {children}
      </Text>
    </TouchableHighlight>
  );
}

MenuItem.propTypes = {
  // children: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  disabledTextColor: PropTypes.string,
  onPress: PropTypes.func,
  style: TouchableHighlight.propTypes.style,
  textStyle: Text.propTypes.style,
  underlayColor: TouchableHighlight.propTypes.underlayColor,
};

MenuItem.defaultProps = {
  disabled: false,
  disabledTextColor: '#BDBDBD',
  underlayColor: '#E0E0E0',
};

const styles = StyleSheet.create({
  container: {
    minHeight: 40,
    justifyContent: 'center',
    maxWidth: 300,
    minWidth: 154,
  },
  title: {
    padding: 10,
    fontSize: 14,
    fontWeight: '400',
    paddingHorizontal: 16,
  },
});

export default MenuItem;
