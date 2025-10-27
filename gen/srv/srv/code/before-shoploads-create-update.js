/**
 * The custom logic attached to the Shoploads entity to validate data before CREATE and UPDATE operations, ensuring data integrity and compliance with business rules.
 * @Before(event = { "CREATE","UPDATE" }, entity = "shopload360Srv.Shoploads")
 * @param {cds.Request} request - User information, tenant-specific CDS model, headers and query parameters
 */
module.exports = async function (request) {
  const { Shoploads, Machines } = cds.entities;

  const data = request.data;

  // Validate mandatory fields
  if (data.machineNo === undefined) {
    request.error(400, 'Machine number is mandatory.');
    return;
  }

  if (data.partNumber === undefined) {
    request.error(400, 'Part number is mandatory.');
    return;
  }

  // Validate machine existence
  const machineExists = await SELECT.one.from(Machines).where({ machineNo: data.machineNo });
  if (!machineExists) {
    request.error(400, `Machine with number ${data.machineNo} does not exist.`);
    return;
  }

  // Additional business rule validations can be added here
  // Example: Validate that the quantity is a positive number
  if (data.quantity !== undefined && data.quantity <= 0) {
    request.error(400, 'Quantity must be a positive number.');
    return;
  }

  // Example: Validate that the startDate is not in the past
  if (data.startDate !== undefined && new Date(data.startDate) < new Date()) {
    request.error(400, 'Start date cannot be in the past.');
    return;
  }

  // Ensure that the machine association is correctly set
  data.machine_ID = machineExists.ID;
};
