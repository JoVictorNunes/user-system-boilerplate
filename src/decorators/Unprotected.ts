import { SetMetadata } from '@nestjs/common';

/**
 * Makes a route unprotected. No authorization will be needed to access the route.
 */
const Unprotected = () => SetMetadata('unprotected', true);

export default Unprotected;
