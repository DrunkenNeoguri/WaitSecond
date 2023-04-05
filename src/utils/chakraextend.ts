import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        color: "#333333",
      },
    },
  },
  components: {
    Checkbox: {
      variants: {
        customBlue: {
          control: {
            _checked: {
              bg: "subBlue",
              borderColor: "subBlue",
            },
          },
        },
      },
    },
  },
  colors: {
    mainBlue: "#4169E1",
    subBlue: "#87CEEB",
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
