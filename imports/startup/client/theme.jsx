import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {
  grey900, grey500,
  grey100, grey300, grey200, red500,
  white, darkBlack, fullBlack, transparent,
} from 'material-ui/styles/colors';
import { darken, fade } from 'material-ui/utils/colorManipulator';
import typography from 'material-ui/styles/typography';

export default function getTheme() {
  const palette = {
    primary1Color: grey200,
    primary2Color: grey900,
    primary3Color: grey100,
    accent1Color: '#ffae00',
    accent2Color: '#ffae00',
    accent3Color: grey500,
    textColor: darkBlack,
    alternateTextColor: fullBlack,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: grey500,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack,
  };

  return getMuiTheme({
    palette,
    svgIcon: {
      color: palette.alternateTextColor,
    },
    raisedButton: {
      color: grey300,
      textColor: palette.textColor,
      primaryColor: palette.accent1Color,
      primaryTextColor: palette.alternateTextColor,
      secondaryColor: palette.accent1Color,
      secondaryTextColor: palette.alternateTextColor,
      disabledColor: darken(palette.alternateTextColor, 0.1),
      disabledTextColor: fade(palette.textColor, 0.3),
      fontSize: typography.fontStyleButtonFontSize,
      fontWeight: typography.fontWeightMedium,
    },
    flatButton: {
      color: transparent,
      buttonFilterColor: '#999999',
      disabledTextColor: fade(palette.textColor, 0.3),
      textColor: palette.textColor,
      primaryTextColor: palette.textColor,
      secondaryTextColor: palette.accent1Color,
      fontSize: typography.fontStyleButtonFontSize,
      fontWeight: typography.fontWeightMedium,
    },
    textField: {
      textColor: palette.textColor,
      hintColor: palette.disabledColor,
      floatingLabelColor: palette.disabledColor,
      disabledTextColor: palette.disabledColor,
      errorColor: red500,
      focusColor: palette.primary2Color,
      backgroundColor: 'transparent',
      borderColor: palette.borderColor,
    },
  });
}
