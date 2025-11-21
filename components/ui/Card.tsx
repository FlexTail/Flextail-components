import React, {
  forwardRef,
  type HTMLAttributes,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";
import {
  cn,
  type ComponentSize,
} from "../utils/FlexTail-config"
import { Button } from './Button';

type CardColor =
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'red'
  | 'green'
  | 'orange'
  | 'teal'
  | 'slate'
  | 'default';

const cardColorMap: Record<CardColor, string> = {
    default: 'slate',
    blue: 'blue',
    indigo: 'indigo',
    violet: 'violet',
    purple: 'purple',
    red: 'red',
    green: 'green',
    orange: 'orange',
    teal: 'teal',
    slate: 'slate',
}

type CardLayout = 'vertical' | 'horizontal';

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  variant?: 'elevated' | 'bordered' | 'ghost' | 'blurred';
  color?: CardColor;
  layout?: CardLayout;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      children,
      variant = 'elevated',
      color = 'default',
      layout = 'vertical',
      ...props
    },
    ref,
  ) => {
    const accentColor = cardColorMap[color] || cardColorMap.default;

    const getVariantClasses = (): string => {
      switch (variant) {
        case 'elevated':
          return clsx(
            'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800',
            `shadow-lg hover:shadow-xl transition-shadow duration-300 shadow-${accentColor}-300/30 dark:shadow-slate-900/50`,
          );
        case 'bordered':
          return clsx(
            'bg-white dark:bg-slate-900 border-2',
            `border-${accentColor}-500/50 dark:border-${accentColor}-600/50 hover:border-${accentColor}-600 dark:hover:border-${accentColor}-500`,
            'shadow-md',
          );
        case 'ghost':
          return clsx(
            'bg-transparent border border-transparent',
            `hover:bg-${accentColor}-50 dark:hover:bg-${accentColor}-900/20`,
          );
        case 'blurred':
          return 'backdrop-filter backdrop-blur-lg bg-white/50 dark:bg-black/30 text-white border border-white/30';
        default:
          return 'bg-white text-gray-900 dark:bg-slate-950 dark:text-white';
      }
    };

    const getLayoutClasses = (): string => {
      if (layout === 'horizontal') {
        return 'flex flex-col md:flex-row md:items-stretch h-full';
      }
      return 'flex flex-col h-full';
    };

    return (
      <div
        ref={ref}
        className={clsx(
          'p-0 rounded-xl w-full transition-all duration-300 overflow-hidden',
          'text-slate-900 dark:text-white',
          getVariantClasses(),
          getLayoutClasses(),
          className,
        )}
        style={{ minWidth: layout === 'horizontal' ? '400px' : undefined }}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Card.displayName = 'Card';

type ObjectFit = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';

const objectFitMap: Record<ObjectFit, string> = {
  fill: 'object-fill',
  contain: 'object-contain',
  cover: 'object-cover',
  none: 'object-none',
  'scale-down': 'object-scale-down',
};

interface CardImageProps extends HTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  objectFit?: ObjectFit;
}
const CardImage = forwardRef<HTMLImageElement, CardImageProps>(
  ({ className, src, alt, objectFit = 'cover', ...props }, ref) => (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={clsx(
        'w-full transition-transform duration-300 group-hover:scale-[1.03] flex-shrink-0', // Use group-hover for image scale
        objectFitMap[objectFit],
        className,
      )}
      {...props}
    />
  ),
);
CardImage.displayName = 'CardImage';

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}
const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx('p-5 sm:p-6 lg:p-7 space-y-3 flex-grow', className)} // Increased padding for modern look
      {...props}
    >
      {children}
    </div>
  ),
);
CardContent.displayName = 'CardContent';

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}
const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx('flex flex-col space-y-1', className)}
      {...props}
    >
      {children}
    </div>
  ),
);
CardHeader.displayName = 'CardHeader';

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  twColor?: CardColor;
}
const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, twColor, ...props }, ref) => {
    const accentClass = twColor ? `text-${cardColorMap[twColor]}-600 dark:text-${cardColorMap[twColor]}-400` : 'text-slate-900 dark:text-slate-50';

    return (
      <h3
        ref={ref}
        className={clsx(
          'text-xl sm:text-2xl font-bold leading-tight tracking-tight',
          accentClass,
          className,
        )}
        {...props}
      >
        {children}
      </h3>
    );
  },
);
CardTitle.displayName = 'CardTitle';

interface CardDescriptionProps extends HTMLAttributes<HTMLDivElement> {
  linesToShow?: 1 | 2 | 3 | 4 | 5;
  twColor?: CardColor;
}

const lineClampClasses = {
  1: 'line-clamp-1',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
  5: 'line-clamp-5',
};

