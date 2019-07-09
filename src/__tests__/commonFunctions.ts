export const sleep = (ms: number = 500) => {
    return new Promise((rv, _rj) => {
        setTimeout(() => {
            rv();
        }, ms);
    })
};
