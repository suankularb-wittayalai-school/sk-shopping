// Imports
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import {
  Button,
  MaterialIcon,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { omit } from "radash";
import { ComponentProps } from "react";

const FullscreenImageDialog: StylableFC<
  ComponentProps<typeof Image> & {
    open: boolean;
    onClose: () => void;
  }
> = (props) => {
  const { src, open, onClose, style, className } = props;
  const { duration, easing } = useAnimationConfig();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="skc-scrim"
          />
          <div
            style={style}
            className={cn(
              `pointer-events-none fixed inset-0 z-[90] grid
              place-content-center`,
              className,
            )}
          >
            <motion.div
              layout="preserve-aspect"
              layoutId={`main-image-${src}`}
              transition={transition(duration.medium2, easing.standard)}
              className={cn(`pointer-events-auto relative aspect-[4/3] h-auto
                w-[100dvh] max-w-[100dvw] md:h-[100dvh] md:w-auto`)}
            >
              <Button
                appearance="outlined"
                icon={<MaterialIcon icon="close" />}
                onClick={onClose}
                className="!absolute !left-2 !top-2 z-[95] !border-0 !bg-surface-1 !shadow-1"
              />
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image
                {...omit(props, ["open", "onClose"])}
                className="h-full w-full object-contain"
              />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FullscreenImageDialog;
