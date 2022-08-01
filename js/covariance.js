

// COVARIANCE //

/**
* FUNCTION: covariance( arr1[, arr2,...,opts] )
*	Computes the covariance between one or more numeric arrays.
*
* @param {...Array} arr - numeric array
* @param {Object} [opts] - function options
* @param {Boolean} [opts.bias] - boolean indicating whether to calculate a biased or unbiased estimate of the covariance (default: false)
* @returns {Array} covariance matrix
*/
function isObject(A) {
    return (typeof value === 'object' && value !== null && !isArray(value));
}

function logGamma(x) {
    if (x === 1 || x === 2) {
        return 0;
    } else if (x === 0) {
        return Infinity;
    } else if (isNaN(x)) {
        // TODO fix: booleans and strings like '123' will not fall here.
        throw new Error(`The value is not a number.`);
    } else if (x < 0) {
        throw new Error(`The value is a negative number.`);
    }

    // Lanczos approximation
    const cof = [
        76.18009172947146,
        -86.50532032941677,
        24.01409824083091,
        -1.231739572450155,
        0.1208650973866179e-2,
        -0.5395239384953e-5,
    ];
    let ser = 1.000000000190015;

    let xx;
    let y;
    let tmp;
    tmp = (y = xx = x) + 5.5;
    tmp -= (xx + 0.5) * Math.log(tmp);

    cof.map((approximation) => {
        ser += approximation / ++y;
    });

    return Math.log(2.5066282746310005 * ser / xx) - tmp;
};

function regLowGamma(a, x) {
    if (isNaN(a)) {
        // TODO fix: booleans and strings like '123' will not fall here.
        throw new Error('The value in param a is not a number.');
    } else if (isNaN(x)) {
        // TODO fix: booleans and strings like '123' will not fall here.
        throw new Error('The value in param x is not a number.');
    } else if (a <= 0) {
        throw new Error('The number in param a is equal or less tham 0.');
    } else if (x < 0) {
        throw new Error('The number in param x is a negative number.');
    }

    const logGammaOfA = logGamma(a);
    let b = x + 1 - a;
    let c = 1 / 1.0e-30;
    let d = 1 / b;
    let h = d;
    let i = 1;
    const maxOfIterationsForA = -~(Math.log((a >= 1) ? a : 1 / a) * 8.5 + a * 0.4 + 17);

    if (x < a + 1) {
        let sum = 1 / a;
        let del = sum;
        for (let ap = a; i <= maxOfIterationsForA; i++) {
            sum += del *= x / ++ap;
        }
        return (sum * Math.exp(-x + a * Math.log(x) - (logGammaOfA)));
    }

    let an;
    for (; i <= maxOfIterationsForA; i++) {
        an = -i * (i - a);
        b += 2;
        d = an * d + b;
        c = b + an / c;
        d = 1 / d;
        h *= d * c;
    }

    return (1 - h * Math.exp(-x + a * Math.log(x) - (logGammaOfA)));
};

function invRegLowGamma(p, a) {
    if (isNaN(p)) {
        // TODO fix: booleans and strings like '123' will not fall here.
        throw new Error('The value in param "p" is not an number.');
    } else if (isNaN(a)) {
        // TODO fix: booleans and strings like '123' will not fall here.
        throw new Error('The value in param "a" is not an number.');
    } else if (p >= 1) {
        return Math.max(100, a + 100 * Math.sqrt(a));
    } else if (p <= 0) {
        return 0;
    }

    const a1 = a - 1;
    const EPS = 1e-8;
    const gln = logGamma(a);
    let inverseRegLowGamma;
    let err;
    let t;
    let u;
    let pp;
    let lna1;
    let afac;

    if (a > 1) {
        lna1 = Math.log(a1);
        afac = Math.exp(a1 * (lna1 - 1) - gln);
        pp = (p < 0.5) ? p : 1 - p;
        t = Math.sqrt(-2 * Math.log(pp));
        inverseRegLowGamma = (2.30753 + t * 0.27061) / (1 + t * (0.99229 + t * 0.04481)) - t;
        if (p < 0.5) {
            inverseRegLowGamma = -inverseRegLowGamma;
        }
        inverseRegLowGamma = Math.max(1e-3, a * Math.pow(1 - 1 / (9 * a) - inverseRegLowGamma / (3 * Math.sqrt(a)), 3));
    } else {
        t = 1 - a * (0.253 + a * 0.12);
        if (p < t) {
            inverseRegLowGamma = Math.pow(p / t, 1 / a);
        } else {
            inverseRegLowGamma = 1 - Math.log(1 - (p - t) / (1 - t));
        }
    }

    for (let j = 0; j < 12; j++) {
        if (inverseRegLowGamma <= 0) {
            return 0;
        }
        err = regLowGamma(a, inverseRegLowGamma) - p;
        if (a > 1) {
            t = afac * Math.exp(-(inverseRegLowGamma - a1) + a1 * (Math.log(inverseRegLowGamma) - lna1));
        } else {
            t = Math.exp(-inverseRegLowGamma + a1 * Math.log(inverseRegLowGamma) - gln);
        }
        u = err / t;
        inverseRegLowGamma -= (t = u / (1 - 0.5 * Math.min(1, u * ((a - 1) / inverseRegLowGamma - 1))));
        if (inverseRegLowGamma <= 0) {
            inverseRegLowGamma = 0.5 * (inverseRegLowGamma + t);
        }
        if (Math.abs(t) < EPS * inverseRegLowGamma) {
            break;
        }
    }

    return inverseRegLowGamma;
};

