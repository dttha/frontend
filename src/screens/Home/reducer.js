export const initialState =
{
    products: [],
    advertisements: [],
    loading: true,
    error: '',
}

export const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, products: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'FETCH_ADVERTISEMENT_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_ADVERTISEMENT_SUCCESS':
            return { ...state, advertisements: action.payload.advertisements, loading: false };
        case 'FETCH_ADVERTISEMENT_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}