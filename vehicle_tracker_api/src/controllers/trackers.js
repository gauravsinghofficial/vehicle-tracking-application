import {STATUS_CODES} from 'http';

import {
  createTrackerService,
  leftFacilityService,
  listTrackerService,
  retrieveTrackerService,
  updateTrackerService,
} from '../services';
import {
  createTrackerSchema,
  outTimeSchema,
  updateTrackerSchema,
} from '../validators';

/**
 * Create new Tracker API
 * @param {express.Request} request Request Object
 * @param {express.Response} response Response Object
 * @return {express.Response} Final Response
 */
export const createTrackerController = async (request, response) => {
  try {
    if (request.user.isAdmin) {
      return response.status(401).json(
          {detail: STATUS_CODES[401]},
      );
    }
    const validatedData = await createTrackerSchema.validateAsync(request.body);
    const createdTracker = await createTrackerService(
        validatedData, request.user,
    );
    return response.status(201).json(createdTracker);
  } catch (e) {
    return response.status(400).json(e);
  }
};

/**
 * Update Tracker API
 * @param {express.Request} request Request Object
 * @param {express.Response} response Response Object
 * @return {express.Response} Final Response
 */
export const updateTrackerController = async (request, response) => {
  if (request.user.isAdmin) {
    return response.status(401).json(
        {detail: STATUS_CODES[401]});
  }
  const {id} = request.params;
  const tracker = await retrieveTrackerService(id);
  if (!tracker) {
    return response.status(404).json({detail: STATUS_CODES[404]});
  }

  try {
    const validatedData = await updateTrackerSchema.validateAsync(request.body);
    const updatedTracker = await updateTrackerService(id, validatedData);
    return response.status(200).json(updatedTracker);
  } catch (e) {
    return response.status(400).json(e);
  }
};

/**
 * List Tracker API
 * @param {express.Request} request Request Object
 * @param {express.Response} response Response Object
 * @return {express.Response} Final Response
 */
export const listTrackerController = async (request, response) => {
  const queryParams = request.query;
  try {
    const trackers = await listTrackerService(queryParams);
    response.status(200).json(trackers);
  } catch (e) {
    response.status(500).json({detail: STATUS_CODES[500]});
  }
};

/**
 * Mark Out API
 * @param {express.Request} request Request Object
 * @param {express.Response} response Response Object
 * @return {express.Response} Final Response
 */
export const leftFacilityController = async (request, response) => {
  if (request.user.isAdmin) {
    return response.status(401).json(
        {detail: STATUS_CODES[401]},
    );
  }
  const {id} = request.params;
  const found = await retrieveTrackerService(id);
  if (!found) {
    return response.status(404).json({detail: STATUS_CODES[404]});
  }
  try {
    await outTimeSchema.validateAsync(request.body);
    const tracker = await leftFacilityService(found._id, request.user);
    return response.status(201).json(tracker);
  } catch (e) {
    return response.status(400).json(e);
  }
};
