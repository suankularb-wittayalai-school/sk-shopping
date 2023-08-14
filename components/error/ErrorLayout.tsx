// Imports
import UseVector from "@/components/UseVector";
import {
  Button,
  Columns,
  ContentLayout,
  MaterialIcon,
} from "@suankularb-components/react";
import { FC, ReactNode } from "react";

/**
 * The layout for error pages and fallbacks. Note that this doesn’t replace
 * Root Layout.
 *
 * @param children The content of the error page/fallback.
 */
const ErrorLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div
      className="flex min-h-[calc(100dvh-5rem)] flex-col justify-center
        bg-fixed px-4 sm:min-h-[100dvh] sm:px-0"
    >
      {/* Background blobs */}
      <UseVector
        href="blob-card-full"
        className="fixed inset-0 -z-10 aspect-video h-full md:w-full"
      />
      {/* Back Button */}
      <div className="fixed left-4 right-4 top-4 sm:top-11">
        <div
          className="mx-auto w-full max-w-[72.5rem]
            sm:w-[calc(100%-11rem)]"
        >
          <Button
            appearance="text"
            icon={<MaterialIcon icon="arrow_backward" />}
            alt="Go back"
            onClick={() => window.history.back()}
            className="-left-2 before:!bg-on-surface [&_i]:text-on-surface
              [&_span]:!bg-on-surface"
          />
        </div>
      </div>

      {/* Content */}
      <ContentLayout>
        <Columns columns={6}>
          <div
            className="col-span-2 flex flex-col gap-6 sm:col-span-4
              md:col-span-4 md:col-start-2"
          >
            {children}
          </div>
        </Columns>
      </ContentLayout>
    </div>
  );
};

export default ErrorLayout;