const CardDescription = forwardRef<HTMLDivElement, CardDescriptionProps>(
  ({
    className,
    children,
    linesToShow = 3,
    twColor = 'blue',
    ...props
  }, ref) => {
    const [isTruncated, setIsTruncated] = useState(false);
    const [isFullDescriptionOpen, setIsFullDescriptionOpen] = useState(false);
    const textRef = useRef<HTMLParagraphElement>(null);

    const checkTruncation = useCallback(() => {
      if (!textRef.current) return;

      const timeout = setTimeout(() => {
        setIsTruncated(
          textRef.current!.scrollHeight > textRef.current!.clientHeight,
        );
      }, 50);

      return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
      checkTruncation();
      window.addEventListener('resize', checkTruncation);

      const observer = new MutationObserver(checkTruncation);
      if (textRef.current) {
        observer.observe(textRef.current, {
          childList: true,
          subtree: true,
          characterData: true,
        });
      }

      return () => {
        window.removeEventListener('resize', checkTruncation);
        observer.disconnect();
      };
    }, [checkTruncation, children]);

    return (
      <div className="w-full" ref={ref as React.Ref<HTMLDivElement>}>
        <p
          ref={textRef}
          className={clsx(
            'text-sm text-slate-600 dark:text-slate-400', // Modernized descriptive text color
            lineClampClasses[linesToShow],
            className,
          )}
          {...props}
        >
          {children}
        </p>
        {isTruncated && (
          <Button
            onClick={() => setIsFullDescriptionOpen(true)}
            variant="link"
            size="sm"
            twColor={twColor as (keyof typeof COLOR_MAP)}
            className="w-fit h-8 p-0 mt-1"
          >
            Show Full Description
          </Button>
        )}
        {isFullDescriptionOpen && (
          <Modal
            onClose={() => setIsFullDescriptionOpen(false)}
            title="Full Description"
            content={children}
            twColor={twColor as (keyof typeof COLOR_MAP)}
          >
            Close
          </Modal>
        )}
      </div>
    );
  },
);
CardDescription.displayName = 'CardDescription';

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}
const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        'flex gap-3 items-center pt-4 border-t border-slate-100 dark:border-slate-800 p-5 sm:px-6 lg:px-7', // Footer separation
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
CardFooter.displayName = 'CardFooter';

const App = () => {
  const sampleText = "The transition from physical to digital workspaces has presented both opportunities and challenges for modern businesses. This comprehensive analysis explores the key technological shifts, including cloud computing and AI-driven automation, that are reshaping productivity metrics and employee engagement across various industries. Furthermore, we delve into the socio-economic impacts, examining how remote work policies affect urban planning and global talent acquisition strategies.";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 sm:p-12 font-sans antialiased">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-10 text-center">
        Modern Card Component Showcase
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">

        <Card className="group h-full" color="blue" variant="elevated">
          <CardImage
            src="https://placehold.co/600x400/2563eb/ffffff?text=Product+Image"
            alt="A placeholder for a product image"
            className="h-48 md:h-56 w-full object-cover"
            />
          <CardContent>
            <CardHeader>
              <CardTitle twColor="blue">Data Analysis Report</CardTitle>
              <p className="text-sm text-blue-500 dark:text-blue-400 font-medium">Published on Jan 15, 2024</p>
            </CardHeader>
            <CardDescription twColor="blue" linesToShow={3}>
              {sampleText}
            </CardDescription>
          </CardContent>
          <CardFooter>
            <Button size="sm" twColor="blue">View Report</Button>
            <Button size="sm" variant="ghost" twColor="slate">Share</Button>
          </CardFooter>
        </Card>

        <Card className="group h-full" color="purple" variant="bordered">
          <CardImage
            src="https://placehold.co/600x400/9333ea/ffffff?text=Feature+Highlight"
            alt="A purple background with feature text"
            className="h-48 md:h-56 w-full object-cover"
          />
          <CardContent>
            <CardHeader>
              <CardTitle twColor="purple">AI Automation Workflow</CardTitle>
              <p className="text-sm text-purple-500 dark:text-purple-400 font-medium">New Feature</p>
            </CardHeader>
            <CardDescription twColor="purple" linesToShow={4}>
              {sampleText.slice(0, 150) + " This section is truncated to show the 'Show Full Description' button, demonstrating the modal functionality."}
            </CardDescription>
          </CardContent>
          <CardFooter>
            <Button size="md" twColor="purple" icon={<CheckIcon className='w-4 h-4' />} iconPos="right">Enable Now</Button>
          </CardFooter>
        </Card>

        <Card className="group h-full" color="red" variant="ghost">
          <CardContent>
            <CardHeader>
              <CardTitle twColor="red">Urgent Security Alert</CardTitle>
              <p className="text-sm text-red-500 dark:text-red-400 font-medium">Action Required</p>
            </CardHeader>
            <CardDescription twColor="red" linesToShow={3}>
              {sampleText.slice(0, 100) + " Immediate patching is required across all server environments. Please review the documentation provided immediately."}
            </CardDescription>
          </CardContent>
          <CardFooter className="pt-0">
            <Button size="sm" twColor="red" variant="outline">Fix Immediately</Button>
            <Button size="sm" twColor="red" variant="link">Ignore for 24h</Button>
          </CardFooter>
        </Card>

        <div className="lg:col-span-2">
            <Card className="group" color="teal" variant="elevated" layout="horizontal">
              <CardImage
                src="https://placehold.co/300x200/0d9488/ffffff?text=Horizontal+View"
                alt="A teal background with horizontal text"
                className="w-full h-40 md:w-52 md:h-full object-cover"
              />
              <CardContent>
                <CardHeader>
                  <CardTitle twColor="teal">Collaborative Project Hub</CardTitle>
                  <p className="text-sm text-teal-500 dark:text-teal-400 font-medium">Team: Alpha</p>
                </CardHeader>
                <CardDescription twColor="teal" linesToShow={2}>
                  This card uses a horizontal layout, combining the image and content side-by-side for a compact, informative display, ideal for lists or dashboards.
                </CardDescription>
                <CardFooter className="p-0 border-t-0 pt-4">
                  <Button size="sm" twColor="teal" icon={<CheckIcon className='w-4 h-4' />}>Go to Board</Button>
                  <Button size="sm" twColor="teal" variant="tertiary">Check Activity</Button>
                </CardFooter>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default App;

export {
  Card,
  CardImage,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
};