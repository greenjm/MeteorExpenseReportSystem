import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {
  grey900, grey500,
  grey100, grey300, grey200,
  white, darkBlack, fullBlack,
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
      color: palette.alternateTextColor,
      textColor: palette.textColor,
      primaryColor: '#ffae00',
      primaryTextColor: palette.alternateTextColor,
      secondaryColor: palette.accent1Color,
      secondaryTextColor: palette.alternateTextColor,
      disabledColor: darken(palette.alternateTextColor, 0.1),
      disabledTextColor: fade(palette.textColor, 0.3),
      fontSize: typography.fontStyleButtonFontSize,
      fontWeight: typography.fontWeightMedium,
    },
  });
}
