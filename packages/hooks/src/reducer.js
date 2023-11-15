export function createAction(name, generator = (id) => id) {
    const actionCreator = {
        [name]: function (...args) {
            const trace = Error().stack;
            return { type: name, payload: generator(...args), trace };
        },
    }[name];
    return actionCreator;
}
export function createReducer(builder) {
    const cases = [];
    let defaultCase = (state, _action) => state;

    const addCase = (action, callback) =>
        cases.push([(dispatch) => dispatch.type === action.name, callback]);
    const addMatcher = (matcher, callback) => cases.push([matcher, callback]);
    const addDefaultCase = (callback) => (defaultCase = callback);
    builder({ addCase, addDefaultCase, addMatcher });
    return function reduce(state, action) {
        let index = 0;
        while (index < cases.length) {
            const [matcher, reducer] = cases[index++];
            if (matcher(action)) {
                return reducer(state, action);
            }
        }
        return defaultCase(state, action);
    };
}
