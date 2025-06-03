const gauss = (x,mu,sigma) => {
    return 1.0 / Math.sqrt(2 * Math.PI * Math.pow(sigma,2)) * Math.exp(- Math.pow(x - mu,2) / (2 * Math.pow(sigma,2)));
};

const cauchy = (x,mu,sigma) => {
    return 1.0 / Math.PI * (sigma / (Math.pow(sigma,2) + Math.pow(x - mu,2)));
};

export {cauchy,gauss};
