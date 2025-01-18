import { cnm } from "@/utils/style";
import SvgIcon from "../utils/SvgIcon";
import dynamic from "next/dynamic";

const AuthButton = ({
  className,
  login,
  logout,
  userInfo,
  isInitializing,
  classNameSvg,
}) => {
  return (
    <button
      disabled={isInitializing}
      onClick={userInfo ? logout : login}
      className={cnm(
        `flex w-28 h-9 items-center justify-center gap-2 px-4 py-2 font-medium rounded-lg bg-lemongrass hover:bg-lemongrass/90 ${className} ${
          isInitializing ? "cursor-wait" : "cursor-pointer"
        }`,
        className
      )}
    >
      {isInitializing ? (
        <SvgIcon
          src="/assets/animations/motion-blur-2.svg"
          className=" h-6 w-6 bg-mossgreen"
        />
      ) : (
        <>
          <SvgIcon
            src="/assets/icons/login.svg"
            className={cnm("h-4 w-4 bg-mossgreen", classNameSvg)}
          />
          <p className="text-mossgreen text-sm md:text-base">
            {userInfo ? "Log Out" : "Sign In"}
          </p>
        </>
      )}
    </button>
  );
};

export default AuthButton;
