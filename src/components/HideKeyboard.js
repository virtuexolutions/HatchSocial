import React from 'react';
import { TouchableWithoutFeedback, Keyboard, SafeAreaView } from 'react-native';

const HideKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );

  export default HideKeyboard;