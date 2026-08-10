
export interface IPaginatedResponse<T> {
    content: T[]; // The paginated data
    totalElements: number; // Total number of elements in the filtered dataset
  }
  