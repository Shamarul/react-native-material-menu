import React from 'react';

import PropTypes from 'prop-types';
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewPropTypes,
  Text
} from 'react-native';

const STATES = {
  HIDDEN: 'HIDDEN',
  ANIMATING: 'ANIMATING',
  SHOWN: 'SHOWN',
};

const ANIMATION_DURATION = 300;
const EASING = Easing.bezier(0.4, 0, 0.2, 1);
const SCREEN_INDENT = 8;

class Menu extends React.Component {
  _container = null;

  state = {
    menuState: STATES.HIDDEN,

    top: 0,
    left: 0,

    menuWidth: 0,
    menuHeight: 0,

    buttonWidth: 0,
    buttonHeight: 0,

    menuSizeAnimation: new Animated.ValueXY({ x: 0, y: 0 }),
    opacityAnimation: new Animated.Value(0),
  };

  _setContainerRef = ref => {
    this._container = ref;
  };

  // Start menu animation
  _onMenuLayout = e => {
    if (this.state.menuState === STATES.ANIMATING) {
      return;
    }

    const { width, height } = e.nativeEvent.layout;

    this.setState(
      {
        menuState: STATES.ANIMATING,
        menuWidth: width,
        menuHeight: height,
      },
      () => {
        Animated.parallel([
          Animated.timing(this.state.menuSizeAnimation, {
            toValue: { x: width, y: height },
            duration: ANIMATION_DURATION,
            easing: EASING,
          }),
          Animated.timing(this.state.opacityAnimation, {
            toValue: 1,
            duration: ANIMATION_DURATION,
            easing: EASING,
          }),
        ]).start();
      },
    );
  };

  // Save button width and height for menu layout
  _onButtonLayout = e => {
    const { width, height } = e.nativeEvent.layout;
    this.setState({ buttonWidth: width, buttonHeight: height });
  };

  show = () => {
    this._container.measureInWindow((x, y) => {
      const top = Math.max(SCREEN_INDENT, y);
      const left = Math.max(SCREEN_INDENT, x);
      this.setState({ menuState: STATES.SHOWN, top, left });
    });
  };

