"use client";

import React from "react";
import {
  RadioGroup,
  VisuallyHidden,
  useRadio,
  useRadioGroupContext,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { cn } from "@nextui-org/react";
import { useTheme } from "next-themes";

const ThemeRadioItem = ({ icon, ...props }) => {
  const {
    Component,
    isSelected: isSelfSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps,
  } = useRadio(props);
  const groupContext = useRadioGroupContext();
  const { setTheme } = useTheme();

  const isSelected =
    isSelfSelected ||
    Number(groupContext.groupState.selectedValue) >= Number(props.value);

  const handleChange = () => {
    setTheme(props.value); // Set theme on selection change
  };

  const wrapperProps = getWrapperProps();

  return (
    <Component {...getBaseProps()} onClick={handleChange}>
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <div
        {...wrapperProps}
        className={cn(
          wrapperProps?.["className"],
          "pointer-events-none h-8 w-8 rounded-full border-black border-opacity-10 ring-0 transition-transform group-data-[pressed=true]:scale-90",
          {
            "bg-default-200 dark:bg-default-100": isSelected,
          }
        )}
      >
        <Icon className="text-default-500" icon={icon} width={18} />
      </div>
    </Component>
  );
};

const ThemeSwitch = React.forwardRef(({ classNames = {}, ...props }, ref) => {
  const { theme } = useTheme(); // Get current theme

  return (
    <RadioGroup
      ref={ref}
      aria-label="Select a theme"
      classNames={{
        ...classNames,
        wrapper: cn("gap-0 items-center", classNames?.wrapper),
      }}
      value={theme} // Set current theme as selected
      orientation="horizontal"
      {...props}
    >
      <ThemeRadioItem icon="solar:moon-linear" value="dark" />
      <ThemeRadioItem icon="solar:sun-2-linear" value="light" />
      <ThemeRadioItem icon="solar:monitor-linear" value="system" />
    </RadioGroup>
  );
});

ThemeSwitch.displayName = "ThemeSwitch";

export default ThemeSwitch;
