import "@testing-library/jest-dom";
import React from "react";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & {
    priority?: boolean;
    fill?: boolean;
  }) => {
    // Render Next.js Image as a normal img in tests.
    const { priority: _priority, fill: _fill, ...imgProps } = props;
    void _priority;
    void _fill;
    return React.createElement("img", { ...imgProps, alt: props.alt ?? "" });
  },
}));