  hide = () => {
    Animated.timing(this.state.opacityAnimation, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      easing: EASING,
    }).start(() => {
      // Reset state
      this.setState(
        {
          menuState: STATES.HIDDEN,
          menuSizeAnimation: new Animated.ValueXY({ x: 0, y: 0 }),
          opacityAnimation: new Animated.Value(0),
        },
        () => {
          // Invoke onHidden callback if defined
          if (Platform.OS !== 'ios' && this.props.onHidden) {
            this.props.onHidden();
          }
        },
      );
    });
  };

  _onDismiss = () => {
    if (this.props.onHidden) {
      this.props.onHidden();
    }
  };

  render() {
    const dimensions = Dimensions.get('screen');

    const {
      menuSizeAnimation,
      menuWidth,
      menuHeight,
      buttonWidth,
      buttonHeight,
      opacityAnimation,
    } = this.state;
    const menuSize = {
      width: menuSizeAnimation.x,
      height: menuSizeAnimation.y,
    };

    // Adjust position of menu
    let { left, top } = this.state;
    const transforms = [];

    // Flip by X axis if menu hits right screen border
    if (left > dimensions.width - menuWidth - SCREEN_INDENT) {
      transforms.push({
        translateX: Animated.multiply(menuSizeAnimation.x, -1),
      });

      left = Math.min(dimensions.width - SCREEN_INDENT, left + buttonWidth);
    }

    // Flip by Y axis if menu hits bottom screen border
    if (top > dimensions.height - menuHeight - SCREEN_INDENT) {
      transforms.push({
        translateY: Animated.multiply(menuSizeAnimation.y, -1),
      });

      top = Math.min(dimensions.height - SCREEN_INDENT, top + buttonHeight);
    }

    const shadowMenuContainerStyle = {
      opacity: opacityAnimation,
      transform: transforms,
      left,
      top,
    };

    const shadowMenuSettingStyle = {
      opacity: opacityAnimation,
      left,
      top,
    };

    const triangleSettingStyle = {
      ...Platform.select({
        ios: {
          width: 0,
          height: 0,
          backgroundColor: 'transparent',
          borderStyle: 'solid',
          borderLeftWidth: 5,
          borderRightWidth: 5,
          borderBottomWidth: 20,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: '#ffffff',
          marginLeft: -20,
          marginTop: 22,
        },
        android: {
          width: 0,
          height: 0,
          backgroundColor: 'transparent',
          borderStyle: 'solid',
          borderLeftWidth: 7,
          borderRightWidth: 7,
          borderBottomWidth: 10,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: '#ffffff',
          marginLeft: -22,
          marginTop: 33,
        },
      }),
    };

    const triangleNoticeStyle = {
      ...Platform.select({
        ios: {
          width: 0,
          height: 0,
          backgroundColor: 'transparent',
          borderStyle: 'solid',
          borderLeftWidth: 5,
          borderRightWidth: 5,
          borderBottomWidth: 20,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: '#ffffff',
          marginLeft: 5,
          marginTop: 22,
        },
        android: {
          width: 0,
          height: 0,
          backgroundColor: 'transparent',
          borderStyle: 'solid',
          borderLeftWidth: 7,
          borderRightWidth: 7,
          borderBottomWidth: 10,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: '#ffffff',
          marginLeft: 3,
          marginTop: 33,
        },
      }),
    };

    const leftPaddingStyle = {
      margin: 20
    }

    const { menuState } = this.state;
    const animationStarted = menuState === STATES.ANIMATING;
    const modalVisible = menuState === STATES.SHOWN || animationStarted;

    const { testID, button, style, children } = this.props;

    return (
      <View ref={this._setContainerRef} collapsable={false} testID={testID}>
        <View onLayout={this._onButtonLayout}>{button}</View>
        <Modal
          visible={modalVisible}
          onRequestClose={this.hide}
          supportedOrientations={[
            'portrait',
            'portrait-upside-down',
            'landscape',
            'landscape-left',
            'landscape-right',
          ]}
          transparent
          onDismiss={this._onDismiss}
        >
          <TouchableWithoutFeedback onPress={this.hide}>
          { this.props.type === "setting"?
            <View style={StyleSheet.absoluteFill}>
                <Animated.View style={[
                    triangleSettingStyle, style, shadowMenuSettingStyle ]}>
                </Animated.View >
              <Animated.View
                onLayout={this._onMenuLayout}
                style={[
                  styles.shadowMenuContainer,
                  shadowMenuContainerStyle,
                ]}
              >
                <Animated.View
                  style={[styles.menuContainer, animationStarted && menuSize]}
                >
                  {children}
                </Animated.View>
              </Animated.View>
            </View>
            : 
            <View style={StyleSheet.absoluteFill}>
                <Animated.View style={[
                    triangleNoticeStyle, style, shadowMenuContainerStyle ]}>
                </Animated.View >
              <Animated.View
                onLayout={this._onMenuLayout}
                style={[
                  styles.shadowMenuContainerNotice,
                  shadowMenuContainerStyle,
                  leftPaddingStyle
                ]}
              >
                <Animated.View
                  style={[styles.menuContainer, animationStarted && menuSize]}
                >
                  {children}
                </Animated.View>
              </Animated.View>
            </View>
          }
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
}

Menu.propTypes = {
  button: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  onHidden: PropTypes.func,
  style: ViewPropTypes.style,
  testID: ViewPropTypes.testID,
};

const styles = StyleSheet.create({
  shadowMenuContainer: {
    // Shadow
    ...Platform.select({
      ios: {
        marginTop: 40,
        marginLeft: -5,
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: 4,
        opacity: 0,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.14,
        shadowRadius: 2,
      },
      android: {
        marginTop: 40,
        marginLeft: -5,
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: 4,
        opacity: 0,
        elevation: 8,
      },
    }),
  },
  shadowMenuContainerNotice: {
    // Shadow
    ...Platform.select({
      ios: {
        marginTop: 40,
        marginLeft: 1,
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: 4,
        opacity: 0,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.14,
        shadowRadius: 2,
      },
      android: {
        marginTop: 40,
        marginLeft: 1,
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: 4,
        opacity: 0,
        elevation: 8,
      },
    }),
  },
  menuContainer: {
    overflow: 'hidden',
  },
});

export default Menu;
