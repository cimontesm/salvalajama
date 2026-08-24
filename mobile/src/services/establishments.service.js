import client from '../api/client';

const endpoint = '/establishments';

const create = (data) => client.post(endpoint, data);

const update = (id, data) => client.put(`${endpoint}/${id}`, data);

const changeStatus = (id, status) => client.patch(`${endpoint}/${id}/status`, { status });

const getProfile = (id) => client.get(`${endpoint}/${id}`);

export default {
    create,
    update,
    changeStatus,
    getProfile
};