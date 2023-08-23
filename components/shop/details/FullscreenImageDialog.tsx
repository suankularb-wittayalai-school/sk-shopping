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
import { ComponentProps, useEffect } from "react";

const FullscreenImageDialog: StylableFC<
  ComponentProps<typeof Image> & {
    open: boolean;
    onClose: () => void;
  }
> = (props) => {
  const { src, open, onClose, style, className } = props;
  const { duration, easing } = useAnimationConfig();

  useEffect(() => {
    const handleKeyUp = ({ key }: KeyboardEvent) =>
      key === "Escape" && onClose();
    window.addEventListener("keyup", handleKeyUp);
    return () => window.removeEventListener("keyup", handleKeyUp);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="skc-scrim"
          />

          {/* Image */}
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
              className={cn(
                `pointer-events-auto relative aspect-[4/3] overflow-hidden
                object-cover before:absolute before:inset-0 before:-z-10
                before:rounded-sm before:bg-outline after:absolute
                after:inset-0 after:-z-10 after:animate-pulse after:rounded-sm
                after:bg-surface-variant`,
              )}
            >
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image
                {...omit(props, ["open", "onClose"])}
                className="rounded-sm"
              />
            </motion.div>
          </div>

          {/* Close Button */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{
              scale: 0,
              transition: transition(
                duration.short2,
                easing.standardAccelerate,
              ),
            }}
            transition={{
              ...transition(duration.medium2, easing.standardDecelerate),
              delay: duration.short4,
            }}
            className="fixed left-2 top-3.5 z-[95] sm:top-2"
          >
            <Button
              appearance="outlined"
              icon={<MaterialIcon icon="close" />}
              onClick={onClose}
              className="!border-0 !bg-surface-1"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FullscreenImageDialog;