function invChiSquareCDF(probability, degreeOfFreedom) {
    if (isNaN(probability)) {
        // TODO fix: booleans and strings like '123' will not fall here.
        throw new Error('The value in param "probability" is not an number.');
    } else if (isNaN(degreeOfFreedom)) {
        // TODO fix: booleans and strings like '123' will not fall here.
        throw new Error('The value in param "degreeOfFreedom" is not an number.');
    } else if (probability >= 1 || probability <= 0) {
        throw new Error('The number in param "probability" must lie in the interval [0 1].');
    } else if (degreeOfFreedom <= 0) {
        throw new Error('The number in param "degreeOfFreedom" must be greater than 0.');
    }

    return 2 * invRegLowGamma(probability, 0.5 * degreeOfFreedom);
};

function covariance() {
    var bias = false,
        args,
        opts,
        nArgs,
        len,
        deltas,
        delta,
        means,
        C,
        cov,
        arr,
        N, r, A, B, sum, val,
        i, j, n;

    args = Array.prototype.slice.call(arguments);
    nArgs = args.length;

    if (isObject(args[nArgs - 1])) {
        opts = args.pop();
        nArgs = nArgs - 1;
        if (opts.hasOwnProperty('bias')) {
            if (typeof opts.bias !== 'boolean') {
                throw new TypeError('covariance()::invalid input argument. Bias option must be a boolean.');
            }
            bias = opts.bias;
        }
    }
    if (!nArgs) {
        throw new Error('covariance()::insufficient input arguments. Must provide array arguments.');
    }
    for (i = 0; i < nArgs; i++) {
        if (!Array.isArray(args[i])) {
            throw new TypeError('covariance()::invalid input argument. Must provide array arguments.');
        }
    }
    if (Array.isArray(args[0][0])) {
        // If the first argument is an array of arrays, calculate the covariance over the nested arrays, disregarding any other arguments...
        args = args[0];
    }
    nArgs = args.length;
    len = args[0].length;
    for (i = 1; i < nArgs; i++) {
        if (args[i].length !== len) {
            throw new Error('covariance()::invalid input argument. All arrays must have equal length.');
        }
    }
    // [0] Initialization...
    deltas = new Array(nArgs);
    means = new Array(nArgs);
    C = new Array(nArgs);
    cov = new Array(nArgs);
    for (i = 0; i < nArgs; i++) {
        means[i] = args[i][0];
        arr = new Array(nArgs);
        for (j = 0; j < nArgs; j++) {
            arr[j] = 0;
        }
        C[i] = arr;
        cov[i] = arr.slice(); // copy!
    }
    if (len < 2) {
        return cov;
    }
    // [1] Compute the covariance...
    for (n = 1; n < len; n++) {

        N = n + 1;
        r = n / N;

        // [a] Extract the values and compute the deltas...
        for (i = 0; i < nArgs; i++) {
            deltas[i] = args[i][n] - means[i];
        }

        // [b] Update the covariance between one array and every other array...
        for (i = 0; i < nArgs; i++) {
            arr = C[i];
            delta = deltas[i];
            for (j = i; j < nArgs; j++) {
                A = arr[j];
                B = r * delta * deltas[j];
                sum = A + B;
                // Exploit the fact that the covariance matrix is symmetric...
                if (i !== j) {
                    C[j][i] = sum;
                }
                arr[j] = sum;
            } // end FOR j
        } // end FOR i

        // [c] Update the means...
        for (i = 0; i < nArgs; i++) {
            means[i] += deltas[i] / N;
        }
    } // end FOR n

    // [2] Normalize the co-moments...
    n = N - 1;
    if (bias) {
        n = N;
    }
    for (i = 0; i < nArgs; i++) {
        arr = C[i];
        for (j = i; j < nArgs; j++) {
            val = arr[j] / n;
            cov[i][j] = val;
            if (i !== j) {
                cov[j][i] = val;
            }
        }
    }
    return cov;
} // end FUNCTION covariance()