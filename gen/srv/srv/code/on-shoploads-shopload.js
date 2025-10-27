/**
 * The custom logic attached to the Shoploads entity action 'shopload' to handle bulk movement of items to SHOPLOADED status and set shoploadedOn date.
 * @On(event = { "shopload" }, entity = "shopload360Srv.Shoploads")
 * @param {cds.Request} request - User information, tenant-specific CDS model, headers and query parameters
 */
module.exports = async function(request) {
    const { Shoploads } = cds.entities;
    
    // Extract the IDs of the shoploads to be updated from the request data
    const shoploadIds = request.data.shoploadIds;
    
    if (!shoploadIds || shoploadIds.length === 0) {
        return; // No shoploads to update
    }
    
    // Update the status to "SHOPLOADED" and set the shoploadedOn date to the current date
    const currentDate = new Date();
    
    await cds.transaction(request).run(
        UPDATE(Shoploads)
            .set({
                status: 'SHOPLOADED',
                shoploadedOn: currentDate
            })
            .where({ ID: { in: shoploadIds } })
    );
};
