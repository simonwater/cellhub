/* eslint-disable sonarjs/no-duplicate-string */
import type { INestApplication } from '@nestjs/common';
import { Role } from '@teable/core';
import type {
  CreateAccessTokenRo,
  CreateAccessTokenVo,
  ICreateSpaceVo,
  IGetSpaceVo,
  ITableFullVo,
  UpdateAccessTokenRo,
} from '@teable/openapi';
import {
  createAccessToken,
  deleteAccessToken,
  listAccessToken,
  listAccessTokenVoSchema,
  refreshAccessToken,
  refreshAccessTokenVoSchema,
  updateAccessToken,
  GET_TABLE_LIST,
  urlBuilder,
  GET_RECORDS_URL,
  EMAIL_SPACE_INVITATION,
  CREATE_SPACE,
  CREATE_BASE,
  DELETE_SPACE,
  createAxios,
  axios as defaultAxios,
  createSpace,
  createBase,
  deleteSpace,
  deleteBase,
  getAccessToken,
  GET_BASE_ALL,
  GET_SPACE_LIST,
} from '@teable/openapi';
import dayjs from 'dayjs';
import { splitAccessToken } from '../src/features/access-token/access-token.encryptor';
import { createNewUserAxios } from './utils/axios-instance/new-user';
import { getError } from './utils/get-error';
import { createTable, initApp, permanentDeleteSpace } from './utils/init-app';

