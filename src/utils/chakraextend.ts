import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  components: {
    Checkbox: {
      variants: {
        customBlue: {
          control: {
            _checked: {
              bg: "mainBlue",
              borderColor: "mainBlue",
            },
          },
        },
      },
    },
  },
  colors: {
    mainBlue: "#87CEEB",
    subBlue: "#4169E1",
    accentBlue: "#00008B",
    mainGray: "#A6A6A6",
    accentGray: "#424242",
    errorRed: "#B22222",
  },
  fonts: {
    heading: `'Pretendard', sans-serif`,
    body: `'Pretendard', sans-serif`,
  },
});

export default theme;
