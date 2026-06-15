import { apiClient } from './client.js';

function getListPath(entity) {
  return entity.listEndpoint || entity.endpoint;
}

function getRecordPath(entity, record) {
  if (entity.compositeKeys) {
    const params = new URLSearchParams();

    entity.compositeKeys.forEach((key) => {
      params.set(entity.queryParams[key], record[key]);
    });

    return `${entity.endpoint}?${params.toString()}`;
  }

  return `${entity.endpoint}/${record[entity.idField]}`;
}

function toApiPayload(entity, values) {
  return entity.fields.reduce((payload, field) => {
    if (values[field.name] !== undefined && values[field.name] !== '') {
      payload[field.apiName || field.name] = values[field.name];
    }
    return payload;
  }, {});
}

export function createResourceApi(entity) {
  return {
    async list() {
      const result = await apiClient.get(getListPath(entity));
      return Array.isArray(result.data) ? result.data : [];
    },
    async create(values) {
      return apiClient.post(entity.endpoint, toApiPayload(entity, values));
    },
    async update(originalRecord, values) {
      return apiClient.put(getRecordPath(entity, originalRecord), toApiPayload(entity, values));
    },
    async remove(record) {
      return apiClient.delete(getRecordPath(entity, record));
    }
  };
}

export function getHealth() {
  return apiClient.get('/health');
}
