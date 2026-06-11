import React from 'react';

export type IconProps = {
  size?: number;
  className?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
  style?: React.CSSProperties;
};

const wrap = (children: React.ReactNode, props: IconProps) => {
  const {
    size = 24,
    className,
    'aria-label': ariaLabel,
    'aria-hidden': ariaHidden,
    style,
  } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden ?? !ariaLabel}
      style={style}
    >
      {children}
    </svg>
  );
};

export const IconUpload = (props: IconProps) =>
  wrap(
    <>
      <path d="M14 8 H30 L36 14 V40 H14 Z" fill="#FBF8F1" stroke="#171717" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M30 8 V14 H36" stroke="#171717" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
      <path d="M24 32 V20" stroke="#5A8B7A" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M19 25 L24 20 L29 25" stroke="#5A8B7A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M40 10 L42 12 M40 14 L38 12" stroke="#F5C547" strokeWidth="2" strokeLinecap="round" />
    </>,
    props,
  );

export const IconClose = (props: IconProps) =>
  wrap(
    <>
      <path d="M14 14 Q24 22 34 34" stroke="#171717" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M34 14 Q24 22 14 34" stroke="#171717" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="24" cy="24" r="2" fill="#5A8B7A" />
    </>,
    props,
  );

export const IconMapPin = (props: IconProps) =>
  wrap(
    <>
      <path d="M24 6 C32 6 38 12 38 20 C38 30 24 42 24 42 C24 42 10 30 10 20 C10 12 16 6 24 6 Z" fill="#5A8B7A" stroke="#171717" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="24" cy="20" r="4.5" fill="#FBF8F1" stroke="#171717" strokeWidth="2" />
      <path d="M40 8 V12 M38 10 H42" stroke="#7A5A8B" strokeWidth="2" strokeLinecap="round" />
    </>,
    props,
  );

export const IconSparkle = (props: IconProps) =>
  wrap(
    <>
      <path d="M24 6 L27 21 L42 24 L27 27 L24 42 L21 27 L6 24 L21 21 Z" fill="#F5C547" stroke="#171717" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="40" cy="10" r="2" fill="#5A8B7A" />
      <circle cx="9" cy="38" r="2" fill="#7A5A8B" />
    </>,
    props,
  );

export const IconCheck = (props: IconProps) =>
  wrap(
    <>
      <circle cx="24" cy="24" r="17" fill="#5A8B7A" stroke="#171717" strokeWidth="2.5" />
      <path d="M15 24 L22 31 L34 18" stroke="#FBF8F1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M40 8 L42 10 M40 12 L38 10" stroke="#F5C547" strokeWidth="2" strokeLinecap="round" />
    </>,
    props,
  );

export const IconHeart = (props: IconProps) =>
  wrap(
    <>
      <path d="M24 40 C24 40 8 30 8 18 C8 13 12 9 17 9 C20 9 22.5 10.5 24 13 C25.5 10.5 28 9 31 9 C36 9 40 13 40 18 C40 30 24 40 24 40 Z" fill="#F4A480" stroke="#171717" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M14 16 Q15 14 17 13.5" stroke="#FBF8F1" strokeWidth="2" strokeLinecap="round" />
      <path d="M40 32 L42 34 M40 36 L38 34" stroke="#5A8B7A" strokeWidth="2" strokeLinecap="round" />
    </>,
    props,
  );

export const IconHouseSmall = (props: IconProps) =>
  wrap(
    <>
      <rect x="10" y="22" width="28" height="20" fill="#FBF8F1" stroke="#171717" strokeWidth="2.5" />
      <path d="M6 24 L24 8 L42 24" fill="#C97A4A" stroke="#171717" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="20" y="28" width="8" height="14" fill="#1E3A5F" stroke="#171717" strokeWidth="2" />
      <circle cx="26" cy="35" r="0.8" fill="#F5C547" />
      <path d="M36 12 Q39 11 41 13 Q43 11 44 13 Q44 16 41 16 Q39 16 36 14 Z" fill="#FBF8F1" stroke="#171717" strokeWidth="1.5" strokeLinejoin="round" />
    </>,
    props,
  );

export const IconUser = (props: IconProps) =>
  wrap(
    <>
      <circle cx="24" cy="17" r="9" fill="#5A8B7A" stroke="#171717" strokeWidth="2.5" />
      <path d="M8 42 C8 32 14 28 24 28 C34 28 40 32 40 42" fill="#5A8B7A" stroke="#171717" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="21" cy="16" r="1.2" fill="#171717" />
      <circle cx="27" cy="16" r="1.2" fill="#171717" />
      <path d="M21 20 Q24 22.5 27 20" stroke="#171717" strokeWidth="2" strokeLinecap="round" fill="none" />
    </>,
    props,
  );

