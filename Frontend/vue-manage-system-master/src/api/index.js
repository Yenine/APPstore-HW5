import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};
export const fetchData1 = query => {
    return request({
        url: './table1.json',
        method: 'get',
        params: query
    });
};
