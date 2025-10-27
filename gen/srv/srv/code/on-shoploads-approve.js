/**
 * The custom logic attached to the Shoploads entity action 'approve' to handle bulk movement of items to COMPLETED status and set completedDate.
 * @On(event = { "approve" }, entity = "shopload360Srv.Shoploads")
 * @param {cds.Request} request - User information, tenant-specific CDS model, headers and query parameters
 */
module.exports = async function(request) {
  const { Shoploads } = cds.entities;
  
  // Extract the IDs of the Shoploads records to be approved from the request data
  const { IDs } = request.data;
  
  if (!IDs || !Array.isArray(IDs) || IDs.length === 0) {
    return; // No IDs provided, nothing to process
  }
  
  // Get the current date to set as the completedDate
  const completedDate = new Date();

  // Update the status to 'COMPLETED' and set the completedDate for the specified Shoploads records
  await UPDATE(Shoploads)
    .set({ status: 'COMPLETED', completedDate })
    .where({ ID: { in: IDs } });
}