export const IconDocumentSmall = (props: IconProps) =>
  wrap(
    <>
      <path d="M12 6 H30 L36 12 V42 H12 Z" fill="#FBF8F1" stroke="#171717" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M30 6 V12 H36" stroke="#171717" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
      <path d="M16 20 Q20 18 24 20 T32 20" stroke="#5A8B7A" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M16 26 Q20 24 24 26 T32 26" stroke="#5A8B7A" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M16 32 Q20 30 24 32 T30 32" stroke="#5A8B7A" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M40 8 L42 10 M40 12 L38 10" stroke="#F5C547" strokeWidth="2" strokeLinecap="round" />
    </>,
    props,
  );

export const IconSearchSmall = (props: IconProps) =>
  wrap(
    <>
      <circle cx="20" cy="20" r="12" fill="#FBF8F1" stroke="#171717" strokeWidth="2.5" />
      <circle cx="20" cy="20" r="12" stroke="#5A8B7A" strokeWidth="1.5" fill="none" />
      <path d="M28.5 28.5 L40 40" stroke="#171717" strokeWidth="3" strokeLinecap="round" />
      <path d="M20 14 L21.5 18.5 L26 20 L21.5 21.5 L20 26 L18.5 21.5 L14 20 L18.5 18.5 Z" fill="#F5C547" stroke="#171717" strokeWidth="1.5" strokeLinejoin="round" />
    </>,
    props,
  );

export const IconMail = (props: IconProps) =>
  wrap(
    <>
      <rect x="6" y="14" width="36" height="24" rx="2" fill="#FBF8F1" stroke="#171717" strokeWidth="2.5" />
      <path d="M6 16 L24 28 L42 16" stroke="#5A8B7A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="38" cy="34" r="2.5" fill="#F4A480" stroke="#171717" strokeWidth="1.5" />
    </>,
    props,
  );

export const IconShield = (props: IconProps) =>
  wrap(
    <>
      <path d="M24 6 L38 11 V24 C38 33 32 39 24 42 C16 39 10 33 10 24 V11 Z" fill="#1E3A5F" stroke="#171717" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M16 24 L22 30 L33 18" stroke="#FBF8F1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M40 8 L42 10 M40 12 L38 10" stroke="#F5C547" strokeWidth="2" strokeLinecap="round" />
    </>,
    props,
  );

export const IconHelp = (props: IconProps) =>
  wrap(
    <>
      <rect x="8" y="8" width="32" height="32" rx="8" fill="#5A8B7A" stroke="#171717" strokeWidth="2.5" />
      <path d="M19 18 C19 14 21.5 12 24 12 C27 12 29 14 29 17 C29 20 24 21 24 25" stroke="#FBF8F1" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="24" cy="32" r="2" fill="#FBF8F1" />
      <circle cx="42" cy="6" r="1.8" fill="#7A5A8B" />
    </>,
    props,
  );

export const IconWarning = (props: IconProps) =>
  wrap(
    <>
      <path d="M24 6 Q26 6 27 8 L41 36 Q42 40 38 40 H10 Q6 40 7 36 L21 8 Q22 6 24 6 Z" fill="#C97A4A" stroke="#171717" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M24 16 V28" stroke="#FBF8F1" strokeWidth="3" strokeLinecap="round" />
      <circle cx="24" cy="34" r="2" fill="#FBF8F1" />
      <circle cx="42" cy="10" r="1.8" fill="#7A2C3D" />
    </>,
    props,
  );

export const IconKey = (props: IconProps) =>
  wrap(
    <g transform="rotate(-28 24 24)">
      <>
        <circle cx="14" cy="24" r="8" fill="#5A8B7A" stroke="#171717" strokeWidth="2.5" />
        <circle cx="14" cy="24" r="2.5" fill="#171717" />
        <path d="M22 24 H40" stroke="#171717" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M40 24 V30 M34 24 V28" stroke="#171717" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M44 8 L46 10 M44 12 L42 10" stroke="#F5C547" strokeWidth="2" strokeLinecap="round" />
      </>
    </g>,
    props,
  );