describe('OpenAPI AccessTokenController (e2e)', () => {
  let app: INestApplication;
  let baseId: string;
  let spaceId: string;
  const email = globalThis.testConfig.email;
  const email2 = 'accesstoken@example.com';
  let table: ITableFullVo;
  let token: CreateAccessTokenVo;

  let defaultCreateRo: CreateAccessTokenRo;

  beforeAll(async () => {
    const appCtx = await initApp();
    app = appCtx.app;
    const space = await createSpace({ name: 'access token space' }).then((res) => res.data);
    const base = await createBase({ spaceId: space.id, name: 'access token base' }).then(
      (res) => res.data
    );
    baseId = base.id;
    spaceId = space.id;
    defaultCreateRo = {
      name: 'token1',
      description: 'token1',
      scopes: ['table|read', 'record|read'],
      baseIds: [baseId],
      spaceIds: [spaceId],
      expiredTime: dayjs(Date.now() + 1000 * 60 * 60 * 24).format('YYYY-MM-DD'),
    };
    table = await createTable(baseId, { name: 'table1' });
    token = (await createAccessToken(defaultCreateRo)).data;
    expect(token).toHaveProperty('id');
  });

  afterAll(async () => {
    await permanentDeleteSpace(spaceId);
    const { data } = await listAccessToken();
    for (const { id } of data) {
      await deleteAccessToken(id);
    }
    await app.close();
  });

  it('create access token invalid expiredTime', async () => {
    const ro = {
      ...defaultCreateRo,
      expiredTime: '25/02/2023',
    };
    const error = await getError(() => createAccessToken(ro));
    expect(error?.status).toEqual(400);
    expect(error?.message).contain('expiredTime');
  });

  it('check access token', async () => {
    const accessToken = '1234567890';
    const res = splitAccessToken(accessToken);
    expect(res).toEqual(null);
  });

  it('/api/access-token (GET)', async () => {
    const { data } = await listAccessToken();
    expect(listAccessTokenVoSchema.safeParse(data).success).toEqual(true);

    expect(data.some(({ id }) => id === token.id)).toEqual(true);
  });

  it('/api/access-token/:accessTokenId (PUT)', async () => {
    const { data: newAccessToken } = await createAccessToken(defaultCreateRo);
    const updateRo: UpdateAccessTokenRo = {
      name: 'new token',
      description: 'new desc',
      scopes: ['table|read', 'record|read', 'record|create'],
      baseIds: null,
      spaceIds: null,
    };
    const { data } = await updateAccessToken(newAccessToken.id, updateRo);
    expect(data).toEqual({
      ...updateRo,
      id: newAccessToken.id,
      baseIds: undefined,
      spaceIds: undefined,
    });
  });

  it('/api/access-token/:accessTokenId (DELETE)', async () => {
    const { data: newAccessToken } = await createAccessToken(defaultCreateRo);
    const res = await deleteAccessToken(newAccessToken.id);
    expect(res.status).toEqual(200);
  });

  it('/api/access-token/:accessTokenId/refresh (POST) 200', async () => {
    const { data: newAccessToken } = await createAccessToken(defaultCreateRo);
    const res = await refreshAccessToken(newAccessToken.id, {
      expiredTime: dayjs(Date.now() + 1000 * 60 * 60 * 24).format('YYYY-MM-DD'),
    });
    expect(res.status).toEqual(200);
    expect(refreshAccessTokenVoSchema.safeParse(res.data).success).toEqual(true);
  });

  it('/api/access-token/:accessTokenId (GET) include deleted spaceIds and baseIds', async () => {
    const space = await createSpace({ name: 'deleted space' }).then((res) => res.data);
    const base = await createBase({ spaceId: space.id, name: 'deleted base' }).then(
      (res) => res.data
    );
    const ro = {
      ...defaultCreateRo,
      spaceIds: [space.id],
      baseIds: [base.id],
    };
    const { data: newAccessToken } = await createAccessToken(ro);
    await deleteBase(base.id);
    await deleteSpace(space.id);
    const { data } = await getAccessToken(newAccessToken.id);
    await permanentDeleteSpace(space.id);
    expect(data.spaceIds).toEqual([]);
    expect(data.baseIds).toEqual([]);
  });

  describe('validate accessToken permission', () => {
    let tableReadToken: string;
    let recordReadToken: string;
    let baseReadAllToken: string;
    let spaceReadToken: string;
    const axios = createAxios();

    beforeAll(async () => {
      const { data: tableReadTokenData } = await createAccessToken({
        ...defaultCreateRo,
        name: 'table read token',
        scopes: ['table|read'],
      });
      tableReadToken = tableReadTokenData.token;
      const { data: recordReadTokenData } = await createAccessToken({
        ...defaultCreateRo,
        name: 'record read token',
        scopes: ['record|read'],
      });
      recordReadToken = recordReadTokenData.token;
      const { data: baseReadAllTokenData } = await createAccessToken({
        ...defaultCreateRo,
        name: 'base read all token',
        scopes: ['base|read_all'],
      });
      baseReadAllToken = baseReadAllTokenData.token;
      axios.defaults.baseURL = defaultAxios.defaults.baseURL;

      const { data: spaceReadTokenData } = await createAccessToken({
        ...defaultCreateRo,
        name: 'space read token',
        scopes: ['space|read'],
      });
      spaceReadToken = spaceReadTokenData.token;
    });

    it('get table list has table|read permission', async () => {
      const res = await axios.get(urlBuilder(GET_TABLE_LIST, { baseId }), {
        headers: {
          Authorization: `Bearer ${tableReadToken}`,
        },
      });
      expect(res.status).toEqual(200);
    });

    it('get table list has not table|read permission', async () => {
      const error = await getError(() =>
        axios.get(urlBuilder(GET_TABLE_LIST, { baseId }), {
          headers: {
            Authorization: `Bearer ${recordReadToken}`,
          },
        })
      );
      expect(error?.status).toEqual(403);
    });

    it('get base list has not base|read_all permission', async () => {
      const error = await getError(() =>
        axios.get(urlBuilder(GET_BASE_ALL), {
          headers: {
            Authorization: `Bearer ${tableReadToken}`,
          },
        })
      );
      expect(error?.status).toEqual(403);
    });

    it('get base list has base|read_all permission', async () => {
      const res = await axios.get(urlBuilder(GET_BASE_ALL), {
        headers: {
          Authorization: `Bearer ${baseReadAllToken}`,
        },
      });
      expect(res.status).toEqual(200);
    });

    it('get record list has record|read permission', async () => {
      const res = await axios.get(urlBuilder(GET_RECORDS_URL, { tableId: table.id }), {
        headers: {
          Authorization: `Bearer ${recordReadToken}`,
        },
      });
      expect(res.status).toEqual(200);
    });

    it('get record list has not record|read permission', async () => {
      const error = await getError(() =>
        axios.get(urlBuilder(GET_RECORDS_URL, { tableId: table.id }), {
          headers: {
            Authorization: `Bearer ${tableReadToken}`,
          },
        })
      );
      expect(error?.status).toEqual(403);
    });

    it('access token permission < user permission', async () => {
      const newUserAxios = await createNewUserAxios({
        email: email2,
        password: '12345678',
      });

      const { data: newUserSpace } = await newUserAxios.post<ICreateSpaceVo>(CREATE_SPACE, {
        name: 'permission test space',
      });

      const spaceId = newUserSpace.id;
      await newUserAxios.post(urlBuilder(EMAIL_SPACE_INVITATION, { spaceId }), {
        role: Role.Viewer,
        emails: [email],
      });

      const { data: createBaseAccessTokenData } = await createAccessToken({
        ...defaultCreateRo,
        name: 'base access token',
        scopes: ['base|read'],
        spaceIds: [spaceId],
      });

      const error = await getError(() =>
        axios.post(
          CREATE_BASE,
          { spaceId },
          {
            headers: {
              Authorization: `Bearer ${createBaseAccessTokenData.token}`,
            },
          }
        )
      );
      expect(error?.status).toEqual(403);
      await newUserAxios.delete(urlBuilder(DELETE_SPACE, { spaceId }));
    });

    it('get space list has space|read permission', async () => {
      const res = await axios.get<IGetSpaceVo[]>(urlBuilder(GET_SPACE_LIST), {
        headers: {
          Authorization: `Bearer ${spaceReadToken}`,
        },
      });
      expect(res.status).toEqual(200);
      expect(res.data.map(({ id }) => id)).toEqual([spaceId]);
    });

    it('get space list has not space|read permission', async () => {
      const error = await getError(() =>
        axios.get<IGetSpaceVo[]>(urlBuilder(GET_SPACE_LIST), {
          headers: {
            Authorization: `Bearer ${tableReadToken}`,
          },
        })
      );
      expect(error?.status).toEqual(403);
    });

    it('hasFullAccess', async () => {
      const space = await createSpace({ name: 'has full access space' }).then((res) => res.data);
      const { data: newAccessToken } = await createAccessToken({
        ...defaultCreateRo,
        name: 'has full access token',
        scopes: ['space|read'],
      });
      const { data: fullAccessToken } = await createAccessToken({
        ...defaultCreateRo,
        name: 'has full access token',
        scopes: ['space|read'],
        hasFullAccess: true,
      });
      const newAccessTokenRes = await axios.get<IGetSpaceVo[]>(urlBuilder(GET_SPACE_LIST), {
        headers: {
          Authorization: `Bearer ${newAccessToken.token}`,
        },
      });
      const fullAccessTokenRes = await axios.get<IGetSpaceVo[]>(urlBuilder(GET_SPACE_LIST), {
        headers: {
          Authorization: `Bearer ${fullAccessToken.token}`,
        },
      });
      await permanentDeleteSpace(space.id);
      expect(newAccessTokenRes.status).toEqual(200);
      expect(newAccessTokenRes.data.map(({ id }) => id)).toEqual([spaceId]);
      expect(fullAccessTokenRes.status).toEqual(200);
      expect(fullAccessTokenRes.data.map(({ id }) => id)).toEqual(
        expect.arrayContaining([spaceId, space.id])
      );
    });
  });
});
