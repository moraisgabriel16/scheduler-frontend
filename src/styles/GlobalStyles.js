// src/styles/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Roboto:wght@400;500&display=swap');

  body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
    background-color: #f0f2f5;
  }
`;

export default GlobalStyle;
