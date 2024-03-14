export interface PagingFilter {
  offset?: number;
  limit?: number;
}

export interface EventingFilter extends PagingFilter {
  expanded?: boolean;
}
