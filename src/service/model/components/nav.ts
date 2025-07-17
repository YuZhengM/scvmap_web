// 横着导航栏
export interface NavBase {
  title: string,
  click?: string | null | undefined,
  href?: string | null | undefined,
  isShow: boolean,
  submenus?: Array<NavBase>
}

/**
 * 竖着导航栏
 */
export interface NavLeftName {
  index: string;
  link?: string;
  title: string;
}

export interface NavLeft {
  index?: string;
  icon?: string;
  title?: string;
  link?: string;
  href?: string;
  isActive?: boolean;
  names?: Array<NavLeftName>;
  submenus?: Array<NavLeft>;
  order?: number;
}
