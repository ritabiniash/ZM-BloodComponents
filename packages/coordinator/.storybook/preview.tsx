import React from "react";
import { StylesProvider } from "@material-ui/core";
import WithGlobalTheme from "../src/HOCs/withGlobalTheme";
import { Story, StoryContext } from "@storybook/react";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import "../src/styles/index.scss";
import {
  Styles,
  ViewportMap,
} from "@storybook/addon-viewport/dist/ts3.9/models/Viewport";

// https://github.com/mui-org/material-ui/issues/9492#issuecomment-657609780
const generateClassName = () => {
  let counter = 0;
  return (rule: any, styleSheet: any) =>
    `${styleSheet.options.classNamePrefix}-${rule.key}-${counter++}`;
};

const viewPort: ViewportMap = {
  zmTabletSmall: {
    name: "ZM tablet (Small)",
    styles: {
      width: "900px",
      height: "1600px",
    },
    type: "tablet",
  },
  zmTabletBig: {
    name: "ZM tablet (Big)",
    styles: {
      width: "1200px",
      height: "2000px",
    },
    type: "tablet",
  },
};

export const parameters = {
  viewport: {
    viewports: {
      ...viewPort,
      ...INITIAL_VIEWPORTS,
    },
    defaultViewport: "zmTabletSmall",
  },
};

export default function WithStableMuiClassnames(props: {
  children: React.ReactNode;
}) {
  return (
    <StylesProvider generateClassName={generateClassName()}>
      {props.children}
    </StylesProvider>
  );
}

const withMuiProvider = (Story: Story, context: StoryContext) => {
  return (
    <div dir="rtl" style={{ height: "100vh" }}>
      <WithStableMuiClassnames>
        <WithGlobalTheme>
          <Story {...context} />
        </WithGlobalTheme>
      </WithStableMuiClassnames>
    </div>
  );
};
export const decorators = [withMuiProvider];
