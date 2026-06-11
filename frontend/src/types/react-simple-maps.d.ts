declare module "react-simple-maps" {
  import { ReactNode, SVGAttributes, MouseEvent } from "react";

  interface ComposableMapProps {
    projection?: string;
    projectionConfig?: Record<string, unknown>;
    viewBox?: string;
    style?: React.CSSProperties;
    width?: number;
    height?: number;
    children?: ReactNode;
  }

  interface GeographiesProps {
    geography: string | Record<string, unknown>;
    children: (props: { geographies: GeoFeature[] }) => ReactNode;
  }

  interface GeoFeature {
    rsmKey: string;
    id: string;
    properties: Record<string, unknown>;
  }

  interface GeographyProps extends Omit<SVGAttributes<SVGPathElement>, "style"> {
    geography: GeoFeature;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
    onClick?: (evt: MouseEvent<SVGPathElement>) => void;
    onMouseEnter?: (evt: MouseEvent<SVGPathElement>) => void;
    onMouseLeave?: (evt: MouseEvent<SVGPathElement>) => void;
    onMouseMove?: (evt: MouseEvent<SVGPathElement>) => void;
  }

  export function ComposableMap(props: ComposableMapProps): JSX.Element;
  export function Geographies(props: GeographiesProps): JSX.Element;
  export function Geography(props: GeographyProps): JSX.Element;
}
