import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { axios } from '../../axios';
import { registerRoute } from '../../utils';
import { aiConfigVoSchema } from './update';

export const settingVoSchema = z.object({
  instanceId: z.string(),
  brandName: z.string().nullable().optional(),
  brandLogo: z.string().nullable().optional(),
  disallowSignUp: z.boolean().nullable().optional(),
  disallowSpaceCreation: z.boolean().nullable().optional(),
  disallowSpaceInvitation: z.boolean().nullable().optional(),
  enableEmailVerification: z.boolean().nullable().optional(),
  aiConfig: aiConfigVoSchema.nullable().optional(),
});

export type ISettingVo = z.infer<typeof settingVoSchema>;

export const GET_SETTING = '/admin/setting';

export const GetSettingRoute: RouteConfig = registerRoute({
  method: 'get',
  path: GET_SETTING,
  description: 'Get the instance settings',
  request: {},
  responses: {
    200: {
      description: 'Returns the instance settings.',
      content: {
        'application/json': {
          schema: settingVoSchema,
        },
      },
    },
  },
  tags: ['admin'],
});

export const getSetting = async () => {
  return axios.get<ISettingVo>(GET_SETTING);
};