export const IconBox = (props: IconProps) =>
  wrap(
    <>
      <path d="M8 16 L24 8 L40 16 L24 24 Z" fill="#F4A480" stroke="#171717" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M8 16 V36 L24 44 V24 Z" fill="#C97A4A" stroke="#171717" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M40 16 V36 L24 44 V24 Z" fill="#7A2C3D" stroke="#171717" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M16 12 L32 20 M16 20 L32 12" stroke="#5A8B7A" strokeWidth="2" strokeLinecap="round" />
      <path d="M42 6 L44 8 M42 10 L40 8" stroke="#F5C547" strokeWidth="2" strokeLinecap="round" />
    </>,
    props,
  );

export const IconChevronRight = (props: IconProps) =>
  wrap(
    <>
      <path d="M18 12 Q26 18 30 24 Q26 30 18 36" stroke="#171717" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="18" cy="12" r="1.8" fill="#5A8B7A" />
    </>,
    props,
  );

export const IconMenu = (props: IconProps) =>
  wrap(
    <>
      <path d="M9 14 Q24 12 39 14" stroke="#171717" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M9 24 Q24 26 39 24" stroke="#171717" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M9 34 Q24 32 39 34" stroke="#171717" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="42" cy="9" r="2" fill="#F5C547" stroke="#171717" strokeWidth="1.5" />
    </>,
    props,
  );

export const IconPhone = (props: IconProps) =>
  wrap(
    <>
      <path d="M10 8 Q14 6 20 8 L24 16 Q22 20 18 22 Q24 30 28 32 Q32 30 34 26 L42 30 Q42 36 40 38 Q34 42 26 38 Q14 32 10 18 Q8 12 10 8 Z" fill="#C97A4A" stroke="#171717" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M34 6 Q40 8 42 14" stroke="#5A8B7A" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M30 10 Q34 12 36 16" stroke="#5A8B7A" strokeWidth="2" strokeLinecap="round" fill="none" />
    </>,
    props,
  );

export const IconClock = (props: IconProps) =>
  wrap(
    <>
      <circle cx="24" cy="24" r="17" fill="#FBF8F1" stroke="#171717" strokeWidth="2.5" />
      <path d="M24 13 V24 L32 28" stroke="#5A8B7A" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="24" cy="24" r="2" fill="#171717" />
      <circle cx="24" cy="9" r="1.5" fill="#F5C547" />
      <circle cx="24" cy="39" r="1.5" fill="#F5C547" />
      <circle cx="9" cy="24" r="1.5" fill="#F5C547" />
      <circle cx="39" cy="24" r="1.5" fill="#F5C547" />
    </>,
    props,
  );

export const IconCalendar = (props: IconProps) =>
  wrap(
    <>
      <rect x="8" y="12" width="32" height="30" rx="3" fill="#FBF8F1" stroke="#171717" strokeWidth="2.5" />
      <rect x="8" y="12" width="32" height="8" rx="3" fill="#5A8B7A" stroke="#171717" strokeWidth="2.5" />
      <path d="M16 8 V16 M32 8 V16" stroke="#171717" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="16" cy="28" r="1.8" fill="#C97A4A" />
      <circle cx="24" cy="28" r="1.8" fill="#C97A4A" />
      <circle cx="32" cy="28" r="1.8" fill="#F5C547" />
      <circle cx="16" cy="35" r="1.8" fill="#C97A4A" />
      <circle cx="24" cy="35" r="1.8" fill="#5A8B7A" />
      <circle cx="32" cy="35" r="1.8" fill="#5A8B7A" />
    </>,
    props,
  );

export const IconGlobe = (props: IconProps) =>
  wrap(
    <>
      <circle cx="24" cy="24" r="17" fill="#5A8B7A" stroke="#171717" strokeWidth="2.5" />
      <path d="M7 24 H41" stroke="#FBF8F1" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 7 Q32 24 24 41" stroke="#FBF8F1" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M24 7 Q16 24 24 41" stroke="#FBF8F1" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="36" cy="14" r="2" fill="#7A5A8B" stroke="#171717" strokeWidth="1.5" />
    </>,
    props,
  );

export const IconChat = (props: IconProps) =>
  wrap(
    <>
      <path d="M8 14 Q8 8 14 8 H34 Q40 8 40 14 V28 Q40 34 34 34 H22 L14 40 V34 Q8 34 8 28 Z" fill="#F4A480" stroke="#171717" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="17" cy="21" r="2" fill="#5A8B7A" />
      <circle cx="24" cy="21" r="2" fill="#5A8B7A" />
      <circle cx="31" cy="21" r="2" fill="#5A8B7A" />
    </>,
    props,
  );

