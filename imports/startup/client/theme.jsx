import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {
  grey900, grey500,
  grey100, grey300, grey400,
  white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator';

export default function getTheme() {
  const palette = {
    primary1Color: '#8c8b86',
    primary2Color: grey900,
    primary3Color: grey100,
    accent1Color: '#ffae00',
    accent2Color: grey400,
    accent3Color: grey500,
    textColor: darkBlack,
    alternateTextColor: '#f9f9f9',
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
  });
}
