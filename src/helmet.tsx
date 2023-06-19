import { Component, ReactNode } from "react";
import { Helmet } from "react-helmet";
class HelmetComponent extends Component {
  render(): ReactNode {
    return (
      <>
        <Helmet>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;700&display=swap"
            rel="stylesheet"
          ></link>
        </Helmet>
      </>
    );
  }
}
export default HelmetComponent;
