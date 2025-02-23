export const apiPath = {
    baseUrl: "localhost",
    category: {
        baseUrl: "/categories",
        getDestinations: (id) => `${apiPath.category.baseUrl}/${id}${apiPath.destination.baseUrl}`
    },
    destination: {
        baseUrl: "/destinations"
    }
}