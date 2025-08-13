import { axios } from '../axios';
import { registerRoute, urlBuilder } from '../utils';
import { z } from '../zod';
import type { IRecordInsertOrderRo } from './create';
import { createRecordsVoSchema, recordInsertOrderRoSchema } from './create';
import type { IRecord } from './get';

export const DUPLICATE_URL = '/table/{tableId}/record/{recordId}/duplicate';

export const duplicateRoute = registerRoute({
  method: 'post',
  path: DUPLICATE_URL,
  summary: 'Duplicate record',
  description: 'Create a copy of an existing record with optional custom positioning in the view.',
  request: {
    params: z.object({
      tableId: z.string(),
      recordId: z.string(),
    }),
    body: {
      content: {
        'application/json': {
          schema: recordInsertOrderRoSchema.optional(),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Successful duplicate',
      content: {
        'application/json': {
          schema: createRecordsVoSchema,
        },
      },
    },
  },
  tags: ['record'],
});

export const duplicateRecord = async (
  tableId: string,
  recordId: string,
  order: IRecordInsertOrderRo
) => {
  return axios.post<IRecord>(urlBuilder(DUPLICATE_URL, { tableId, recordId }), order);
};
