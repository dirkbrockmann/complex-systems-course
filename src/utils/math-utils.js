
const newtonsMethod = (f,fprime,guess,options) => {
    options = options || {};
    var tolerance = options.tolerance || 0.0000001;
    var epsilon = options.epsilon || 0.000000000001;
    var maxIterations = options.maxIterations || 100;
    var haveWeFoundSolution = false;
    var result;

    for(var i = 0; i < maxIterations; ++i) {
        var denominator = fprime(guess);
        if(Math.abs(denominator) < epsilon) {
            return false
        }

        result = guess - (f(guess) / denominator);

        var resultWithinTolerance = Math.abs(result - guess) < tolerance;
        if(resultWithinTolerance) {
            return result
        }

        guess = result;
    }

    return false;
}

function findAllRoots(f,fprime,xrange,options = {}) {
    const numPoints = options.numPoints || 100;
    const tolerance = options.tolerance || 1e-6;
    const noise = options.noise || 1e-7;
    const [xmin,xmax] = xrange;
    const step = (xmax - xmin) / (numPoints + 1); // +1 to avoid boundaries

    const roots = [];
    for(let i = 1; i <= numPoints; i++) { // start at 1, end at numPoints (not 0 or numPoints+1)
        let guess = xmin + i * step;
        // Add small random noise, clamp to [xmin, xmax]
        guess += (Math.random() * 2 - 1) * noise;
        guess = Math.max(xmin,Math.min(xmax,guess));

        const root = newtonsMethod(f,fprime,guess,options);
        if(
            root !== false &&
            typeof root === "number" &&
            isFinite(root) &&
            root >= xmin - tolerance &&
            root <= xmax + tolerance &&
            !roots.some(r => Math.abs(r - root) < tolerance)
        ) {
            roots.push(root);
        }
    }
    return roots.sort((a,b) => a - b);
}


export {findAllRoots,newtonsMethod};

