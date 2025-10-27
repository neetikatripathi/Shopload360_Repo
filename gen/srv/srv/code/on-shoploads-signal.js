/**
 * The custom logic attached to the Shoploads entity action 'signal' to handle bulk signaling for selected items, ensuring status is at least TO_BE_SHOPLOADED.
 * @On(event = { "signal" }, entity = "shopload360Srv.Shoploads")
 * @param {cds.Request} request - User information, tenant-specific CDS model, headers and query parameters
 */
module.exports = async function(request) {
    const { Shoploads } = cds.entities;
    const { data } = request;
    
    if (!data || !Array.isArray(data) || data.length === 0) {
        return;
    }

    const shoploadIds = data.map(item => item.ID).filter(id => id !== undefined);

    if (shoploadIds.length === 0) {
        return;
    }

    // Fetch the Shoploads entries with the given IDs and check their status
    const shoploadsToSignal = await SELECT.from(Shoploads)
        .where({ ID: { in: shoploadIds }, status: { '>=': 'TO_BE_SHOPLOADED' } });

    if (shoploadsToSignal.length === 0) {
        return;
    }

    // Update the signal field for the eligible shoploads
    for (const shopload of shoploadsToSignal) {
        shopload.signal = 1; // Assuming '1' indicates the signal is set
        await cds.run(UPDATE(Shoploads).set({ signal: shopload.signal }).where({ ID: shopload.ID }));
    }
};
