/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { IHttpService } from 'angular';
import { get } from 'lodash';
import { SavedObjectRelation } from '../types';

export async function getRelationships(
  type: string,
  id: string,
  savedObjectTypes: string[],
  $http: IHttpService,
  basePath: string
): Promise<SavedObjectRelation[]> {
  const url = `${basePath}/api/kibana/management/saved_objects/relationships/${encodeURIComponent(
    type
  )}/${encodeURIComponent(id)}`;
  const options = {
    method: 'GET',
    url,
    params: {
      savedObjectTypes,
    },
  };

  try {
    const response = await $http<SavedObjectRelation[]>(options);
    return response?.data;
  } catch (resp) {
    const respBody = get(resp, 'data', {}) as any;
    const err = new Error(respBody.message || respBody.error || `${resp.status} Response`);

    (err as any).statusCode = respBody.statusCode || resp.status;
    (err as any).body = respBody;

    throw err;
  }
}
