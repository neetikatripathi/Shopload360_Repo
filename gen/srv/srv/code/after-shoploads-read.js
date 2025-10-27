/**
 * The custom logic attached to the Shoploads entity to perform calculations or transformations after a READ operation, ensuring the data source remains unchanged.
 * @After(event = { "READ" }, entity = "shopload360Srv.Shoploads")
 * @param {(Object|Object[])} results - For the After phase only: the results of the event processing
 * @param {cds.Request} request - User information, tenant-specific CDS model, headers and query parameters
*/
module.exports = async function(results, request) {
    // Ensure results is an array for uniform processing
    if (!Array.isArray(results)) {
        results = [results];
    }

    // Iterate over each result to perform transformations
    results.forEach(result => {
        if (result) {
            // Example transformation: Calculate a new field based on existing fields
            // Let's say we want to calculate a 'totalVolume' as quantity * volume
            if (result.quantity !== undefined && result.volume !== undefined) {
                result.totalVolume = result.quantity * result.volume;
            }

            // Example transformation: Append a status message based on 'sapStatus'
            if (result.sapStatus) {
                result.statusMessage = `SAP Status: ${result.sapStatus}`;
            }

            // Additional transformations can be added here as needed
        }
    });
};