export const IconSend = (props: IconProps) =>
  wrap(
    <>
      <path d="M6 24 L42 8 L34 42 L24 28 L6 24 Z" fill="#5A8B7A" stroke="#171717" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M24 28 L42 8" stroke="#171717" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 30 L12 32 M6 36 L10 37" stroke="#F5C547" strokeWidth="2" strokeLinecap="round" />
    </>,
    props,
  );

export const IconLightbulb = (props: IconProps) =>
  wrap(
    <>
      <path d="M16 22 Q16 12 24 12 Q32 12 32 22 Q32 28 28 30 V34 H20 V30 Q16 28 16 22 Z" fill="#F5C547" stroke="#171717" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="20" y="34" width="8" height="5" rx="1" fill="#5A8B7A" stroke="#171717" strokeWidth="2" />
      <path d="M22 41 H26" stroke="#171717" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 22 H6 M39 22 H42 M11 11 L9 9 M37 11 L39 9 M11 33 L9 35 M37 33 L39 35" stroke="#7A5A8B" strokeWidth="2" strokeLinecap="round" />
    </>,
    props,
  );

export const IconFlag = (props: IconProps) =>
  wrap(
    <>
      <path d="M12 6 V42" stroke="#1E3A5F" strokeWidth="3" strokeLinecap="round" />
      <path d="M12 8 Q24 4 36 8 Q34 16 36 22 Q24 18 12 22 Z" fill="#C97A4A" stroke="#171717" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="12" cy="42" r="2.5" fill="#1E3A5F" stroke="#171717" strokeWidth="2" />
      <path d="M40 8 L42 10 M40 12 L38 10" stroke="#F5C547" strokeWidth="2" strokeLinecap="round" />
    </>,
    props,
  );

export const IconScale = (props: IconProps) =>
  wrap(
    <>
      <path d="M24 8 V40" stroke="#171717" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M10 14 H38" stroke="#171717" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="8" r="2.5" fill="#F5C547" stroke="#171717" strokeWidth="2" />
      <path d="M10 14 L6 26 L14 26 Z" fill="#1E3A5F" stroke="#171717" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M38 14 L34 26 L42 26 Z" fill="#1E3A5F" stroke="#171717" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M16 40 H32" stroke="#171717" strokeWidth="2.5" strokeLinecap="round" />
    </>,
    props,
  );

export const IconDownload = (props: IconProps) =>
  wrap(
    <>
      <path d="M24 8 V28" stroke="#5A8B7A" strokeWidth="3" strokeLinecap="round" />
      <path d="M16 22 L24 30 L32 22" stroke="#5A8B7A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M8 32 V40 H40 V32" fill="#FBF8F1" stroke="#171717" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M42 8 L44 10 M42 12 L40 10" stroke="#F5C547" strokeWidth="2" strokeLinecap="round" />
    </>,
    props,
  );

export const IconShare = (props: IconProps) =>
  wrap(
    <>
      <path d="M16 24 L32 14 M16 24 L32 34" stroke="#5A8B7A" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="14" cy="24" r="6" fill="#FBF8F1" stroke="#171717" strokeWidth="2.5" />
      <circle cx="34" cy="12" r="6" fill="#C97A4A" stroke="#171717" strokeWidth="2.5" />
      <circle cx="34" cy="36" r="6" fill="#5A8B7A" stroke="#171717" strokeWidth="2.5" />
    </>,
    props,
  );

export const IconExternalLink = (props: IconProps) =>
  wrap(
    <>
      <path d="M10 14 V38 H34 V26" fill="#FBF8F1" stroke="#171717" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M22 26 L40 8" stroke="#5A8B7A" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M28 8 H40 V20" stroke="#5A8B7A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>,
    props,
  );

export const IconPlus = (props: IconProps) =>
  wrap(
    <>
      <rect x="8" y="8" width="32" height="32" rx="8" fill="#5A8B7A" stroke="#171717" strokeWidth="2.5" />
      <path d="M24 16 V32 M16 24 H32" stroke="#FBF8F1" strokeWidth="3" strokeLinecap="round" />
    </>,
    props,
  );

export const IconLock = (props: IconProps) =>
  wrap(
    <>
      <path d="M16 22 V14 Q16 8 24 8 Q32 8 32 14 V22" stroke="#171717" strokeWidth="3" strokeLinecap="round" fill="none" />
      <rect x="10" y="22" width="28" height="20" rx="3" fill="#7A2C3D" stroke="#171717" strokeWidth="2.5" />
      <circle cx="24" cy="30" r="3" fill="#F5C547" stroke="#171717" strokeWidth="2" />
      <path d="M24 32 V36" stroke="#F5C547" strokeWidth="2.5" strokeLinecap="round" />
    </>,
    props,
  );
