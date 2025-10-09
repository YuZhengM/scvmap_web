// all methods of the request
enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS'
}

export default Method;

// pagination and sorting parameters
export interface Page {
  // The current page number
  page: number;
  // The number of items per page
  size: number;
  // The field used for sorting
  field: string;
  // The sort order (1 for ascending, -1 for descending, 0 for no sorting)
  order: number;
  // The data type of the database field
  type?: number;
  // The symbol used for number comparison
  symbol?: number;
  // The field used for searching
  searchField?: string;
  // The content used for searching
  content?: string;
}
