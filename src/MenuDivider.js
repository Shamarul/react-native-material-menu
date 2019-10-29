import React from 'react';
import { View, StyleSheet } from 'react-native';

import PropTypes from 'prop-types';

function MenuDivider({ color }) {
  return <View style={[styles.divider, { borderBottomColor: color }]} />;
}

MenuDivider.defaultProps = {
  color: 'rgba(0,0,0,0.3)',
};

MenuDivider.propTypes = {
  color: PropTypes.string,
};

const styles = StyleSheet.create({
  divider: {
    borderBottomWidth: 0.4,
    marginLeft: 10,
    marginRight: 10,
  },
});

export default MenuDivider;
