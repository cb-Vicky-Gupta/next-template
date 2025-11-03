interface ButtonProps {
  button_text: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}
const Button = (props: ButtonProps) => {
  const variant = "primary";
  return (
    <button
      {...props}
      onClick={props.onClick}
      className={`flex items-center gap-2 ${props.className} `}
    >
      {props.iconLeft && props.iconLeft}
      {props.button_text}
      {props.iconRight && props.iconRight}
    </button>
  );
};

export default Button;
