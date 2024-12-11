export interface PaginationParams {
    page?: number
    limit?: number
}

export interface FilterParams {
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}