import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {
  grey900, grey700,
  orangeA200, grey500,
  grey100, grey300, grey400,
  white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator';

export default function getTheme() {
  return getMuiTheme({
    palette: {
      primary1Color: grey700,
      primary2Color: grey900,
      primary3Color: grey100,
      accent1Color: orangeA200,
      accent2Color: grey400,
      accent3Color: grey500,
      textColor: darkBlack,
      alternateTextColor: white,
      canvasColor: white,
      borderColor: grey300,
      disabledColor: fade(darkBlack, 0.3),
      pickerHeaderColor: grey500,
      clockCircleColor: fade(darkBlack, 0.07),
      shadowColor: fullBlack,
    },
  });
}
