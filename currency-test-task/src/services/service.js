const _apiBase = "https://www.nbrb.by/API/ExRates/Rates/Dynamics"; 

const getRequest = async (url) => {
    const res = await fetch(`${_apiBase}${url}`);
    return await res.json();
}

export const getCurrency = async (currency, startDate, endDate) => {
    const url = `/${currency}?startDate=${startDate}&endDate=${endDate}`;
    const res = await getRequest(url);
    return res;
}